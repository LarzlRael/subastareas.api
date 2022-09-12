import { Request } from 'express';
export const getHostName = (req: Request): string => {
  const hostname = req.headers.host;
  const protocol = req.protocol;
  return `${protocol}://${hostname}`;
};
