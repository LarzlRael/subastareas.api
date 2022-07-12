import { Module } from '@nestjs/common';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationService } from '../devices/notification/notification.service';

import { Wallet } from '../wallet/entities/wallet.entity';
import { Notification } from '../devices/notification/entities/notification.entity';
import { Device } from '../devices/entities/devices.entity';
import { Trade } from '../trade/entities/trade.entity';
import { DevicesModule } from '../devices/devices.module';
import { OfferModule } from '../offer/offer.module';
import { HomeworkModule } from '../homework/homework.module';
import { WalletModule } from '../wallet/wallet.module';
import { Offer } from '../offer/entities/offer.entity';

@Module({
  imports: [
    HomeworkModule,
    WalletModule,
    OfferModule,
    DevicesModule,
    TypeOrmModule.forFeature([Trade, Offer, Notification, Wallet, Device]),
  ],
  controllers: [TradeController],
  providers: [TradeService, NotificationService],
  exports: [TradeService],
})
export class TradeModule {}
