import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeviceRepository } from './device.repository';
import { Device } from './entities/devices.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(DeviceRepository)
    private deviceRepository: DeviceRepository,
  ) {}

  createDevice(user: User, idDevice: string): Promise<Device> {
    if (user.device.find((device) => device.idDevice === idDevice)) {
      return;
    }
    return this.deviceRepository.newDevice(user, idDevice);
  }
  async deleteDevice(idDevice: string) {
    return await this.deviceRepository.delete({ idDevice });
  }
}
