const express = require('express');
const { 
  getGuides, 
  registerGuide, 
  getNearbyGuides, 
  toggleLiveStatus, 
  getGuideProfile, 
  getOnboardingStatus, 
  updateOnboardingStep, 
  getGuideById 
} = require('../controllers/guideController');
const { authenticateUser, authorizeRole } = require('../middleware/auth');
const { validateGuideRegister } = require('../middleware/validator');
const upload = require('../middleware/upload');
const router = express.Router();

router.get('/', getGuides);
router.get('/nearby', getNearbyGuides);
router.post('/register', authenticateUser, authorizeRole('guide'), upload.single('image'), validateGuideRegister, registerGuide);
router.get('/profile', authenticateUser, authorizeRole('guide'), getGuideProfile);
router.get('/onboarding/status', authenticateUser, authorizeRole('guide'), getOnboardingStatus);
router.put('/onboarding/step/:stepNumber', authenticateUser, authorizeRole('guide'), upload.any(), updateOnboardingStep);
router.put('/live', authenticateUser, authorizeRole('guide'), toggleLiveStatus);

// Public profile
router.get('/:id', getGuideById);

module.exports = router;
