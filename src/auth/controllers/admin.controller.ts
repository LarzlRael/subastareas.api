import { Controller, Get, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';

import { User } from '../entities/user.entity';
import { AdminService } from '../services/admin.service';
import { RolesGuard } from '../guard/roles.guard';
import { RoleEnum } from '../../enums/enums';
import { Roles } from '../decorators/get.rols.decorator';

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
