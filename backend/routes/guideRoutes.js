const express = require('express');
const { getGuides, registerGuide, getNearbyGuides, toggleLiveStatus, getGuideProfile } = require('../controllers/guideController');
const { authenticateUser, authorizeRole } = require('../middleware/auth');
const { validateGuideRegister } = require('../middleware/validator');
const upload = require('../middleware/upload');
const router = express.Router();

router.get('/', getGuides);
router.get('/nearby', getNearbyGuides);
router.post('/register', authenticateUser, authorizeRole('guide'), upload.single('image'), validateGuideRegister, registerGuide);
router.get('/profile', authenticateUser, authorizeRole('guide'), getGuideProfile);
router.put('/live', authenticateUser, authorizeRole('guide'), toggleLiveStatus);

module.exports = router;
