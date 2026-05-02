const mongoose = require('mongoose');
const AudioGuide = require('./models/AudioGuide');
require('dotenv').config();

const TOURS_DATA = [
  { 
    name: 'Sun Temple, Konark', 
    location: 'Konark, Puri',
    category: 'Heritage',
    duration: '15:20', 
    description: 'Explore the 13th-century UNESCO site shaped as a giant stone chariot of the Sun God.',
    image: 'https://images.unsplash.com/photo-1600100395420-40aa0c46bc5e?auto=format&fit=crop&q=80&w=800', 
    accent: '#ff385c',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    fullDetails: {
      history: "Built by King Narasimhadeva I of the Eastern Ganga Dynasty in 1250 CE, this temple is a masterpiece of Kalinga architecture. It's designed as a chariot for the Sun God, Surya, with 24 carved stone wheels.",
      highlights: ["Giant Stone Chariot Design", "24 Intricately Carved Wheels", "Celestial Musicians Statues"],
      bestTime: "October to March (6:00 AM - 8:00 PM)",
      stops: [
        { title: "Main Entrance", time: "0:00", description: "Start at the Gaja-Simha gate." },
        { title: "The Nata Mandir", time: "4:30", description: "The Hall of Dance with intricate carvings." },
        { title: "The Main Chariot", time: "9:15", description: "Viewing the 12 pairs of wheels." },
        { title: "Sanctum Sanctorum", time: "12:45", description: "The remains of the main temple structure." }
      ]
    }
  },
  { 
    name: 'Jagannath Temple, Puri', 
    location: 'Puri',
    category: 'Spiritual',
    duration: '22:45', 
    description: 'Dive into the history and legends of the spiritual heart of Odisha and its famous Rath Yatra.',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=800', 
    accent: '#ff385c',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    fullDetails: {
      history: "One of the Char Dham pilgrimage sites, built by King Anantavarman Chodaganga Deva in the 12th century. The temple is famous for its annual Rath Yatra and several unexplained mysteries.",
      highlights: ["The Nilachakra (Blue Wheel)", "The Mahaprasad Kitchen", "The Patitapabana Image"],
      bestTime: "Year-round (5:00 AM - 11:00 PM)",
      stops: [
        { title: "Singhadwara", time: "0:00", description: "The Lion's Gate entrance." },
        { title: "Ananda Bazar", time: "6:20", description: "The world's largest food market." },
        { title: "The Main Temple", time: "15:10", description: "Understanding the deities' idols." }
      ]
    }
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/guidego');
    await AudioGuide.deleteMany({});
    await AudioGuide.insertMany(TOURS_DATA);
    console.log('Audio Guides Seeded!');
    process.exit();
  } catch (error) {
    console.error('Error seeding:', error);
    process.exit(1);
  }
};

seedDB();
