import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDTO } from './dto/AuthCredentialDTO ';
import { UsersRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { JWtPayload } from './interfaces/jwtPayload';
import { User } from './entities/user.entity';
import { validateGoogleToken } from './google/googleVerifyToken';
import { ProfileEditDto } from './dto/ProfileEdit.dto';
import { MailService } from '../mail/mail.service';
import { RolsService } from './rols/rols.service';
import { RoleEnum } from 'src/enums/rol.enum';
import { DevicesService } from '../devices/devices.service';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
    private mailService: MailService,
    private jwtService: JwtService,
    private rolsService: RolsService,
    private devicesService: DevicesService,
  ) {}
  async singUp(authCredentialDTO: AuthCredentialDTO): Promise<User> {
    const newUser = await this.usersRepository.createUser(authCredentialDTO);
    this.rolsService.assignStudenRole(newUser, {
      rolName: RoleEnum.STUDENT,
      active: true,
    });
    return newUser;
  }

  async singIn(
    authCredentialDTO: AuthCredentialDTO,
  ): Promise<{ accessToken: string }> {
    const { username, password, idDevice } = authCredentialDTO;
    const user = await this.usersRepository.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JWtPayload = { username };
      const accessToken = await this.jwtService.sign(payload);
      await this.devicesService.createDevice(user, idDevice);
      return { ...user, accessToken };
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
}
