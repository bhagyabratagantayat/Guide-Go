const express = require('express');
const router = express.Router();
const { 
  submitReport, 
  getReports, 
  updateReportStatus 
} = require('../controllers/reportController');
const { authenticateUser, authorizeRole } = require('../middleware/auth');

router.use(authenticateUser);

router.post('/', submitReport);

// Admin only routes
router.get('/', authorizeRole('admin'), getReports);
router.put('/:id', authorizeRole('admin'), updateReportStatus);

module.exports = router;
