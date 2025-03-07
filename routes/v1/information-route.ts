import {Router} from 'express';

import {InformationController} from '../../controllers/information-controller';

const informationRouterV1 = Router();

informationRouterV1.get('/banner', InformationController.getBannerList);
informationRouterV1.get('/services', InformationController.getServiceList);

export {informationRouterV1};
