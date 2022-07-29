import { Module } from '@nestjs/common';
import { TradeController } from './controllers/trade.controller';

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
import { TradeService } from './services/trade.service';
import { PlanesServices } from './services/planes.service';
import { PlanesController } from './controllers/planes.controller';
import { Planes } from './entities/planes.entity';
import { ConfigModule } from '@nestjs/config';
import { Shopping } from './entities/shopping.entity';
import { ShoppingController } from './controllers/shopping.controller';
import { ShoppingService } from './services/shopping.service';

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
