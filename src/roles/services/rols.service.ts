import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolRepository } from '../repositories/rol.repository';
import { Rol } from '../entities/rol.entity';

import { RolDto } from '../dto/rol.dto';
import { UsersRepository } from '../../auth/user.repository';
import { User } from '../../auth/entities/user.entity';

@Injectable()
export class RolsService {
  constructor(
    @InjectRepository(RolRepository)
    private rolRepository: RolRepository,
    private userRepository: UsersRepository,
  ) {}
  createNewRol(user: User, rol: RolDto): Promise<Rol> {
    return this.rolRepository.createRol(user, rol);
  }
  async assignRole(id: number, rol: RolDto): Promise<Rol> {
    const findUser = await this.userRepository.findOne(id);
    if (!findUser) {
      throw new InternalServerErrorException('User not found');
    }
    const currentUserRol = findUser.rols.map((rol) => {
      return rol.rolName;
    });
    if (currentUserRol.includes(rol.rolName)) {
      throw new InternalServerErrorException('Rol already exists');
    }

    return this.rolRepository.assignRole(findUser, rol);
  }
  async assignStudenRole(user: User, rol: RolDto): Promise<Rol> {
    return this.rolRepository.assignRole(user, rol);
  }
  async listUserRoles(idUser: number): Promise<Rol[]> {
    const findUser = await this.userRepository.findOne(idUser);
    if (!findUser) {
      throw new InternalServerErrorException('User not found');
    }
    return this.rolRepository.listUserRoles(findUser);
  }
  async removeRole(idRole: number) {
    const getRole = await this.rolRepository.findOne(idRole);
    if (!getRole) {
      throw new InternalServerErrorException('Rol not found not found');
    }

    return await this.rolRepository.delete(idRole);
  }
}
