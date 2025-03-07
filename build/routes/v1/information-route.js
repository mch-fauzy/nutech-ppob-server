"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.informationRouterV1 = void 0;
const express_1 = require("express");
const information_controller_1 = require("../../controllers/information-controller");
const informationRouterV1 = (0, express_1.Router)();
exports.informationRouterV1 = informationRouterV1;
informationRouterV1.get('/banner', information_controller_1.InformationController.getBannerList);
informationRouterV1.get('/services', information_controller_1.InformationController.getServiceList);
//# sourceMappingURL=information-route.js.map