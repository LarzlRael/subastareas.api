import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

import { EntityRepository, Repository } from 'typeorm';
import { HomeworkDto } from './dto/homework.dto';
import { HomeWork } from './entities/Homework';
import { User } from '../auth/entities/User';

@EntityRepository(HomeWork)
export class HomeworkRepository extends Repository<HomeWork> {
  async createHomework(homeWorkDto: HomeworkDto, user: User): Promise<void> {
    const createHomework = this.create({
      user,
      ...homeWorkDto,
    });

    await this.save(createHomework);
  }
}
