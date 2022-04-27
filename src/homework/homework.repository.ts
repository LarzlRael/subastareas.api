/* eslint-disable prettier/prettier */
import {
  InternalServerErrorException,
} from '@nestjs/common';

import { EntityRepository, Repository } from 'typeorm';
import { HomeworkDto } from './dto/homework.dto';
import { HomeWork } from './entities/Homework';
import { User } from '../auth/entities/User';
import { UploadApiResponse, v2 } from 'cloudinary';
import { UploadedFile } from '@nestjs/common';
import toStream = require('buffer-to-stream');
@EntityRepository(HomeWork)
export class HomeworkRepository extends Repository<HomeWork> {
  async createHomework(
    homeWorkDto: HomeworkDto,
    @UploadedFile() file: Express.Multer.File,
    user: User,
  ): Promise<HomeWork> {
    let createdHomework;
    try {
      let uploadApiResponse: UploadApiResponse;
      const upload = v2.uploader.upload_stream(
        { folder: 'homeworks' },
        async (error, result) => {
          if (error) {
            console.log(error);
            throw new InternalServerErrorException();
          }
          uploadApiResponse = result;
          homeWorkDto.fileUrl = uploadApiResponse.url;
          createdHomework = this.create({
            user,
            ...homeWorkDto,
          });
          await this.save(createdHomework);
        },
      );
      toStream(file.buffer).pipe(upload);
      /* return this.find({ order: { id: 'DESC' } }, take: 1); */
      const lastRecord = await this.find({
        order: { id: "DESC" },
        where: { user },
        // order results
        take: 1 // limit 1
      })
      return lastRecord[0];

    } catch (error) {
      console.log('hay un error')
      console.log(error)
      throw new InternalServerErrorException('Error to upload file o is emppy');

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

  async getHomeworksById(user: User): Promise<HomeWork[]> {
    const homework = await this.find({ where: { user } });
    return homework;
  }
  async getOneHomework(id: number): Promise<HomeWork> {
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
  ): Promise<HomeWork> {
    const homework = await this.findOne(id);
    if (!homework) {
      throw new InternalServerErrorException('Homework not found');
    } else {
      if (homework.user.id !== user.id) {
        throw new InternalServerErrorException(
          'No permission to update this homework',
        );
      } else {
        let edited;
        let uploadApiResponse: UploadApiResponse;
        const upload = v2.uploader.upload_stream(
          { folder: 'homeworks' },
          async (error, result) => {
            if (error) {
              console.log(error);
              throw new InternalServerErrorException();
            }
            console.log(result);
            uploadApiResponse = result;
            try {
              homeWorkDto.fileUrl = uploadApiResponse.url;
              edited = await this.update(id, {
                ...homeWorkDto,
                fileUrl: uploadApiResponse.url,
              });
              console.log(edited);
              return edited;
            } catch (error) {
              console.log(error);
            }
          },
        );
        /* console.log(upload); */
        toStream(file.buffer).pipe(upload);
        return edited;
      }
    }
  }
}
