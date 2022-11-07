import { IsEmpty, IsNotEmpty, IsString, Length } from 'class-validator';

export class WithDrawDto {
  @IsNotEmpty()
  @IsString()
  @Length(24, 24)
  readonly idTransaction: string;
  @IsNotEmpty()
  @IsString()
  readonly amount: string;

  @IsEmpty()
  @IsString()
  accountNumber: string;

  @IsEmpty()
  @IsString()
  paymentMethod: string;

  @IsString()
  status: string;
  @IsEmpty()
  @IsString()
  telephone: string;
}
