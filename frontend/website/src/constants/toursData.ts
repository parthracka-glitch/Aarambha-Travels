export interface TourItineraryDay {
  day: number;
  title: string;
  description: string;
  highlights: string[];
}

export interface TourBatchDate {
  id: string;
  month: string;
  label: string;
  tag: string;
  startDate: string;
  endDate: string;
  status?: 'available' | 'full' | 'disabled';
}

export interface TourContactInfo {
  phone1: string;
  phone2: string;
  phone1Display: string;
  phone2Display: string;
  whatsappNumber: string;
  address: string;
  instagramUrl: string;
}

export const SHARED_TOUR_CONTACT: TourContactInfo = {
  phone1: '9067617451',
  phone2: '9021878717',
  phone1Display: '+91 90676 17451',
  phone2Display: '+91 90218 78717',
  whatsappNumber: '919067617451',
  address: 'Green Hills Society, Near Mastan Hotel, Mangdewadi, Katraj, Pune - 411046, Maharashtra',
  instagramUrl: 'https://instagram.com/aarambha_tours_travels',
};

export interface TourPackage {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  destination: string;
  state: string;
  durationDays: number;
  durationNights: number;
  durationLabel: string;
  datesLabel: string;
  basePrice: number;
  priceDisplay: string;
  depositPrice: number;
  advanceLabel: string;
  lowerSeatPrice?: number;
  upperSeatPrice?: number;
  rating: number;
  reviewsCount: number;
  featured?: boolean;
  image: string;
  gallery: string[];
  sites: string[];
  inclusions: string[];
  exclusions: string[];
  terms: string[];
  itinerary: TourItineraryDay[];
  batchDates?: TourBatchDate[];
  overview: string;
}

export const TOUR_PACKAGES: TourPackage[] = [
  {
    id: '3-jyotirlinga-yatra-ujjain-omkareshwar-ghrishneshwar',
    slug: '3-jyotirlinga-yatra-ujjain-omkareshwar-ghrishneshwar',
    title: '3 Jyotirlinga Yatra – Ujjain, Omkareshwar, Ghrishneshwar, Maheshwar',
    subtitle: 'Mahakaleshwar Jyotirlinga, Mahakal Corridor, Shaktipeeths, Omkareshwar, Mamleshwar, Maheshwar Rajwada & Ghrishneshwar',
    destination: 'Ujjain & Omkareshwar',
    state: 'Madhya Pradesh & Maharashtra',
    durationDays: 3,
    durationNights: 2,
    durationLabel: '3 Days / 2 Nights',
    datesLabel: '',
    basePrice: 6499,
    priceDisplay: '₹6,499 per person',
    depositPrice: 1999,
    advanceLabel: 'Advance: ₹1,999',
    rating: 4.9,
    reviewsCount: 148,
    featured: true,
    image: '/images/tours_travels_bg.jpg',
    gallery: [
      '/images/tours_travels_bg.jpg',
      'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596707328905-234b3e811c75?q=80&w=1000&auto=format&fit=crop',
    ],
    sites: [
      'Mahakaleshwar Jyotirlinga',
      'Mahakal Corridor',
      'Harsiddhi Mata Shaktipeeth',
      'Bada Ganesh Temple',
      'Kaal Bhairav Temple',
      'Gadkalika Mata Shaktipeeth',
      'Mangalnath Temple',
      'Sandipani Ashram',
      'Ram Ghat',
      'Runmukteshwar Mahadev',
      'Omkareshwar Jyotirlinga',
      'Mamleshwar Temple',
      'Maheshwar Rajwada',
      'Maheshwar Ghat',
      'Ghrishneshwar Jyotirlinga',
    ],
    inclusions: [
      'New Urbania Pushback AC Bus',
      'Hotel Stay (4–5 sharing rooms)',
      '1 Veg Meal per Day',
      'Drinking Water with Meals',
      'Travel Insurance',
    ],
    exclusions: [
      'Puja / Abhishek Charges',
      'VIP Darshan Pass',
      'Local Travel / Auto Rickshaw',
      'Boating Charges',
      'Personal Expenses & Shopping',
    ],
    terms: [
      'Booking confirmed only after advance received',
      'No refund on cancellation',
      'Substitute traveler allowed',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Ujjain & Mahakal Corridor Darshan',
        description: 'Depart by New Urbania AC Bus to Ujjain. Experience divine Bhasma Aarti and darshan at Mahakaleshwar Jyotirlinga, explore the grandeur of Mahakal Corridor, visit Harsiddhi Mata Shaktipeeth, Bada Ganesh, Kaal Bhairav, and holy Ram Ghat on the Shipra River.',
        highlights: ['Mahakaleshwar Jyotirlinga', 'Mahakal Corridor', 'Harsiddhi Mata Shaktipeeth', 'Kaal Bhairav', 'Ram Ghat Aarti'],
      },
      {
        day: 2,
        title: 'Omkareshwar Jyotirlinga, Mamleshwar & Maheshwar Rajwada',
        description: 'Proceed towards the sacred island of Omkareshwar on Narmada River. Seek blessings at Omkareshwar Jyotirlinga & Mamleshwar Temple. In the afternoon, visit the historic Maheshwar Rajwada, Ahilya Fort, and the serene Maheshwar Narmada Ghats.',
        highlights: ['Omkareshwar Jyotirlinga', 'Mamleshwar Temple', 'Runmukteshwar Mahadev', 'Maheshwar Rajwada & Ghats'],
      },
      {
        day: 3,
        title: 'Ghrishneshwar Jyotirlinga & Blessed Return',
        description: 'Travel to Ghrishneshwar Jyotirlinga, the 12th and last Jyotirlinga temple of Lord Shiva. Complete the sacred 3 Jyotirlinga pilgrimage with divine blessings and embark on the return journey.',
        highlights: ['Ghrishneshwar Jyotirlinga Darshan', 'Conch & Temple Blessings', 'Comfortable AC Return Transfer'],
      },
    ],
    batchDates: [],
    overview: 'Embark on a soul-cleansing 3-day spiritual pilgrimage covering 3 sacred Jyotirlingas (Mahakaleshwar, Omkareshwar, Ghrishneshwar) alongside 15 holy temples, Shaktipeeths, and majestic Maheshwar ghats with New Urbania Pushback AC comfort.',
  },
  {
    id: 'krishna-yatra-vrindavan-mathura-khatu-shyam-ujjain',
    slug: 'krishna-yatra-vrindavan-mathura-khatu-shyam-ujjain',
    title: 'Krishna Yatra – Vrindavan, Mathura, Khatu Shyam Baba, Ujjain Mahakal',
    subtitle: 'Divine Braj Bhoomi, Krishna Janmabhoomi, Prem Mandir, Banke Bihari, Barsana, Khatu Shyam, Agra Taj Mahal & Mahakaleshwar',
    destination: 'Mathura & Vrindavan',
    state: 'Uttar Pradesh & Rajasthan',
    durationDays: 6,
    durationNights: 3,
    durationLabel: '6 Days / 3 Nights (AC hotel)',
    datesLabel: '',
    basePrice: 12999,
    lowerSeatPrice: 13999,
    upperSeatPrice: 12999,
    priceDisplay: 'Lower seat ₹13,999 / Upper seat ₹12,999 per person',
    depositPrice: 2999,
    advanceLabel: 'Advance: ₹2,999',
    rating: 5.0,
    reviewsCount: 192,
    featured: true,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600100397608-f010f443b74a?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?q=80&w=1000&auto=format&fit=crop',
    ],
    sites: [
      'Mathura-Vrindavan',
      'Krishna Janmabhoomi',
      'Prem Mandir',
      'Banke Bihari Temple',
      'Vrindavan Chardham',
      'Barsana Radha Rani',
      'Khatu Shyam Baba',
      'Ujjain Mahakaleshwar',
      'Kaal Bhairav Temple',
      'Omkareshwar Jyotirlinga',
      'Mamleshwar Temple',
      'Sawariya Seth Mandir',
      'Agra Taj Mahal',
      'Maa Baglamukhi Temple',
    ],
    inclusions: [
      'Sleeper Coach (2x2 AC)',
      '3 Nights AC Hotel Stay',
      '4-Person Sharing Rooms',
      '2 Meals per Day (Pure Veg)',
      'Tea & Daily Breakfast',
      'Drinking Water Provided',
      'Travel Insurance',
    ],
    exclusions: [
      'Puja / Abhishek Charges',
      'VIP Darshan Pass',
      'Local Travel / Auto Rickshaw / E-Rickshaw',
      'Boating Charges',
      'Personal Expenses / Shopping',
    ],
    terms: [
      'Booking confirmed only after advance received',
      'No refund on cancellation',
      'Substitute traveler allowed',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Departure & Ujjain Mahakal, Kaal Bhairav Darshan',
        description: 'Depart comfortably in 2x2 AC Sleeper Coach. Reach Ujjain for sacred darshan at Mahakaleshwar Jyotirlinga, Kaal Bhairav, and Omkareshwar/Mamleshwar.',
        highlights: ['AC Sleeper Coach Departure', 'Ujjain Mahakaleshwar Darshan', 'Kaal Bhairav'],
      },
      {
        day: 2,
        title: 'Sawariya Seth Mandir & Journey to Braj Bhoomi',
        description: 'Visit the renowned Sawariya Seth Mandir in Mandphiya to seek blessings of Lord Krishna before driving towards Mathura-Vrindavan.',
        highlights: ['Sawariya Seth Darshan', 'En-route Refreshments & Meals'],
      },
      {
        day: 3,
        title: 'Mathura Krishna Janmabhoomi, Prem Mandir & Banke Bihari',
        description: 'Immerse in divine spirituality at Shri Krishna Janmabhoomi in Mathura, followed by the enchanting Prem Mandir and legendary Banke Bihari Temple in Vrindavan.',
        highlights: ['Krishna Janmabhoomi', 'Prem Mandir Illumination', 'Banke Bihari Darshan'],
      },
      {
        day: 4,
        title: 'Vrindavan Chardham, Barsana Radha Rani & Agra Taj Mahal',
        description: 'Explore Vrindavan Chardham and the vibrant hills of Barsana (Shri Radha Rani Temple). Continue to Agra to witness the world-famous Taj Mahal.',
        highlights: ['Vrindavan Chardham', 'Barsana Radha Rani Mandir', 'Agra Taj Mahal Sightseeing'],
      },
      {
        day: 5,
        title: 'Khatu Shyam Baba Darshan & Maa Baglamukhi',
        description: 'Special pilgrimage darshan of Khatu Shyam Baba (Haare Ka Sahara) in Rajasthan and visit Maa Baglamukhi Shaktipeeth.',
        highlights: ['Khatu Shyam Baba Darshan', 'Maa Baglamukhi Temple', 'Grand Aarti Experience'],
      },
      {
        day: 6,
        title: 'Return Journey with Eternal Memories',
        description: 'Breakfast and relaxing return journey in AC Sleeper coach carrying divine prasad and cherished memories of the complete Krishna Yatra.',
        highlights: ['Comfortable AC Coach Return', 'Group Photo & Divine Blessings'],
      },
    ],
    batchDates: [],
    overview: 'Experience the divine grace of Lord Krishna across sacred Mathura-Vrindavan, Banke Bihari, Prem Mandir, and Barsana, complemented by powerful blessings at Khatu Shyam Baba, Taj Mahal Agra, and Ujjain Mahakal Jyotirlinga in 2x2 AC Sleeper Coach luxury.',
  },
  {
    id: 'tirupati-balaji-srisailam-jyotirlinga-kolhapur-mahalakshmi',
    slug: 'tirupati-balaji-srisailam-jyotirlinga-kolhapur-mahalakshmi',
    title: 'Tirupati Balaji, Srisailam Jyotirlinga, Mahanandi, Kolhapur Mahalakshmi',
    subtitle: 'Lord Venkateswara Tirupati Balaji, Mallikarjuna Srisailam Jyotirlinga, Kalahasti Rahu-Ketu, Mahanandi & Kolhapur Mahalakshmi',
    destination: 'Tirupati & Srisailam',
    state: 'Andhra Pradesh & Maharashtra',
    durationDays: 6,
    durationNights: 5,
    durationLabel: '6 Days',
    datesLabel: '',
    basePrice: 10999,
    priceDisplay: '₹10,999 per person',
    depositPrice: 2999,
    advanceLabel: 'Advance: ₹2,999',
    rating: 4.9,
    reviewsCount: 134,
    featured: true,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1000&auto=format&fit=crop',
    ],
    sites: [
      'Srisailam Jyotirlinga',
      'Mahanandi Temple',
      'Kalahasti Temple',
      'Tirupati Balaji Temple',
      'Padmavati Ammavari Temple',
      'Kolhapur Mahalakshmi Temple',
    ],
    inclusions: [
      'New Urbania AC Pushback Bus',
      'Hotel Stay (4-Person Sharing Room)',
      'Daily Morning Tea',
      'Drinking Water Provided',
      'Travel Insurance',
    ],
    exclusions: [
      'Puja / Abhishek Charges',
      'VIP Darshan Pass',
      'Local Travel / Auto Rickshaw',
      'Boating Charges',
      'Personal Expenses / Shopping',
    ],
    terms: [
      'Booking confirmed only after advance received',
      'No refund on cancellation',
      'Substitute traveler allowed',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Departure & Kolhapur Mahalakshmi Darshan',
        description: 'Depart from Pune in New Urbania AC Pushback Bus. Reach the holy city of Kolhapur for auspicious darshan at the ancient Shri Ambabai Mahalakshmi Shaktipeeth Temple.',
        highlights: ['Urbania AC Bus Departure', 'Kolhapur Mahalakshmi Darshan', 'Overnight Journey to Srisailam'],
      },
      {
        day: 2,
        title: 'Srisailam Mallikarjuna Jyotirlinga & Bhramaramba Devi',
        description: 'Arrive at the sacred Nallamala Hills. Perform holy darshan at Sri Mallikarjuna Swamy Jyotirlinga and Bhramaramba Devi Shaktipeeth on the banks of Krishna River.',
        highlights: ['Mallikarjuna Jyotirlinga', 'Bhramaramba Devi Shaktipeeth', 'Patalganga View'],
      },
      {
        day: 3,
        title: 'Mahanandi Temple & Scenic Drive to Kalahasti',
        description: 'Visit the historic Mahanandi Temple with its crystalline freshwater Kalyani Pushkarini, followed by a scenic drive towards Srikalahasti.',
        highlights: ['Mahanandi Sacred Spring', 'Ancient Architecture', 'Hotel Check-In'],
      },
      {
        day: 4,
        title: 'Srikalahasteeswara Temple & Arrival in Tirupati',
        description: 'Seek blessings at the famous Srikalahasti Vayu Lingam temple (renowned for Rahu-Ketu remedies) and proceed to the holy foothills of Tirupati.',
        highlights: ['Srikalahasteeswara Vayu Lingam', 'Rahu Ketu Kshetra', 'Tirupati Foothills'],
      },
      {
        day: 5,
        title: 'Sacred Tirumala Tirupati Balaji & Padmavati Darshan',
        description: 'Ascend the sacred Seven Hills to Tirumala for unforgettable darshan of Lord Venkateswara (Tirupati Balaji), followed by Padmavati Ammavari Temple at Tiruchanur.',
        highlights: ['Lord Venkateswara Balaji Darshan', 'Tirupati Laddu Prasad', 'Padmavati Ammavari Temple'],
      },
      {
        day: 6,
        title: 'Return Journey to Pune with Divine Blessings',
        description: 'Concluding the auspicious pilgrimage with morning prayers and relaxed travel back to Pune in New Urbania AC comfort.',
        highlights: ['Comfortable Return Journey', 'Divine Blessings & Prasad'],
      },
    ],
    batchDates: [],
    overview: 'Embark on a sanctified South Indian pilgrimage to seek the divine blessings of Lord Venkateswara at Tirupati Balaji, Sri Mallikarjuna Jyotirlinga at Srisailam, Srikalahasti, and Kolhapur Mahalakshmi Mata traveling comfortably in New Urbania AC Pushback Bus.',
  },
  {
    id: 'south-india-premium-mysore-ooty-munnar-thekkady-alleppey-kochi',
    slug: 'south-india-premium-mysore-ooty-munnar-thekkady-alleppey-kochi',
    title: 'South India Premium Tour – Mysore, Ooty, Pollachi, Munnar, Thekkady, Alleppey, Kochi',
    subtitle: 'Experience royal Mysore, chilly Ooty hills, lush Munnar tea gardens, Thekkady wilderness & serene Alleppey backwaters in AC Urbania comfort',
    destination: 'Mysore, Ooty & Kerala',
    state: 'Karnataka, Tamil Nadu & Kerala',
    durationDays: 7,
    durationNights: 4,
    durationLabel: '7 Days / 4–5 Nights',
    datesLabel: '01 Oct 2026 – 08 Oct 2026',
    basePrice: 15999,
    priceDisplay: '₹15,999 per person',
    depositPrice: 4999,
    advanceLabel: 'Advance: ₹4,999',
    rating: 5.0,
    reviewsCount: 118,
    featured: true,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600100397800-47b2511475e1?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=1000&auto=format&fit=crop',
    ],
    sites: [
      'Magnificent Mysore Palace',
      'Chamundeshwari Temple & Chamundi Hills',
      'Beautiful Brindavan Gardens',
      'Ooty Lake & Picturesque Boating',
      'Botanical Garden & Doddabetta Peak',
      'Pine Forest & Nilgiri Tea Gardens',
      'Pollachi Coconut Groves & Mountain Ghat Roads',
      'Mattupetty Dam & Echo Point',
      'Kundala Lake & Munnar Tea Museum',
      'Periyar Wildlife Sanctuary Region & Spice Plantations',
      'Alleppey Famous Backwaters Sightseeing & Boating',
      'Fort Kochi, Marine Drive & Chinese Fishing Nets',
      'St. Francis Church & Kochi City Shopping',
    ],
    inclusions: [
      'Round-trip travel from Pune to Pune by AC Urbania (Pushback seats)',
      'Dedicated comfortable vehicle for the entire itinerary',
      'Minimum 4 nights stay in clean, quality family hotels (5th night stay subject to schedule)',
      'Room accommodation on 3 to 4 sharing basis',
      'Sightseeing as per the itinerary',
      'Driver allowance, toll charges, parking fees, and state entry permits',
      'Complete tour planning and guidance throughout the trip',
    ],
    exclusions: [
      'Daily breakfast, lunch, and dinner',
      'Entry tickets for boating, safaris, monuments, and viewpoints',
      'Personal shopping, laundry, and individual expenses',
      'Additional sightseeing spots not mentioned in the itinerary',
      'Any extra costs arising from weather, traffic delays, or natural causes',
    ],
    terms: [
      'The hotel stay covers a minimum of 4 nights; a 5th night stay may be added based on route timing and conditions.',
      'Accommodation will be on a 3 to 4 persons per room basis.',
      'Seats will be confirmed only upon payment of the ₹4,999/- advance booking amount.',
      'Remaining tour balance must be cleared before the designated date prior to departure.',
      'The order of sightseeing points may change based on traffic, weather, or local circumstances.',
      'All travelers must carry a valid government-issued photo ID.',
      'Please carry necessary warm clothing and personal medications for high-altitude areas.',
      'Bookings are accepted on a first-come, first-served basis due to limited seats (15 seats only).',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Thursday Night Departure from Pune to Mysore',
        description: 'Depart comfortably on Thursday night (01 October 2026) from Pune in New AC Urbania with Pushback seats. Embark on a smooth overnight road journey towards Karnataka.',
        highlights: ['Departure from Pune (Thursday Night, 1 Oct)', 'New AC Urbania with Pushback Seats', 'Scenic Overnight Highway Drive'],
      },
      {
        day: 2,
        title: 'Arrival in Royal Mysore – Palace, Chamundeshwari Temple & Brindavan Gardens',
        description: 'Arrive in the royal heritage city of Mysore. Hotel check-in and refresh. Visit the world-famous magnificent Mysore Palace, seek blessings at Sri Chamundeshwari Temple atop Chamundi Hills, and witness the captivating evening illuminated musical fountains at Brindavan Gardens.',
        highlights: ['Magnificent Mysore Palace', 'Chamundeshwari Temple', 'Brindavan Gardens', 'Mysore Local City Tour'],
      },
      {
        day: 3,
        title: 'Mysore to Ooty – Queen of Hill Stations, Lake & Tea Gardens',
        description: 'Scenic morning drive ascending the Nilgiri Mountain ghat roads into chilly Ooty. Experience panoramic views from Doddabetta Peak (highest vantage in the Nilgiris), stroll through the Government Botanical Garden, wander the lush Pine Forest, enjoy boating at Ooty Lake, and explore rolling green tea plantations.',
        highlights: ['Nilgiri Mountain Ghat Roads', 'Doddabetta Peak Viewpoint', 'Ooty Lake & Boating', 'Botanical Garden & Pine Forest', 'Tea Garden Photo Spots'],
      },
      {
        day: 4,
        title: 'Ooty to Munnar via Pollachi Coconut Groves & Waterfalls',
        description: 'Descend through the picturesque landscapes of Pollachi, surrounded by sprawling coconut plantations, mountain ghat roads, and cascading roadside waterfalls. Ascend into God’s Own Country (Kerala) to Munnar, the world-renowned paradise of rolling tea hills. Hotel check-in and evening relaxation.',
        highlights: ['Pollachi Coconut Groves', 'Mountain Ghat Waterfalls & Photo Spots', 'Scenic Drive to Munnar', 'Munnar Hotel Check-In'],
      },
      {
        day: 5,
        title: 'Munnar Tea Plantations Sightseeing to Thekkady Spice Trails',
        description: 'Morning exploration of Munnar visiting Mattupetty Dam, Echo Point, Kundala Lake, and the historic Munnar Tea Gardens & Museum. In the afternoon, scenic drive to Thekkady bordering the Periyar Wildlife Sanctuary. Visit aromatic spice plantations and local spice markets for authentic Kerala cardamom, cinnamon, and pepper shopping.',
        highlights: ['Mattupetty Dam & Echo Point', 'Kundala Lake & Tea Museum', 'Periyar Wildlife Sanctuary Region', 'Authentic Kerala Spice Shopping'],
      },
      {
        day: 6,
        title: 'Thekkady to Alleppey Backwaters Boating & Fort Kochi Heritage',
        description: 'Morning transfer to Alleppey, the Venice of the East. Experience serene backwater boating through palm-fringed canals, witnessing traditional Kerala village life and lush paddy fields. In the afternoon, proceed to Kochi. Explore Fort Kochi, the iconic Chinese Fishing Nets, and the vibrant Marine Drive promenade.',
        highlights: ['Alleppey Backwaters Boating', 'Palm-fringed Waterways', 'Fort Kochi & Chinese Fishing Nets', 'Marine Drive Promenade'],
      },
      {
        day: 7,
        title: 'Kochi City Heritage Tour & Return Journey to Pune',
        description: 'Morning visit to St. Francis Church and local Kochi heritage landmarks. Begin the relaxing return journey in AC Urbania back to Pune. Arrive in Pune on Thursday morning, 8 October 2026, carrying divine memories of an unforgettable South India tour.',
        highlights: ['St. Francis Church & Heritage Tour', 'Local Kochi Shopping', 'Comfortable AC Urbania Return Transfer', 'Arrival in Pune on Thursday Morning (8 Oct)'],
      },
    ],
    batchDates: [
      {
        id: 'batch-south-india-oct-2026',
        month: 'October',
        label: '01 Oct 2026 – 08 Oct 2026 (Pune to Pune)',
        tag: 'Limited 15 Seats • Premium AC Urbania',
        startDate: '2026-10-01',
        endDate: '2026-10-08',
        status: 'available',
      },
    ],
    overview: 'Experience the royal heritage of Mysore, the chilly breeze of Ooty, the lush tea gardens of Munnar, the wilderness of Thekkady, and the serene backwaters of Alleppey—all in one premium 7-day tour package traveling Pune to Pune by comfortable AC Urbania (Pushback seats) for only 15 travelers.',
  },
];
