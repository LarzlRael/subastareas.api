import { Controller, Get, UseGuards } from '@nestjs/common';

import { User } from './entities/user.entity';

import { AuthGuard } from '@nestjs/passport';

import { AdminService } from './admin.service';
import { RolesGuard } from './guard/roles.guard';
import { Roles } from './decorators/get.rols.decorator';
import { RoleEnum } from '../enums/enums';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AdminController {
  constructor(private authService: AdminService) {}
  @Roles(RoleEnum.ADMIN)
  @Get('/getUsers')
  getUsers(): Promise<User[]> {
    return this.authService.getUsers();
  }
}
