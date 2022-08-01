import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationService } from '../devices/notification/';

import { DevicesModule } from '../devices/devices.module';
import { OfferModule } from '../offer/offer.module';
import { HomeworkModule } from '../homework/homework.module';
import { WalletModule } from '../wallet/wallet.module';
import { RolesModule } from '../roles/roles.module';

import { ProfessorService } from '../roles/services/';
import { Professor } from '../roles/entities/';
import { TradeService, PlanesServices, ShoppingService } from './services/';

import {
  PlanesController,
  ShoppingController,
  TradeController,
} from './controllers/';
import { ConfigModule } from '@nestjs/config';

import { Planes, Shopping, Trade } from './entities/';
import { Notification } from '../devices/entities';

@Module({
  imports: [
    HomeworkModule,
    WalletModule,
    OfferModule,
    DevicesModule,
    RolesModule,
    TypeOrmModule.forFeature([
      Trade,
      Notification,
      Professor,
      Planes,
      Shopping,
    ]),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  controllers: [TradeController, PlanesController, ShoppingController],
  providers: [
    TradeService,
    NotificationService,
    ProfessorService,
    PlanesServices,
    ShoppingService,
  ],
  exports: [TradeService, PlanesServices, ShoppingService],
})
export class TradeModule {}
