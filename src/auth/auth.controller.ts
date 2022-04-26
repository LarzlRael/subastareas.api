import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDTO } from './dto/AuthCredentialDTO ';
import { User } from './entities/User';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  signup(@Body() authCredentialDTO: AuthCredentialDTO): Promise<User> {
    return this.authService.singUp(authCredentialDTO);
  }
  @Post('/signin')
  signin(
    @Body() authCredentialDTO: AuthCredentialDTO,
  ): Promise<{ accessToken: string }> {
    return this.authService.singIn(authCredentialDTO);
  }
}
