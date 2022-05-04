/* eslint-disable prettier/prettier */
import {
  InternalServerErrorException,
} from '@nestjs/common';

import { EntityRepository, Repository } from 'typeorm';
import { HomeworkDto } from './dto/homework.dto';
import { Homework } from './entities/Homework.entity';
import { User } from '../auth/entities/user.entity';
import { uploadFile } from '../utils/utils';
@EntityRepository(Homework)
export class HomeworkRepository extends Repository<Homework> {

  async createHomework(
    homeWorkDto: HomeworkDto,
    file: Express.Multer.File,
    user: User,
  ): Promise<Homework> {
    delete homeWorkDto.status;

    if (file) {
      uploadFile(file, 'HOMEWORK').then(async (url) => {
        homeWorkDto.fileUrl = url;
        const homework = this.create({ ...homeWorkDto, user });
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

  async getHomeworksById(user: User): Promise<Homework[]> {
    const homework = await this.find({ where: { user } });
    return homework;
  }
  async getOneHomework(id: number): Promise<Homework> {
    const homework = await this.findOne(id);
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
}
