import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Device } from '../entities/';
import { User } from '../../auth/entities/user.entity';

@Injectable()
export class DevicesService {
  constructor(
    @InjectRepository(Device)
    private deviceRepository: Repository<Device>,
  ) {}

  async createDevice(user: User, idDevice: string): Promise<Device> {
    if (
      user.device &&
      user.device.find((device) => device.idDevice === idDevice)
    ) {
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
    console.log(user);
    const gerUserDevices = await this.deviceRepository.find({
      where: { user: { id: user.id } },
    });
    return gerUserDevices.map((device) => device.idDevice);
  }
}
