import { Injectable } from '@nestjs/common';
import { SupervisorRepository } from './supervisor.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../auth/entities/user.entity';
import { Supervisor } from './entities/Supervisor.entity';
import { RolRepository } from '../../auth/rols/entities/rol.repository';
import { RoleEnum } from '../../enums/rol.enum';

@Injectable()
export class SupervisorService {
  constructor(
    @InjectRepository(SupervisorRepository)
    public supervisorRepository: SupervisorRepository,
    @InjectRepository(RolRepository)
    public rolRepository: RolRepository,
  ) {}
  createSupervisor(user: User): Promise<Supervisor> {
    this.rolRepository.assignRole(user, {
      rolName: RoleEnum.SUPERVISOR,
      id: user.id,
      active: true,
    });
    return this.supervisorRepository.createSupervisor(user);
  }
}
