const responses = {
  "plan 1 day trip in puri": "Recommended itinerary: Jagannath Temple (Morning Darshan) → Puri Beach (Relaxation) → Konark Sun Temple (Afternoon visit) → Local seafood dinner near the beach.",
  "best food in puri": "Puri is famous for its Mahaprasad at the temple. You must also try Odia dishes like Dalma, Chhena Poda, and the fresh variety of seafood near Puri Beach.",
  "places to visit in bhubaneswar": "Top places: Lingaraj Temple, Udayagiri & Khandagiri Caves, Nandankanan Zoological Park, Dhauli Shanti Stupa, and the Odisha State Museum.",
  "what is konark sun temple": "Konark Sun Temple is a 13th-century UNESCO World Heritage site built in the shape of a giant chariot with detailed wheels and horses, dedicated to the Sun God.",
  "hidden places in odisha": "Explore Satkosia Gorge, the mangrove forests of Bhitarkanika, Chilika Lake islands, and the tribal heartlands of Koraput for unique, offbeat experiences.",
  "best time to visit odisha": "The best time to visit Odisha is between October and March when the weather is pleasant and ideal for sightseeing and beach activities.",
  "how to reach puri": "Puri is well-connected by rail and road. The nearest airport is Biju Patnaik International Airport in Bhubaneswar, which is about 60 km away.",
  "jagannath temple facts": "The 12th-century Jagannath Temple is famous for the annual Rath Yatra. Interestingly, the flag on the temple dome always flies in the opposite direction of the wind.",
  "chilika lake highlights": "Chilika is Asia's largest salt-water lagoon. It's famous for Irrawaddy dolphins, migratory birds at Nalabana Sanctuary, and beautiful boating experiences.",
  "shopping in odisha": "Look for Pattachitra paintings, Sambalpuri and Kataki sarees, silver filigree (Tarakasi) from Cuttack, and stone carvings from Puri.",
  "festivals in odisha": "Major festivals include Rath Yatra (Puri), Bali Jatra (Cuttack), Konark Dance Festival, and Nuakhai (Western Odisha).",
  "beaches in odisha": "Top beaches include Puri Beach, Konark (Chandrabhaga) Beach, Gopalpur-on-Sea, and the quiet Chandipur Beach where the sea recedes during low tide.",
  "cuttack tourist places": "Famous for silver filigree, Cuttack offers Netaji Birthplace Museum, Barabati Fort, Katak Chandi Temple, and the Maritime Museum.",
  "wildlife in odisha": "Odisha is home to Similipal National Park (Tigers), Bhitarkanika (Crocodiles), and Gahirmatha (Olive Ridley Turtles nesting site).",
  "local transport in puri": "In Puri, you can use cycle rickshaws, auto-rickshaws, and e-rickshaws. Many visitors also prefer renting scooters or cycles for local exploration.",
  "similipal national park": "A tiger reserve and national park in Mayurbhanj district known for its dense forests, waterfalls like Barehipani, and rich biodiversity.",
  "buddhist sites in odisha": "Known as the Golden Triangle of Buddhism: Ratnagiri, Lalitgiri, and Udayagiri house ancient monasteries and stupas.",
  "hirakud dam": "Located near Sambalpur, it is one of the longest earthen dams in the world, built across the Mahanadi River.",
  "handicrafts of odisha": "Odisha is world-renowned for Pattachitra, Applique work (Pipli), Bell Metal work, and intricate Silver Filigree.",
  "staying in puri": "Puri offers a wide range of stay options from luxury beach resorts to budget hotels and traditional 'Dharmashalas' near the temple.",
  "popular snacks in odisha": "Don't miss out on Bara-Aludum in Cuttack, Gupchup (Pani Puri), Dahi Bara-Aloo Dum, and Rasagulla from Pahala.",
  "safety tips for tourists": "Odisha is generally very safe. However, always follow temple dress codes, be cautious of strong currents at the beach, and use authorized guides.",
};

const getAIResponse = (question) => {
  const q = question.toLowerCase();

  // Keyword matching logic - simplified for better matching
  if (q.includes("puri") && (q.includes("trip") || q.includes("plan") || q.includes("itinerary"))) return responses["plan 1 day trip in puri"];
  if (q.includes("food") || q.includes("eat") || q.includes("dish")) return responses["best food in puri"];
  if (q.includes("puri")) return responses["plan 1 day trip in puri"]; // Default for Puri
  if (q.includes("bhubaneswar")) return responses["places to visit in bhubaneswar"];
  if (q.includes("konark") || q.includes("sun temple")) return responses["what is konark sun temple"];
  if (q.includes("hidden") || q.includes("offbeat") || q.includes("gem")) return responses["hidden places in odisha"];
  if (q.includes("time") || q.includes("when")) return responses["best time to visit odisha"];
  if (q.includes("reach") || q.includes("how to") || q.includes("airport") || q.includes("train")) return responses["how to reach puri"];
  if (q.includes("jagannath") || q.includes("temple")) return responses["jagannath temple facts"];
  if (q.includes("chilika") || q.includes("lake") || q.includes("dolphin")) return responses["chilika lake highlights"];
  if (q.includes("shop") || q.includes("market") || q.includes("saree")) return responses["shopping in odisha"];
  if (q.includes("fest") || q.includes("yatra") || q.includes("event")) return responses["festivals in odisha"];
  if (q.includes("beach")) return responses["beaches in odisha"];
  if (q.includes("cuttack")) return responses["cuttack tourist places"];
  if (q.includes("wildlife") || q.includes("park") || q.includes("tiger") || q.includes("crocodile") || q.includes("animal")) return responses["wildlife in odisha"];
  if (q.includes("transport") || q.includes("scooter") || q.includes("auto") || q.includes("cab")) return responses["local transport in puri"];
  if (q.includes("similipal")) return responses["similipal national park"];
  if (q.includes("buddhist") || q.includes("monastery") || q.includes("stupa")) return responses["buddhist sites in odisha"];
  if (q.includes("dam") || q.includes("hirakud")) return responses["hirakud dam"];
  if (q.includes("handicraft") || q.includes("filigree") || q.includes("applique")) return responses["handicrafts of odisha"];
  if (q.includes("stay") || q.includes("hotel") || q.includes("resort") || q.includes("room")) return responses["staying in puri"];
  if (q.includes("snack") || q.includes("rasagulla") || q.includes("dahibara")) return responses["popular snacks in odisha"];
  if (q.includes("safe") || q.includes("security") || q.includes("emergency")) return responses["safety tips for tourists"];

  // Default fallback
  return "I can help with travel plans, tourist places, guides, and local food recommendations in Odisha. Try asking about Puri, Bhubaneswar, Konark, or hidden gems!";
};

module.exports = { getAIResponse };
