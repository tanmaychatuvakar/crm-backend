import { Router } from 'express';
import auth from '@/middlewares/auth.middleware';
import documentsController from './documents.controller';

import upload from '@/middlewares/upload.middleware';

import 'express-async-errors';
import { Role } from '@prisma/client';

const router = Router();

router.post('/upload', auth(Role.AGENT), upload('listings/documents').single('file'), documentsController.upload);

export default router;
