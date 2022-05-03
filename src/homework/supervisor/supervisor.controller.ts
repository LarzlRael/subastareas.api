import { Controller, Post, UseGuards, Get, Body } from '@nestjs/common';
import { SupervisorService } from './supervisor.service';
import { User } from '../../auth/entities/user.entity';
import { GetUser } from '../../auth/decorators/get-user..decorator';

import { RolesGuard } from '../../auth/guard/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../auth/decorators/get.rols.decorator';
import { RoleEnum } from '../../enums/rol.enum';
import { ActionSupervisorDTO } from './dto/action.dto';

@Controller('supervisor')
/* @UseGuards(AuthGuard('jwt'), RolesGuard) */
export class SupervisorController {
  constructor(private supervisorService: SupervisorService) {}

  @Post('/createSupervisor')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPERVISOR)
  createSupervisor(@GetUser() user: User) {
    return this.supervisorService.createSupervisor(user);
  }
  @Get('/homewokstoSupervisor')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPERVISOR)
  getHomeworkTosupervisor() {
    return this.supervisorService.getHomewoksToSupervisor();
  }
  @Post('/actionSupervisor')
  monitorHomework(@Body() actionSupervisorDTO: ActionSupervisorDTO) {
    return this.supervisorService.monitorHomework(actionSupervisorDTO);
  }
}
