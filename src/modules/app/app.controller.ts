import { Request, Response } from 'express';
import appService from './app.service';

const getCommon = async (req: Request, res: Response) => {
  const result = await appService.getCommon();
  res.send(result);
};

export default {
  getCommon,
};
