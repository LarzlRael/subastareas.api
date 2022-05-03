import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolRepository } from './entities/rol.repository';
import { Rol } from './entities/rol.entity';
import { User } from '../entities/user.entity';
import { RolDto } from './dto/rol.dto';
import { UsersRepository } from '../user.repository';

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
  /* async removeRole(id: number, rol: RolDto): Promise<Rol> {
    
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
  } */
}
