import { Controller, Post, UseGuards, Body, Param, Get } from '@nestjs/common';

import { RolsService } from '../services/rols.service';
import { AuthGuard } from '@nestjs/passport';

import { RolDto } from '../dto/rol.dto';
import { Rol } from '../entities/rol.entity';

import { RoleEnum } from '../../enums/enums';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { Roles } from '../../auth/decorators/get.rols.decorator';
import { GetUser } from '../../auth/decorators/get-user..decorator';
import { User } from '../../auth/entities/user.entity';

@Controller('rols')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RolsController {
  constructor(private rolService: RolsService) {}
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPERVISOR)
  @Post('/createRol')
  createNewRole(@GetUser() user: User, @Body() rol: RolDto): Promise<Rol> {
    return this.rolService.createNewRol(user, rol);
  }
  /* @Roles(RoleEnum.ADMIN) */
  @Post('/assingrole/:id')
  assingRole(
    /* @GetUser() user: User, */
    @Body() rol: RolDto,
    @Param('id') id: number,
  ) {
    return this.rolService.assignRole(id, rol);
  }

  @Roles(RoleEnum.ADMIN)
  @Get('/listuserroles/:id')
  getUserRoles(@Param('id') id: number): Promise<Rol[]> {
    return this.rolService.listUserRoles(id);
  }
}
