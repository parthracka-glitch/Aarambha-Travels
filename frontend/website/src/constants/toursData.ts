export interface TourItineraryDay {
  day: number;
  title: string;
  description: string;
  highlights: string[];
}

export interface TourBatchDate {
  id?: string;
  _id?: string;
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
    "id": "3-jyotirlinga-yatra-ujjain-omkareshwar-ghrishneshwar",
    "slug": "3-jyotirlinga-yatra-ujjain-omkareshwar-ghrishneshwar",
    "title": "3 Jyotirlinga Yatra – Ujjain, Omkareshwar, Ghrishneshwar, Maheshwar",
    "subtitle": "Mahakaleshwar Jyotirlinga, Mahakal Corridor, Shaktipeeths, Omkareshwar, Mamleshwar, Maheshwar Rajwada & Ghrishneshwar",
    "destination": "Ujjain & Omkareshwar",
    "state": "Madhya Pradesh & Maharashtra",
    "durationDays": 3,
    "durationNights": 2,
    "durationLabel": "3 Days / 2 Nights",
    "datesLabel": "Upcoming Departures",
    "basePrice": 6499,
    "priceDisplay": "₹6,499 per person",
    "depositPrice": 1999,
    "advanceLabel": "Advance: ₹1,999",
    "rating": 4.9,
    "reviewsCount": 140,
    "featured": true,
    "image": "/images/tours_travels_bg.jpg",
    "gallery": [
      "/images/tours_travels_bg.jpg"
    ],
    "sites": [
      "Mahakaleshwar Jyotirlinga",
      "Mahakal Corridor",
      "Harsiddhi Mata Shaktipeeth",
      "Bada Ganesh Temple",
      "Kaal Bhairav Temple",
      "Gadkalika Mata Shaktipeeth",
      "Mangalnath Temple",
      "Sandipani Ashram",
      "Ram Ghat",
      "Runmukteshwar Mahadev",
      "Omkareshwar Jyotirlinga",
      "Mamleshwar Temple",
      "Maheshwar Rajwada",
      "Maheshwar Ghat",
      "Ghrishneshwar Jyotirlinga"
    ],
    "inclusions": [
      "New Urbania Pushback AC Bus",
      "Hotel Stay (4-5 sharing)",
      "1 Veg Meal/Day",
      "Drinking Water",
      "Travel Insurance"
    ],
    "exclusions": [
      "Puja / Abhishek Charges",
      "VIP Darshan Pass",
      "Local Travel / Auto Rickshaw",
      "Boating Charges",
      "Personal Expenses & Shopping"
    ],
    "terms": [
      "Booking confirmed only after advance received",
      "No refund on cancellation",
      "Substitute traveler allowed"
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Ujjain Mahakal & Corridor Darshan",
        "description": "Mahakaleshwar Jyotirlinga, Mahakal Corridor, Shaktipeeths and Ram Ghat.",
        "highlights": []
      },
      {
        "day": 2,
        "title": "Omkareshwar Jyotirlinga & Maheshwar Rajwada",
        "description": "Omkareshwar Jyotirlinga, Mamleshwar, and Maheshwar Ghats.",
        "highlights": []
      },
      {
        "day": 3,
        "title": "Ghrishneshwar Jyotirlinga & Return",
        "description": "Ghrishneshwar Jyotirlinga darshan and return journey.",
        "highlights": []
      }
    ],
    "batchDates": [],
    "overview": "Embark on a soul-cleansing 3-day spiritual pilgrimage covering 3 sacred Jyotirlingas (Mahakaleshwar, Omkareshwar, Ghrishneshwar) alongside 15 holy temples, Shaktipeeths, and majestic Maheshwar ghats with New Urbania Pushback AC comfort."
  },
  {
    "id": "krishna-yatra-vrindavan-mathura-khatu-shyam-ujjain",
    "slug": "krishna-yatra-vrindavan-mathura-khatu-shyam-ujjain",
    "title": "Shree Krishna Yatra – Vrindavan, Mathura | Khatu Shyam Baba | Ujjain Mahakal Darshan",
    "subtitle": "Special Spiritual Yatra 2026 • Pune to Uttar Pradesh, Madhya Pradesh & Rajasthan • Divine Confluence of Bhakti, Devotion & Bliss",
    "destination": "Mathura & Vrindavan",
    "state": "Uttar Pradesh, Madhya Pradesh & Rajasthan",
    "durationDays": 6,
    "durationNights": 2,
    "durationLabel": "6 Days / 2 Nights",
    "datesLabel": "23 Oct 2026 – 29 Oct 2026 (Pune to Pune)",
    "basePrice": 11999,
    "priceDisplay": "₹11,999 per person",
    "depositPrice": 2999,
    "advanceLabel": "Advance: ₹2,999",
    "rating": 4.9,
    "reviewsCount": 140,
    "featured": true,
    "image": "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800&auto=format&fit=crop",
    "gallery": [
      "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800&auto=format&fit=crop"
    ],
    "sites": [
      "Mathura – Vrindavan",
      "Shri Krishna Janmabhoomi (Mathura)",
      "Prem Mandir (Vrindavan)",
      "Banke Bihari Mandir (Vrindavan)",
      "Vrindavan Chardham",
      "Barsana (Shri Radha Rani Mandir)",
      "Khatu Shyam Baba (Rajasthan)",
      "Salasar Balaji (Rajasthan)",
      "Ujjain – Shri Mahakaleshwar Jyotirlinga",
      "Kaal Bhairav Mandir (Ujjain)",
      "Omkareshwar Jyotirlinga",
      "Mamleshwar Jyotirlinga",
      "Sanwaliya Seth Mandir (Mandphiya)",
      "Agra Taj Mahal"
    ],
    "inclusions": [
      "Sleeper Coach (2×2 AC Pushback/Sleeper Luxury Travel)",
      "2 Nights Stay in Premium AC Hotel",
      "4-Person Sharing Rooms (Quad Sharing)",
      "2 Pure Vegetarian Meals per Day (Lunch & Dinner)",
      "Daily Morning Tea & Breakfast",
      "Packaged Drinking Water Provided During Meals",
      "Comprehensive Travel Insurance"
    ],
    "exclusions": [
      "Puja, Archana & Abhishek Charges",
      "VIP / Fast-track Darshan Passes",
      "Local Travel / Auto-Rickshaw / E-Rickshaw Charges",
      "Boating Charges at Holy Ghats",
      "Personal Expenses, Shopping & Extra Food"
    ],
    "terms": [
      "Booking is confirmed strictly upon receipt of the ₹2,999/- advance amount.",
      "Strict No Refund policy in case of cancellation.",
      "You can send another person in your place (ticket transfer permitted)."
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Pune Departure & En Route Omkareshwar, Mamleshwar Jyotirlinga",
        "description": "Depart from Pune in comfortable 2×2 AC Sleeper Coach towards MP. Seek blessings at Omkareshwar Jyotirlinga and Mamleshwar Jyotirlinga along sacred Narmada river.",
        "highlights": []
      },
      {
        "day": 2,
        "title": "Ujjain Mahakaleshwar, Kaal Bhairav & Drive to Sanwaliya Seth",
        "description": "Experience Mahakaleshwar Jyotirlinga Darshan, Mahakal Lok Corridor, and Kaal Bhairav Mandir. Afternoon drive into Rajasthan to visit miraculous Sanwaliya Seth Mandir.",
        "highlights": []
      },
      {
        "day": 3,
        "title": "Khatu Shyam Baba, Salasar Balaji & Vrindavan Hotel Check-in",
        "description": "Soulful darshan of Khatu Shyam Baba and Salasar Balaji Temple. Evening drive to Braj Bhoomi and check-in to premium AC hotel in Vrindavan for dinner & restful stay.",
        "highlights": []
      },
      {
        "day": 4,
        "title": "Mathura Shri Krishna Janmabhoomi, Banke Bihari & Prem Mandir",
        "description": "Visit sacred Shri Krishna Janmabhoomi Temple complex in Mathura. In Vrindavan, seek blessings at Banke Bihari Mandir and witness illuminated Prem Mandir light show.",
        "highlights": []
      },
      {
        "day": 5,
        "title": "Vrindavan Chardham, Barsana Radha Rani & Agra Taj Mahal",
        "description": "Morning visits to Vrindavan Chardham and Barsana Radha Rani Mandir. Afternoon journey to Agra to witness the world-famous Taj Mahal. Evening board AC Sleeper Coach for Pune.",
        "highlights": []
      },
      {
        "day": 6,
        "title": "Highway Return Journey with Group Fellowship & Bhajans",
        "description": "Comfortable day-long transit in AC Sleeper Coach through MP and Maharashtra with tea, breakfast, pure veg meals, and devotional bhajans.",
        "highlights": []
      },
      {
        "day": 7,
        "title": "Morning Arrival in Pune with Blessed Memories & Prasad",
        "description": "Early morning arrival back in Pune (Katraj / Mangadewadi / Swargate) with divine prasad, eternal memories, and lifelong blessings.",
        "highlights": []
      }
    ],
    "batchDates": [
      {
        "id": "batch-vrindavan-oct-2026",
        "month": "October",
        "label": "23 Oct 2026 – 29 Oct 2026 (Pune to Pune)",
        "tag": "Special Spiritual Yatra 2026 • Lower ₹12,999 / Upper ₹11,999",
        "startDate": "2026-10-23",
        "endDate": "2026-10-29",
        "status": "available",
        "_id": "6af07156a7e7406a2ef3e5a2"
      }
    ],
    "overview": "Experience the divine confluence of Bhakti, Shraddha & Bliss on this grand 2026 spiritual pilgrimage from Pune covering Mathura-Vrindavan, Shri Krishna Janmabhoomi, Banke Bihari, Prem Mandir, Barsana, Khatu Shyam Baba, Salasar Balaji, Ujjain Mahakal, Omkareshwar, Mamleshwar, Sanwaliya Seth, and Agra Taj Mahal traveling in 2×2 AC Sleeper Coach with 2 Nights AC Hotel stay."
  },
  {
    "id": "mumbai-ujjain-mahakal-omkareshwar-maheshwar",
    "slug": "mumbai-ujjain-mahakal-omkareshwar-maheshwar",
    "title": "Mumbai to Ujjain Mahakal | Omkareshwar Jyotirlinga | Maheshwar",
    "subtitle": "Special Spiritual Yatra 2026 • Mumbai to Mumbai • Sacred Darshan of Mahakaleshwar, Kaal Bhairav, Omkareshwar, Mamleshwar & Maheshwar Rajwada",
    "destination": "Ujjain & Omkareshwar",
    "state": "Madhya Pradesh & Maharashtra",
    "durationDays": 3,
    "durationNights": 1,
    "durationLabel": "3 Days / 1 Nights",
    "datesLabel": "16 Oct 2026 – 19 Oct 2026 (Mumbai to Mumbai)",
    "basePrice": 7499,
    "priceDisplay": "₹7,499 per person",
    "depositPrice": 2999,
    "advanceLabel": "Advance: ₹2,999",
    "rating": 4.9,
    "reviewsCount": 140,
    "featured": true,
    "image": "/images/tours/mumbai_ujjain_omkareshwar_tour.jpg",
    "gallery": [
      "/images/tours/mumbai_ujjain_omkareshwar_tour.jpg"
    ],
    "sites": [
      "Ujjain Mahakaleshwar Jyotirlinga",
      "Shri Kaal Bhairav Mandir (Ujjain)",
      "Harsiddhi Mata Shaktipeeth",
      "Mangalnath Mandir",
      "Runmukteshwar Mahadev Mandir",
      "Ramghat Shipra River Evening Aarti",
      "Shri Mahakal Lok Corridor",
      "Omkareshwar Jyotirlinga",
      "Mamleshwar Temple",
      "Ahilyabai Holkar Rajwada (Maheshwar)",
      "Maheshwari Saree Market & Narmada Ghats"
    ],
    "inclusions": [
      "Sleeper Coach (2×2 AC Pushback/Sleeper Luxury Travel)",
      "1 Night Stay in Premium AC Hotel",
      "4-Person Sharing Rooms (Quad Sharing)",
      "2 Pure Vegetarian Meals per Day (Lunch & Dinner)",
      "Daily Morning Tea",
      "Fresh Breakfast Daily",
      "Packaged Drinking Water Provided During Meals",
      "Comprehensive Travel Insurance"
    ],
    "exclusions": [
      "Puja, Archana & Abhishek Charges",
      "VIP / Fast-track Darshan Passes",
      "Local Travel / Auto-Rickshaw / E-Rickshaw Charges",
      "Boating Charges",
      "Personal Expenses, Shopping & Extra Food"
    ],
    "terms": [
      "Booking is confirmed strictly upon receipt of the ₹2,999/- advance amount.",
      "Strict No Refund policy in case of cancellation.",
      "You can send another person in your place (ticket transfer permitted)."
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Mumbai Departure & Overnight Highway Journey to Ujjain",
        "description": "Depart from Mumbai in 2×2 AC Sleeper Coach. Overnight scenic drive towards MP with group fellowship.",
        "highlights": []
      },
      {
        "day": 2,
        "title": "Ujjain Mahakal, Kaal Bhairav, Shaktipeeths & Ramghat Aarti (AC Hotel Stay)",
        "description": "Darshan of Mahakaleshwar Jyotirlinga, Mahakal Lok Corridor, Kaal Bhairav, Shaktipeeths and Ramghat Aarti. AC hotel stay.",
        "highlights": []
      },
      {
        "day": 3,
        "title": "Omkareshwar Jyotirlinga, Mamleshwar & Maheshwar Rajwada",
        "description": "Darshan of Omkareshwar & Mamleshwar Jyotirlinga. Visit Ahilyabai Holkar Rajwada and Maheshwari Saree Market. Evening return coach boarding.",
        "highlights": []
      },
      {
        "day": 4,
        "title": "Highway Return Journey & Arrival in Mumbai",
        "description": "Day-long transit with morning tea, breakfast & pure veg meals. Safe arrival back in Mumbai on 19 October 2026.",
        "highlights": []
      }
    ],
    "batchDates": [
      {
        "id": "batch-mumbai-ujjain-oct-2026",
        "month": "October",
        "label": "16 Oct 2026 – 19 Oct 2026 (Mumbai to Mumbai)",
        "tag": "Special Spiritual Yatra 2026 • Lower ₹7,999 / Upper ₹7,499",
        "startDate": "2026-10-16",
        "endDate": "2026-10-19",
        "status": "available",
        "_id": "6af07157a7e7406a2ef3e5be"
      }
    ],
    "overview": "Seek the holy blessings of Lord Shiva on this 3-day spiritual pilgrimage (returning on 4th day) from Mumbai covering Ujjain Mahakaleshwar Jyotirlinga, Mahakal Corridor, Kaal Bhairav, Omkareshwar Jyotirlinga, Mamleshwar, and historic Maheshwar Rajwada traveling in 2×2 AC Sleeper Coach with 1 Night AC Hotel stay."
  },
  {
    "id": "pune-sanwaliya-seth-salasar-balaji-khatu-shyam",
    "slug": "pune-sanwaliya-seth-salasar-balaji-khatu-shyam",
    "title": "Pune to Sanwaliya Seth | Salasar Balaji Dham | Khatu Shyam Baba",
    "subtitle": "Special Spiritual Yatra 2026 • Pune to Pune • Sacred Darshan of Khatu Shyam Baba, Sanwaliya Seth & Salasar Balaji Dham",
    "destination": "Rajasthan & Madhya Pradesh",
    "state": "Rajasthan & Maharashtra",
    "durationDays": 3,
    "durationNights": 1,
    "durationLabel": "3 Days / 1 Nights",
    "datesLabel": "23 Oct 2026 – 26 Oct 2026 (Pune to Pune)",
    "basePrice": 7499,
    "priceDisplay": "₹7,499 per person",
    "depositPrice": 2999,
    "advanceLabel": "Advance: ₹2,999",
    "rating": 4.9,
    "reviewsCount": 140,
    "featured": true,
    "image": "/images/tours/khatu_shyam_salasar_tour.jpg",
    "gallery": [
      "/images/tours/khatu_shyam_salasar_tour.jpg"
    ],
    "sites": [
      "Khatu Shyam Baba (Rajasthan)",
      "Shri Sanwaliya Seth Mandir (Mandphiya)",
      "Salasar Balaji Dham (Hanuman Ji)"
    ],
    "inclusions": [
      "Sleeper Coach (2×2 AC Pushback/Sleeper Luxury Travel)",
      "1 Night Stay in Premium AC Hotel",
      "4-Person Sharing Rooms (Quad Sharing)",
      "2 Pure Vegetarian Meals per Day (Lunch & Dinner)",
      "Daily Morning Tea",
      "Fresh Breakfast Daily",
      "Packaged Drinking Water Provided During Meals",
      "Comprehensive Travel Insurance"
    ],
    "exclusions": [
      "Puja, Archana & Abhishek Charges",
      "VIP / Fast-track Darshan Passes",
      "Local Travel / Auto-Rickshaw / E-Rickshaw Charges",
      "Boating Charges",
      "Personal Expenses, Shopping & Extra Food"
    ],
    "terms": [
      "Booking is confirmed strictly upon receipt of the ₹2,999/- advance amount.",
      "Strict No Refund policy in case of cancellation.",
      "You can send another person in your place (ticket transfer permitted)."
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Pune Departure & Highway Journey to Sanwaliya Seth",
        "description": "Depart from Pune in luxury 2×2 AC Sleeper Coach towards Rajasthan with group devotion.",
        "highlights": []
      },
      {
        "day": 2,
        "title": "Sanwaliya Seth Darshan & Drive to Khatu Dham (AC Hotel Stay)",
        "description": "Darshan at miraculous Shri Sanwaliya Seth Mandir. Drive to Khatu, hotel check-in, dinner and night stay.",
        "highlights": []
      },
      {
        "day": 3,
        "title": "Khatu Shyam Baba Darshan, Salasar Balaji Dham & Return Boarding",
        "description": "Early morning holy darshan of Khatu Shyam Baba and Salasar Balaji Dham. Evening boarding AC coach for Pune.",
        "highlights": []
      },
      {
        "day": 4,
        "title": "Highway Return Journey & Safe Arrival in Pune",
        "description": "Comfortable transit with morning tea, breakfast & pure veg meals. Safe arrival back in Pune on 26 October 2026.",
        "highlights": []
      }
    ],
    "batchDates": [
      {
        "id": "batch-khatu-salasar-oct-2026",
        "month": "October",
        "label": "23 Oct 2026 – 26 Oct 2026 (Pune to Pune)",
        "tag": "Special Spiritual Yatra 2026 • Lower ₹8,499 / Upper ₹7,499",
        "startDate": "2026-10-23",
        "endDate": "2026-10-26",
        "status": "available",
        "_id": "6af07157a7e7406a2ef3e5b3"
      }
    ],
    "overview": "Embark on a sacred 3-day spiritual pilgrimage (returning on 4th day) from Pune covering holy Khatu Shyam Baba, miraculous Sanwaliya Seth Mandir, and revered Salasar Balaji Dham with 1 Night AC Hotel stay and 2×2 AC Sleeper Coach comfort."
  },
  {
    "id": "pune-to-2-jyotirlinga-yatra--ujjain-omkareshwar-maheshwar",
    "slug": "pune-to-2-jyotirlinga-yatra--ujjain-omkareshwar-maheshwar",
    "title": "pune to 2 Jyotirlinga Yatra – Ujjain, Omkareshwar, Maheshwar",
    "subtitle": "Mahakaleshwar Jyotirlinga, Mahakal Corridor, Shaktipeeths, Omkareshwar, Mamleshwar, Maheshwar Rajwada & Ghrishneshwar",
    "destination": "Ujjain & Omkareshwar",
    "state": "Madhya Pradesh & Maharashtra",
    "durationDays": 3,
    "durationNights": 2,
    "durationLabel": "3 Days / 2 Nights",
    "datesLabel": "16 Nov 2026 Onwards (14 Batches)",
    "basePrice": 5999,
    "priceDisplay": "₹5,999 per person",
    "depositPrice": 1999,
    "advanceLabel": "Advance: ₹1,999",
    "rating": 4.9,
    "reviewsCount": 140,
    "featured": true,
    "image": "/images/tours_travels_bg.jpg",
    "gallery": [
      "/images/tours_travels_bg.jpg"
    ],
    "sites": [
      "Mahakaleshwar Jyotirlinga",
      "Mahakal Corridor",
      "Harsiddhi Mata Shaktipeeth",
      "Bada Ganesh Temple",
      "Kaal Bhairav Temple",
      "Gadkalika Mata Shaktipeeth",
      "Mangalnath Temple",
      "Sandipani Ashram",
      "Ram Ghat",
      "Runmukteshwar Mahadev",
      "Omkareshwar Jyotirlinga",
      "Mamleshwar Temple",
      "Maheshwar Rajwada",
      "Maheshwar Ghat",
      "Ghrishneshwar Jyotirlinga"
    ],
    "inclusions": [
      "2*2 sleeper  AC Bus",
      "Hotel Stay (4-5 sharing)",
      "1 Veg Meal/Day",
      "Drinking Water",
      "Travel Insurance"
    ],
    "exclusions": [
      "Puja / Abhishek Charges",
      "VIP Darshan Pass",
      "Local Travel / Auto Rickshaw",
      "Boating Charges",
      "Personal Expenses & Shopping"
    ],
    "terms": [
      "Booking confirmed only after advance received",
      "No refund on cancellation",
      "Substitute traveler allowed"
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Ujjain Mahakal & Corridor Darshan",
        "description": "Mahakaleshwar Jyotirlinga, Mahakal Corridor, Shaktipeeths and Ram Ghat.",
        "highlights": []
      },
      {
        "day": 2,
        "title": "Omkareshwar Jyotirlinga & Maheshwar Rajwada",
        "description": "Omkareshwar Jyotirlinga, Mamleshwar, and Maheshwar Ghats.",
        "highlights": []
      },
      {
        "day": 3,
        "title": "Ghrishneshwar Jyotirlinga & Return",
        "description": "Ghrishneshwar Jyotirlinga darshan and return journey.",
        "highlights": []
      }
    ],
    "batchDates": [
      {
        "id": "batch-1793856594659",
        "month": "November",
        "label": "12 Nov 2026 – 15 Nov 2021",
        "tag": "Batch Special",
        "startDate": "2026-11-12",
        "endDate": "2021-11-15",
        "status": "full",
        "_id": "6aec1526e9d432feed11d110"
      },
      {
        "id": "batch-1794075175808",
        "month": "November",
        "label": "16 Nov 2026 – 19 Nov 2026",
        "tag": "Batch #2 (Mid Nov)",
        "startDate": "2026-11-16",
        "endDate": "2026-11-19",
        "status": "available",
        "_id": "6aef6d1f6d1889e3ab6f9d4e"
      },
      {
        "id": "batch-1794075244631",
        "month": "November",
        "label": "20 Nov 2026 – 23 Nov 2026",
        "tag": "Batch #2 (Mid Nov)",
        "startDate": "2026-11-20",
        "endDate": "2026-11-23",
        "status": "available",
        "_id": "6aef6d1f6d1889e3ab6f9d4f"
      },
      {
        "id": "batch-1794075280428",
        "month": "November",
        "label": "27 Nov 2026 – 30 Nov 2026",
        "tag": "Batch #3 (Late Nov)",
        "startDate": "2026-11-27",
        "endDate": "2026-11-30",
        "status": "available",
        "_id": "6aef6d1f6d1889e3ab6f9d50"
      },
      {
        "id": "batch-1794075340956",
        "month": "December",
        "label": "04 Dec 2026 – 07 Nov 2026",
        "tag": "Batch #1 (Early Dec)",
        "startDate": "2026-12-04",
        "endDate": "2026-11-07",
        "status": "available",
        "_id": "6aef6d1f6d1889e3ab6f9d51"
      },
      {
        "id": "batch-1794075375933",
        "month": "December",
        "label": "11 Dec 2026 – 14 Dec 2026",
        "tag": "Batch #1 (Early Dec)",
        "startDate": "2026-12-11",
        "endDate": "2026-12-14",
        "status": "available",
        "_id": "6aef6d1f6d1889e3ab6f9d52"
      },
      {
        "id": "batch-1794075460348",
        "month": "December",
        "label": "18 Dec 2026 – 21 Dec 2026",
        "tag": "Batch #2 (Mid Dec)",
        "startDate": "2026-12-18",
        "endDate": "2026-12-21",
        "status": "available",
        "_id": "6aef6d1f6d1889e3ab6f9d53"
      },
      {
        "id": "batch-1794075507720",
        "month": "December",
        "label": "25 Dec 2026 – 28 Dec 2026",
        "tag": "Batch #3 (Late Dec)",
        "startDate": "2026-12-25",
        "endDate": "2026-12-28",
        "status": "available",
        "_id": "6aef6d1f6d1889e3ab6f9d54"
      },
      {
        "id": "batch-1794075557173",
        "month": "December",
        "label": "25 Dec 2026 – 28 Dec 2026",
        "tag": "Batch #3 (Late Dec)",
        "startDate": "2026-12-25",
        "endDate": "2026-12-28",
        "status": "available",
        "_id": "6aef6d1f6d1889e3ab6f9d55"
      },
      {
        "id": "batch-1794075566207",
        "month": "December",
        "label": "25 Dec 2026 – 28 Dec 2026",
        "tag": "Batch #3 (Late Dec)",
        "startDate": "2026-12-25",
        "endDate": "2026-12-28",
        "status": "available",
        "_id": "6aef6d1f6d1889e3ab6f9d56"
      },
      {
        "id": "batch-1794075781991",
        "month": "January",
        "label": "01 Jan 2027 – 04 Jan 2027",
        "tag": "Batch #1 (Early Jan)",
        "startDate": "2027-01-01",
        "endDate": "2027-01-04",
        "status": "available",
        "_id": "6aef6d1f6d1889e3ab6f9d57"
      },
      {
        "id": "batch-1794075817912",
        "month": "January",
        "label": "08 Jan 2027 – 11 Jan 2027",
        "tag": "Batch #1 (Early Jan)",
        "startDate": "2027-01-08",
        "endDate": "2027-01-11",
        "status": "available",
        "_id": "6aef6d1f6d1889e3ab6f9d58"
      },
      {
        "id": "batch-1794075830631",
        "month": "January",
        "label": "15 Jan 2027 – 18 Jan 2027",
        "tag": "Batch #1 (Early Jan)",
        "startDate": "2027-01-15",
        "endDate": "2027-01-18",
        "status": "available",
        "_id": "6aef6d1f6d1889e3ab6f9d59"
      },
      {
        "id": "batch-1794075881813",
        "month": "January",
        "label": "29 Jan 2027 – 01 Feb 2027",
        "tag": "Batch #1 (Early Jan)",
        "startDate": "2027-01-29",
        "endDate": "2027-02-01",
        "status": "available",
        "_id": "6aef6d1f6d1889e3ab6f9d5a"
      }
    ],
    "overview": "Embark on a soul-cleansing 3-day spiritual pilgrimage covering 3 sacred Jyotirlingas (Mahakaleshwar, Omkareshwar, Ghrishneshwar) alongside 15 holy temples, Shaktipeeths, and majestic Maheshwar ghats with New Urbania Pushback AC comfort."
  },
  {
    "id": "pune-to-girnar-dwarka-somnath-jyotirlinga",
    "slug": "pune-to-girnar-dwarka-somnath-jyotirlinga",
    "title": "Pune to Girnar Mountain | Dwarka, Somnath Jyotirlinga | Statue of Unity",
    "subtitle": "Sacred Pilgrimage in One Trip • Girnar Mountain, Dwarkadhish, Bet Dwarka, Somnath Jyotirlinga, Nageshwar, Neelkanth Dham & Statue of Unity",
    "destination": "Girnar, Dwarka & Somnath",
    "state": "Gujarat",
    "durationDays": 6,
    "durationNights": 2,
    "durationLabel": "6 Days / 2 Nights",
    "datesLabel": "27 Nov 2026 – 03 Dec 2026 (Pune to Pune)",
    "basePrice": 11999,
    "priceDisplay": "₹11,999 per person",
    "depositPrice": 2999,
    "advanceLabel": "Advance: ₹2,999",
    "rating": 4.9,
    "reviewsCount": 140,
    "featured": true,
    "image": "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?q=80&w=1200&auto=format&fit=crop",
    "gallery": [
      "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596707328905-234b3e811c75?q=80&w=1200&auto=format&fit=crop"
    ],
    "sites": [
      "Girnar Mountain (Guru Dattatreya & Ambaji Darshan)",
      "Dwarkadhish Temple (Dwarka)",
      "Bet Dwarka (Island & Holy Shrine)",
      "Shree Somnath Jyotirlinga Temple",
      "Nageshwar Jyotirlinga Temple",
      "Neelkanth Dham (Swaminarayan Temple, Poicha)",
      "Statue of Sardar Vallabhbhai Patel (Statue of Unity)",
      "Gomti Ghat & Sudama Setu (Dwarka)",
      "Bhalka Tirth (Lord Krishna Sacred Site)",
      "Junagadh Heritage & Girnar Foothills"
    ],
    "inclusions": [
      "Sleeper Coach (2×2 AC Pushback/Sleeper Bus Travel)",
      "Overnight Stay in Comfortable AC Hotels (2 Nights Accommodation)",
      "4-Person Sharing Rooms",
      "2 Meals per Day (Pure Vegetarian Lunch & Dinner)",
      "Daily Morning Tea",
      "Daily Morning Breakfast",
      "Daily Morning Access to Hotel Facilities for Bathing & Fresh-up",
      "Drinking Water Provided During Meals",
      "Comprehensive Travel Insurance"
    ],
    "exclusions": [
      "Girnar Ropeway Ticket Charges",
      "Puja / Abhishek Rituals & Special Offerings",
      "VIP / Fast-track Darshan Passes",
      "Local Transport / Rickshaw Fares",
      "Boating Charges at Bet Dwarka",
      "Personal Expenses, Laundry & Shopping"
    ],
    "terms": [
      "Booking is confirmed strictly upon receipt of the ₹2,999/- advance payment.",
      "Strict No Refund policy in case of cancellation.",
      "You may send another person in your place (ticket transfer permitted).",
      "Seats are limited – secure your spot today!"
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Pune Departure & Highway Journey towards Gujarat",
        "description": "Depart in the evening from Pune (Katraj / Mastan Hotel / Swargate) in comfortable 2×2 AC Sleeper Coach. Enjoy scenic highway travel towards Gujarat with devotional group ambiance.",
        "highlights": []
      },
      {
        "day": 2,
        "title": "Neelkanth Dham (Poicha) & Statue of Unity Sightseeing",
        "description": "Morning hotel fresh-up and breakfast. Visit the magnificent Neelkanth Dham Swaminarayan Temple in Poicha. Proceed to marvel at the world-famous Statue of Sardar Vallabhbhai Patel (Statue of Unity). Evening journey towards Dwarka.",
        "highlights": []
      },
      {
        "day": 3,
        "title": "Dwarkadhish Temple, Gomti Ghat, Nageshwar Jyotirlinga & Bet Dwarka",
        "description": "Morning arrival in holy Dwarka and check-in to AC hotel. Experience divine blessings at Dwarkadhish Mandir and Gomti Ghat. Visit sacred Nageshwar Jyotirlinga and take a boat ferry to holy Bet Dwarka Island. Overnight stay in AC hotel at Dwarka.",
        "highlights": []
      },
      {
        "day": 4,
        "title": "Somnath Jyotirlinga, Bhalka Tirth & Evening Sound and Light Show",
        "description": "Morning breakfast and drive to Prabhas Patan, Somnath. Visit sacred Bhalka Tirth. Seek divine darshan at the 1st Jyotirlinga Shree Somnath Mahadev Temple, followed by the enchanting evening Aarti and Sound & Light Show by the Arabian Sea. Overnight stay in AC hotel at Somnath.",
        "highlights": []
      },
      {
        "day": 5,
        "title": "Junagadh & Sacred Girnar Mountain Darshan (Dattatreya & Ambaji)",
        "description": "Morning arrival at the foothills of holy Girnar Mountain in Junagadh. Ascend by ropeway or steps to seek divine darshan of Shri Ambaji Mata and Guru Dattatreya Holy Padukas. Evening departure on the return highway journey towards Pune.",
        "highlights": []
      },
      {
        "day": 6,
        "title": "Return Highway Journey & Safe Arrival in Pune",
        "description": "Day-long highway journey with morning tea, fresh breakfast, and pure vegetarian meals provided en route. Safe and blessed arrival back in Pune. Har Har Mahadev!",
        "highlights": []
      }
    ],
    "batchDates": [
      {
        "id": "batch-girnar-nov-2026",
        "month": "November",
        "label": "27 Nov 2026 – 03 Dec 2026 (Pune to Pune)",
        "tag": "Special Gujarat Pilgrimage 2026 • Lower ₹12,999 / Upper ₹11,999",
        "startDate": "2026-11-27",
        "endDate": "2026-12-03",
        "status": "available",
        "_id": "6af07158a7e7406a2ef3e5e7"
      }
    ],
    "overview": "Embark on a divine 6-day spiritual pilgrimage from Pune covering sacred Girnar Mountain, Dwarkadhish Temple, Bet Dwarka, Somnath Jyotirlinga, Nageshwar Jyotirlinga, Neelkanth Dham, and the iconic Statue of Sardar Vallabhbhai Patel traveling comfortably in 2×2 AC Sleeper Coach with 2 Nights AC Hotel Stay and pure vegetarian meals."
  },
  {
    "id": "pune-to-sanwaliya-seth---khatu-shyam-babaujjain-mahakal",
    "slug": "pune-to-sanwaliya-seth---khatu-shyam-babaujjain-mahakal",
    "title": "Pune to Sanwaliya Seth  | Khatu Shyam Baba/ujjain mahakal",
    "subtitle": "Special Spiritual Yatra 2026 • Pune to Pune • Sacred Darshan of Khatu Shyam Baba, Sanwaliya Seth & Salasar Balaji Dham",
    "destination": "Rajasthan & Madhya Pradesh",
    "state": "Rajasthan & Maharashtra",
    "durationDays": 3,
    "durationNights": 1,
    "durationLabel": "3 Days / 1 Nights",
    "datesLabel": "23 Oct 2026 – 26 Oct 2026 (Pune to Pune)",
    "basePrice": 7999,
    "priceDisplay": "₹7,999 per person",
    "depositPrice": 2999,
    "advanceLabel": "Advance: ₹2,999",
    "rating": 4.9,
    "reviewsCount": 140,
    "featured": true,
    "image": "/images/tours/khatu_shyam_salasar_tour.jpg",
    "gallery": [
      "/images/tours/khatu_shyam_salasar_tour.jpg"
    ],
    "sites": [
      "Khatu Shyam Baba (Rajasthan)",
      "Shri Sanwaliya Seth Mandir (Mandphiya)",
      "Salasar Balaji Dham (Hanuman Ji)"
    ],
    "inclusions": [
      "Sleeper Coach (2×2 AC Pushback/Sleeper Luxury Travel)",
      "1 Night Stay in Premium AC Hotel",
      "4-Person Sharing Rooms (Quad Sharing)",
      "2 Pure Vegetarian Meals per Day (Lunch & Dinner)",
      "Daily Morning Tea",
      "Fresh Breakfast Daily",
      "Packaged Drinking Water Provided During Meals",
      "Comprehensive Travel Insurance"
    ],
    "exclusions": [
      "Puja, Archana & Abhishek Charges",
      "VIP / Fast-track Darshan Passes",
      "Local Travel / Auto-Rickshaw / E-Rickshaw Charges",
      "Boating Charges",
      "Personal Expenses, Shopping & Extra Food"
    ],
    "terms": [
      "Booking is confirmed strictly upon receipt of the ₹2,999/- advance amount.",
      "Strict No Refund policy in case of cancellation.",
      "You can send another person in your place (ticket transfer permitted)."
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Pune Departure & Highway Journey to Sanwaliya Seth",
        "description": "Depart from Pune in luxury 2×2 AC Sleeper Coach towards Rajasthan with group devotion.",
        "highlights": []
      },
      {
        "day": 2,
        "title": "Sanwaliya Seth Darshan & Drive to Khatu Dham (AC Hotel Stay)",
        "description": "Darshan at miraculous Shri Sanwaliya Seth Mandir. Drive to Khatu, hotel check-in, dinner and night stay.",
        "highlights": []
      },
      {
        "day": 3,
        "title": "Khatu Shyam Baba Darshan, Salasar Balaji Dham & Return Boarding",
        "description": "Early morning holy darshan of Khatu Shyam Baba and Salasar Balaji Dham. Evening boarding AC coach for Pune.",
        "highlights": []
      },
      {
        "day": 4,
        "title": "Highway Return Journey & Safe Arrival in Pune",
        "description": "Comfortable transit with morning tea, breakfast & pure veg meals. Safe arrival back in Pune on 26 October 2026.",
        "highlights": []
      }
    ],
    "batchDates": [
      {
        "id": "batch-khatu-salasar-oct-2026",
        "month": "October",
        "label": "23 Oct 2026 – 26 Oct 2026 (Pune to Pune)",
        "tag": "Special Spiritual Yatra 2026 • Lower ₹8,499 / Upper ₹7,499",
        "startDate": "2026-10-23",
        "endDate": "2026-10-26",
        "status": "full",
        "_id": "6aef60a86d1889e3ab6f479b"
      },
      {
        "id": "batch-1794076974610",
        "month": "November",
        "label": "04 Dec 2026 – 07 Dec 2026",
        "tag": "Batch #1 (Late nov )",
        "startDate": "2026-12-04",
        "endDate": "2026-12-07",
        "status": "available",
        "_id": "6aef71316d1889e3ab6fcdba"
      }
    ],
    "overview": "Embark on a sacred 3-day spiritual pilgrimage (returning on 4th day) from Pune covering holy Khatu Shyam Baba, miraculous Sanwaliya Seth Mandir, and revered Salasar Balaji Dham with 1 Night AC Hotel stay and 2×2 AC Sleeper Coach comfort."
  },
  {
    "id": "south-india-premium-mysore-ooty-munnar-thekkady-alleppey-kochi",
    "slug": "south-india-premium-mysore-ooty-munnar-thekkady-alleppey-kochi",
    "title": "South India Premium Tour – Mysore, Ooty, Pollachi, Munnar, Thekkady, Alleppey, Kochi",
    "subtitle": "Experience royal Mysore, chilly Ooty hills, lush Munnar tea gardens, Thekkady wilderness & serene Alleppey backwaters in AC Urbania comfort",
    "destination": "Mysore, Ooty & Kerala",
    "state": "Karnataka, Tamil Nadu & Kerala",
    "durationDays": 7,
    "durationNights": 4,
    "durationLabel": "7 Days / 4 Nights",
    "datesLabel": "01 Oct 2026 – 08 Oct 2026",
    "basePrice": 15999,
    "priceDisplay": "₹15,999 per person",
    "depositPrice": 4999,
    "advanceLabel": "Advance: ₹4,999",
    "rating": 4.9,
    "reviewsCount": 140,
    "featured": true,
    "image": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000&auto=format&fit=crop",
    "gallery": [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600100397800-47b2511475e1?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=1000&auto=format&fit=crop"
    ],
    "sites": [
      "Magnificent Mysore Palace",
      "Chamundeshwari Temple & Chamundi Hills",
      "Beautiful Brindavan Gardens",
      "Ooty Lake & Picturesque Boating",
      "Botanical Garden & Doddabetta Peak",
      "Pine Forest & Nilgiri Tea Gardens",
      "Pollachi Coconut Groves & Mountain Ghat Roads",
      "Mattupetty Dam & Echo Point",
      "Kundala Lake & Munnar Tea Museum",
      "Periyar Wildlife Sanctuary Region & Spice Plantations",
      "Alleppey Famous Backwaters Sightseeing & Boating",
      "Fort Kochi, Marine Drive & Chinese Fishing Nets",
      "St. Francis Church & Kochi City Shopping"
    ],
    "inclusions": [
      "Round-trip travel from Pune to Pune by AC Urbania (Pushback seats)",
      "Dedicated comfortable vehicle for the entire itinerary",
      "Minimum 4 nights stay in clean, quality family hotels (5th night stay subject to schedule)",
      "Room accommodation on 3 to 4 sharing basis",
      "Sightseeing as per the itinerary",
      "Driver allowance, toll charges, parking fees, and state entry permits",
      "Complete tour planning and guidance throughout the trip"
    ],
    "exclusions": [
      "Daily breakfast, lunch, and dinner",
      "Entry tickets for boating, safaris, monuments, and viewpoints",
      "Personal shopping, laundry, and individual expenses",
      "Additional sightseeing spots not mentioned in the itinerary",
      "Any extra costs arising from weather, traffic delays, or natural causes"
    ],
    "terms": [
      "The hotel stay covers a minimum of 4 nights; a 5th night stay may be added based on route timing and conditions.",
      "Accommodation will be on a 3 to 4 persons per room basis.",
      "Seats will be confirmed only upon payment of the ₹4,999/- advance booking amount.",
      "Remaining tour balance must be cleared before the designated date prior to departure.",
      "The order of sightseeing points may change based on traffic, weather, or local circumstances.",
      "All travelers must carry a valid government-issued photo ID.",
      "Please carry necessary warm clothing and personal medications for high-altitude areas.",
      "Bookings are accepted on a first-come, first-served basis due to limited seats (15 seats only)."
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Thursday Night Departure from Pune to Mysore",
        "description": "Depart comfortably on Thursday night (01 October 2026) from Pune in New AC Urbania with Pushback seats. Overnight journey to Karnataka.",
        "highlights": []
      },
      {
        "day": 2,
        "title": "Arrival in Royal Mysore – Palace, Chamundeshwari & Brindavan Gardens",
        "description": "Arrive in Mysore. Hotel check-in. Visit Mysore Palace, Chamundeshwari Temple atop Chamundi Hills, and illuminated Brindavan Gardens.",
        "highlights": []
      },
      {
        "day": 3,
        "title": "Mysore to Ooty – Queen of Hill Stations & Tea Gardens",
        "description": "Scenic drive ascending Nilgiri Ghats. Visit Doddabetta Peak, Botanical Garden, Pine Forest, Ooty Lake boating, and tea plantations.",
        "highlights": []
      },
      {
        "day": 4,
        "title": "Ooty to Munnar via Pollachi Coconut Groves & Waterfalls",
        "description": "Drive through scenic Pollachi coconut plantations, waterfalls, and ghats into Munnar tea paradise. Hotel check-in.",
        "highlights": []
      },
      {
        "day": 5,
        "title": "Munnar Sightseeing to Thekkady Spice Trails",
        "description": "Explore Mattupetty Dam, Echo Point, Kundala Lake, and Munnar Tea Museum. Proceed to Thekkady for spice plantation tour and shopping.",
        "highlights": []
      },
      {
        "day": 6,
        "title": "Thekkady to Alleppey Backwaters Boating & Fort Kochi",
        "description": "Alleppey backwaters boating experience. Afternoon transfer to Kochi for Fort Kochi, Chinese Fishing Nets, and Marine Drive.",
        "highlights": []
      },
      {
        "day": 7,
        "title": "Kochi City Heritage & Return Journey to Pune",
        "description": "Visit St. Francis Church and local markets. Return journey in AC Urbania, arriving in Pune on Thursday morning, 8 October 2026.",
        "highlights": []
      }
    ],
    "batchDates": [
      {
        "id": "batch-south-india-oct-2026",
        "month": "October",
        "label": "01 Oct 2026 – 08 Oct 2026 (Pune to Pune)",
        "tag": "Limited 15 Seats • Premium AC Urbania",
        "startDate": "2026-10-01",
        "endDate": "2026-10-08",
        "status": "available",
        "_id": "6af07157a7e7406a2ef3e5d6"
      }
    ],
    "overview": "Experience the royal heritage of Mysore, the chilly breeze of Ooty, the lush tea gardens of Munnar, the wilderness of Thekkady, and the serene backwaters of Alleppey—all in one premium 7-day tour package traveling Pune to Pune by comfortable AC Urbania (Pushback seats) for only 15 travelers."
  },
  {
    "id": "tirupati-balaji-srisailam-jyotirlinga-kolhapur-mahalakshmi",
    "slug": "tirupati-balaji-srisailam-jyotirlinga-kolhapur-mahalakshmi",
    "title": "Tirupati Balaji, Srisailam Jyotirlinga, Mahanandi, Kolhapur Mahalakshmi",
    "subtitle": "Lord Venkateswara Tirupati Balaji, Mallikarjuna Srisailam Jyotirlinga, Kalahasti Rahu-Ketu, Mahanandi & Kolhapur Mahalakshmi",
    "destination": "Tirupati & Srisailam",
    "state": "Andhra Pradesh & Maharashtra",
    "durationDays": 6,
    "durationNights": 5,
    "durationLabel": "6 Days / 5 Nights",
    "datesLabel": "Upcoming Departures",
    "basePrice": 10999,
    "priceDisplay": "₹10,999 per person",
    "depositPrice": 2999,
    "advanceLabel": "Advance: ₹2,999",
    "rating": 4.9,
    "reviewsCount": 140,
    "featured": true,
    "image": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop",
    "gallery": [
      "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop"
    ],
    "sites": [
      "Srisailam Jyotirlinga",
      "Mahanandi Temple",
      "Kalahasti Temple",
      "Tirupati Balaji Temple",
      "Padmavati Ammavari Temple",
      "Kolhapur Mahalakshmi Temple"
    ],
    "inclusions": [
      "New Urbania AC Pushback Bus",
      "Hotel Stay (4 sharing)",
      "Daily Morning Tea",
      "Drinking Water",
      "Travel Insurance"
    ],
    "exclusions": [
      "Puja / Abhishek Charges",
      "VIP Darshan Pass",
      "Local Travel / Auto Rickshaw",
      "Boating Charges",
      "Personal Expenses / Shopping"
    ],
    "terms": [
      "Booking confirmed only after advance received",
      "No refund on cancellation",
      "Substitute traveler allowed"
    ],
    "itinerary": [
      {
        "day": 1,
        "title": "Departure & Kolhapur Mahalakshmi Darshan",
        "description": "Kolhapur Mahalakshmi Ambabai Temple darshan.",
        "highlights": []
      },
      {
        "day": 2,
        "title": "Srisailam Mallikarjuna Jyotirlinga",
        "description": "Mallikarjuna Swamy Jyotirlinga and Bhramaramba Devi.",
        "highlights": []
      },
      {
        "day": 3,
        "title": "Mahanandi Temple & Kalahasti Drive",
        "description": "Mahanandi Pushkarini and drive to Kalahasti.",
        "highlights": []
      },
      {
        "day": 4,
        "title": "Srikalahasti Temple & Tirupati Arrival",
        "description": "Srikalahasteeswara Vayu Lingam darshan.",
        "highlights": []
      },
      {
        "day": 5,
        "title": "Tirumala Tirupati Balaji & Padmavati",
        "description": "Lord Venkateswara Balaji and Padmavati Ammavari.",
        "highlights": []
      },
      {
        "day": 6,
        "title": "Return Journey to Pune",
        "description": "Return journey with holy prasad.",
        "highlights": []
      }
    ],
    "batchDates": [],
    "overview": "Embark on a sanctified South Indian pilgrimage to seek the divine blessings of Lord Venkateswara at Tirupati Balaji, Sri Mallikarjuna Jyotirlinga at Srisailam, Srikalahasti, and Kolhapur Mahalakshmi Mata traveling comfortably in New Urbania AC Pushback Bus."
  }
];
