import { Injectable } from '@nestjs/common';

import { User } from './entities/user.entity';
import { AuthService } from './auth.service';

@Injectable()
export class AdminService {
  constructor(private userServices: AuthService) {}
  async getUsers(): Promise<User[]> {
    //TODO add pagination and filters

    const users = await this.userServices.getAllUsers();

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
