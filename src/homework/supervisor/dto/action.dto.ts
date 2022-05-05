import { HomeWorkStatusEnum } from '../../../enums/rol.enum';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
export class ActionSupervisorDTO {
  @IsNotEmpty()
  observation: string;

  @IsEnum(HomeWorkStatusEnum)
  status: HomeWorkStatusEnum;

  @IsNotEmpty()
  idHomework: number;
}
