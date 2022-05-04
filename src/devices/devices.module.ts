import { Module } from '@nestjs/common';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceRepository } from './device.repository';

@Module({
  /* imports: [TypeOrmModule.forFeature([DeviceRepository])], */
  imports: [TypeOrmModule.forFeature([DeviceRepository])],
  providers: [DevicesService],
  controllers: [DevicesController],
})
export class DevicesModule {}
