import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AuthCredentialDTO } from '../../auth/dto/AuthCredentialDTO ';

import { IsEnum } from 'class-validator';
import { HomeWorkTypeEnum, HomeWorkStatusEnum } from '../../enums/rol.enum';

export class HomeworkDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  offered_amount: number;
  fileUrl?: string;
  resolutionTime?: Date;

  @IsEnum(HomeWorkTypeEnum)
  category?: HomeWorkTypeEnum;

  @IsOptional()
  @IsEnum(HomeWorkStatusEnum)
  status: HomeWorkStatusEnum;
}
