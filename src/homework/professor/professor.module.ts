import { Module } from '@nestjs/common';
import { ProfessorController } from './professor.controller';
import { ProfessorService } from './professor.service';
import { ProfessorRepository } from './professor.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolRepository } from 'src/auth/rols/entities/rol.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProfessorRepository, RolRepository])],
  controllers: [ProfessorController],
  providers: [ProfessorService],
})
export class ProfessorModule {}
