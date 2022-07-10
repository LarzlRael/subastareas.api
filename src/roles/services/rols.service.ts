import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rol } from '../entities/rol.entity';
import { RolDto } from '../dto/rol.dto';
import { UsersRepository } from '../../auth/user.repository';
import { User } from '../../auth/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolsService {
  constructor(
    @InjectRepository(Rol)
    private rolRepository: Repository<Rol>,
    private userRepository: UsersRepository,
  ) {}

  async createNewRol(user: User, rol: RolDto): Promise<Rol> {
    try {
      return await this.rolRepository.save({ ...rol, user });
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
  async assignRole(id: number, rol: RolDto) {
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

    try {
      await this.userRepository.save({ ...rol, findUser });
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
  async assignStudenRole(user: User, rol: RolDto) {
    return this.assignRole(user.id, rol);
  }
  async listUserRoles(idUser: number) {
    const findUser = await this.userRepository.findOne(idUser);
    if (!findUser) {
      throw new InternalServerErrorException('User not found');
    }
    return await this.rolRepository.find({ user: findUser });
  }
  async removeRole(idRole: number) {
    const getRole = await this.rolRepository.findOne(idRole);
    if (!getRole) {
      throw new InternalServerErrorException('Rol not found not found');
    }

    return await this.rolRepository.delete(idRole);
  }
}
