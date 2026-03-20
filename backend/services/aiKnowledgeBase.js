const knowledgeBase = [
  {
    keywords: ["puri", "trip", "plan", "itinerary", "one day", "1 day"],
    answer: "A perfect one-day Puri itinerary: Start with an early morning Darshan at the **Jagannath Temple**, followed by breakfast with local 'Puris'. Head to **Konark Sun Temple** (35km away) to witness the sunrise or morning glory. Spend your afternoon at **Chandrabhaga Beach** and return to Puri for a sunset stroll and seafood dinner at **Puri Beach**.",
    score: 3
  },
  {
    keywords: ["food", "eat", "dish", "cuisine", "specialty", "mahaprasad"],
    answer: "Odisha is a culinary paradise! You must try the **Mahaprasad** (Chappan Bhog) at Puri Temple. Other local favorites include **Dalma** (lentils with vegetables), **Dahi Bara-Aloo Dum** (Cuttack's specialty), **Chhena Poda** (baked cheese dessert), and ultra-fresh seafood. Don't miss the **Pahala Rasagulla**!",
    score: 2
  },
  {
    keywords: ["bhubaneswar", "temple city", "visit", "places"],
    answer: "Bhubaneswar, the 'Temple City', offers a blend of heritage and nature. Top sites: **Lingaraj Temple**, **Udayagiri & Khandagiri Caves**, **Dhauli Shanti Stupa**, **Nandankanan Zoo**, and the **Odisha State Museum**. It's the perfect gateway to your Odisha journey.",
    score: 2
  },
  {
    keywords: ["konark", "sun temple", "chariot", "black pagoda"],
    answer: "The **Konark Sun Temple**, a UNESCO World Heritage site, is a 13th-century architectural marvel built as a giant chariot for the Sun God. Known as the 'Black Pagoda', it features 24 intricately carved wheels and 7 horses, symbolizing time and the days of the week.",
    score: 3
  },
  {
    keywords: ["odisha", "india", "overview", "describe", "culture"],
    answer: "Odisha is one of India's most vibrant coastal states, known for its **heritage temples**, **pristine beaches**, and **rich tribal culture**. It is the land of Lord Jagannath and the birthplace of the classical **Odissi dance**. From the Asia's largest lagoon (**Chilika**) to the spiritual heart of **Puri**, it's India's best-kept secret.",
    score: 2
  },
  {
    keywords: ["india", "travel", "important", "tips", "visa", "currency"],
    answer: "Travelling to India is a soul-stirring experience! **Important tips**: 1. Ensure you have an E-Visa. 2. Use Indian Rupees (INR). 3. Respect local traditions (remove shoes at temples). 4. Try the diverse street food but stick to bottled water. 5. Download **GuideGo** for the best local insights!",
    score: 2
  },
  {
    keywords: ["best time", "weather", "month", "visit", "season"],
    answer: "The ideal time to visit Odisha and most parts of India is from **October to March**. The weather is pleasantly cool, perfect for beach activities, temple visits, and festivals like the Konark Dance Festival.",
    score: 2
  },
  {
    keywords: ["rath yatra", "chariot festival", "puri festival"],
    answer: "The **Rath Yatra** or Chariot Festival in Puri is one of the world's most spectacular religious events. It usually occurs in June or July. Lord Jagannath, along with His siblings, travels in massive decorated chariots to the Gundicha Temple. It's a sea of humanity and pure devotion!",
    score: 4
  },
  {
    keywords: ["chilika", "lake", "lagoon", "dolphin", "bird"],
    answer: "**Chilika Lake** is Asia's largest brackish water lagoon. It's world-famous for the rare **Irrawaddy Dolphins** at Satapada and the migratory birds at **Nalabana Bird Sanctuary**. A boat ride at sunrise or sunset is a must-experience!",
    score: 3
  },
  {
    keywords: ["safe", "safety", "security", "emergency", "women"],
    answer: "Odisha is known as one of the safest states in India for travelers. People are generally helpful and humble. **Pro-tips**: Use authorized guides from GuideGo, avoid isolated areas late at night, and keep the local police helpline (112) saved. Your safety is our priority.",
    score: 2
  },
  {
    keywords: ["namaste", "hello", "hi", "greet"],
    answer: "Namaste! (or 'Juhar' in Western Odisha). I am the GuideGo Oracle, your spiritual and cultural companion. How can I help you explore the beautiful land of India today?",
    score: 1
  },
  {
    keywords: ["who are you", "what is this", "oracle", "guidego"],
    answer: "I am the **GuideGo Oracle**, an AI-powered knowledge base designed to answer all your travel, heritage, and cultural questions about Odisha and India. I help you find the best guides, hidden gems, and local secrets.",
    score: 2
  }
];

const getAIResponse = (question) => {
  const q = question.toLowerCase();
  let bestMatch = null;
  let highestScore = -1;

  for (const item of knowledgeBase) {
    let currentScore = 0;
    let matchCount = 0;

    for (const keyword of item.keywords) {
      if (q.includes(keyword)) {
        currentScore += item.score;
        matchCount++;
      }
    }

    // Boost score if multiple keywords match
    if (matchCount > 1) {
      currentScore *= 1.5;
    }

    if (currentScore > highestScore && currentScore > 0) {
      highestScore = currentScore;
      bestMatch = item.answer;
    }
  }

  return bestMatch || "I'm currently in 'Demo Mode' and can answer questions about Odisha, India, Puri, Jagannath Temple, local food, and general travel tips. Feel free to ask about any of these!";
};

module.exports = { getAIResponse, knowledgeBase };
