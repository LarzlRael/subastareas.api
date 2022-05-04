import { Module } from '@nestjs/common';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';
import { TradeRepository } from './trade.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferRepository } from '../offer/offer.repository';
import { UsersRepository } from '../auth/user.repository';
import { WalletRepository } from '../wallet/wallet.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TradeRepository,
      OfferRepository,
      UsersRepository,
      WalletRepository,
    ]),
  ],
  controllers: [TradeController],
  providers: [TradeService],
})
export class TradeModule {}
