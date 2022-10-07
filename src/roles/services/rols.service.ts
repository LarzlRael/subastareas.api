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
export class RolesService {
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
  async assignRole(idUser: number, rolDto: RolDto) {
    const findUser = await this.userService.getOneUser(idUser);

    if (!findUser) {
      throw new InternalServerErrorException('User not found');
    }
    const currentUserRol = findUser.rols.map((rol) => {
      return rol.rolName;
    });

    if (currentUserRol.includes(rolDto.rolName)) {
      throw new InternalServerErrorException('Rol already exists');
    }
    try {
      await this.rolRepository.save({
        ...rolDto,
        user: findUser,
      });

      return findUser;
    } catch (error) {
      console.log(error);
      if (error.code === 'ER_DUP_ENTRY') {
        // duplicate rol
        throw new ConflictException('Rol already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  /* async assignStudentRole(user: User, rolDto: RolDto) {
    return await this.assignRole(user.id, rolDto);
  } */
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
