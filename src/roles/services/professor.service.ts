import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ProfessorRepository } from '../repositories/professor.repository';
import { User } from '../../auth/entities/user.entity';
import { RolRepository } from 'src/auth/rols/entities/rol.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEnum } from '../../enums/enums';

@Injectable()
export class ProfessorService {
  constructor(
    private professorRepository: ProfessorRepository,
    @InjectRepository(RolRepository)
    private rolRepository: RolRepository,
  ) {}

  async becomeProfessor(user: User) {
    if (user.professor) {
      throw new InternalServerErrorException('You are already a professor');
    }
    this.rolRepository.assignRole(user, {
      rolName: RoleEnum.PROFESSOR,
      id: user.id,
      active: true,
    });
    const createProffesor = this.professorRepository.create({ user });
    return await this.professorRepository.save(createProffesor);
  }
}
