import { FoldersNameEnum } from '../enums/enums';
import { v2 } from 'cloudinary';
import { InternalServerErrorException } from '@nestjs/common';

import toStream = require('buffer-to-stream');

export const fileFilter = (res, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|webp|pdf)$/)) {
    return callback(new Error('Only image and pdfs files are allowed!'), false);
  }
  callback(null, true);
};
export const imageFileFiltesr = (res, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
    return callback(new Error('Only image and pdfs files are allowed!'), false);
  }
  callback(null, true);
};

export const uploadFile = (
  file: Express.Multer.File,
  folder: keyof typeof FoldersNameEnum,
): Promise<string> => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = v2.uploader.upload_stream(
        {
          folder,
          /* resource_type: 'auto', */
        },
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result.secure_url);
        },
      );
      const fileStream = toStream(file.buffer);
      fileStream.pipe(uploadStream);
    });
  } catch (error) {
    console.log('Este es el error');
    console.log(error);
    throw new InternalServerErrorException('Error to upload file o is empty');
  }
};
