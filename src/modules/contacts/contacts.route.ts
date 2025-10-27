import { Router } from 'express';
import contactsController from './contacts.controller';
import validate from '@/middlewares/validate.middleware';

import createContactSchema from './schemas/create.schema';

import 'express-async-errors';
import auth from '@/middlewares/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', auth(), contactsController.findAll);
router.post('/', auth(Role.AGENT), validate.body(createContactSchema), contactsController.create);

export default router;
