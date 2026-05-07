const express = require('express');
const { getPlaces, getPlaceById, createPlace, updatePlace, deletePlace, getNearbyPlaces } = require('../controllers/placeController');
const { authenticateUser, authorizeRole } = require('../middleware/auth');
const { validatePlace } = require('../middleware/validator');
const upload = require('../middleware/upload');
const router = express.Router();

router.get('/', getPlaces);
router.get('/nearby', getNearbyPlaces);
router.get('/:id', getPlaceById);
router.post('/', authenticateUser, authorizeRole('admin'), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 10 }]), validatePlace, createPlace);
router.put('/:id', authenticateUser, authorizeRole('admin'), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 10 }]), updatePlace);
router.delete('/:id', authenticateUser, authorizeRole('admin'), deletePlace);

module.exports = router;
