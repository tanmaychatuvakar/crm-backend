import { Router } from 'express';
import auth from '@/middlewares/auth.middleware';
import validate from '@/middlewares/validate.middleware';
import createExtensionRequestSchema from './schemas/create.schema';
import extensionRequestsController from './extension-requests.controller';

import findArgsSchema from './schemas/find-args.schema';

import 'express-async-errors';
import { Role } from '@prisma/client';

const router = Router();

router.get('/:id', auth(Role.LINE_MANAGER), extensionRequestsController.findOne);
router.get('/', auth(Role.AGENT, Role.LINE_MANAGER), validate.query(findArgsSchema), extensionRequestsController.findAll);
router.post('/', auth(Role.AGENT), validate.body(createExtensionRequestSchema), extensionRequestsController.create);

router.post('/:id/approve', auth(Role.LINE_MANAGER), extensionRequestsController.approve);
router.post('/:id/reject', auth(Role.LINE_MANAGER), extensionRequestsController.reject);

export default router;
