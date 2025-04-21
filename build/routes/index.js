"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const membership_route_1 = require("./v1/membership-route");
const information_route_1 = require("./v1/information-route");
const transaction_route_1 = require("./v1/transaction-route");
const config_1 = require("../configs/config");
const swagger_json_1 = __importDefault(require("../docs/swagger.json"));
const logger_1 = require("../common/utils/logging/logger");
const router = (0, express_1.Router)();
exports.router = router;
const SWAGGER_CSS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css';
const routes = [
    {
        path: '/v1',
        route: membership_route_1.membershipRouterV1,
    },
    {
        path: '/v1',
        route: information_route_1.informationRouterV1,
    },
    {
        path: '/v1',
        route: transaction_route_1.transactionRouterV1,
    },
];
routes.forEach(route => {
    router.use(route.path, route.route);
});
// API docs
const swaggerRoute = {
    path: '/',
    route: swagger_ui_express_1.default.serve,
    docs: swagger_ui_express_1.default.setup(swagger_json_1.default, {
        customCss: '.swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 10px; width: 100%; }',
        customCssUrl: SWAGGER_CSS_URL,
    }),
};
if (config_1.CONFIG.APP.DOCS === 'enabled') {
    router.use(swaggerRoute.path, swaggerRoute.route, swaggerRoute.docs);
    (0, logger_1.logInfo)(`Swagger documentation enabled. URL: ${config_1.CONFIG.APP.URL}${swaggerRoute.path}`);
}
//# sourceMappingURL=index.js.map