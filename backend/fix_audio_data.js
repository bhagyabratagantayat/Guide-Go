const mongoose = require('mongoose');
const Place = require('./models/Place');
const config = require('./config/env');

const audioContent = {
  "Lingaraj Temple": "Welcome to Lingaraj Temple. This ancient temple is one of the most sacred temples dedicated to Lord Shiva and represents the rich architectural heritage of Odisha with its massive deula and intricate carvings.",
  "Konark Sun Temple": "Welcome to the Konark Sun Temple. This magnificent temple was built in the 13th century by King Narasimhadeva of the Eastern Ganga dynasty. Designed as a giant chariot dedicated to the Sun God Surya, it is a UNESCO World Heritage site and one of India's most remarkable architectural achievements.",
  "Jagannath Temple Puri": "Welcome to Jagannath Temple in Puri. This sacred temple is dedicated to Lord Jagannath, a form of Lord Vishnu. It is famous for the annual Rath Yatra festival, where massive chariots carry the deities through the streets of Puri.",
  "Udayagiri & Khandagiri Caves": "Welcome to Udayagiri and Khandagiri Caves. These partly natural and partly artificial caves have significant archaeological, historical and religious importance. They were built around 2nd century BCE for Jain monks during the reign of King Kharavela.",
  "Nandankanan Zoological Park": "Welcome to Nandankanan Biological Park. Literally meaning 'The Garden of Heavens', it is the first zoo in India to join the World Association of Zoos and Aquariums. It is famous for its unique white tiger breeding and the open-air botanical garden.",
  "Dhauli Shanti Stupa": "Welcome to Dhauli Shanti Stupa. This Peace Pagoda was built by an Indo-Japanese collaboration in 1972 on the top of the hill where the Great Kalinga War was fought. It symbolizes the transformation of Emperor Ashoka from a warrior to a messenger of peace.",
  "Mukiteshvara Temple": "Welcome to the Mukteshvara Temple, often described as the 'Gem of Odisha Architecture'. This 10th-century temple is famous for its exquisite stone archway or 'Torana' and intricate carvings of celestial beings.",
  "Rajarani Temple": "Welcome to Rajarani Temple. Built in the 11th century, this temple is unique because it has no presiding deity. It is famous for its beautiful carvings of 'Nayikas' and the red-gold sandstone used in its construction.",
  "Ekamra Kanan": "Welcome to Ekamra Kanan, the largest botanical garden in Bhubaneswar. It serves as a vital green lung for the city, housing a wide variety of flora, a cactus house, and a serene lake.",
  "Chilika Lake": "Welcome to Chilika Lake, Asia's largest brackish water lagoon. It is a haven for migratory birds from as far as Siberia and is one of the few places in the world where you can spot the rare Irrawaddy dolphins."
};

const fixAudioData = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB...');

    for (const [name, text] of Object.entries(audioContent)) {
      const result = await Place.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
        { audioGuideText: text },
        { new: true }
      );
      
      if (result) {
        console.log(`✅ Updated: ${name}`);
      } else {
        console.log(`⚠️ Not found: ${name}`);
      }
    }

    console.log('DONE!');
    process.exit(0);
  } catch (error) {
    console.error('ERROR:', error);
    process.exit(1);
  }
};

fixAudioData();
