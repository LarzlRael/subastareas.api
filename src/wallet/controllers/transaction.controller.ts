import { TransactionService } from '../services/transaction.service';

import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { User } from '../../auth/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { GetUser } from '../../auth/decorators/get-user..decorator';
import { RoleEnum } from '../../enums/enums';
import { WithDrawDto } from '../dto/withdraw.dto';
import { Roles } from '../../auth/decorators/get.rols.decorator';
import { WithdrawConfirmDto } from '../dto/withdrawConfirm.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('transaction')
/* @UseGuards(AuthGuard('jwt')) */
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('/getUserTransactionsHistory')
  async getUserTransaction(@GetUser() user: User) {
    return this.transactionService.getTransactionsHistory(user);
  }
  @Post('/withdrawMoneyTransaction')
  async withdrawMoneyTransaction(
    @GetUser() user: User,
    @Body() withDrawDto: WithDrawDto,
  ) {
    return this.transactionService.withdrawMoneyTransactionRequest(
      user,
      withDrawDto,
    );
  }

  @Roles(RoleEnum.ADMIN)
  @Get('/getListUserWithdrawRequest')
  async getListUserWithdrawRequest() {
    return this.transactionService.getListUserWithdrawRequest();
  }
  @Roles(RoleEnum.ADMIN)
  @Post('/confirmWithDraw/')
  async confirmWithDraw(
    /* @Param('idUser') idUser: number,
    @Param('idTransaction') idTransaction: number,
    @Param('idWithdraw') idWithdraw: number, */
    @Body() withdrawConfirmDto: WithdrawConfirmDto,
  ) {
    return this.transactionService.withdrawMoneyConfirm(
      /* idUser,
      idTransaction,
      idWithdraw, */
      withdrawConfirmDto,
    );
  }
}
