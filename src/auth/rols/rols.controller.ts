import { Controller, Post, UseGuards, Body, Param, Get } from '@nestjs/common';

import { RolsService } from './rols.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../decorators/get-user..decorator';
import { User } from '../entities/user.entity';
import { RolDto } from './dto/rol.dto';
import { Rol } from './entities/rol.entity';
import { RolesGuard } from '../guard/roles.guard';
import { Roles } from '../decorators/get.rols.decorator';
import { RoleEnum } from 'src/enums/enums';

@Controller('rols')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RolsController {
  constructor(private rolService: RolsService) {}
  @Roles(RoleEnum.ADMIN, RoleEnum.SUPERVISOR)
  @Post('/createRol')
  createNewRole(@GetUser() user: User, @Body() rol: RolDto): Promise<Rol> {
    return this.rolService.createNewRol(user, rol);
  }
  @Roles(RoleEnum.ADMIN)
  @Post('/assingrole/:id')
  assingRole(
    /* @GetUser() user: User, */
    @Body() rol: RolDto,
    @Param('id') id: number,
  ): Promise<Rol> {
    return this.rolService.assignRole(id, rol);
  }

  @Roles(RoleEnum.ADMIN)
  @Get('/listuserroles/:id')
  getUserRoles(@Param('id') id: number): Promise<Rol[]> {
    return this.rolService.listUserRoles(id);
  }
}
