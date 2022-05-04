import { EntityRepository, Repository } from 'typeorm';
import { Device } from './entities/devices.entity';
import { User } from '../auth/entities/user.entity';

@EntityRepository(Device)
export class DeviceRepository extends Repository<Device> {
  async newDevice(user: User, idDevice: string): Promise<Device> {
    const device = this.create({
      user,
      idDevice,
    });
    return await this.save(device);
  }
}
