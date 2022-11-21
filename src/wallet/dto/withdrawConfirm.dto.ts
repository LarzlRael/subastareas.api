import { IsNumber, IsString } from 'class-validator';

export class WithdrawConfirmDto {
  @IsNumber()
  idUser: number;

  @IsNumber()
  idTransaction: number;

  @IsNumber()
  idWithdraw: number;

  @IsString()
  paymentMethod: string;

  @IsString()
  status: string;
}
