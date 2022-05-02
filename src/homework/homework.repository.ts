/* eslint-disable prettier/prettier */
import {
  InternalServerErrorException,
} from '@nestjs/common';

import { EntityRepository, Repository } from 'typeorm';
import { HomeworkDto } from './dto/homework.dto';
import { Homework } from './entities/Homework.entity';
import { User } from '../auth/entities/user.entity';
import { UploadApiResponse, v2 } from 'cloudinary';
import { UploadedFile } from '@nestjs/common';
import { uploadFile2, uploadFile } from '../utils/utils';
import { FoldersNameEnum } from '../enums/rol.enum';
import toStream = require('buffer-to-stream');
@EntityRepository(Homework)
export class HomeworkRepository extends Repository<Homework> {
  
  async createHomework(
    homeWorkDto: HomeworkDto,
    @UploadedFile() file: Express.Multer.File,
    user: User,
  ): Promise<Homework> {
    delete homeWorkDto.status;
    try {
      if (file) {
        uploadFile(file, FoldersNameEnum.HOMEWORK).then(async (url) => {
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
    } catch (error) {
      console.log('Este es el error')
      console.log(error)
      throw new InternalServerErrorException('Error to upload file o is empty');
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
          let edited;
          let uploadApiResponse: UploadApiResponse;
          const upload = v2.uploader.upload_stream(
            { folder: 'homeworks' },
            async (error, result) => {
              if (error) {
                console.log(error);
                throw new InternalServerErrorException();
              }
              uploadApiResponse = result;
              try {
                homeWorkDto.fileUrl = uploadApiResponse.url;
                edited = await this.update(id, {
                  ...homeWorkDto,
                  fileUrl: uploadApiResponse.url,
                });
                return await this.findOne(id);
              } catch (error) {
                console.log(error);
              }
            },
          );
          /* console.log(upload); */
          toStream(file.buffer).pipe(upload);
          return edited;
        } else {
          await this.update(id, { ...homeWorkDto });
          return this.findOne(id);
        }
      }
    }
  }
}
