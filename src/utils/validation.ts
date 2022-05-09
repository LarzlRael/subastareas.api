export const validateArray = (dataArray: any[]): boolean => {
  return dataArray ? (dataArray.length !== 0 ? true : false) : false;
};
