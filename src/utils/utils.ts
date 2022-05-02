import { FoldersNameEnum } from 'src/enums/rol.enum';
import { v2, UploadApiResponse } from 'cloudinary';
import { InternalServerErrorException } from '@nestjs/common';

import toStream = require('buffer-to-stream');

export const imageFileFilter = (res, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|pdf)$/)) {
    return callback(new Error('Only image and pdfs files are allowed!'), false);
  }
  callback(null, true);
};

export const uploadFile = (
  file: Express.Multer.File,
  folder: FoldersNameEnum,
): Promise<string> => {
  console.log(file);
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
          resolve(result.url);
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
export const uploadFile2 = async (
  file: Express.Multer.File,
  folder: FoldersNameEnum,
) => {
  uploadFile(file, folder)
    .then((url) => {
      console.log(url);
      return url;
    })
    .catch((error) => {
      console.log('Este es el error');
      console.log(error);
      throw new InternalServerErrorException('Error to upload file o is empty');
    });
};
