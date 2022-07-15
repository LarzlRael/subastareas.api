import { Module } from '@nestjs/common';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification/notification.service';
import { NotificationController } from './notification/notification.controller';
import { ConfigModule } from '@nestjs/config';
import { Notification } from './notification/entities/notification.entity';
import { Device } from './entities/devices.entity';

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
