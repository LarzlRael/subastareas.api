import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Put,
  Param,
  Render,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDTO } from './dto/AuthCredentialDTO ';
import { User } from './entities/user.entity';
import { GetUser } from './decorators/get-user..decorator';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from '../utils/utils';
import { ProfileEditDto } from './dto/ProfileEdit.dto';
import { JwtService } from '@nestjs/jwt';
import { JWtPayload } from '../auth/interfaces/jwtPayload';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}
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

  @Get('/google')
  googleAuth(@Body() googleToken: { googleToken: string }) {
    return this.authService.googleAuth(googleToken.googleToken);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('imageProfile', {
      fileFilter: imageFileFilter,
    }),
  )
  @Put('/updateuser')
  updateUser(
    @Body() editProfile: ProfileEditDto,
    @GetUser() user: User,
    @UploadedFile() imageProfile: Express.Multer.File,
  ) {
    console.log(editProfile);
    return this.authService.updateUserProfile(editProfile, imageProfile, user);
  }

  @Post('email')
  sendEmail() {
    return this.authService.sendEmail();
  }

  @Get('/verify/:token')
  @Render('index')
  async verifyEmail(@Param('token') token: string) {
    const { username } = this.jwtService.verify(token) as JWtPayload;
    const xd = await this.authService.verifyEmail(username);
    console.log(xd);
    return xd;
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('/signout/:idDevice')
  async logoutAndDeleteDevice(@Param('idDevice') idDevice: string) {
    console.log(idDevice);
    this.authService.signOut(idDevice);
  }
}
