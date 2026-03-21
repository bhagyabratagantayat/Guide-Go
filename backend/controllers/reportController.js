const Report = require('../models/Report');
const Guide = require('../models/Guide');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Submit a report
// @route   POST /api/reports
// @access  Private
const submitReport = asyncHandler(async (req, res, next) => {
  const { guideId, bookingId, reason, description } = req.body;

  // Verify guide exists
  const guide = await Guide.findById(guideId);
  if (!guide) {
    return next(new ErrorResponse('Guide not found', 404));
  }

  const report = await Report.create({
    reporter: req.user.id,
    guide: guideId,
    booking: bookingId,
    reason,
    description
  });

  res.status(201).json({
    success: true,
    data: report
  });
});

// @desc    Get all reports (Admin only)
// @route   GET /api/reports
// @access  Private/Admin
const getReports = asyncHandler(async (req, res, next) => {
  const reports = await Report.find()
    .populate('reporter', 'name email')
    .populate({
      path: 'guide',
      populate: { path: 'userId', select: 'name email' }
    })
    .populate('booking')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: reports.length,
    data: reports
  });
});

// @desc    Update report status
// @route   PUT /api/reports/:id
// @access  Private/Admin
const updateReportStatus = asyncHandler(async (req, res, next) => {
  const { status, adminAction } = req.body;
  const report = await Report.findById(req.params.id);

  if (!report) {
    return next(new ErrorResponse('Report not found', 404));
  }

  report.status = status || report.status;
  report.adminAction = adminAction || report.adminAction;
  
  await report.save();

  res.json({
    success: true,
    data: report
  });
});

module.exports = {
  submitReport,
  getReports,
  updateReportStatus
};
