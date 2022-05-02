import { IsEnum } from 'class-validator';
import { RoleEnum } from '../../../enums/rol.enum';

export class RolDto {
  id?: number;

  @IsEnum(RoleEnum)
  rolName: RoleEnum;

  active: boolean;
  /* user: User; */
}
