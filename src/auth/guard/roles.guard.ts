import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from '../../enums/rol.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }
  canActivate(context: ExecutionContext): boolean {
    const requireRoles = this.reflector.getAllAndOverride<RoleEnum[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requireRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    const currentUserRol = user.rols.map((rol) => {
      return rol.rolName;
    });
    return requireRoles.some((r) => currentUserRol.indexOf(r) >= 0);
  }
}
