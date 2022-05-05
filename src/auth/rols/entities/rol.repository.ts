import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

import { EntityRepository, Repository } from 'typeorm';
import { Rol } from './rol.entity';
import { User } from '../../entities/user.entity';
import { RolDto } from '../dto/rol.dto';

@EntityRepository(Rol)
export class RolRepository extends Repository<Rol> {
  async createRol(user: User, rol: RolDto): Promise<Rol> {
    try {
      return await this.save({ ...rol, user });
    } catch (error) {
      console.log(error);
      if (error.code === 'ER_DUP_ENTRY') {
        // duplicate user
        throw new ConflictException('Rol already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  async assignRole(user: User, rol: RolDto): Promise<Rol> {
    try {
      return await this.save({ ...rol, user });
    } catch (error) {
      console.log(error);
      if (error.code === 'ER_DUP_ENTRY') {
        // duplicate user
        throw new ConflictException('Rol already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  async listUserRoles(user: User): Promise<Rol[]> {
    return await this.find({ user });
  }
  /*  async removeRole(user: User, rol: RolDto): Promise<Rol> {
    try {
      return await this.delete({ ...rol, user });
    } catch (error) {
      console.log(error);
      if (error.code === 'ER_DUP_ENTRY') {
        // duplicate user
        throw new ConflictException('Rol already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  } */
}
