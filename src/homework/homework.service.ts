import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HomeworkDto } from './dto/Homework.dto';
import { User } from '../auth/entities/user.entity';
import { HomeWorkStatusEnum, HomeWorkTypeEnum } from '../enums/enums';
import { Homework } from './entities/Homework.entity';
import { CommentsService } from '../comments/comments.service';
import { OfferService } from '../offer/offer.service';
import {
  Brackets,
  ObjectLiteral,
  SelectQueryBuilder,
  In,
  Repository,
} from 'typeorm';
import { uploadFile } from '../utils/utils';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class HomeworkService {
  constructor(
    @InjectRepository(Homework)
    private homeworkRepository: Repository<Homework>,

    @Inject(forwardRef(() => OfferService))
    private offerService: OfferService,
    @Inject(forwardRef(() => CommentsService))
    private commentService: CommentsService,
  ) {}

  async createHomework(
    homeworkDto: HomeworkDto,
    file: Express.Multer.File,
    user: User,
  ): Promise<Homework> {
    if (file) {
      uploadFile(file, 'HOMEWORK').then(async (url) => {
        const homework = this.homeworkRepository.create({
          ...homeworkDto,
          fileUrl: url,
          user,
          fileType: file.mimetype,
        });
        await this.homeworkRepository.save(homework);
        return homework;
      });
    } else {
      const createdHomework = this.homeworkRepository.create({
        user,
        ...homeworkDto,
        fileType: 'only_text',
        status: HomeWorkStatusEnum.ACCEPTED,
      });
      return await this.homeworkRepository.save(createdHomework);
    }
  }
  async getAprovedHomeWorks() {
    return this.getHomeworksByCondition({
      status: HomeWorkStatusEnum.ACCEPTED,
    });
  }
  async getUserPendingOfferAccept(user: User) {
    return this.getHomeworksByCondition({
      status: HomeWorkStatusEnum.PENDING_TO_RESOLVE,
      user: user,
    });
  }
  async getHomeworkByCategory(category: string[]) {
    if (category[0] !== 'empty') {
      return this.getHomeworksByCondition({ category: In(category) });
    }
    return this.getHomeworksByCondition({
      category: In(category),
    });
  }
  async getHomeworkByUser(user: User) {
    /* return this.getHomeworksByCondition('user', user); */
    return this.getHomeworksByCondition({ user: user });
  }
  async getOneHomework(id: number) {
    const homework = await this.getOneHomeworkComments(id);
    const comments = await this.commentService.getCommentsByHomework(id);
    const offers = await this.offerService.getOffersByHomeworks(homework.id);
    return { homework, comments, offers };
  }
  async deleteHomework(user: User, id: number): Promise<void> {
    const homework = await this.getOneHomeworkWhere({ id });

    if (homework.user.id !== user.id) {
      throw new InternalServerErrorException(
        'No permission to delete this homework',
      );
    } else {
      if (!homework) {
        throw new InternalServerErrorException('Homework not found');
      }
      await this.homeworkRepository.delete(id);
    }
  }
  async updateHomework(
    homeWorkDto: HomeworkDto,
    file: Express.Multer.File,
    user: User,
    id: number,
  ) {
    const homework = await this.getOneHomeworkWhere({ id }, ['user']);

    if (!homework) {
      throw new InternalServerErrorException('Homework not found');
    } else {
      if (homework.user.id !== user.id) {
        throw new InternalServerErrorException(
          'No permission to update this homework',
        );
      } else {
        if (file) {
          uploadFile(file, 'HOMEWORK').then(async (url) => {
            await this.homeworkRepository.update(id, {
              ...homework,
              ...homeWorkDto,
              fileUrl: url,
            });
            return homework;
          });
        } else {
          await this.homeworkRepository.update(id, {
            ...homework,
            ...homeWorkDto,
          });
          return this.getOneHomeworkWhere({
            id,
          });
        }
      }
    }
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
  async getOneHomeworkOfferAndUser(id: number) {
    const homework = await this.getOneHomeworkWhere({ id }, ['offers', 'user']);
    return homework;
  }
  async getOneHomeworkAll(id: number) {
    return await this.getOneHomeworkWhere({ id });
  }
  async getOffersReceiveByUser(user: User) {
    return this.getOneHomeworkWhere(
      {
        user: {
          id: user.id,
        },
      },
      ['homework', 'offers'],
    );
  }

  async getHomeworksByCondition(
    where:
      | string
      | Brackets
      | ObjectLiteral
      | ObjectLiteral[]
      | ((qb: SelectQueryBuilder<Homework>) => string),
  ) {
    const homeworks = await this.homeworkRepository
      .createQueryBuilder('homework')
      .where(where)

      .select([
        'homework',
        /* 'comment.user', */
        'offers.id',
        'offers.priceOffer',
        /* 'offers.title',
        'offers', */
        'user.id',
      ])
      .leftJoin('homework.offers', 'offers')
      .leftJoin('homework.user', 'user')
      .getMany();
    console.log(homeworks);
    return homeworks;
  }

  async getOneHomeworkComments(id: number) {
    const homework = await this.homeworkRepository
      .createQueryBuilder('homework')
      .where({ id: id })
      .select([
        'homework',
        /* 'comment.user', */
        'user.id',
        'user.username',
        'user.profileImageUrl',
        /* 'offer.id', */
      ])
      .leftJoin('homework.comments', 'comment')
      .leftJoin('homework.user', 'user')
      .getOne();

    /* console.log(querybuilder[0]); */
    if (!homework) {
      throw new InternalServerErrorException('Homework not found');
    }
    return homework;
  }
  async saveHomework(homework: Homework) {
    return this.homeworkRepository.save(homework);
  }
  async getOneHomeworkUser(idHomework: number) {
    return await this.getOneHomeworkWhere(
      {
        id: idHomework,
      },
      ['user'],
    );
  }
  async getHomewokrTosupervisor() {
    return await this.homeworkRepository.find({
      where: [
        { status: HomeWorkStatusEnum.ACCEPTED },
        { status: HomeWorkStatusEnum.REJECTED },
      ],
    });
  }
  async getOneHomeworkWhere(
    where: FindOptionsWhere<Homework> | FindOptionsWhere<Homework>[],
    relations?: string[],
  ) {
    return await this.homeworkRepository.findOne({
      where,
      relations: relations,
    });
  }
}
