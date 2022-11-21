import { WithdrawEnum } from '../../enums/enums';
import {
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  Length,
  IsEnum,
} from 'class-validator';

export class WithDrawDto {
  /* @IsNotEmpty() */
  @IsOptional()
  readonly idTransaction: number;

  @IsNumber()
  @IsNotEmpty()
  readonly amount: number;

  @IsString()
  @IsOptional()
  accountNumber: string;

  @IsOptional()
  paymentMethod: string;

  @IsEnum(WithdrawEnum)
  @IsOptional()
  status: WithdrawEnum;

  @IsString()
  phone: string;
}
