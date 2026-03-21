export const mockRestaurants = [
  {
     id: "rest_1",
     name: "Tripti Restaurant",
     bannerUrl: "https://picsum.photos/seed/tripti/1200/600",
     images: ["https://picsum.photos/seed/tripti2/800/600", "https://picsum.photos/seed/tripti3/800/600", "https://picsum.photos/seed/tripti4/800/600"],
     rating: 4.8,
     reviewsCount: 1240,
     priceLevel: "₹₹",
     category: "Traditional Odia",
     isOpen: true,
     distance: "0.8 km",
     address: "VIP Road, Near Jagannath Temple, Puri, Odisha",
     description: "Experience the authentic taste of Odisha with our legendary traditional thalis and handcrafted Mahaprasad-inspired dishes. A culinary institution serving heritage on a plate inside a deeply cultural ambiance.",
     hours: "11:30 AM - 10:30 PM",
     features: ["Family Friendly", "Air Conditioned", "Parking Available", "Pure Veg Options", "Traditional Seating"],
     menuHighlights: [
        { name: "Puri Special Thali", description: "Authentic 12-item traditional platter.", price: 450 },
        { name: "Chhena Poda", description: "Classic Odia baked cheese dessert.", price: 150 },
        { name: "Dalma", description: "Roasted lentil & vegetable stew.", price: 200 }
     ],
     reviews: [
        { id: 'r1', author: 'Rahul M.', rating: 5, text: 'Absolutely spectacular authentic thali! Every bite feels like home.' },
        { id: 'r2', author: 'Priyanka S.', rating: 4, text: 'Great ambiance but a bit crowded during lunch hours.' }
     ]
  },
  {
     id: "rest_2",
     name: "Wildgrass Restaurant",
     bannerUrl: "https://picsum.photos/seed/wildgrass/1200/600",
     images: ["https://picsum.photos/seed/wildgrass2/800/600", "https://picsum.photos/seed/wildgrass3/800/600"],
     rating: 4.9,
     reviewsCount: 892,
     priceLevel: "₹₹₹",
     category: "Continental & Seafood",
     isOpen: true,
     distance: "1.2 km",
     address: "Marine Drive Road, Puri, Odisha",
     description: "An elegant, nature-inspired luxury dining experience specializing in freshly caught Bay of Bengal seafood and expertly crafted continental plates, all served in an open-air forested corridor.",
     hours: "12:00 PM - 11:30 PM",
     features: ["Outdoor Seating", "Live Music", "Bar Available", "Romantic Vibe", "Seaside Views"],
     menuHighlights: [
        { name: "Grilled Jumbo Prawns", description: "Fresh local catch with garlic butter glaze.", price: 850 },
        { name: "Crab Masala", description: "Rich, spicy Indian coastal crab curry.", price: 950 },
        { name: "Wildgrass Signature Mocktail", description: "Refreshing tropical fruit blend.", price: 250 }
     ],
     reviews: [
        { id: 'r1', author: 'John D.', rating: 5, text: 'The best seafood I have ever had! The prawn glaze was perfect.' },
        { id: 'r2', author: 'Anya V.', rating: 5, text: 'Unmatched romantic ambiance.' }
     ]
  },
  {
     id: "rest_3",
     name: "Dalma",
     bannerUrl: "https://picsum.photos/seed/dalma/1200/600",
     images: ["https://picsum.photos/seed/dalma2/800/600", "https://picsum.photos/seed/dalma3/800/600"],
     rating: 4.5,
     reviewsCount: 3000,
     priceLevel: "₹",
     category: "Odia Cuisine",
     isOpen: false,
     distance: "2.5 km",
     address: "Unit 4, Bhubaneswar, Odisha",
     description: "The pioneering chain that brought traditional Odia home food to the mainstream restaurant scene. Famous nationwide for unparalleled consistency and deeply rooted local spices.",
     hours: "12:00 PM - 4:00 PM, 7:00 PM - 10:30 PM",
     features: ["Quick Service", "Budget Friendly", "Takeaway", "Authentic Spices"],
     menuHighlights: [
        { name: "Mati Handi Mutton", description: "Clay-pot slow cooked tender mutton.", price: 420 },
        { name: "Pakhala Bhata", description: "Summer special water-soaked rice with sides.", price: 180 },
        { name: "Macha Besara", description: "Fish curry in mustard garlic paste.", price: 280 }
     ],
     reviews: [
        { id: 'r1', author: 'Ankit P.', rating: 5, text: 'If you want real Odia food, this is the only place to go.' },
        { id: 'r2', author: 'Sarah L.', rating: 4, text: 'Incredibly flavorful and spicy!' }
     ]
  },
  {
     id: "rest_4",
     name: "Bocca Cafe",
     bannerUrl: "https://picsum.photos/seed/bocca/1200/600",
     images: ["https://picsum.photos/seed/bocca2/800/600", "https://picsum.photos/seed/bocca3/800/600"],
     rating: 4.7,
     reviewsCount: 512,
     priceLevel: "₹₹",
     category: "Cafe & Italian",
     isOpen: true,
     distance: "3.1 km",
     address: "Master Canteen, Bhubaneswar, Odisha",
     description: "A chic, artsy urban cafe known for the best artisanal coffee roasts and authentic Italian wood-fired pizzas in the city. A popular hub for creatives and digital nomads.",
     hours: "8:00 AM - 11:00 PM",
     features: ["Free WiFi", "Artisan Coffee", "Pet Friendly", "Books & Board Games"],
     menuHighlights: [
        { name: "Wood-Fired Pepperoni", description: "Classic thin crust pepperoni pizza.", price: 550 },
        { name: "Caramel Macchiato", description: "Signature slow-drip caramel coffee.", price: 220 },
        { name: "Tiramisu", description: "Authentic Italian espresso dessert.", price: 280 }
     ],
     reviews: [
        { id: 'r1', author: 'Vikas T.', rating: 5, text: 'The vibe here is incredible. I can work for hours with their amazing coffee.' }
     ]
  }
];
