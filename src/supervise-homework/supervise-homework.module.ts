import { Module } from '@nestjs/common';
import { SuperviseHomeWork } from './entities/superviseHomework..entity';
import { SuperviseHomeworkController } from './supervise-homework.controller';
import { SuperviseHomeworkService } from './supervise-homework.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SuperviseHomeWork])],
  controllers: [SuperviseHomeworkController],
  providers: [SuperviseHomeworkService],
})
export class SuperviseHomeworkModule {}
