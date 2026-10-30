

// import { Router } from 'express';
// import {
//   createListing,
//   getListings,
//   getListing,
//   updateListing,
//   deleteListing,
//   markFilled,
//   markActive,
//   getOwnerListings,
// } from '../controllers/listing.controller';
// import { authenticate } from '../middleware/auth.middleware';
// import { authorize } from '../middleware/role.middleware';

// const router = Router();

// // Public routes
// router.get('/', getListings);
// router.get('/my', authenticate, authorize('OWNER', 'ADMIN'), getOwnerListings);
// router.get('/owner/mine', authenticate, authorize('OWNER', 'ADMIN'), getOwnerListings);
// router.get('/:id', getListing);

// // Protected routes
// router.post('/', authenticate, authorize('OWNER', 'ADMIN'), createListing);
// router.put('/:id', authenticate, authorize('OWNER', 'ADMIN'), updateListing);
// router.delete('/:id', authenticate, authorize('OWNER', 'ADMIN'), deleteListing);
// router.patch('/:id/fill', authenticate, authorize('OWNER'), markFilled);
// router.patch('/:id/activate', authenticate, authorize('OWNER'), markActive);

// export default router;








import { Router } from 'express';

import {
  createListing,
  getListings,
  getListing,
  updateListing,
  deleteListing,
  markFilled,
  markActive,
  getOwnerListings,
} from '../controllers/listing.controller';

import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';

const router = Router();

// Public routes
router.get('/', getListings);

// Owner/Admin: Get all listings created by the logged-in owner
router.get('/my', authenticate, authorize('OWNER', 'ADMIN'), getOwnerListings);

// Keep this alias only if your frontend already uses /owner/mine
router.get(
  '/owner/mine',
  authenticate,
  authorize('OWNER', 'ADMIN'),
  getOwnerListings
);

// Get one listing by ID
router.get('/:id', getListing);

// Protected routes: Create, update and delete listings
router.post(
  '/',
  authenticate,
  authorize('OWNER', 'ADMIN'),
  createListing
);

router.put(
  '/:id',
  authenticate,
  authorize('OWNER', 'ADMIN'),
  updateListing
);

router.delete(
  '/:id',
  authenticate,
  authorize('OWNER', 'ADMIN'),
  deleteListing
);

// Owner: Change listing status
router.patch(
  '/:id/fill',
  authenticate,
  authorize('OWNER'),
  markFilled
);

router.patch(
  '/:id/activate',
  authenticate,
  authorize('OWNER'),
  markActive
);

export default router;
