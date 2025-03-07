"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.membershipRouterV1 = void 0;
const express_1 = require("express");
const membership_controller_1 = require("../../controllers/membership-controller");
const membershipRouterV1 = (0, express_1.Router)();
exports.membershipRouterV1 = membershipRouterV1;
membershipRouterV1.post('/register', membership_controller_1.MembershipController.register);
membershipRouterV1.post('/login', membership_controller_1.MembershipController.login);
membershipRouterV1.get('/profile', membership_controller_1.MembershipController.getProfileForCurrentUser);
membershipRouterV1.put('/profile/update', membership_controller_1.MembershipController.updateProfileForCurrentUser);
// membershipRouterV1.put('/profile/image', MembershipController.updateProfileImageForCurrentUser);
membershipRouterV1.put('/profile/image', membership_controller_1.MembershipController.updateProfileImageCloudinaryForCurrentUser);
//# sourceMappingURL=membership-route.js.map