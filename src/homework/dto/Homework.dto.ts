import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AuthCredentialDTO } from '../../auth/dto/AuthCredentialDTO ';

import { IsEnum } from 'class-validator';
import {
  HomeWorkTypeEnum,
  HomeWorkStatusEnum,
  LevelTypeEnum,
} from '../../enums/enums';
import { Type } from 'class-transformer';

export class HomeworkDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  offered_amount: number;
  fileUrl?: string;

  @Type(() => Date)
  @IsDate()
  resolutionTime: Date;

  @IsEnum(HomeWorkTypeEnum)
  category?: HomeWorkTypeEnum;

  @IsOptional()
  @IsEnum(HomeWorkStatusEnum)
  status: HomeWorkStatusEnum;

  @IsEnum(LevelTypeEnum)
  level: LevelTypeEnum;
}
