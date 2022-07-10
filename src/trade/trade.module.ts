import { Module } from '@nestjs/common';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferRepository } from '../offer/offer.repository';
import { UsersRepository } from '../auth/user.repository';
import { HomeworkRepository } from '../homework/homework.repository';
import { NotificationService } from '../devices/notification/notification.service';

import { Wallet } from '../wallet/entities/wallet.entity';
import { Trade } from 'src/trade/entities/trade.entity';
import { Notification } from 'src/devices/notification/entities/notification.entity';
import { DevicesModule } from '../devices/devices.module';
import { Device } from '../devices/entities/devices.entity';

@Module({
  imports: [
    DevicesModule,
    TypeOrmModule.forFeature([
      OfferRepository,
      UsersRepository,

      HomeworkRepository,
      Device,
      Notification,
      Trade,
      Wallet,
    ]),
  ],
  controllers: [TradeController],
  providers: [TradeService, NotificationService],
})
export class TradeModule {}
