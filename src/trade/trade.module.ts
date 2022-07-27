import { Module } from '@nestjs/common';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationService } from '../devices/notification/notification.service';

import { Trade } from '../trade/entities/trade.entity';
import { DevicesModule } from '../devices/devices.module';
import { OfferModule } from '../offer/offer.module';
import { HomeworkModule } from '../homework/homework.module';
import { WalletModule } from '../wallet/wallet.module';
import { Notification } from './../devices/notification/entities/notification.entity';
import { ProfessorService } from '../roles/services/professor.service';
import { Professor } from '../roles/entities/professor.entity';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    HomeworkModule,
    WalletModule,
    OfferModule,
    DevicesModule,
    RolesModule,
    TypeOrmModule.forFeature([Trade, Notification, Professor]),
  ],
  controllers: [TradeController],
  providers: [TradeService, NotificationService, ProfessorService],
  exports: [TradeService],
})
export class TradeModule {}
