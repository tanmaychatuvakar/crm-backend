import { Request, Response } from 'express';
import contactsService from './contacts.service';
import defineAbility from '@/casl/casl-ability.factory';
import { accessibleBy } from '@casl/prisma';

const findAll = async (req: Request, res: Response) => {
  const ability = defineAbility(req.user);
  const result = await contactsService.findAll({ where: accessibleBy(ability).Contact });
  res.send(result);
};

const create = async (req: Request, res: Response) => {
  const result = await contactsService.create(req.user.id, req.body);
  res.status(201).send(result);
};

export default { findAll, create };
