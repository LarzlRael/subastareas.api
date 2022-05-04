import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupervisorRepository } from './supervisor.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../auth/entities/user.entity';
import { Supervisor } from './entities/Supervisor.entity';
import { RolRepository } from '../../auth/rols/entities/rol.repository';
import { RoleEnum } from '../../enums/rol.enum';
import { HomeworkRepository } from '../homework.repository';
import { Homework } from '../entities/Homework.entity';
import { ActionSupervisorDTO } from './dto/action.dto';

@Injectable()
export class SupervisorService {
  constructor(
    @InjectRepository(SupervisorRepository)
    public supervisorRepository: SupervisorRepository,
    @InjectRepository(RolRepository)
    public rolRepository: RolRepository,
    @InjectRepository(HomeworkRepository)
    public homeworkRepository: HomeworkRepository,
  ) {}
  createSupervisor(user: User): Promise<Supervisor> {
    if (user.supervisor) {
      throw new InternalServerErrorException('You are already a supervisor');
    }
    this.rolRepository.assignRole(user, {
      rolName: RoleEnum.SUPERVISOR,
      id: user.id,
      active: true,
    });
    return this.supervisorRepository.createSupervisor(user);
  }
  async getHomewoksToSupervisor(): Promise<Homework[]> {
    return await this.homeworkRepository.find({
      where: [{ status: 'pending' }, { status: 'rejected' }],
    });
  }
  async monitorHomework(
    actionSupervisorDTO: ActionSupervisorDTO,
  ): Promise<Homework> {
    const homework = await this.homeworkRepository.findOne(
      actionSupervisorDTO.idHomework,
    );
    if (!homework) {
      throw new InternalServerErrorException('Homework not found');
    }
    homework.status = actionSupervisorDTO.status;
    homework.observation = actionSupervisorDTO.observation;
    await this.homeworkRepository.save(homework);
    return homework;
  }
}
