const mongoose = require('mongoose');
require('dotenv').config();

const places = [
  {
    name: "Konark Sun Temple",
    description: "13th century UNESCO heritage temple built as a giant chariot.",
    latitude: 19.8876,
    longitude: 86.0945,
    category: "Temple",
    audioGuideText: "Welcome to the Konark Sun Temple. This magnificent temple was built in the 13th century by King Narasimhadeva of the Eastern Ganga dynasty. Designed as a giant chariot dedicated to the Sun God Surya, it is a UNESCO World Heritage site and one of India's most remarkable architectural achievements.",
    image: "https://images.unsplash.com/photo-1590733403305-675c9298585e"
  },
  {
    name: "Jagannath Temple Puri",
    description: "Sacred 12th century temple dedicated to Lord Jagannath.",
    latitude: 19.8049,
    longitude: 85.8179,
    category: "Temple",
    audioGuideText: "Welcome to Jagannath Temple in Puri. This sacred temple is dedicated to Lord Jagannath, a form of Lord Vishnu. It is famous for the annual Rath Yatra festival, where massive chariots carry the deities through the streets of Puri.",
    image: "https://images.unsplash.com/photo-1524492459422-ad5193910f54"
  },
  {
    name: "Lingaraj Temple",
    description: "Ancient temple dedicated to Lord Shiva located in Bhubaneswar.",
    latitude: 20.2382,
    longitude: 85.8335,
    category: "Temple",
    audioGuideText: "Welcome to Lingaraj Temple. This ancient temple is one of the most sacred temples dedicated to Lord Shiva and represents the rich architectural heritage of Odisha with its massive deula and intricate carvings.",
    image: "https://images.unsplash.com/photo-1590733403305-675c9298585e"
  },
  {
    name: "Udayagiri and Khandagiri Caves",
    description: "Historical rock-cut caves that served as Jain residential blocks.",
    latitude: 20.258,
    longitude: 85.795,
    category: "Caves",
    audioGuideText: "Welcome to Udayagiri and Khandagiri Caves. These partly natural and partly artificial caves have significant archaeological, historical and religious importance. They were built around 2nd century BCE for Jain monks during the reign of King Kharavela.",
    image: "https://images.unsplash.com/photo-1524492459422-ad5193910f54"
  },
  {
    name: "Nandankanan Zoo",
    description: "Premier biological park known for its white tiger safari.",
    latitude: 20.3956,
    longitude: 85.826,
    category: "Park",
    audioGuideText: "Welcome to Nandankanan Biological Park. Literally meaning 'The Garden of Heavens', it is the first zoo in India to join the World Association of Zoos and Aquariums. It is famous for its unique white tiger breeding and the open-air botanical garden.",
    image: "https://images.unsplash.com/photo-1525923838299-2312b60f6d69"
  },
  {
    name: "Dhauli Shanti Stupa",
    description: "Peace Pagoda built on the site of the Kalinga War.",
    latitude: 20.1924,
    longitude: 85.8394,
    category: "Monument",
    audioGuideText: "Welcome to Dhauli Shanti Stupa. This white peace pagoda was built as a symbol of peace after the historic Kalinga War, which led Emperor Ashoka to adopt Buddhism and non-violence. It offers a panoramic view of the Daya River valley.",
    image: "https://images.unsplash.com/photo-1524492459422-ad5193910f54"
  },
  {
    name: "Chilika Lake",
    description: "Asia's largest salt-water lagoon and home to migratory birds.",
    latitude: 19.6826,
    longitude: 85.1843,
    category: "Nature",
    audioGuideText: "Welcome to Chilika Lake. As Asia's largest brackish water lagoon, it is a biodiversity hotspot. You can spot the rare Irrawaddy dolphins and thousands of migratory birds that fly here all the way from the Caspian Sea and Lake Baikal.",
    image: "https://images.unsplash.com/photo-1524492459422-ad5193910f54"
  },
  {
    name: "Ram Mandir Bhubaneswar",
    description: "Modern Hindu temple dedicated to Lord Ram.",
    latitude: 20.2858,
    longitude: 85.8398,
    category: "Temple",
    audioGuideText: "Welcome to the Ram Mandir. Situated in the heart of Bhubaneswar, this beautiful temple is dedicated to Lord Ram, Lakshman and Sita. Its vibrant red towers and calm atmosphere make it a popular spiritual destination in the city.",
    image: "https://images.unsplash.com/photo-1590733403305-675c9298585e"
  },
  {
    name: "Mukteshwar Temple",
    description: "10th-century temple known as the Gem of Odisha Architecture.",
    latitude: 20.2435,
    longitude: 85.8336,
    category: "Temple",
    audioGuideText: "Welcome to Mukteshwar Temple. Often called the 'Gem of Odisha Architecture', this 10th-century temple is famous for its ornate archway or 'Torana' and detailed carvings on its ceiling, showcasing the transition in temple building styles.",
    image: "https://images.unsplash.com/photo-1590733403305-675c9298585e"
  },
  {
    name: "Kedar Gouri Temple",
    description: "Twin temples dedicated to Lord Shiva and Goddess Gouri.",
    latitude: 20.2443,
    longitude: 85.8341,
    category: "Temple",
    audioGuideText: "Welcome to Kedar Gouri Temple. This is one of the oldest temple complexes in Bhubaneswar. It consists of two temples dedicated to Lord Kedar and Goddess Gouri and is associated with several local legends of eternal love.",
    image: "https://images.unsplash.com/photo-1590733403305-675c9298585e"
  }
];

async function seed() {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) throw new Error("MONGO_URI not found in .env");

    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const Place = require('./models/Place');

    for (const placeData of places) {
      // Upsert by name
      await Place.findOneAndUpdate(
        { name: placeData.name },
        placeData,
        { upsert: true, new: true }
      );
      console.log(`Seeded: ${placeData.name}`);
    }

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
