import { Module } from '@nestjs/common';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';
import { TradeRepository } from './trade.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferRepository } from '../offer/offer.repository';
import { UsersRepository } from '../auth/user.repository';
import { WalletRepository } from '../wallet/wallet.repository';
import { HomeworkRepository } from '../homework/homework.repository';
import { NotificationService } from '../devices/notification/notification.service';
import { NotificationRepository } from '../devices/notification/repository/notification.repository';
import { DeviceRepository } from '../devices/device.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TradeRepository,
      OfferRepository,
      UsersRepository,
      WalletRepository,
      HomeworkRepository,
      NotificationRepository,
      DeviceRepository,
    ]),
  ],
  controllers: [TradeController],
  providers: [TradeService, NotificationService],
})
export class TradeModule {}
