import { Module } from '@nestjs/common';
import { HomeworkService } from './homework.service';
import { HomeworkController } from './homework.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeworkRepository } from './homework.repository';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryProvider } from './cloudinary.provider';
import { SupervisorModule } from './supervisor/supervisor.module';
import { ProfessorModule } from './professor/professor.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HomeworkRepository]),
    AuthModule,
    SupervisorModule,
    ProfessorModule,
  ],
  controllers: [HomeworkController],
  providers: [HomeworkService, CloudinaryProvider],
  exports: [CloudinaryProvider, HomeworkService],
})
export class HomeworkModule {}
