import {
  Inject,
  Injectable,
  InternalServerErrorException,
  forwardRef,
} from '@nestjs/common';
import { User } from '../../auth/entities/user.entity';
import { Supervisor } from '../entities/Supervisor.entity';
import { RoleEnum } from '../../enums/enums';

import { Homework } from '../../homework/entities/Homework.entity';
import { ActionSupervisorDTO } from '../dto/action.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesService } from './rols.service';

import { HomeworkService } from '../../homework/homework.service';
import { AuthService } from '../../auth/services/auth.service';

@Injectable()
export class SupervisorService {
  constructor(
    @InjectRepository(Supervisor)
    private supervisorRepository: Repository<Supervisor>,
    private userService: AuthService,
    private rolService: RolesService,
    private homeworkService: HomeworkService,
  ) {}
  async createSupervisor(user: User): Promise<Supervisor> {
    if (user.supervisor) {
      throw new InternalServerErrorException('You are already a supervisor');
    }
    this.rolService.assignRole(user.id, {
      rolName: RoleEnum.SUPERVISOR,
      id: user.id,
      active: true,
    });
    const createNewSupervisor = this.supervisorRepository.create({ user });
    return await this.supervisorRepository.save(createNewSupervisor);
  }
  async becomeSupervisor(idUser: number): Promise<Supervisor> {
    const user = await this.userService.getOneUser(idUser);
    if (!user) {
      throw new InternalServerErrorException('User not found');
    }
    if (user.supervisor) {
      throw new InternalServerErrorException('You are already a supervisor');
    }
    this.rolService.assignRole(user.id, {
      rolName: RoleEnum.SUPERVISOR,
      id: user.id,
      active: true,
    });
    /* return this.supervisorRepository.createSupervisor(user); */
    const createNewSupervisor = this.supervisorRepository.create({ user });
    return await this.supervisorRepository.save(createNewSupervisor);
  }
  async getHomeworksToSupervise(): Promise<Homework[]> {
    return await this.homeworkService.getHomeworkToSupervisor();
  }
  async superviseHomework(
    user: User,
    actionSupervisorDTO: ActionSupervisorDTO,
  ): Promise<Homework> {
    const homework = await this.homeworkService.getOneHomeworkAll(
      actionSupervisorDTO.idHomework,
    );
    if (!homework) {
      throw new InternalServerErrorException('Homework not found');
    }
    homework.observation = actionSupervisorDTO.observation;
    homework.userSupervisor = user;
    homework.status = actionSupervisorDTO.status;
    await this.homeworkService.saveHomework(homework);
    const getSupervisorId = await this.supervisorRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
      },
    });
    getSupervisorId.supervisedHomework += 1;
    await this.supervisorRepository.save(getSupervisorId);
    return homework;
  }
}
