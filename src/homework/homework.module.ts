import { Module } from '@nestjs/common';
import { HomeworkService } from './homework.service';
import { HomeworkController } from './homework.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeworkRepository } from './homework.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [HomeworkService],
  controllers: [HomeworkController],
  imports: [TypeOrmModule.forFeature([HomeworkRepository]), AuthModule],
})
export class HomeworkModule {}
