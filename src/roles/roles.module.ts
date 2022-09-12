import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { HomeworkModule } from '../homework/homework.module';
import {
  ProfessorController,
  SupervisorController,
  RolsController,
} from './controllers';

import { ProfessorService, RolsService, SupervisorService } from './services/';
import { Professor, Supervisor, Rol } from './entities/';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    HomeworkModule,
    TypeOrmModule.forFeature([Rol, Supervisor, Professor]),
  ],
  controllers: [ProfessorController, SupervisorController, RolsController],
  providers: [ProfessorService, SupervisorService, RolsService],
  exports: [ProfessorService, SupervisorService, RolsService],
})
export class RolesModule {}
