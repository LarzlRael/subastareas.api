import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from './roles/roles.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppGateway } from './app.gateway';
import { OfferModule } from './offer/offer.module';
import { TradeModule } from './trade/trade.module';
import { PlanesSubscriber } from './trade/suscribers/planes.susbriber';
import { BankModule } from './bank/bank.module';

/* import typeOrmConfig, { typeOrmAsyncConfig } from './config/typeorm.config'; */
import { typeOrmConfig, typeOrmAsyncConfig } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    /* TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      synchronize: true,
      subscribers: [PlanesSubscriber],
      autoLoadEntities: true,
    }), */
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    AuthModule,
    RolesModule,
    OfferModule,
    TradeModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../', 'client'),
    }),
    BankModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
