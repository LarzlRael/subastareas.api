import { Module, forwardRef } from '@nestjs/common';
import { ProfessorController } from './controllers/professor.controller';
import { SupervisorController } from './controllers/supervisor.controller';
import { ProfessorService } from './services/professor.service';
import { SupervisorService } from './services/supervisor.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RolsController } from './controllers/rols.controller';
import { RolsService } from './services/rols.service';
import { Professor } from './entities/professor.entity';
import { Supervisor } from './entities/Supervisor.entity';
import { Rol } from './entities/rol.entity';
import { AuthModule } from '../auth/auth.module';
import { HomeworkModule } from '../homework/homework.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    HomeworkModule,
    TypeOrmModule.forFeature([Rol, Professor, Supervisor]),
  ],
  controllers: [ProfessorController, SupervisorController, RolsController],
  providers: [ProfessorService, SupervisorService, RolsService],
})
export class RolesModule {}
