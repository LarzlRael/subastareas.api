import { Module } from '@nestjs/common';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceRepository } from './device.repository';
import { NotificationService } from './notification/notification.service';
import { NotificationController } from './notification/notification.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  /* imports: [TypeOrmModule.forFeature([DeviceRepository])], */

  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([DeviceRepository]),
  ],
  providers: [DevicesService, NotificationService],
  controllers: [DevicesController, NotificationController],
})
export class DevicesModule {}
