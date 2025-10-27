import { Router } from 'express';
import feedController from './feed.controller';

import 'express-async-errors';

const router = Router();

router.get('/', feedController.getFeed);

export default router;
