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
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDTO, RegisterUserDTO } from './dto/AuthCredentialDTO ';
import { User } from './entities/user.entity';
import { GetUser } from './decorators/get-user..decorator';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from '../utils/utils';
import { ProfileEditDto } from './dto/ProfileEdit.dto';
import { JwtService } from '@nestjs/jwt';
import { JWtPayload } from '../auth/interfaces/jwtPayload';
import { Request } from 'express';
import { ChangePasswordDto } from './dto/ChangePassword.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}
  @Post('/signup')
  signup(@Body() registerUserDTO: RegisterUserDTO): Promise<User> {
    return this.authService.singUp(registerUserDTO);
  }
  @Post('/signin')
  signin(
    @Body() authCredentialDTO: AuthCredentialDTO,
  ): Promise<{ accessToken: string } | { message: string }> {
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
    return this.authService.updateUserProfile(editProfile, imageProfile, user);
  }

  @Post('email')
  sendEmail() {
    return this.authService.sendEmail();
  }
  @Get('sendemailverification/:email')
  sendEmailVerification(
    @Req() request: Request,
    @Param('email') email: string,
  ) {
    return this.authService.sendEmailTokenVerification(email, request);
  }

  @Get('/verifyemail/:token')
  async verifyEmail(@Param('token') token: string) {
    const { username } = this.jwtService.verify(token) as JWtPayload;
    const xd = await this.authService.verifyEmail(username);
    return {
      message: 'email verifified',
    };
  }
  @UseGuards(AuthGuard('jwt'))
  @Post('/signout/:idDevice')
  async logoutAndDeleteDevice(@Param('idDevice') idDevice: string) {
    this.authService.signOut(idDevice);
  }

  //TODO render page password change

  @Get('requestpasswordchange/:email')
  sendEmailRequestPasswordChange(
    @Req() req: Request,
    @Param('email') email: string,
  ) {
    this.authService.sendEmailRequestPasswordChange(email, req);
  }

  //TODO form to change password
  @UseGuards(AuthGuard('jwt'))
  @Post('/changepassword')
  changePassword(
    @GetUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePasswordxd(changePasswordDto, user);
  }
}
