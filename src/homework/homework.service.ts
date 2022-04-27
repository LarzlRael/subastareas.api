import { Injectable, UploadedFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HomeworkRepository } from './homework.repository';
import { HomeworkDto } from './dto/Homework.dto';
import { User } from '../auth/entities/User';

@Injectable()
export class HomeworkService {
  constructor(
    @InjectRepository(HomeworkRepository)
    private homeworkRepository: HomeworkRepository,
  ) { }

  async createHomework(
    homeworkDto: HomeworkDto,
    file: Express.Multer.File,
    user: User,
  ): Promise<HomeworkDto> {
    return this.homeworkRepository.createHomework(homeworkDto, file, user);
  }
  async getHomeworkByUser(user: User) {
    return this.homeworkRepository.getHomeworksById(user);
  }
  async getOneHomework(id: number) {
    return this.homeworkRepository.getOneHomework(id);
  }
  async deleteHomework(user: User, id: number): Promise<void> {
    return this.homeworkRepository.deleteHomework(user, id);
  }
  async updateHomework(
    homeWorkDto: HomeworkDto,
    file: Express.Multer.File,
    user: User,
    id: number,
  ) {
    return this.homeworkRepository.updateHomework(homeWorkDto, file, user, id);
  }
}
