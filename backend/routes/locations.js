const express = require('express');
const router = express.Router();
const {
  getLocations, getLocationById, createLocation, updateLocation, deleteLocation
} = require('../controllers/locationController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

router.get('/', getLocations);
router.get('/:id', getLocationById);
router.post('/', protect, authorize('admin'), createLocation);
router.put('/:id', protect, authorize('admin'), updateLocation);
router.delete('/:id', protect, authorize('admin'), deleteLocation);

module.exports = router;