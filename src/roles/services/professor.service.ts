import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from '../../auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEnum } from '../../enums/enums';
import { Professor } from '../entities/professor.entity';
import { Repository } from 'typeorm';
import { RolsService } from './rols.service';

@Injectable()
export class ProfessorService {
  constructor(
    @InjectRepository(Professor)
    private professorRepository: Repository<Professor>,
    private rolService: RolsService,
  ) {}

  async becomeProfessor(user: User) {
    if (user.professor) {
      throw new InternalServerErrorException('You are already a professor');
    }

    const createProfessor = this.professorRepository.create({ user });
    return await this.professorRepository.save(createProfessor);
  }
  async addReputation(id: number, reputation: number) {
    const professor = await this.professorRepository.findOne({
      where: { user: { id } },
    });
    if (!professor) {
      throw new InternalServerErrorException('Professor not found');
    }
    professor.reputation += reputation;
    return await this.professorRepository.save(professor);
  }
}
