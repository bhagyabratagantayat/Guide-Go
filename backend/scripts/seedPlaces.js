const mongoose = require('mongoose');
const Place = require('../models/Place');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const places = [
  {
    name: 'Puri',
    description: 'Sacred coastal city, home of Jagannath Temple and golden beaches. Experience the divine energy of one of India\'s most holy Char Dham sites.',
    latitude: 19.8135,
    longitude: 85.8312,
    category: 'Heritage',
    city: 'Puri',
    image: 'https://images.unsplash.com/photo-1590393048529-679901f46f37?auto=format&fit=crop&q=80',
    audioGuideText: 'Welcome to Puri, the land of Lord Jagannath.'
  },
  {
    name: 'Konark',
    description: 'UNESCO World Heritage Site — the magnificent Sun Temple. A 13th-century engineering marvel designed as a colossal chariot of the Sun God.',
    latitude: 19.8876,
    longitude: 86.0945,
    category: 'Heritage',
    city: 'Konark',
    image: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80',
    audioGuideText: 'Welcome to the Sun Temple of Konark.'
  },
  {
    name: 'Chilika',
    description: 'Asia\'s largest brackish water lagoon, famous for Irrawaddy dolphins, migratory birds, and the beautiful Kalijai Temple island.',
    latitude: 19.6841,
    longitude: 85.3182,
    category: 'Nature',
    city: 'Chilika',
    image: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?auto=format&fit=crop&q=80',
    audioGuideText: 'Welcome to Chilika Lake.'
  },
  {
    name: 'Bhubaneswar',
    description: 'The Temple City of India, featuring over 700 ancient temples like Lingaraj and Mukteswar, blending modern life with spiritual history.',
    latitude: 20.2961,
    longitude: 85.8245,
    category: 'City',
    city: 'Bhubaneswar',
    image: 'https://images.unsplash.com/photo-1605658601552-6d1a100579e0?auto=format&fit=crop&q=80',
    audioGuideText: 'Welcome to Bhubaneswar, the Temple City.'
  },
  {
    name: 'Dhauli',
    description: 'Historic rock edicts of Ashoka and the Shanti Stupa. The place where Emperor Ashoka renounced war and embraced Buddhism.',
    latitude: 20.1925,
    longitude: 85.8394,
    category: 'Heritage',
    city: 'Bhubaneswar',
    image: 'https://images.unsplash.com/photo-1589139331393-2713e7104b2a?auto=format&fit=crop&q=80',
    audioGuideText: 'Welcome to Dhauli Shanti Stupa.'
  },
  {
    name: 'Gopalpur',
    description: 'A quiet, nostalgic beach town perfect for sunrise walks. Once a busy seaport, it now offers a peaceful escape by the Bay of Bengal.',
    latitude: 19.2561,
    longitude: 84.9045,
    category: 'Beach',
    city: 'Gopalpur',
    image: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?auto=format&fit=crop&q=80',
    audioGuideText: 'Welcome to Gopalpur-on-Sea.'
  },
  {
    name: 'Cuttack',
    description: 'The Silver City — famous for its exquisite silver filigree work (Tarakasi) and the historic 14th-century Barabati Fort.',
    latitude: 20.4625,
    longitude: 85.8830,
    category: 'City',
    city: 'Cuttack',
    image: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?auto=format&fit=crop&q=80',
    audioGuideText: 'Welcome to Cuttack, the Silver City.'
  },
  {
    name: 'Pipili',
    description: 'Famous for its vibrant appliqué craft. Every lane is filled with colorful handicrafts, lanterns, and wall hangings.',
    latitude: 20.1130,
    longitude: 85.8336,
    category: 'Art',
    city: 'Pipili',
    image: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?auto=format&fit=crop&q=80',
    audioGuideText: 'Welcome to Pipili, the craft village.'
  },
  {
    name: 'Goa',
    description: 'India\'s coastal paradise. Famous for its pristine beaches, vibrant culture, Portuguese heritage, and world-class nightlife.',
    latitude: 15.2993,
    longitude: 74.1240,
    category: 'Beach',
    city: 'Goa',
    image: 'https://images.unsplash.com/photo-1512783563744-ca7a47d28646?auto=format&fit=crop&q=80',
    audioGuideText: 'Welcome to Goa.'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    for (const place of places) {
      const exists = await Place.findOne({ name: place.name });
      if (!exists) {
        await Place.create(place);
        console.log(`Added ${place.name}`);
      } else {
        console.log(`${place.name} already exists`);
      }
    }

    console.log('Seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding DB:', error);
    process.exit(1);
  }
};

seedDB();
