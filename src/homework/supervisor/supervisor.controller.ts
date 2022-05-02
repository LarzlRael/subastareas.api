import { Controller, Post, UseGuards } from '@nestjs/common';
import { SupervisorService } from './supervisor.service';
import { User } from '../../auth/entities/user.entity';
import { GetUser } from '../../auth/decorators/get-user..decorator';

import { RolesGuard } from '../../auth/guard/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../auth/decorators/get.rols.decorator';
import { RoleEnum } from '../../enums/rol.enum';

@Controller('supervisor')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SupervisorController {
  constructor(private supervisorService: SupervisorService) {}

  @Post('/createSupervisor')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPERVISOR)
  createSupervisor(@GetUser() user: User) {
    return this.supervisorService.createSupervisor(user);
  }
}
