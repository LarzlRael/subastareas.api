import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '../../auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEnum } from '../../enums/enums';
import { RolRepository } from '../repositories/rol.repository';
import { Professor } from '../entities/professor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfessorService {
  constructor(
    @InjectRepository(Professor)
    private professorRepository: Repository<Professor>,
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
