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
import { HomeWorkTypeEnum } from '../../enums/enums';
import { Type } from 'class-transformer';

export class HomeworkDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  offered_amount: number;
  /*  */
  @Type(() => Date)
  @IsDate()
  resolutionTime: Date;

  @IsEnum(HomeWorkTypeEnum)
  category?: HomeWorkTypeEnum;

  /* @IsEnum(LevelTypeEnum)
  level: LevelTypeEnum; */
}
