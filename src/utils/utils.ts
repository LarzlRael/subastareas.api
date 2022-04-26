export const imageFileFilter = (res, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|pdf)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};
