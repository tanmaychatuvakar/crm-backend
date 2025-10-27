import { Request, Response } from 'express';
import usersService from '../users/users.service';

const findAll = async (req: Request, res: Response) => {
  const result = await usersService.findAll({ where: { role: 'PHOTOGRAPHER' } });
  res.send(result);
};

export default { findAll };
