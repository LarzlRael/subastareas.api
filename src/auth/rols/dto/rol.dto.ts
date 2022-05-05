import { IsEnum } from 'class-validator';
import { RoleEnum } from '../../../enums/enums';

export class RolDto {
  id?: number;

  @IsEnum(RoleEnum)
  rolName: RoleEnum;

  active: boolean;
  /* user: User; */
}
