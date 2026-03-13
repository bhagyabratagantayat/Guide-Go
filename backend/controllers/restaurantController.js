const Restaurant = require('../models/Restaurant');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const cloudinary = require('../config/cloudinary');

const getRestaurants = asyncHandler(async (req, res, next) => {
  const restaurants = await Restaurant.find();
  res.json(restaurants);
});

const createRestaurant = asyncHandler(async (req, res, next) => {
  const { name, description, location, category } = req.body;
  
  let image = '';

  if (req.file) {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'guidego/restaurants' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });
    image = result.secure_url;
  }

  const restaurant = await Restaurant.create({
    name,
    description,
    location: typeof location === 'string' ? JSON.parse(location) : location,
    category,
    image
  });

  res.status(201).json(restaurant);
});

module.exports = { getRestaurants, createRestaurant };
