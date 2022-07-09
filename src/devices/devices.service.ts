import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from './entities/devices.entity';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device)
    private deviceRepository: Repository<Device>,
  ) {}

  async createDevice(user: User, idDevice: string): Promise<Device> {
    /* console.log(user.device.find((device) => device.idDevice === idDevice)); */
    /* console.log(user); */
    if (user.device.find((device) => device.idDevice === idDevice)) {
      return;
    } else {
      const device = this.deviceRepository.create({
        user,
        idDevice,
      });
      return await this.deviceRepository.save(device);
    }
  }
  async deleteDevice(idDevice: string) {
    return await this.deviceRepository.delete({ idDevice });
  }
  async getUserDevices(user: User): Promise<string[]> {
    const gerUserDevices = await this.deviceRepository.find({ user });
    return gerUserDevices.map((device) => device.idDevice);
  }
}
