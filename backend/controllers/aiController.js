const { getAIResponse } = require('../services/aiKnowledgeBase');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

const generateTravelAdvice = asyncHandler(async (req, res, next) => {
  const { question } = req.body;

  if (!question) {
    return next(new ErrorResponse('Please provide a question', 400));
  }

  try {
    const answer = getAIResponse(question);

    res.status(200).json({
      success: true,
      answer: answer,
      response: answer // Keep for backward compatibility if needed by some frontend parts
    });
  } catch (error) {
    return next(new ErrorResponse('Local AI processing failed: ' + error.message, 500));
  }
});

module.exports = { generateTravelAdvice };
