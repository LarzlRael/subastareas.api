import { Module } from '@nestjs/common';
import { WalletController, TransactionController } from './controllers/';
import {
  WalletService,
  TransactionService,
  WithDrawService,
} from './services/';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet, Transaction, Withdraw } from './entities/';
import { BankModule } from '../bank/bank.module';
import { WithDrawController } from './controllers/withdraw.controller';

@Module({
  imports: [
    BankModule,
    TypeOrmModule.forFeature([Wallet, Transaction, Withdraw]),
  ],
  controllers: [WalletController, TransactionController, WithDrawController],
  providers: [WalletService, TransactionService, WithDrawService],
  exports: [WalletService, TransactionService, WithDrawService],
})
export class WalletModule {}
