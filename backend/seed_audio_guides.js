const mongoose = require('mongoose');
require('dotenv').config();

const places = [
  {
    name: "Konark Sun Temple",
    description: "13th century UNESCO heritage temple built as a giant chariot.",
    latitude: 19.8876,
    longitude: 86.0945,
    category: "Temple",
    city: "Konark",
    audioGuideText: "Welcome to the Konark Sun Temple. This magnificent temple was built in the 13th century by King Narasimhadeva of the Eastern Ganga dynasty. Designed as a giant chariot dedicated to the Sun God Surya, it is a UNESCO World Heritage site and one of India's most remarkable architectural achievements.",
    image: "https://images.unsplash.com/photo-1590733403305-675c9298585e"
  },
  {
    name: "Jagannath Temple Puri",
    description: "Sacred 12th century temple dedicated to Lord Jagannath.",
    latitude: 19.8049,
    longitude: 85.8179,
    category: "Temple",
    city: "Puri",
    audioGuideText: "Welcome to Jagannath Temple in Puri. This sacred temple is dedicated to Lord Jagannath, a form of Lord Vishnu. It is famous for the annual Rath Yatra festival, where massive chariots carry the deities through the streets of Puri.",
    image: "https://images.unsplash.com/photo-1524492459422-ad5193910f54"
  },
  {
    name: "Lingaraj Temple",
    description: "Ancient temple dedicated to Lord Shiva located in Bhubaneswar.",
    latitude: 20.2382,
    longitude: 85.8335,
    category: "Temple",
    city: "Bhubaneswar",
    audioGuideText: "Welcome to Lingaraj Temple. This ancient temple is one of the most sacred temples dedicated to Lord Shiva and represents the rich architectural heritage of Odisha with its massive deula and intricate carvings.",
    image: "https://images.unsplash.com/photo-1590733403305-675c9298585e"
  },
  {
    name: "Udayagiri and Khandagiri Caves",
    description: "Historical rock-cut caves that served as Jain residential blocks.",
    latitude: 20.258,
    longitude: 85.795,
    category: "Caves",
    city: "Bhubaneswar",
    audioGuideText: "Welcome to Udayagiri and Khandagiri Caves. These partly natural and partly artificial caves have significant archaeological, historical and religious importance. They were built around 2nd century BCE for Jain monks during the reign of King Kharavela.",
    image: "https://images.unsplash.com/photo-1524492459422-ad5193910f54"
  },
  {
    name: "Nandankanan Zoo",
    description: "Premier biological park known for its white tiger safari.",
    latitude: 20.3956,
    longitude: 85.826,
    category: "Park",
    city: "Bhubaneswar",
    audioGuideText: "Welcome to Nandankanan Biological Park. Literally meaning 'The Garden of Heavens', it is the first zoo in India to join the World Association of Zoos and Aquariums. It is famous for its unique white tiger breeding and the open-air botanical garden.",
    image: "https://images.unsplash.com/photo-1525923838299-2312b60f6d69"
  },
  {
    name: "Taj Mahal",
    description: "Iconic white marble mausoleum built by Mughal Emperor Shah Jahan.",
    latitude: 27.1751,
    longitude: 78.0421,
    category: "Monument",
    city: "Agra",
    audioGuideText: "Welcome to the Taj Mahal, an ivory-white marble mausoleum on the south bank of the Yamuna river. It was commissioned in 1632 by the Mughal emperor, Shah Jahan, to house the tomb of his favorite wife, Mumtaz Mahal.",
    image: "https://images.unsplash.com/photo-1564507592333-c60657ece523"
  },
  {
    name: "Gateway of India",
    description: "Arch-monument built during the 20th century in Mumbai.",
    latitude: 18.922,
    longitude: 72.8347,
    category: "Monument",
    city: "Mumbai",
    audioGuideText: "Welcome to the Gateway of India. It is an arch-monument built during the 20th century in Mumbai. The monument was erected to commemorate the landing of King George V and Queen Mary at Apollo Bunder on their visit to India in 1911.",
    image: "https://images.unsplash.com/photo-1566552881560-0be862a7c445"
  },
  {
    name: "Qutub Minar",
    description: "UNESCO World Heritage site and the tallest brick minaret in the world.",
    latitude: 28.5245,
    longitude: 77.1855,
    category: "Monument",
    city: "Delhi",
    audioGuideText: "Welcome to Qutub Minar. This 73-metre tall tapering tower of five storeys was built in 1193 by Qutab-ud-din Aibak after the defeat of Delhi's last Hindu kingdom.",
    image: "https://images.unsplash.com/photo-1585135497273-1a86b09fe707"
  },
  {
    name: "Hawa Mahal",
    description: "Palace in Jaipur, India, built of red and pink sandstone.",
    latitude: 26.9239,
    longitude: 75.8267,
    category: "Palace",
    city: "Jaipur",
    audioGuideText: "Welcome to Hawa Mahal, the 'Palace of Winds'. Built in 1799 by Maharaja Sawai Pratap Singh, its unique five-floor exterior is akin to the honeycomb of a beehive with its 953 small windows called jharokhas.",
    image: "https://images.unsplash.com/photo-1603262110263-ce0158e9f338"
  },
  {
    name: "Lalbagh Botanical Garden",
    description: "Old botanical garden in Bengaluru, commissioned by Hyder Ali.",
    latitude: 12.9507,
    longitude: 77.5848,
    category: "Nature",
    city: "Bengaluru",
    audioGuideText: "Welcome to Lalbagh Botanical Garden. Commissioned by Hyder Ali in 1760 and finished by his son Tipu Sultan, it has India's largest collection of tropical plants and an aquarium.",
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc18a593"
  },
  {
    name: "Kashi Vishwanath Temple",
    description: "One of the most famous Hindu temples dedicated to Lord Shiva.",
    latitude: 25.3109,
    longitude: 83.0107,
    category: "Temple",
    city: "Varanasi",
    audioGuideText: "Welcome to the Kashi Vishwanath Temple. Located in Varanasi, it is one of the most sacred Hindu temples dedicated to Lord Shiva. It stands on the western bank of the holy river Ganga.",
    image: "https://images.unsplash.com/photo-1561047029-3000c6812cbb"
  },
  {
    name: "Marine Drive",
    description: "3.6-kilometre-long Promenade along the Netaji Subhash Chandra Bose Road in Mumbai.",
    latitude: 18.9431,
    longitude: 72.823,
    category: "Nature",
    city: "Mumbai",
    audioGuideText: "Welcome to Marine Drive. Also known as the Queen's Necklace, it is a C-shaped six-lane concrete road along the coast, which is a natural bay. At night, the street lights look like a string of pearls.",
    image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66"
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
