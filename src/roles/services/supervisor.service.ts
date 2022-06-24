import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupervisorRepository } from '../repositories/supervisor.repository';
import { User } from '../../auth/entities/user.entity';
import { Supervisor } from '../entities/Supervisor.entity';
import { RoleEnum } from '../../enums/enums';
import { HomeworkRepository } from '../../homework/homework.repository';
import { Homework } from '../../homework/entities/Homework.entity';
import { ActionSupervisorDTO } from '../dto/action.dto';
import { UsersRepository } from 'src/auth/user.repository';
import { RolRepository } from '../repositories/rol.repository';

@Injectable()
export class SupervisorService {
  constructor(
    public supervisorRepository: SupervisorRepository,
    public rolRepository: RolRepository,
    public homeworkRepository: HomeworkRepository,
    public usersRepository: UsersRepository,
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
  async becomeSupervisor(idUser: number): Promise<Supervisor> {
    const user = await this.usersRepository.findOne(idUser);
    if (!user) {
      throw new InternalServerErrorException('User not found');
    } else {
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
  }
  async getHomeworksToSupervise(): Promise<Homework[]> {
    return await this.homeworkRepository.find({
      where: [{ status: 'pending' }, { status: 'rejected' }],
    });
  }
  async superviseHomework(
    user: User,
    actionSupervisorDTO: ActionSupervisorDTO,
  ): Promise<Homework> {
    const homework = await this.homeworkRepository.findOne(
      actionSupervisorDTO.idHomework,
    );
    if (!homework) {
      throw new InternalServerErrorException('Homework not found');
    }
    /* homework.status = actionSupervisorDTO.status; */
    homework.observation = actionSupervisorDTO.observation;
    homework.userSupervisor = user;
    await this.homeworkRepository.save(homework);
    homework.userSupervisor = user;
    const getSuperisorid = await this.supervisorRepository.findOne(
      user.supervisor.id,
    );
    getSuperisorid.supervisedHomework += 1;
    await this.supervisorRepository.save(getSuperisorid);
    return homework;
  }
}
