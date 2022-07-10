import { Module } from '@nestjs/common';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '../auth/user.repository';
import { HomeworkRepository } from '../homework/homework.repository';
import { NotificationService } from '../devices/notification/notification.service';

import { Wallet } from '../wallet/entities/wallet.entity';
import { Trade } from 'src/trade/entities/trade.entity';
import { Notification } from 'src/devices/notification/entities/notification.entity';
import { DevicesModule } from '../devices/devices.module';
import { Device } from '../devices/entities/devices.entity';
import { OfferModule } from '../offer/offer.module';

@Module({
  imports: [
    OfferModule,
    DevicesModule,
    TypeOrmModule.forFeature([
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
