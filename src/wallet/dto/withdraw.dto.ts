import {
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  Length,
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

  @IsString()
  @IsOptional()
  status: string;

  @IsString()
  phone: string;
}
