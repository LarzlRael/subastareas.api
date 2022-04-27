import { Body, Controller, Post, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDTO } from './dto/AuthCredentialDTO ';
import { User } from './entities/User';
import { GetUser } from './get-user..decorator';
import { AuthGuard } from '@nestjs/passport';


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
  @UseGuards(AuthGuard('jwt'))
  @Get('/renewtoken')
  renewToken(@GetUser() user: User): Promise<{ accessToken: string }> {
    return this.authService.renewToken(user);
  }
}
