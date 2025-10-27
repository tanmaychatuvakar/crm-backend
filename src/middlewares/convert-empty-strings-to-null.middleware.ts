import { Request, Response, NextFunction } from 'express';

const convertEmptyStringsToNull = async (
  req: Request,
  res: Response, // eslint-disable-line
  next: NextFunction, // eslint-disable-line
) => {
  const body = { ...req.body };

  if (typeof body === 'object') {
    for (const k in body) {
      if (typeof body[k] === 'string' && body[k] === '') {
        body[k] = null;
      }
    }
  }

  req.body = body;
  next();
};

export default convertEmptyStringsToNull;
