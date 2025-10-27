import { Router } from 'express';
import locationsController from './locations.controller';

import 'express-async-errors';

const router = Router();

// Todo: add auth

router.get('/cities', locationsController.findCities);
router.get('/communities', locationsController.findCommunities);
router.get('/subcommunities', locationsController.findSubcommunities);
router.get('/properties', locationsController.findProperties);

export default router;
