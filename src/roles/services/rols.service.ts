import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rol } from '../entities/rol.entity';
import { RolDto } from '../dto/rol.dto';
import { User } from '../../auth/entities/user.entity';
import { Repository } from 'typeorm';

import { forwardRef } from '@nestjs/common';
import { AuthService } from '../../auth/services/auth.service';

@Injectable()
export class RolsService {
  constructor(
    @InjectRepository(Rol)
    private rolRepository: Repository<Rol>,

    @Inject(forwardRef(() => AuthService))
    private userService: AuthService,
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
  async assignRole(idUser: number, rol: RolDto) {
    const findUser = await this.userService.getOneUser(idUser);

    if (!findUser) {
      throw new InternalServerErrorException('User not found');
    }
    const currentUserRol = findUser.rols.map((rol) => {
      return rol.rolName;
    });
    if (currentUserRol.includes(rol.rolName)) {
      throw new InternalServerErrorException('Rol already exists');
    }
    console.log(findUser);
    try {
      const newROl = await this.rolRepository.save({
        ...rol,
        user: findUser,
      });
      const newUser = await this.userService.saveUser({
        ...findUser,
        rols: [...findUser.rols, newROl],
      });
      /* console.log(newUser); */
      return newUser;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // duplicate user
        throw new ConflictException('Rol already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  async assignStudenRole(user: User, rol: RolDto) {
    const assinedRoles = await this.assignRole(user.id, rol);
    console.log(assinedRoles);
    return assinedRoles;
  }
  async listUserRoles(idUser: number) {
    const findUser = await this.userService.getOneUser(idUser);
    return await this.rolRepository.find({
      where: {
        user: {
          id: findUser.id,
        },
      },
    });
  }
  async removeRole(idRole: number) {
    const getRole = await this.rolRepository.findOne({
      where: { id: idRole },
    });
    if (!getRole) {
      throw new InternalServerErrorException('Rol not found not found');
    }

    return await this.rolRepository.delete(idRole);
  }
}
