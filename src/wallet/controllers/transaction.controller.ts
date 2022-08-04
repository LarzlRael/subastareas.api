import { TransactionService } from '../services/transaction.service';

import { Controller, Get, UseGuards } from '@nestjs/common';

import { User } from '../../auth/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { GetUser } from '../../auth/decorators/get-user..decorator';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('transaction')
/* @UseGuards(AuthGuard('jwt')) */
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('/getUserAmount')
  async getUserBalance(@GetUser() user: User) {
    return this.transactionService.getUserBalance(user);
  }
  @Get('/getTransactionsHistory')
  async getUserTrasaction(@GetUser() user: User) {
    return this.transactionService.getTransactionsHistory(user);
  }
}
