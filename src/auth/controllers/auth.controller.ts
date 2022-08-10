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

import { AuthCredentialDTO, RegisterUserDTO } from '../dto/AuthCredentialDTO ';
import { User } from '../entities/user.entity';
import { GetUser } from '../decorators/get-user..decorator';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from '../../utils/utils';
import { ProfileEditDto } from '../dto/ProfileEdit.dto';
import { JwtService } from '@nestjs/jwt';
import { JWtPayload } from '../../interfaces/jwtPayload';
import { Request } from 'express';
import { ChangePasswordDto } from '../dto/ChangePassword.dto';
import { GoogleCredentialDto } from '../dto/GoogleCredential.dto';
import { AuthService } from '../services/auth.service';
import { VerifyUserDTO } from '../dto/VerifyUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  signup(@Body() registerUserDTO: RegisterUserDTO): Promise<User> {
    return this.authService.signUp(registerUserDTO);
  }
  @Post('/signIn')
  async signIn(@Body() authCredentialDTO: AuthCredentialDTO) {
    return await this.authService.signIn(authCredentialDTO);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/renewToken')
  renewToken(@GetUser() user: User) {
    return this.authService.renewToken(user);
  }

  @Post('/google')
  googleAuth(@Body() googleCredentialDto: GoogleCredentialDto) {
    return this.authService.googleAuth(googleCredentialDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('imageProfile', {
      fileFilter: fileFilter,
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

  @Get('sendEmailVerification/:email')
  sendEmailVerification(
    @Req() request: Request,
    @Param('email') email: string,
  ) {
    return this.authService.sendEmailTokenVerification(email, request);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/verifyUser')
  async verifyEmail(@Body() verifyUser: VerifyUserDTO, @GetUser() user: User) {
    if (user.verify) {
      return {
        message: 'email already verify',
      };
    }
    return await this.authService.verifyUser(user, verifyUser);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/signout/:idDevice')
  async signOutAndDeleteDevice(@Param('idDevice') idDevice: string) {
    return this.authService.signOut(idDevice);
  }

  @Get('requestpasswordchange/:email')
  sendEmailRequestPasswordChange(
    @Req() req: Request,
    @Param('email') email: string,
  ) {
    return this.authService.sendEmailRequestPasswordChange(email, req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/changepassword')
  changePassword(
    @GetUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePasswordxd(changePasswordDto, user);
  }

  //change profile image
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
    }),
  )
  @Put('/updateprofileimage/:idUser')
  updateHomework(
    @GetUser() user: User,
    @Param('idUser') id: number,
    @UploadedFile() homeWorkFile: Express.Multer.File,
  ) {
    return this.authService.uploadOrUpdateProfileImage(homeWorkFile, user, id);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('/verifytemporarytoken')
  verifyTemporaryToken(@GetUser() user: User) {
    return this.authService.renewTemporaryToken(user);
  }
}
