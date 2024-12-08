import { Router } from 'express';

import { InformationController } from '../../controllers/information-controller';
import { authenticateToken } from '../../middlewares/auth-middleware';

const informationRouterV1 = Router();

informationRouterV1.get('/banner', InformationController.getBannerList);
informationRouterV1.get('/services', authenticateToken, InformationController.getServiceList);

export { informationRouterV1 };
