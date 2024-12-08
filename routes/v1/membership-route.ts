import { Router } from 'express';

import { MembershipController } from '../../controllers/membership-controller';
import { authenticateToken } from '../../middlewares/auth-middleware';

const membershipRouterV1 = Router();

membershipRouterV1.post('/register', MembershipController.register);
membershipRouterV1.post('/login', MembershipController.login);

membershipRouterV1.get('/profile', authenticateToken, MembershipController.getProfileForCurrentUser);
membershipRouterV1.put('/profile/update', authenticateToken, MembershipController.updateProfileForCurrentUser);
membershipRouterV1.put('/profile/image', authenticateToken, MembershipController.updateProfileImageForCurrentUser);

export { membershipRouterV1 };
