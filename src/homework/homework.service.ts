import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HomeworkRepository } from './homework.repository';
import { HomeworkDto } from './dto/Homework.dto';
import { User } from '../auth/entities/User';

@Injectable()
export class HomeworkService {
  constructor(
    @InjectRepository(HomeworkRepository)
    private homeworkRepository: HomeworkRepository,
  ) {}

  async createHomework(homeWorkDto: HomeworkDto, user: User): Promise<void> {
    this.homeworkRepository.createHomework(homeWorkDto, user);
  }
}
