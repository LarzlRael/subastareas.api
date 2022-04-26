import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialDTO } from './dto/AuthCredentialDTO ';
import { UsersRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { JWtPayload } from './interfaces/jwtPayload';
import { User } from './entities/User';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}
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
}
