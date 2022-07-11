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
import { AuthService } from '../../auth/auth.service';
import { forwardRef } from '@nestjs/common';

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
  async assignRole(id: number, rol: RolDto) {
    const findUser = await this.userService.getOneUser(id);

    const currentUserRol = findUser.rols.map((rol) => {
      return rol.rolName;
    });
    if (currentUserRol.includes(rol.rolName)) {
      throw new InternalServerErrorException('Rol already exists');
    }

    try {
      await this.userService.saveUser({ ...rol, ...findUser });
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
    const findUser = this.userService.getOneUser(idUser);
    return await this.rolRepository.find({ where: { user: findUser } });
  }
  async removeRole(idRole: number) {
    const getRole = await this.rolRepository.findOne(idRole);
    if (!getRole) {
      throw new InternalServerErrorException('Rol not found not found');
    }

    return await this.rolRepository.delete(idRole);
  }
}
