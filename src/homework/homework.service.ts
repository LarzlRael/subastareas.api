import { Injectable, UploadedFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HomeworkRepository } from './homework.repository';
import { HomeworkDto } from './dto/Homework.dto';
import { User } from '../auth/entities/user.entity';
import { HomeWorkStatusEnum } from '../enums/rol.enum';
import { Homework } from './entities/Homework.entity';

@Injectable()
export class HomeworkService {
  constructor(
    @InjectRepository(HomeworkRepository)
    private homeworkRepository: HomeworkRepository,
  ) {}

  async createHomework(
    homeworkDto: HomeworkDto,
    file: Express.Multer.File,
    user: User,
  ): Promise<Homework> {
    return this.homeworkRepository.createHomework(homeworkDto, file, user);
  }
  async getAprovedHomeWorks() {
    return this.homeworkRepository.find({
      where: { status: HomeWorkStatusEnum.ACCEPTED },
    });
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
  async getPendingHomework(
    homeWorkStatusEnum: HomeWorkStatusEnum,
  ): Promise<Homework[]> {
    return this.homeworkRepository.find({
      where: { status: homeWorkStatusEnum },
    });
  }
}
