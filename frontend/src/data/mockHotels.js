export const mockHotels = [
  {
    _id: 'hotel_1',
    name: 'Mayfair Lagoon',
    city: 'Bhubaneswar',
    rating: 4.8,
    reviewsCount: 1245,
    pricePerNight: 8500,
    distanceFromUser: 1.2,
    coordinates: { lat: 20.2961, lng: 85.8245 },
    shortDescription: 'Luxury heritage resort with widespread lagoons, lush green gardens, and top-tier amenities.',
    longDescription: 'Experience unparalleled luxury at Mayfair Lagoon. Nestled in the heart of Bhubaneswar, this 5-star heritage resort is spread across lush acres, offering world-class dining, an award-winning spa, and unparalleled hospitality designed to make your stay unforgettable.',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80'
    ],
    amenities: ['Free WiFi', 'Swimming Pool', 'Spa & Wellness', 'Fitness Center', 'Bar/Lounge', 'Restaurant'],
    roomTypes: [
      { id: 'r1', name: 'Deluxe Room', price: 8500, features: ['King Bed', 'City View', 'Free Breakfast'] },
      { id: 'r2', name: 'Lagoon View Suite', price: 14000, features: ['King Bed', 'Lagoon View', 'Lounge Access', 'Balcony'] },
    ],
    reviews: [
      { id: 'rev1', user: 'Ankita M.', rating: 5, date: 'October 2025', text: 'Absolutely spectacular resort. The gardens are breathtaking and the food was incredible.' },
      { id: 'rev2', user: 'Rajesh K.', rating: 4.5, date: 'September 2025', text: 'Great hospitality. The spa services were a highlight of our trip.' }
    ]
  },
  {
    _id: 'hotel_2',
    name: 'Trident Bhubaneswar',
    city: 'Bhubaneswar',
    rating: 4.7,
    reviewsCount: 980,
    pricePerNight: 6500,
    distanceFromUser: 3.5,
    coordinates: { lat: 20.3161, lng: 85.8145 },
    shortDescription: 'Modern luxury set amidst 14 acres of manicured gardens, featuring a traditional Odia architectural aesthetic.',
    longDescription: 'Trident, Bhubaneswar offers luxury accommodations and serene surroundings. Featuring architectural touches that honor Odisha\'s rich history, it perfectly blends modern comforts with traditional charm. Ideal for both business and leisure travelers.',
    images: [
      'https://images.unsplash.com/photo-1542314831-c53cd3816002?w=1200&q=80',
      'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1200&q=80',
      'https://images.unsplash.com/photo-1574643156929-51fa098b0394?w=1200&q=80'
    ],
    amenities: ['Free WiFi', 'Outdoor Pool', 'Business Center', 'Pet Friendly', 'Restaurant'],
    roomTypes: [
      { id: 'r1', name: 'Standard Room', price: 6500, features: ['Queen Bed', 'Garden View'] },
      { id: 'r2', name: 'Executive Suite', price: 11000, features: ['King Bed', 'Pool View', 'Private Lounge'] },
    ],
    reviews: [
      { id: 'rev1', user: 'Sarah W.', rating: 5, date: 'August 2025', text: 'Loved the peaceful ambiance right in the city. Truly an oasis.' }
    ]
  },
  {
    _id: 'hotel_3',
    name: 'Swosti Premium',
    city: 'Bhubaneswar',
    rating: 4.5,
    reviewsCount: 2150,
    pricePerNight: 4500,
    distanceFromUser: 2.1,
    coordinates: { lat: 20.3061, lng: 85.8345 },
    shortDescription: 'The city’s largest convention hotel offering vibrant decor, a massive health club, and multiple dining options.',
    longDescription: 'Swosti Premium is the largest convention hotel in East India, boasting exceptional luxury, a Scottish-themed bar, and an in-house discotheque. It is highly favored by tourists and corporate executives alike.',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c0d5e9af?w=1200&q=80',
      'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=1200&q=80'
    ],
    amenities: ['Free WiFi', 'Fitness Center', 'Discotheque', 'Banquet Hall', 'Restaurant'],
    roomTypes: [
      { id: 'r1', name: 'Premium Room', price: 4500, features: ['Queen Bed', 'City View'] },
      { id: 'r2', name: 'Corporate Suite', price: 7500, features: ['King Bed', 'Work Desk', 'Lounge Area'] },
    ],
    reviews: [
      { id: 'rev1', user: 'Pritam D.', rating: 4, date: 'November 2025', text: 'Great place for events and conferences. Room service is slightly slow.' }
    ]
  },
  {
    _id: 'hotel_4',
    name: 'Vivanta Bhubaneswar',
    city: 'Bhubaneswar',
    rating: 4.9,
    reviewsCount: 540,
    pricePerNight: 9500,
    distanceFromUser: 4.8,
    coordinates: { lat: 20.2561, lng: 85.7845 },
    shortDescription: 'Contemporary design meets traditional warmth. Enjoy the rooftop infinity pool with panoramic views.',
    longDescription: 'Vivanta brings its signature stylish swagger to Bhubaneswar. Situated in a prime location, the modern facade gives way to a vibrant interior. Enjoy world-class culinary experiences, sweeping views from the rooftop pool, and impeccable service.',
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80'
    ],
    amenities: ['Free WiFi', 'Infinity Pool', 'Spa', 'Premium Dining', 'Valet Parking'],
    roomTypes: [
      { id: 'r1', name: 'Superior Room', price: 9500, features: ['King Bed', 'Smart TV', 'City View'] },
      { id: 'r2', name: 'Premium Suite', price: 18000, features: ['King Bed', 'Panoramic Window', 'Living Area', 'Butler Service'] },
    ],
    reviews: [
      { id: 'rev1', user: 'John M.', rating: 5, date: 'December 2025', text: 'The infinity pool is the best in the city. Fantastic new property.' }
    ]
  }
];
