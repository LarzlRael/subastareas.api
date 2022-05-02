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
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) { }
  async singUp(authCredentialDTO: AuthCredentialDTO): Promise<User> {
    return this.usersRepository.createUser(authCredentialDTO);
  }

  async singIn(
    authCredentialDTO: AuthCredentialDTO,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialDTO;
    const user = await this.usersRepository.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JWtPayload = { username };
      const accessToken = await this.jwtService.sign(payload);
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
}
