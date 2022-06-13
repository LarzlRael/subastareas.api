/* eslint-disable prettier/prettier */
import { InternalServerErrorException } from '@nestjs/common';

import {
  Brackets,
  EntityRepository,
  In,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { Homework } from './entities/Homework.entity';
import { User } from '../auth/entities/user.entity';
import { uploadFile } from '../utils/utils';
import { HomeworkDto } from './dto/Homework.dto';
import { Wallet } from 'src/wallet/entities/wallet.entity';
import { HomeWorkStatusEnum } from '../enums/enums';
@EntityRepository(Homework)
export class HomeworkRepository extends Repository<Homework> {
  async createHomework(
    homeWorkDto: HomeworkDto,
    file: Express.Multer.File,
    user: User,
    /* wallet: Wallet, */
  ): Promise<Homework> {
    delete homeWorkDto.status;

    /* if (wallet.balance < homeWorkDto.offered_amount) {
      throw new InternalServerErrorException(
        'You dont have enough money in your wallet',
      );
    } */
    if (file) {
      uploadFile(file, 'HOMEWORK').then(async (url) => {
        homeWorkDto.fileUrl = url;

        const homework = this.create({
          ...homeWorkDto,
          user,
          fileType: file.mimetype,
        });
        await this.save(homework);
        return homework;
      });
    } else {
      const createdHomework = this.create({
        user,
        ...homeWorkDto,
      });
      return await this.save(createdHomework);
    }
  }

  async deleteHomework(user: User, id: number): Promise<void> {
    const homework = await this.findOne(id);

    if (homework.user.id !== user.id) {
      throw new InternalServerErrorException(
        'No permission to delete this homework',
      );
    } else {
      if (!homework) {
        throw new InternalServerErrorException('Homework not found');
      }
      await this.delete(id);
    }
  }

  async getHomeworksByUser(user: User): Promise<Homework[]> {
    const homework = await this.find({
      where: { user },
      order: {
        ['status']: 'DESC',
      },
    });
    return homework;
  }
  async getHomeworksByCategory(category: string[], level: string[]) {
    console.log(category, level);

    if (category[0] === 'empty' && level[0] !== 'empty') {
      return this.getHomeworksByCondition({ level: In(level) });
    }
    if (level[0] === 'empty' && category[0] !== 'empty') {
      return this.getHomeworksByCondition({ category: In(category) });
    }

    if (category[0] === 'empty' && level[0] === 'empty') {
      //TODO devolver todos los homeworks
      return this.getHomeworksByCondition({
        status: HomeWorkStatusEnum.ACCEPTED,
      });
    }

    return this.getHomeworksByCondition({
      category: In(category),
      level: In(level),
    });
  }
  async getOneHomework(id: number) {
    const homework = await this.createQueryBuilder('homework')
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
  async updateHomework(
    homeWorkDto: HomeworkDto,
    file: Express.Multer.File,
    user: User,
    id: number,
  ): Promise<Homework> {
    delete homeWorkDto.status;
    const homework = await this.findOne(id);

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
            homeWorkDto.fileUrl = url;
            await this.update(id, { ...homework, ...homeWorkDto });
            return homework;
          });
        } else {
          await this.update(id, { ...homework, ...homeWorkDto });
          return this.findOne(id);
        }
      }
    }
  }

  async getHomeworksByCondition(
    where:
      | string
      | Brackets
      | ObjectLiteral
      | ObjectLiteral[]
      | ((qb: SelectQueryBuilder<Homework>) => string),
  ) {
    const homeworks = await this.createQueryBuilder('homework')
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
}
