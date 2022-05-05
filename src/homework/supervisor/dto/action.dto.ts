import { HomeWorkStatusEnum } from '../../../enums/enums';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
export class ActionSupervisorDTO {
  @IsNotEmpty()
  observation: string;

  @IsEnum(HomeWorkStatusEnum)
  status: HomeWorkStatusEnum;

  @IsNotEmpty()
  idHomework: number;
}
