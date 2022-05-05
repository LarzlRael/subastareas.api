import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeworkModule } from './homework/homework.module';
import { CommentsModule } from './comments/comments.module';
import { AppGateway } from './app.gateway';
import { RolsModule } from './auth/rols/rols.module';
import { OfferController } from './offer/offer.controller';
import { OfferModule } from './offer/offer.module';
import { DevicesModule } from './devices/devices.module';
import { WalletModule } from './wallet/wallet.module';
import { TradeModule } from './trade/trade.module';
import { SuperviseHomeworkModule } from './supervise-homework/supervise-homework.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      synchronize: true,
      autoLoadEntities: true,
    }),
    AuthModule,
    HomeworkModule,
    CommentsModule,
    RolsModule,
    OfferModule,
    DevicesModule,
    WalletModule,
    TradeModule,
    /* SuperviseHomeworkModule, */
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
