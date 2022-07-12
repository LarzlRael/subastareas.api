import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  Inject,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AuthCredentialDTO,
  RegisterUserDTO,
} from './../dto/AuthCredentialDTO ';

import * as bcrypt from 'bcrypt';
import { JWtPayload } from '../../interfaces/jwtPayload';
import { User } from './../entities/user.entity';
import { validateGoogleToken } from './../google/googleVerifyToken';
import { ProfileEditDto } from './../dto/ProfileEdit.dto';
import { MailService } from '../../mail/mail.service';
import { RoleEnum } from '../../enums/enums';
import { DevicesService } from '../../devices/devices.service';
import { WalletService } from '../../wallet/wallet.service';
import { Request } from 'express';
import { ChangePasswordDto } from './../dto/ChangePassword.dto';
import { RolsService } from '../../roles/services/rols.service';
import { GoogleCredentialDto } from './../dto/GoogleCredential.dto';

import { forwardRef } from '@nestjs/common';
import { uploadFile } from '../../utils/utils';
import { Repository } from 'typeorm';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private mailService: MailService,
    private devicesService: DevicesService,
    private walletService: WalletService,
    @Inject(forwardRef(() => RolsService))
    private jwtService: JwtService,
    private rolsService: RolsService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async singUp(registerUserDTO: RegisterUserDTO): Promise<User> {
    const { username, password, email } = registerUserDTO;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
      email: email,
    });
    try {
      const newUser = await this.usersRepository.save(user);
      this.rolsService.assignStudenRole(newUser, {
        rolName: RoleEnum.STUDENT,
        active: true,
      });
      await this.walletService.createWallet(newUser);
      return newUser;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // duplicate user
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async singIn(
    authCredentialDTO: AuthCredentialDTO,
  ): Promise<{ accessToken: string } | { message: string }> {
    const { username, password, idDevice } = authCredentialDTO;
    const user = await this.usersRepository.findOne(
      {
        username,
      },
      { relations: ['rols', 'wallet', 'device'] },
    );
    /*  */
    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.verify) {
        return {
          message: 'Please verify your email',
        };
      } else {
        if (user.rols) {
          user.userRols = user.rols.map((rol) => rol.rolName);
          delete user.rols;
        }
        await this.devicesService.createDevice(user, idDevice);

        const payload: JWtPayload = { username };
        const accessToken = await this.jwtService.sign(payload);
        delete user.password;

        return { ...user, accessToken };
      }
    } else {
      throw new UnauthorizedException('Please check your login credential');
    }
  }

  async renewToken(user: User): Promise<{ accessToken: string }> {
    const payload: JWtPayload = { username: user.username };
    const accessToken = await this.jwtService.sign(payload);
    if (user.rols) {
      user.userRols = user.rols.map((rol) => rol.rolName);
      delete user.rols;
    }
    if (user.device) {
      user.userDevices = user.device.map((device) => device.idDevice);
      delete user.device;
    }
    delete user.password;
    return { ...user, accessToken };
  }

  async googleAuth(googleCredentialDto: GoogleCredentialDto) {
    const googleUser = await validateGoogleToken(
      googleCredentialDto.googleToken,
    );
    if (!googleUser) {
      throw new UnauthorizedException('Please check your login credential');
    }
    //TODO check if user exists
    const user = await this.usersRepository.findOne({
      email: googleUser.email,
    });
    if (!user) {
      const newUser = await this.usersRepository.create({
        username: googleUser.name,
        lastName: googleUser.lastName,
        email: googleUser.email,
        profileImageUrl: googleUser.picture,
        password: 'xD',
        verify: true,
        google: true,
      });
      await this.usersRepository.save(newUser);
      const payload: JWtPayload = { username: googleUser.name };
      const accessToken = await this.jwtService.sign(payload);

      const user = await this.usersRepository.findOne({
        email: googleUser.email,
      });
      await this.devicesService.createDevice(
        user,
        googleCredentialDto.idDevice,
      );

      if (user.rols) {
        user.userRols = user.rols.map((rol) => rol.rolName);
        delete user.rols;
      }
      if (user.device) {
        user.userDevices = user.device.map((device) => device.idDevice);
        delete user.device;
      }

      return { accessToken, ...user };
    } else {
      const payload: JWtPayload = { username: googleUser.name };
      const accessToken = await this.jwtService.sign(payload);
      return { accessToken, ...user };
    }
  }
  async updateUserProfile(
    updateUser: ProfileEditDto,
    profileImageUrl: Express.Multer.File,
    user: User,
  ) {
    try {
      if (profileImageUrl) {
        uploadFile(profileImageUrl, 'PROFILE_IMAGES').then(async (url) => {
          updateUser.profileImageUrl = url;
          const updatedProfile = await this.usersRepository.save({
            ...user,
            name: updateUser.name,
            lastName: updateUser.lastName,
            nickName: updateUser.nickName,
            phone: updateUser.phone,
            profileImageUrl: updateUser.profileImageUrl,
          });
          return updatedProfile;
        });
      } else {
        return await this.usersRepository.save({
          ...user,
          name: updateUser.name,
          lastName: updateUser.lastName,
          nickName: updateUser.nickName,
          phone: updateUser.phone,
        });
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
  async sendEmailTokenVerification(email: string, req: Request) {
    const getUser = await this.usersRepository.findOne({ email });
    const hostname = req.headers.host;
    const protocol = req.protocol;

    const hostName = `${protocol}://${hostname}`;
    if (getUser) {
      if (!getUser.verify) {
        const payload: JWtPayload = { username: getUser.username };
        //generate token
        const accessToken = await this.jwtService.sign(payload);
        //send email
        await this.mailService.sendEmailVerification(
          hostName,
          { email: getUser.email, name: getUser.username },
          accessToken,
        );
      } else {
        throw new UnauthorizedException('User already verified');
      }
    } else {
      throw new UnauthorizedException('User not found');
    }
  }
  async verifyEmail(username: string): Promise<User> {
    const getUser = await this.usersRepository.findOne({ username });
    if (getUser.verify) {
      return;
    }
    getUser.verify = true;
    return await this.usersRepository.save(getUser);
  }
  async signOut(idDevice: string) {
    return await this.devicesService.deleteDevice(idDevice);
  }
  async sendEmail() {
    return this.mailService.sendUserConfirmation(
      {
        email: 'seug.ri.pe@gmail.com',
        name: 'Rael',
      },
      '1231564545',
    );
  }
  async sendEmailRequestPasswordChange(email: string, req: Request) {
    const getUser = await this.usersRepository.findOne({ email });
    const hostname = req.headers.host;
    const protocol = req.protocol;
    const hostName = `${protocol}://${hostname}`;
    if (getUser) {
      const payload: JWtPayload = { username: getUser.username };
      //generate token
      const accessToken = await this.jwtService.sign(payload, {
        expiresIn: '3600',
      });
      this.mailService.sendEmailRequestpasswordChange(
        { email: getUser.email, name: getUser.username },
        accessToken,
        hostName,
      );
    } else {
      throw new UnauthorizedException('User not found');
    }
  }

  async changePasswordxd(changePasswordDto: ChangePasswordDto, user: User) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(changePasswordDto.password, salt);
    return await this.usersRepository.save({
      ...user,
      password: hashedPassword,
    });
  }

  async uploadOrUpdateProfileImage(
    file: Express.Multer.File,
    currentUser: User,
    idUser: number,
  ) {
    const user = await this.usersRepository.findOne(idUser);

    if (!user) {
      throw new InternalServerErrorException('User not found');
    }
    if (currentUser.id !== user.id) {
      throw new InternalServerErrorException(
        'You are not the owner of this profile',
      );
    } else {
      if (file) {
        uploadFile(file, 'PROFILE_IMAGES').then(async (url) => {
          user.profileImageUrl = url;
          await this.usersRepository.save(user);
          return user;
        });
      } else {
        throw new InternalServerErrorException('There is not profileImage');
      }
    }
  }
  async getOneUser(idUser: number) {
    const findUser = await this.usersRepository.findOne(idUser);
    if (!findUser) {
      throw new InternalServerErrorException('User not found');
    }
    return findUser;
  }
  async saveUser(user: User) {
    return await this.usersRepository.save(user);
  }

  async getAllUsers() {
    return await this.usersRepository.find();
  }
}
