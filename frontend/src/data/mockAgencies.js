export const mockAgencies = [
  {
    id: 'agency-1',
    name: 'Kalinga Heritage Travels',
    verified: true,
    rating: 4.9,
    reviewsCount: 342,
    location: 'Bhubaneswar, Odisha',
    priceStarting: 1500,
    bannerUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80',
    logoUrl: 'https://ui-avatars.com/api/?name=Kalinga&background=020617&color=10b981',
    description: 'Specializing in deep ancient temple tours, expert historian guides, and premium AC transport across the Golden Triangle.',
    services: ['Premium Transport', 'Historian Guides', 'Temple Approvals', 'Luxury Stay'],
    packages: [
      { id: 'p1', name: 'Golden Triangle Elite', duration: '3 Days', price: 8500 },
      { id: 'p2', name: 'Bhubaneswar Heritage', duration: '1 Day', price: 1500 }
    ],
    reviews: [
      { id: 1, author: 'Liam S.', rating: 5, text: 'Absolutely mesmerizing tour. The vehicles were pristine.' },
      { id: 2, author: 'Priya D.', rating: 5, text: 'The historian guide knew everything about Lingaraj temple.' }
    ]
  },
  {
    id: 'agency-2',
    name: 'Odisha Eco Retreats',
    verified: true,
    rating: 4.7,
    reviewsCount: 128,
    location: 'Puri, Odisha',
    priceStarting: 2200,
    bannerUrl: 'https://images.unsplash.com/photo-1596885542884-28b9ccaf09fa?auto=format&fit=crop&q=80',
    logoUrl: 'https://ui-avatars.com/api/?name=Eco&background=020617&color=6366f1',
    description: 'Immersive nature and wildlife tours targeting Chilika Lake, Bhitarkanika mangroves, and marine camps.',
    services: ['Boat Safaris', 'Camp Sites', 'Wildlife Trackers', 'Meals Included'],
    packages: [
      { id: 'p3', name: 'Chilika Island Camp', duration: '2 Days', price: 4200 },
      { id: 'p4', name: 'Mangrove Safari', duration: '1 Day', price: 2200 }
    ],
    reviews: [
      { id: 3, author: 'Amit K.', rating: 4, text: 'Amazing boat ride, saw dolphins!' }
    ]
  },
  {
    id: 'agency-3',
    name: 'Konark Wheels Tours',
    verified: false,
    rating: 4.5,
    reviewsCount: 89,
    location: 'Konark, Odisha',
    priceStarting: 900,
    bannerUrl: 'https://images.unsplash.com/photo-1600008544258-75c1a8eeb056?auto=format&fit=crop&q=80',
    logoUrl: 'https://ui-avatars.com/api/?name=Konark&background=020617&color=f59e0b',
    description: 'Budget-friendly travel agency providing day trips to the Sun Temple, marine drive, and local seafood spots.',
    services: ['Group Transport', 'Audio Guides', 'Budget Friendly'],
    packages: [
      { id: 'p5', name: 'Sun Temple Express', duration: '1 Day', price: 900 }
    ],
    reviews: [
      { id: 4, author: 'Ravi R.', rating: 4, text: 'Good for the price, decent bus.' }
    ]
  },
  {
    id: 'agency-4',
    name: 'Utkal Royal Experiences',
    verified: true,
    rating: 5.0,
    reviewsCount: 512,
    location: 'Cuttack, Odisha',
    priceStarting: 5500,
    bannerUrl: 'https://images.unsplash.com/photo-1542314831-c6a4d14fff8e?auto=format&fit=crop&q=80',
    logoUrl: 'https://ui-avatars.com/api/?name=Utkal&background=020617&color=a855f7',
    description: 'Award-winning luxury travel curation. Stay in palaces, travel in SUVs, and experience Odia royalty.',
    services: ['Palace Stays', 'Chauffeur Driven', 'Personal Concierge', 'Fine Dining'],
    packages: [
      { id: 'p6', name: 'The Maharaja Tour', duration: '5 Days', price: 35000 },
      { id: 'p7', name: 'Silver City Royals', duration: '2 Days', price: 12000 }
    ],
    reviews: [
      { id: 5, author: 'Sarah W.', rating: 5, text: 'Truly a 5-star experience from arrival to departure.' }
    ]
  }
];
