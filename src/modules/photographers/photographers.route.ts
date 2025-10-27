import { Router } from 'express';
import auth from '@/middlewares/auth.middleware';
import photographersController from './photographers.controller';

import 'express-async-errors';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', auth(Role.LISTING_DEPARTMENT), photographersController.findAll);

export default router;
