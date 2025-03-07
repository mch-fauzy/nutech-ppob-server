import {Router} from 'express';

import {MembershipController} from '../../controllers/membership-controller';

const membershipRouterV1 = Router();

membershipRouterV1.post('/register', MembershipController.register);
membershipRouterV1.post('/login', MembershipController.login);

membershipRouterV1.get(
  '/profile',
  MembershipController.getProfileForCurrentUser,
);
membershipRouterV1.put(
  '/profile/update',
  MembershipController.updateProfileForCurrentUser,
);
// membershipRouterV1.put('/profile/image', MembershipController.updateProfileImageForCurrentUser);
membershipRouterV1.put(
  '/profile/image',
  MembershipController.updateProfileImageCloudinaryForCurrentUser,
);

export {membershipRouterV1};
