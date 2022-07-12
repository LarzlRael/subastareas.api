import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../entities/user.entity';
import { JWtPayload } from '../../interfaces/jwtPayload';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userService: AuthService,
  ) {
    super({
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JWtPayload): Promise<User> {
    const { username } = payload;
    const user: User = await this.userService.getUserWhere({ username });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
