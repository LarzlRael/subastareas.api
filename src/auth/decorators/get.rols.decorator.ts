import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../../enums/rol.enum';

export const Roles = (...roles: RoleEnum[]) => {
  return SetMetadata('roles', roles);
};
