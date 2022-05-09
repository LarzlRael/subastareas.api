import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDTO, RegisterUserDTO } from './dto/AuthCredentialDTO ';
import { UsersRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { JWtPayload } from './interfaces/jwtPayload';
import { User } from './entities/user.entity';
import { validateGoogleToken } from './google/googleVerifyToken';
import { ProfileEditDto } from './dto/ProfileEdit.dto';
import { MailService } from '../mail/mail.service';
import { RolsService } from './rols/rols.service';
import { RoleEnum } from 'src/enums/enums';
import { DevicesService } from '../devices/devices.service';
import { WalletService } from '../wallet/wallet.service';
import { Request } from 'express';
import { ChangePasswordDto } from './dto/ChangePassword.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
    private mailService: MailService,
    private jwtService: JwtService,
    private rolsService: RolsService,
    private devicesService: DevicesService,
    private walletService: WalletService,
  ) {}
  async singUp(registerUserDTO: RegisterUserDTO): Promise<User> {
    const newUser = await this.usersRepository.createUser(registerUserDTO);
    this.rolsService.assignStudenRole(newUser, {
      rolName: RoleEnum.STUDENT,
      active: true,
    });
    await this.walletService.createWallet(newUser);
    return newUser;
  }

  async singIn(
    authCredentialDTO: AuthCredentialDTO,
  ): Promise<{ accessToken: string } | { message: string }> {
    const { username, password, idDevice } = authCredentialDTO;
    const user = await this.usersRepository.findOne({ username });
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
        if (user.device) {
          user.userDevices = user.device.map((device) => device.idDevice);
          delete user.device;
        }
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
    return { ...user, accessToken };
  }

  async googleAuth(token: string) {
    const googleUser = await validateGoogleToken(token);
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
        email: googleUser.email,
        profileImageUrl: googleUser.picture,
        password: 'xD',
        google: true,
      });
      await this.usersRepository.save(newUser);
      const payload: JWtPayload = { username: googleUser.name };
      const accessToken = await this.jwtService.sign(payload);
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
    return this.usersRepository.updateUserProfile(
      updateUser,
      profileImageUrl,
      user,
    );
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
    await this.devicesService.deleteDevice(idDevice);
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
}
