const mongoose = require('mongoose');
const User = require('./models/User');
const Guide = require('./models/Guide');
const dotenv = require('dotenv');
dotenv.config();

const checkData = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const userCount = await User.countDocuments();
  const guideCount = await Guide.countDocuments();
  console.log(`Users in DB: ${userCount}`);
  console.log(`Guides in DB: ${guideCount}`);
  process.exit(0);
};

checkData();
