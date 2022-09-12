import { Module } from '@nestjs/common';
import { DevicesController, NotificationController } from './controllers/';

import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigModule } from '@nestjs/config';

import { Device, Notification } from './entities/';
import { DevicesService, NotificationService } from './services';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([Device, Notification]),
  ],
  providers: [DevicesService, NotificationService],
  controllers: [DevicesController, NotificationController],
  exports: [DevicesService, NotificationService],
})
export class DevicesModule {}
