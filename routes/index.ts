import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import { membershipRouterV1 } from './v1/membership-route';
import { CONFIG } from '../configs/config';
import { logger } from '../configs/winston';
import swaggerDocument from '../swagger.json'

const router = Router();
const SWAGGER_CSS_URL =
    "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

const routes = [
    {
        path: '/v1',
        route: membershipRouterV1,
    },
];

routes.forEach((route) => {
    router.use(route.path, route.route);
});

// API docs
const swaggerRoute = {
    path: '/',
    route: swaggerUi.serve,
    docs: swaggerUi.setup(swaggerDocument, {
        customCss:
            '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
        customCssUrl: SWAGGER_CSS_URL
    }),
};

if (CONFIG.APP.DOCS === "enabled") {
    router.use(swaggerRoute.path, swaggerRoute.route, swaggerRoute.docs);
    logger.info(`Swagger documentation enabled on ${swaggerRoute.path}`);
}

export { router };
