import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guard/roles.guard';

import { UserProfileService } from '../services/userProfile.service';
import { UserProfileDTO } from '../dto/UserProfile.dot';

@Controller('userProfile')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserProfileController {
  constructor(private userProfileService: UserProfileService) {}

  @Post('changePreferences')
  getUsers(@Body() userProfileDto: UserProfileDTO) {
    return this.userProfileService.changePreferences(userProfileDto);
  }
}
