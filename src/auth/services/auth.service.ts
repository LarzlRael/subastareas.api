import {
  Injectable,
  InternalServerErrorException,
  Inject,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { JWtPayload } from '../../interfaces/jwtPayload';
import { User } from './../entities/user.entity';
import { validateGoogleToken } from './../google/googleVerifyToken';
import {
  ProfileEditDto,
  ChangePasswordDto,
  GoogleCredentialDto,
  AuthCredentialDTO,
  RegisterUserDTO,
} from './../dto';
import { MailService } from '../../mail/mail.service';
import { RoleEnum, TableNameEnum } from '../../enums/enums';

import { WalletService } from '../../wallet/services';
import { Request } from 'express';

import { forwardRef, UnauthorizedException } from '@nestjs/common';
import { uploadFile } from '../../utils/utils';
import { FindOptionsWhere, Repository } from 'typeorm';

import { getHostName } from '../../utils/hostUtils';
import { RolesService } from '../../roles/services/rols.service';
import { ProfessorService } from '../../roles/services/professor.service';
import { DevicesService } from '../../devices/services';
import { TransactionService } from '../../wallet/services';
import { UserProfileService } from './';
import { VerifyUserDTO } from '../dto/VerifyUser.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @Inject(forwardRef(() => RolesService))
    private rolesService: RolesService,

    private mailService: MailService,
    private devicesService: DevicesService,
    private walletService: WalletService,
    private jwtService: JwtService,
    private professorService: ProfessorService,
    private transactionService: TransactionService,
    private userProfileService: UserProfileService,
  ) {}
  async signUp(registerUserDTO: RegisterUserDTO): Promise<User> {
    const { username, password, email } = registerUserDTO;

    const user = this.usersRepository.create({
      username,
      password,
      email,
    });
    try {
      const newUser = await this.usersRepository.save(user);
      return await this.usersRepository.save(newUser);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // duplicate user
        throw new ConflictException('Username or email already exists');
      } else {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(authCredentialDTO: AuthCredentialDTO) {
    const { username, password, idDevice } = authCredentialDTO;
    const user = await this.getUserWhere(
      [{ username }, { email: username }],
      [TableNameEnum.ROLES, TableNameEnum.WALLET, TableNameEnum.DEVICE],
    );
    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.verify) {
        throw new UnauthorizedException(`verify_your_email ${user.email}`);
      } else {
        await this.devicesService.createDevice(user, idDevice);
        return this.getUserToReturn(user);
      }
    } else {
      throw new UnauthorizedException('check_your_credential');
    }
  }

  async renewToken(user: User): Promise<{ accessToken: string }> {
    return this.getUserToReturn(user);
  }

  async googleAuth(googleCredentialDto: GoogleCredentialDto) {
    const googleUser = await validateGoogleToken(
      googleCredentialDto.googleToken,
    );
    if (!googleUser) {
      throw new UnauthorizedException('check_your_credential');
    }

    const user = await this.getUserWhere({ email: googleUser.email });
    if (!user) {
      const newUser = await this.usersRepository.create({
        username: googleUser.name,
        name: googleUser.name,
        lastName: googleUser.lastName,
        email: googleUser.email,
        profileImageUrl: googleUser.picture,
        password: 'xD',
        verify: false,
        google: true,
      });
      const googleUserCreated = await this.usersRepository.save(newUser);
      await this.verifyUser(googleUserCreated);
      await this.devicesService.createDevice(
        googleUserCreated,
        googleCredentialDto.idDevice,
      );
      /* console.log(user); */
      return this.getUserToReturn(user);
    } else {
      return this.getUserToReturn(user);
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
    const getUser = await this.getUserWhere({ email });
    if (getUser) {
      if (!getUser.verify) {
        //generate token
        const accessToken = await this.generateToken(getUser.username, '30M');
        //send email
        await this.mailService.sendEmailVerification(
          /* getHostName(req), */
          getHostName(req),
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

  async verifyUser(user: User, verifyUserDto?: VerifyUserDTO) {
    const getUser = await this.getUserWhere({ username: user.username });
    if (getUser.verify) {
      return;
    }

    getUser.verify = true;
    const wallet = await this.walletService.createWallet(user);
    getUser.wallet = wallet;
    const userSaved = await this.usersRepository.save({
      ...getUser,
    });
    console.log(userSaved);
    await this.professorService.becomeProfessor(user);
    await this.rolesService.assignRole(user.id, {
      rolName: RoleEnum.STUDENT,
      active: true,
    });
    await this.rolesService.assignRole(user.id, {
      rolName: RoleEnum.PROFESSOR,
      active: true,
    });
    const userProfile = await this.userProfileService.createNewUserProfile(
      user.id,
    );
    getUser.userProfile = userProfile;
    await this.usersRepository.save({
      ...getUser,
      ...verifyUserDto,
    });
    console.log(userSaved);
    return userSaved;
  }

  async signOut(idDevice: string) {
    return await this.devicesService.deleteDevice(idDevice);
  }

  async sendEmailRequestPasswordChange(email: string, req: Request) {
    const getUser = await this.getUserWhere({ email });

    if (getUser) {
      //generate token
      const accessToken = await this.generateToken(getUser.username, '5M');
      this.mailService.sendEmailRequestPasswordChange(
        { email: getUser.email, name: getUser.username },
        accessToken,
        getHostName(req),
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
    const user = await this.getUserWhere({ id: idUser });

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
    const findUser = await this.getUserWhere({ id: idUser });
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

  async getUserToReturn(user: User) {
    const accessToken = await this.generateToken(user.username, '24h');
    console.log(user);
    if (user.rols) {
      user.userRols = user.rols.map((rol) => rol.rolName);
      delete user.rols;
    }
    if (user.device) {
      user.userDevices = user.device.map((device) => device.idDevice);
      delete user.device;
    }
    if (user.wallet) {
      user.wallet.balanceTotal = await this.transactionService.getUserBalance(
        user,
      );
      user.wallet.balanceWithDrawable = await this.transactionService.getUserWithdrawableBalance(
        user,
      );
      delete user.wallet.created_at;
      delete user.wallet.updated_at;
      delete user.wallet.id;
    }

    delete user.password;
    return { ...user, accessToken };
  }

  async getUserWhere(
    where: FindOptionsWhere<User> | FindOptionsWhere<User>[],
    relations?: TableNameEnum[],
  ): Promise<User> {
    return await this.usersRepository.findOne({
      where,
      relations: relations,
    });
  }
  async generateToken(username: string, period: string): Promise<string> {
    const payload: JWtPayload = { username };

    const accessToken = await this.jwtService.sign(payload, {
      expiresIn: period,
    });
    return accessToken;
  }

  async renewTemporaryToken(user: User) {
    const token = await this.generateToken(user.username, '5m');
    return { token };
  }

  async getUsePublicProfile(idUser: number) {
    const findUser = await this.usersRepository.query(
      'select u.id, u.name,u.lastName, u.nickName, u.profileImageUrl,up.bio, p.solvedHomeworks ,p.reputation from user u inner join user_profile up on up.id = u.id inner join professor p on u.id = p.id where u.id = ?',
      [idUser],
    );
        console.log(findUser[0]);
    return findUser[0];
  }
}
