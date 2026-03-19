const express = require('express');
const router = express.Router();
const {
  getRegistrations, registerForEvent,
  cancelRegistration, getMyRegistrations
} = require('../controllers/registrationController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getRegistrations);
router.get('/my-registrations', protect, getMyRegistrations);
router.post('/', protect, registerForEvent);
router.delete('/:id', protect, cancelRegistration);

module.exports = router;