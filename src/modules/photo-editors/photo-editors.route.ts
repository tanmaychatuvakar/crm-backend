import { Router } from 'express';
import auth from '@/middlewares/auth.middleware';
import photoEditorsController from './photo-editors.controller';

import 'express-async-errors';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', auth(Role.LISTING_DEPARTMENT), photoEditorsController.findAll);

export default router;
