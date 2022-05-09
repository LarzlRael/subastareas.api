import { Controller, Post, UseGuards, Get, Body, Param } from '@nestjs/common';
import { SupervisorService } from '../services/supervisor.service';
import { User } from '../../auth/entities/user.entity';
import { GetUser } from '../../auth/decorators/get-user..decorator';

import { RolesGuard } from '../../auth/guard/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../auth/decorators/get.rols.decorator';
import { RoleEnum } from '../../enums/enums';
import { ActionSupervisorDTO } from '../dto/action.dto';

@Controller('supervisor')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SupervisorController {
  constructor(private supervisorService: SupervisorService) {}

  /* @Post('/createSupervisor')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPERVISOR)
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPERVISOR)
  createSupervisor(@GetUser() user: User) {
    return this.supervisorService.createSupervisor(user);
  } */
  @Post('/becomesupervisor/:idUser')
  @Roles(RoleEnum.ADMIN)
  becomeSupervisor(@Param('idUser') idUser: number) {
    return this.supervisorService.becomeSupervisor(idUser);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.SUPERVISOR)
  @Get('/homeworkstosupervise')
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPERVISOR)
  getHomeworkTosupervisor() {
    return this.supervisorService.getHomeworksToSupervise();
  }
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPERVISOR)
  @Post('/supervisehomework')
  supervisehomework(
    @GetUser() user: User,
    @Body() actionSupervisorDTO: ActionSupervisorDTO,
  ) {
    return this.supervisorService.superviseHomework(user, actionSupervisorDTO);
  }
}
