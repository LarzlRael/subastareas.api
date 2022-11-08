import { TransactionService } from '../services/transaction.service';

import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { User } from '../../auth/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { GetUser } from '../../auth/decorators/get-user..decorator';
import { Roles } from 'src/auth/decorators/get.rols.decorator';
import { RoleEnum } from '../../enums/enums';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('transaction')
/* @UseGuards(AuthGuard('jwt')) */
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('/getUserTransactionsHistory')
  async getUserTransaction(@GetUser() user: User) {
    return this.transactionService.getTransactionsHistory(user);
  }
  @Get('/withdrawMoneyTransaction/:amount')
  async withdrawMoneyTransaction(
    @GetUser() user: User,
    @Param('amount') amount: number,
  ) {
    return this.transactionService.withdrawMoneyTransactionRequest(
      user,
      amount,
    );
  }

  @Roles(RoleEnum.ADMIN)
  @Get('/getListUserWithdrawRequest')
  async getListUserWithdrawRequest() {
    return this.transactionService.getListUserWithdrawRequest();
  }
}
