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
    title: 'Shree Krishna Yatra – Vrindavan, Mathura | Khatu Shyam Baba | Ujjain Mahakal Darshan',
    subtitle: 'Special Spiritual Yatra 2026 • Pune to Uttar Pradesh, Madhya Pradesh & Rajasthan • Divine Confluence of Bhakti, Devotion & Bliss',
    destination: 'Mathura & Vrindavan',
    state: 'Uttar Pradesh, Madhya Pradesh & Rajasthan',
    durationDays: 6,
    durationNights: 2,
    durationLabel: '6 Days Journey (7th Day Pune Return) • 2 Nights AC Hotel Stay',
    datesLabel: '23 Oct 2026 – 29 Oct 2026 (Pune to Pune)',
    basePrice: 11999,
    lowerSeatPrice: 12999,
    upperSeatPrice: 11999,
    priceDisplay: 'Lower seat ₹12,999 / Upper seat ₹11,999 per person',
    depositPrice: 2999,
    advanceLabel: 'Advance: ₹2,999',
    rating: 5.0,
    reviewsCount: 226,
    featured: true,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1000&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600100397608-f010f443b74a?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?q=80&w=1000&auto=format&fit=crop',
    ],
    sites: [
      'Mathura – Vrindavan',
      'Shri Krishna Janmabhoomi (Mathura)',
      'Prem Mandir (Vrindavan)',
      'Banke Bihari Mandir (Vrindavan)',
      'Vrindavan Chardham',
      'Barsana (Shri Radha Rani Mandir)',
      'Khatu Shyam Baba (Rajasthan)',
      'Salasar Balaji (Rajasthan)',
      'Ujjain – Shri Mahakaleshwar Jyotirlinga',
      'Kaal Bhairav Mandir (Ujjain)',
      'Omkareshwar Jyotirlinga',
      'Mamleshwar Jyotirlinga',
      'Sanwaliya Seth Mandir (Mandphiya)',
      'Agra Taj Mahal',
    ],
    inclusions: [
      'Sleeper Coach (2×2 AC Pushback/Sleeper Luxury Travel)',
      '2 Nights Stay in Premium AC Hotel',
      '4-Person Sharing Rooms (Quad Sharing)',
      '2 Pure Vegetarian Meals per Day (Lunch & Dinner)',
      'Daily Morning Tea & Breakfast',
      'Packaged Drinking Water Provided During Meals',
      'Comprehensive Travel Insurance',
    ],
    exclusions: [
      'Puja, Archana & Abhishek Charges',
      'VIP / Fast-track Darshan Passes',
      'Local Travel / Auto-Rickshaw / E-Rickshaw Charges',
      'Boating Charges at Holy Ghats',
      'Personal Expenses, Shopping & Extra Food',
    ],
    terms: [
      'Booking is confirmed strictly upon receipt of the ₹2,999/- advance amount.',
      'Strict No Refund policy in case of cancellation.',
      'You can send another person in your place (ticket transfer permitted).',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Pune Departure & En Route Omkareshwar, Mamleshwar Jyotirlinga',
        description: 'Depart from Pune (Katraj / Mastan Hotel / Swargate) in comfortable 2×2 AC Sleeper Coach. Scenic highway journey towards Madhya Pradesh. Seek holy blessings at Omkareshwar Jyotirlinga and Mamleshwar Jyotirlinga along the sacred Narmada River.',
        highlights: ['Pune 2×2 AC Sleeper Departure', 'Narmada River Ghats', 'Omkareshwar & Mamleshwar Jyotirlinga Darshan'],
      },
      {
        day: 2,
        title: 'Ujjain Mahakaleshwar, Kaal Bhairav & Drive to Sanwaliya Seth',
        description: 'Morning arrival in sacred Ujjain. Experience divine Mahakaleshwar Jyotirlinga Darshan, explore the magnificent Mahakal Lok Corridor, and visit Kaal Bhairav Mandir. Afternoon drive into Rajasthan to visit the miraculous Sanwaliya Seth Mandir (Mandphiya) before proceeding towards Braj Bhoomi.',
        highlights: ['Mahakaleshwar Jyotirlinga', 'Mahakal Lok Corridor', 'Kaal Bhairav Mandir', 'Sanwaliya Seth Darshan'],
      },
      {
        day: 3,
        title: 'Khatu Shyam Baba, Salasar Balaji & Vrindavan Hotel Check-in',
        description: 'Soulful early darshan of Khatu Shyam Baba ("Haare Ka Sahara, Baba Shyam Hamara") in Rajasthan. Proceed to the revered Salasar Balaji Temple for Hanuman Ji\'s divine blessings. Evening drive to Braj Bhoomi and check-in to premium AC hotel in Vrindavan for dinner and restful stay.',
        highlights: ['Khatu Shyam Baba Darshan', 'Salasar Balaji Temple', 'Vrindavan AC Hotel Check-In (Night 1)'],
      },
      {
        day: 4,
        title: 'Mathura Shri Krishna Janmabhoomi, Banke Bihari & Prem Mandir',
        description: 'Full day immersed in Krishna Bhakti. Visit the sacred Shri Krishna Janmabhoomi Temple complex in Mathura and Yamuna Vishram Ghat. In Vrindavan, seek blessings at the world-famous Banke Bihari Mandir and ISKCON. Evening witness the mesmerizing illuminated Prem Mandir light and musical fountain show.',
        highlights: ['Shri Krishna Janmabhoomi', 'Banke Bihari Temple', 'Prem Mandir Evening Light Show', 'AC Hotel Stay (Night 2)'],
      },
      {
        day: 5,
        title: 'Vrindavan Chardham, Barsana Radha Rani & Agra Taj Mahal',
        description: 'Morning visits to Vrindavan Chardham and the vibrant hill temple of Barsana (Shri Radha Rani Mandir / Ladli Ji). Afternoon journey to Agra to witness the world-famous wonder, the Taj Mahal. Evening board your 2×2 AC Sleeper Coach for the return journey towards Pune.',
        highlights: ['Vrindavan Chardham', 'Barsana Radha Rani Mandir', 'Agra Taj Mahal Exploration', 'Return Coach Boarding'],
      },
      {
        day: 6,
        title: 'Highway Return Journey with Group Fellowship & Bhajans',
        description: 'Comfortable day-long transit in AC Sleeper Coach through Madhya Pradesh and Maharashtra. Relish morning tea, breakfast, pure veg meals, and share memorable pilgrimage experiences and devotional bhajans with fellow yatris.',
        highlights: ['2×2 AC Sleeper Comfort', 'Delicious Veg Meals & Tea', 'Devotional Atmosphere & Bhajans'],
      },
      {
        day: 7,
        title: 'Morning Arrival in Pune with Blessed Memories & Prasad',
        description: 'Arrive back in Pune (Katraj / Mangadewadi / Swargate) early morning on Day 7 with divine prasad, eternal memories, and lifelong blessings of Lord Krishna, Khatu Shyam Baba, and Lord Mahakal.',
        highlights: ['Early Morning Pune Drop', 'Divine Prasad Distribution', 'Successful Yatra Completion'],
      },
    ],
    batchDates: [
      {
        id: 'batch-vrindavan-oct-2026',
        month: 'October',
        label: '23 Oct 2026 – 29 Oct 2026 (Pune to Pune)',
        tag: 'Special Spiritual Yatra 2026 • Lower ₹12,999 / Upper ₹11,999',
        startDate: '2026-10-23',
        endDate: '2026-10-29',
        status: 'available',
      },
    ],
    overview: 'Experience the divine confluence of Bhakti, Shraddha & Bliss on this grand 2026 spiritual pilgrimage from Pune covering Mathura-Vrindavan, Shri Krishna Janmabhoomi, Banke Bihari, Prem Mandir, Barsana, Khatu Shyam Baba, Salasar Balaji, Ujjain Mahakal, Omkareshwar, Mamleshwar, Sanwaliya Seth, and Agra Taj Mahal traveling in 2×2 AC Sleeper Coach with 2 Nights AC Hotel stay.',
  },
  {
    id: 'pune-sanwaliya-seth-salasar-balaji-khatu-shyam',
    slug: 'pune-sanwaliya-seth-salasar-balaji-khatu-shyam',
    title: 'Pune to Sanwaliya Seth | Salasar Balaji Dham | Khatu Shyam Baba',
    subtitle: 'Special Spiritual Yatra 2026 • Pune to Pune • Sacred Darshan of Khatu Shyam Baba, Sanwaliya Seth & Salasar Balaji Dham',
    destination: 'Rajasthan & Madhya Pradesh',
    state: 'Rajasthan & Maharashtra',
    durationDays: 3,
    durationNights: 1,
    durationLabel: '3 Days Journey (4th Day Pune Return) • 1 Night AC Hotel Stay',
    datesLabel: '23 Oct 2026 – 26 Oct 2026 (Pune to Pune)',
    basePrice: 7499,
    lowerSeatPrice: 8499,
    upperSeatPrice: 7499,
    priceDisplay: 'Lower seat ₹8,499 / Upper seat ₹7,499 per person',
    depositPrice: 2999,
    advanceLabel: 'Advance: ₹2,999',
    rating: 4.9,
    reviewsCount: 184,
    featured: true,
    image: '/images/tours/khatu_shyam_salasar_tour.jpg',
    gallery: [
      '/images/tours/khatu_shyam_salasar_tour.jpg',
      'https://images.unsplash.com/photo-1545126178-862d2ad693b7?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600100397608-f010f443b74a?q=80&w=1000&auto=format&fit=crop',
    ],
    sites: [
      'Khatu Shyam Baba (Rajasthan)',
      'Shri Sanwaliya Seth Mandir (Mandphiya)',
      'Salasar Balaji Dham (Hanuman Ji)',
    ],
    inclusions: [
      'Sleeper Coach (2×2 AC Pushback/Sleeper Luxury Travel)',
      '1 Night Stay in Premium AC Hotel',
      '4-Person Sharing Rooms (Quad Sharing)',
      '2 Pure Vegetarian Meals per Day (Lunch & Dinner)',
      'Daily Morning Tea',
      'Fresh Breakfast Daily',
      'Packaged Drinking Water Provided During Meals',
      'Comprehensive Travel Insurance',
    ],
    exclusions: [
      'Puja, Archana & Abhishek Charges',
      'VIP / Fast-track Darshan Passes',
      'Local Travel / Auto-Rickshaw / E-Rickshaw Charges',
      'Boating Charges',
      'Personal Expenses, Shopping & Extra Food',
    ],
    terms: [
      'Booking is confirmed strictly upon receipt of the ₹2,999/- advance amount.',
      'Strict No Refund policy in case of cancellation.',
      'You can send another person in your place (ticket transfer permitted).',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Pune Departure & Highway Journey to Sanwaliya Seth',
        description: 'Depart from Pune (Green Hill Society, Katraj / Swargate) in comfortable 2×2 AC Sleeper Coach. Relax and enjoy a smooth highway transit towards Rajasthan with devotional music and fellow yatris.',
        highlights: ['Departure from Pune (23 Oct 2026)', '2×2 AC Sleeper Coach Travel', 'Devotional Group Atmosphere'],
      },
      {
        day: 2,
        title: 'Sanwaliya Seth Darshan & Drive to Khatu Dham (AC Hotel Stay)',
        description: 'Arrive in Mandphiya (Chittorgarh) for divine darshan of miraculous Shri Sanwaliya Seth (Lord Krishna in rich regal swaroop). Afternoon drive across Rajasthan towards Sikar/Khatu. Check into premium AC hotel for fresh-up, dinner, and 1 night restful stay.',
        highlights: ['Shri Sanwaliya Seth Darshan (Mandphiya)', 'Scenic Rajasthan Highway Transit', 'Premium AC Hotel Check-In & Dinner (Night 1)'],
      },
      {
        day: 3,
        title: 'Khatu Shyam Baba Darshan, Salasar Balaji Dham & Return Boarding',
        description: 'Early morning soulful darshan of Khatu Shyam Baba ("Haare Ka Sahara, Baba Shyam Hamara"). Seek blessings for prosperity and peace. Proceed to revered Salasar Balaji Dham for Hanuman Ji’s darshan. Evening board your 2×2 AC Sleeper Coach for the return journey towards Pune.',
        highlights: ['Khatu Shyam Baba Holy Darshan', 'Salasar Balaji Dham Hanuman Darshan', 'Evening Boarding 2×2 AC Sleeper Coach'],
      },
      {
        day: 4,
        title: 'Highway Return Journey & Safe Arrival in Pune',
        description: 'Relaxed journey along the highway with morning tea, breakfast, and delicious pure veg meals. Arrive safely back in Pune (Katraj / Mangadewadi) on 26 October 2026 carrying divine prasad and lifelong memories.',
        highlights: ['Delicious Pure Veg Meals & Tea', 'Arrival in Pune on 26 October 2026', 'Blessed Memories & Holy Prasad'],
      },
    ],
    batchDates: [
      {
        id: 'batch-khatu-salasar-oct-2026',
        month: 'October',
        label: '23 Oct 2026 – 26 Oct 2026 (Pune to Pune)',
        tag: 'Special Spiritual Yatra 2026 • Lower ₹8,499 / Upper ₹7,499',
        startDate: '2026-10-23',
        endDate: '2026-10-26',
        status: 'available',
      },
    ],
    overview: 'Embark on a sacred 3-day spiritual pilgrimage (returning on 4th day) from Pune covering holy Khatu Shyam Baba, miraculous Sanwaliya Seth Mandir, and revered Salasar Balaji Dham with 1 Night AC Hotel stay and 2×2 AC Sleeper Coach comfort.',
  },
  {
    id: 'mumbai-ujjain-mahakal-omkareshwar-maheshwar',
    slug: 'mumbai-ujjain-mahakal-omkareshwar-maheshwar',
    title: 'Mumbai to Ujjain Mahakal | Omkareshwar Jyotirlinga | Maheshwar',
    subtitle: 'Special Spiritual Yatra 2026 • Mumbai to Mumbai • Sacred Darshan of Mahakaleshwar, Kaal Bhairav, Omkareshwar, Mamleshwar & Maheshwar Rajwada',
    destination: 'Ujjain & Omkareshwar',
    state: 'Madhya Pradesh & Maharashtra',
    durationDays: 3,
    durationNights: 1,
    durationLabel: '3 Days Journey (4th Day Mumbai Return) • 1 Night AC Hotel Stay',
    datesLabel: '16 Oct 2026 – 19 Oct 2026 (Mumbai to Mumbai)',
    basePrice: 7499,
    lowerSeatPrice: 7999,
    upperSeatPrice: 7499,
    priceDisplay: 'Lower seat ₹7,999 / Upper seat ₹7,499 per person',
    depositPrice: 2999,
    advanceLabel: 'Advance: ₹2,999',
    rating: 4.9,
    reviewsCount: 162,
    featured: true,
    image: '/images/tours/mumbai_ujjain_omkareshwar_tour.jpg',
    gallery: [
      '/images/tours/mumbai_ujjain_omkareshwar_tour.jpg',
      'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596707328905-234b3e811c75?q=80&w=1000&auto=format&fit=crop',
    ],
    sites: [
      'Ujjain Mahakaleshwar Jyotirlinga',
      'Shri Kaal Bhairav Mandir (Ujjain)',
      'Harsiddhi Mata Shaktipeeth',
      'Mangalnath Mandir',
      'Runmukteshwar Mahadev Mandir',
      'Ramghat Shipra River Evening Aarti',
      'Shri Mahakal Lok Corridor',
      'Omkareshwar Jyotirlinga',
      'Mamleshwar Temple',
      'Ahilyabai Holkar Rajwada (Maheshwar)',
      'Maheshwari Saree Market & Narmada Ghats',
    ],
    inclusions: [
      'Sleeper Coach (2×2 AC Pushback/Sleeper Luxury Travel)',
      '1 Night Stay in Premium AC Hotel',
      '4-Person Sharing Rooms (Quad Sharing)',
      '2 Pure Vegetarian Meals per Day (Lunch & Dinner)',
      'Daily Morning Tea',
      'Fresh Breakfast Daily',
      'Packaged Drinking Water Provided During Meals',
      'Comprehensive Travel Insurance',
    ],
    exclusions: [
      'Puja, Archana & Abhishek Charges',
      'VIP / Fast-track Darshan Passes',
      'Local Travel / Auto-Rickshaw / E-Rickshaw Charges',
      'Boating Charges',
      'Personal Expenses, Shopping & Extra Food',
    ],
    terms: [
      'Booking is confirmed strictly upon receipt of the ₹2,999/- advance amount.',
      'Strict No Refund policy in case of cancellation.',
      'You can send another person in your place (ticket transfer permitted).',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Mumbai Departure & Overnight Highway Journey to Ujjain',
        description: 'Depart from Mumbai on 16 October 2026 in 2×2 AC Sleeper Coach. Enjoy a comfortable overnight ride towards Madhya Pradesh with group fellowship and devotional ambiance.',
        highlights: ['Departure from Mumbai (16 Oct 2026)', '2×2 AC Sleeper Coach Travel', 'Overnight Scenic Highway Drive'],
      },
      {
        day: 2,
        title: 'Ujjain Mahakal, Kaal Bhairav, Shaktipeeths & Ramghat Aarti (AC Hotel Stay)',
        description: 'Morning arrival in sacred Ujjain. Check into premium AC hotel. Sacred darshan of Mahakaleshwar Jyotirlinga, explore the grand Mahakal Lok Corridor, and visit Kaal Bhairav Mandir, Harsiddhi Mata Shaktipeeth, Mangalnath, and Runmukteshwar Mahadev. In the evening, witness the divine Shipra River Deep Aarti at Ramghat. Dinner and 1 night AC hotel stay.',
        highlights: ['Mahakaleshwar Jyotirlinga & Mahakal Lok', 'Kaal Bhairav & Harsiddhi Shaktipeeth', 'Ramghat Shipra River Aarti', 'Premium AC Hotel Stay in Ujjain (Night 1)'],
      },
      {
        day: 3,
        title: 'Omkareshwar Jyotirlinga, Mamleshwar & Maheshwar Rajwada',
        description: 'Early morning drive to holy Omkareshwar on Mandhata island. Seek blessings at Omkareshwar Jyotirlinga and Mamleshwar Mandir along the Narmada River. Proceed to historic Maheshwar to visit Rani Ahilyabai Holkar Rajwada, picturesque ghats, and shop for authentic world-famous Maheshwari handloom sarees. Evening boarding of 2×2 AC Sleeper Coach for return journey to Mumbai.',
        highlights: ['Omkareshwar & Mamleshwar Jyotirlinga Darshan', 'Ahilyabai Holkar Rajwada & Ghats', 'Maheshwari Saree Market Shopping', 'Return AC Coach Boarding'],
      },
      {
        day: 4,
        title: 'Highway Return Journey & Arrival in Mumbai',
        description: 'Comfortable day-long transit through Maharashtra with morning tea, breakfast, and delicious pure veg meals. Arrive safely back in Mumbai on 19 October 2026 carrying Mahakal’s divine blessings, sacred holy water, and joyful memories.',
        highlights: ['Delicious Veg Meals & Tea', 'Arrival in Mumbai on 19 October 2026', 'Blessed Memories & Divine Prasad'],
      },
    ],
    batchDates: [
      {
        id: 'batch-mumbai-ujjain-oct-2026',
        month: 'October',
        label: '16 Oct 2026 – 19 Oct 2026 (Mumbai to Mumbai)',
        tag: 'Special Spiritual Yatra 2026 • Lower ₹7,999 / Upper ₹7,499',
        startDate: '2026-10-16',
        endDate: '2026-10-19',
        status: 'available',
      },
    ],
    overview: 'Seek the holy blessings of Lord Shiva on this 3-day spiritual pilgrimage (returning on 4th day) from Mumbai covering Ujjain Mahakaleshwar Jyotirlinga, Mahakal Corridor, Kaal Bhairav, Omkareshwar Jyotirlinga, Mamleshwar, and historic Maheshwar Rajwada traveling in 2×2 AC Sleeper Coach with 1 Night AC Hotel stay.',
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
