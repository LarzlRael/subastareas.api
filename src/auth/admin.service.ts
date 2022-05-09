import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './user.repository';
import { User } from './entities/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
  ) {}
  async getUsers(): Promise<User[]> {
    //TODO add pagination and filters

    const users = await this.usersRepository.find();

    const deleteFields = users.map((user) => {
      delete user.password;
      if (user.rols) {
        user.userRols = user.rols.map((rol) => rol.rolName);
        delete user.rols;
      }
      if (user.device) {
        user.userDevices = user.device.map((device) => device.idDevice);
        delete user.device;
      }
      return user;
    });

    return deleteFields;
  }
}
