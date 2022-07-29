import { Module } from '@nestjs/common';
import { WalletController } from './controllers/wallet.controller';
import { WalletService } from './services/wallet.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from './entities/transaction.entity';
import { TransactionService } from './services/transaction.service';
import { TransactionController } from './controllers/transaction.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Transaction])],
  controllers: [WalletController, TransactionController],
  providers: [WalletService, TransactionService],
  exports: [WalletService, TransactionService],
})
export class WalletModule {}
