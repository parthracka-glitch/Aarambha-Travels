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
    datesLabel: 'Flexible / Custom Dates',
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
    datesLabel: 'Flexible / Custom Dates',
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
    datesLabel: 'Flexible / Custom Dates',
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
];
