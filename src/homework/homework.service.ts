import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HomeworkRepository } from './homework.repository';
import { HomeworkDto } from './dto/Homework.dto';
import { User } from '../auth/entities/user.entity';
import { HomeWorkStatusEnum, HomeWorkTypeEnum } from '../enums/enums';
import { Homework } from './entities/Homework.entity';
import { OfferRepository } from '../offer/offer.repository';
import { CommentRepository } from '../comments/comment.repository';

@Injectable()
export class HomeworkService {
  constructor(
    @InjectRepository(HomeworkRepository)
    private homeworkRepository: HomeworkRepository,
    private offerRepository: OfferRepository,
    private commentRepository: CommentRepository,
  ) {}

  async createHomework(
    homeworkDto: HomeworkDto,
    file: Express.Multer.File,
    user: User,
  ): Promise<Homework> {
    return this.homeworkRepository.createHomework(homeworkDto, file, user);
  }
  async getAprovedHomeWorks() {
    return this.homeworkRepository.getHomeworksByCondition({
      status: HomeWorkStatusEnum.ACCEPTED,
    });
  }
  async getUserPendingOfferAccept(user: User) {
    return this.homeworkRepository.getHomeworksByCondition({
      status: HomeWorkStatusEnum.PENDING_TO_RESOLVE,
      user: user,
    });
  }
  async getHomeworkByCategory(category: string[]) {
    return await this.homeworkRepository.getHomeworksByCategory(category);
  }
  async getHomeworkByUser(user: User) {
    /* return this.getHomeworksByCondition('user', user); */
    return this.homeworkRepository.getHomeworksByCondition({ user: user });
  }
  async getOneHomework(id: number) {
    const homework = await this.homeworkRepository.getOneHomework(id);

    const comments = await this.commentRepository.getCommentsByHomework(id);
    const offers = await this.offerRepository.getOffersByHomeworks(homework);
    console.log(offers);
    return { homework, comments, offers };
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
  getSubjectsAndLevels() {
    return Object.values(HomeWorkTypeEnum);
  }
}
