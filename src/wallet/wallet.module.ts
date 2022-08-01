import { Module } from '@nestjs/common';
import { WalletController, TransactionController } from './controllers/';
import { WalletService, TransactionService } from './services/';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet, Transaction } from './entities/';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Transaction])],
  controllers: [WalletController, TransactionController],
  providers: [WalletService, TransactionService],
  exports: [WalletService, TransactionService],
})
export class WalletModule {}
