import { Module } from '@nestjs/common';
import { RolesController } from './controllers/roles.controller';
import { RolesService } from './services/roles.service';
import { ProfessorController } from './controllers/professor.controller';
import { SupervisorController } from './controllers/supervisor.controller';
import { ProfessorService } from './services/professor.service';
import { SupervisorService } from './services/supervisor.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HomeworkRepository } from '../homework/homework.repository';
import { UsersRepository } from '../auth/user.repository';
import { RolRepository } from './repositories/rol.repository';
import { RolsController } from './controllers/rols.controller';
import { RolsService } from './services/rols.service';
import { Professor } from './entities/professor.entity';
import { Supervisor } from './entities/Supervisor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RolRepository,
      HomeworkRepository,
      UsersRepository,
      Supervisor,
      Professor,
    ]),
  ],
  controllers: [
    RolesController,
    ProfessorController,
    SupervisorController,
    RolsController,
  ],
  providers: [RolesService, ProfessorService, SupervisorService, RolsService],
})
export class RolesModule {}
