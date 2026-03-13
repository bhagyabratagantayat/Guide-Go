const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/env');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

const generateTravelAdvice = asyncHandler(async (req, res, next) => {
  const { question } = req.body;

  if (!question) {
    return next(new ErrorResponse('Please provide a question', 400));
  }

  const genAI = new GoogleGenerativeAI(config.geminiApiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `You are a professional travel assistant for GuideGo. 
  Answer the following user question about travel, itineraries, or food in a helpful, concise, and structured way.
  Use markdown for formatting.
  
  Question: ${question}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({
      success: true,
      response: text
    });
  } catch (error) {
    return next(new ErrorResponse('AI Generation failed: ' + error.message, 500));
  }
});

module.exports = { generateTravelAdvice };
