const express = require('express');
const router = express.Router();
const axios = require('axios');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get weather data for a city
// @route   GET /api/weather/:city
// @access  Public
router.get('/:city', asyncHandler(async (req, res, next) => {
  const { city } = req.params;
  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (!apiKey) {
    return next(new ErrorResponse('Weather API key is missing', 500));
  }

  try {
    // Get Current Weather
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const { data: currentData } = await axios.get(currentUrl);

    // Get 5-Day Forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    const { data: forecastData } = await axios.get(forecastUrl);

    // Filter forecast to get one entry per day (at 12:00:00)
    const dailyForecast = forecastData.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 5);

    res.json({
      success: true,
      current: {
        temp: Math.round(currentData.main.temp),
        condition: currentData.weather[0].main,
        description: currentData.weather[0].description,
        humidity: currentData.main.humidity,
        wind: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
        loc: `${currentData.name}, ${currentData.sys.country}`,
        sunrise: new Date(currentData.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sunset: new Date(currentData.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        icon: currentData.weather[0].icon
      },
      forecast: dailyForecast.map(item => ({
        day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
        temp: Math.round(item.main.temp),
        condition: item.weather[0].main,
        icon: item.weather[0].icon
      }))
    });
  } catch (error) {
    return next(new ErrorResponse('City not found or API error', 404));
  }
}));

module.exports = router;
