import { AdminUser, Setting, PromoCode, TourDestination, TourPackage, FleetCategory, Vehicle, TourBooking, FleetBooking, TourInquiry, FleetInquiry } from '../models';
import { hashPassword } from '../middlewares/auth.middleware';

export const seedDatabase = async (): Promise<void> => {
  try {
    // 1. Seed & Update Admin Users (2 Super Admins + 1 Viewer)
    const hashedSuperAdmin = await hashPassword('Admin@123');
    const hashedViewer = await hashPassword('Viewer@123');

    // Super Admin 1: Primary Admin
    const existingSuperAdmin1 = await AdminUser.findOne({ email: 'admin@aarambhatravels.in' });
    if (!existingSuperAdmin1) {
      await AdminUser.create({
        name: 'Kushal Parakh',
        email: 'admin@aarambhatravels.in',
        hashedPassword: hashedSuperAdmin,
        role: 'superadmin',
        isActive: true,
      });
      console.log('[Seed] Superadmin 1 created: admin@aarambhatravels.in / Admin@123');
    } else {
      existingSuperAdmin1.role = 'superadmin';
      await existingSuperAdmin1.save();
    }

    // Super Admin 2: Operations Super Admin
    const existingSuperAdmin2 = await AdminUser.findOne({ email: 'admin2@aarambhatravels.in' });
    if (!existingSuperAdmin2) {
      await AdminUser.create({
        name: 'Pravin (Operations Head)',
        email: 'admin2@aarambhatravels.in',
        hashedPassword: hashedSuperAdmin,
        role: 'superadmin',
        isActive: true,
      });
      console.log('[Seed] Superadmin 2 created: admin2@aarambhatravels.in / Admin@123');
    } else {
      existingSuperAdmin2.role = 'superadmin';
      await existingSuperAdmin2.save();
    }

    // Viewer 1: Booking Viewer
    const existingViewer1 = await AdminUser.findOne({ email: 'viewer1@aarambhatravels.in' });
    if (!existingViewer1) {
      await AdminUser.create({
        name: 'Booking Viewer',
        email: 'viewer1@aarambhatravels.in',
        hashedPassword: hashedViewer,
        role: 'viewer',
        isActive: true,
      });
      console.log('[Seed] Viewer 1 created: viewer1@aarambhatravels.in / Viewer@123');
    } else {
      existingViewer1.role = 'viewer';
      await existingViewer1.save();
    }

    // Remove legacy viewer2 if exists to maintain exactly 2 Super Admins + 1 Viewer
    await AdminUser.deleteOne({ email: 'viewer2@aarambhatravels.in' });

    // 2. Seed Default Settings
    const settingCount = await Setting.countDocuments();
    if (settingCount === 0) {
      await Setting.create([
        { key: 'business_name', value: 'Aarambha Tours & Travels + Self-Drive Rentals', category: 'general' },
        { key: 'contact_phone', value: '+91 82082 11478', category: 'general' },
        { key: 'contact_email', value: 'support@aarambha.in', category: 'general' },
        { key: 'business_address', value: 'Green Hills Society, Katraj, Pune - 411046, Maharashtra', category: 'general' },
      ]);
      console.log('[Seed] Initial settings created');
    }

    // 3. Seed Tour Destinations & Packages (Upsert to always stay up-to-date)
    await TourPackage.deleteMany({ $or: [{ slug: /pune-to-kerala/i }, { title: /pune to kerala/i }] });
    let destUjjain = await TourDestination.findOne({ name: 'Ujjain & Omkareshwar' });
    if (!destUjjain) {
      destUjjain = await TourDestination.create({
        name: 'Ujjain & Omkareshwar',
        state: 'Madhya Pradesh',
        country: 'India',
        description: 'Sacred Jyotirlinga temples, Mahakal Corridor, and Narmada ghats.',
        imageUrl: '/images/tours_travels_bg.jpg',
      });
    }

    let destMathura = await TourDestination.findOne({ name: 'Mathura & Vrindavan' });
    if (!destMathura) {
      destMathura = await TourDestination.create({
        name: 'Mathura & Vrindavan',
        state: 'Uttar Pradesh',
        country: 'India',
        description: 'Divine Braj Bhoomi, Krishna Janmabhoomi, Prem Mandir, and Khatu Shyam.',
        imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800&auto=format&fit=crop',
      });
    }

    let destTirupati = await TourDestination.findOne({ name: 'Tirupati & Srisailam' });
    if (!destTirupati) {
      destTirupati = await TourDestination.create({
        name: 'Tirupati & Srisailam',
        state: 'Andhra Pradesh',
        country: 'India',
        description: 'Lord Venkateswara Balaji, Srisailam Mallikarjuna Jyotirlinga, and Kolhapur Mahalakshmi.',
        imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop',
      });
    }

    let destSouthIndia = await TourDestination.findOne({ name: 'Mysore, Ooty & Kerala' });
    if (!destSouthIndia) {
      destSouthIndia = await TourDestination.create({
        name: 'Mysore, Ooty & Kerala',
        state: 'Karnataka, Tamil Nadu & Kerala',
        country: 'India',
        description: 'Royal Mysore Palace, chilly Ooty hills, Munnar tea plantations, Thekkady wildlife, and Alleppey backwaters.',
        imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop',
      });
    }

    const defaultPackages = [
      {
        slug: '3-jyotirlinga-yatra-ujjain-omkareshwar-ghrishneshwar',
        title: '3 Jyotirlinga Yatra – Ujjain, Omkareshwar, Ghrishneshwar, Maheshwar',
        subtitle: 'Mahakaleshwar Jyotirlinga, Mahakal Corridor, Shaktipeeths, Omkareshwar, Mamleshwar, Maheshwar Rajwada & Ghrishneshwar',
        description: 'Holy Darshan of 3 Sacred Jyotirlingas, 15 Temples & Shaktipeeths with New Urbania Pushback AC comfort.',
        overview: 'Embark on a soul-cleansing 3-day spiritual pilgrimage covering 3 sacred Jyotirlingas (Mahakaleshwar, Omkareshwar, Ghrishneshwar) alongside 15 holy temples, Shaktipeeths, and majestic Maheshwar ghats with New Urbania Pushback AC comfort.',
        durationDays: 3,
        durationNights: 2,
        basePrice: 6499,
        depositPrice: 1999,
        destinationId: destUjjain._id,
        destination: 'Ujjain & Omkareshwar',
        state: 'Madhya Pradesh & Maharashtra',
        images: ['/images/tours_travels_bg.jpg'],
        sites: ['Mahakaleshwar Jyotirlinga', 'Mahakal Corridor', 'Harsiddhi Mata Shaktipeeth', 'Bada Ganesh Temple', 'Kaal Bhairav Temple', 'Gadkalika Mata Shaktipeeth', 'Mangalnath Temple', 'Sandipani Ashram', 'Ram Ghat', 'Runmukteshwar Mahadev', 'Omkareshwar Jyotirlinga', 'Mamleshwar Temple', 'Maheshwar Rajwada', 'Maheshwar Ghat', 'Ghrishneshwar Jyotirlinga'],
        inclusions: ['New Urbania Pushback AC Bus', 'Hotel Stay (4-5 sharing)', '1 Veg Meal/Day', 'Drinking Water', 'Travel Insurance'],
        exclusions: ['Puja / Abhishek Charges', 'VIP Darshan Pass', 'Local Travel / Auto Rickshaw', 'Boating Charges', 'Personal Expenses & Shopping'],
        terms: ['Booking confirmed only after advance received', 'No refund on cancellation', 'Substitute traveler allowed'],
        itineraries: [
          { dayNumber: 1, title: 'Ujjain Mahakal & Corridor Darshan', description: 'Mahakaleshwar Jyotirlinga, Mahakal Corridor, Shaktipeeths and Ram Ghat.', meals: 'Veg Meal', stayDetails: 'Ujjain Hotel' },
          { dayNumber: 2, title: 'Omkareshwar Jyotirlinga & Maheshwar Rajwada', description: 'Omkareshwar Jyotirlinga, Mamleshwar, and Maheshwar Ghats.', meals: 'Veg Meal', stayDetails: 'Hotel Stay' },
          { dayNumber: 3, title: 'Ghrishneshwar Jyotirlinga & Return', description: 'Ghrishneshwar Jyotirlinga darshan and return journey.', meals: 'Veg Meal', stayDetails: 'Return Transfer' },
        ],
      },
      {
        slug: 'krishna-yatra-vrindavan-mathura-khatu-shyam-ujjain',
        title: 'Krishna Yatra – Vrindavan, Mathura, Khatu Shyam Baba, Ujjain Mahakal',
        subtitle: 'Divine Braj Bhoomi, Krishna Janmabhoomi, Prem Mandir, Banke Bihari, Barsana, Khatu Shyam, Agra Taj Mahal & Mahakaleshwar',
        description: 'Divine Braj Bhoomi pilgrimage with Khatu Shyam Baba, Taj Mahal, and Ujjain Mahakal in 2x2 AC Sleeper Coach.',
        overview: 'Experience the divine grace of Lord Krishna across sacred Mathura-Vrindavan, Banke Bihari, Prem Mandir, and Barsana, complemented by powerful blessings at Khatu Shyam Baba, Taj Mahal Agra, and Ujjain Mahakal Jyotirlinga in 2x2 AC Sleeper Coach luxury.',
        durationDays: 6,
        durationNights: 3,
        basePrice: 12999,
        depositPrice: 2999,
        destinationId: destMathura._id,
        destination: 'Mathura & Vrindavan',
        state: 'Uttar Pradesh & Rajasthan',
        images: ['https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800&auto=format&fit=crop'],
        sites: ['Mathura-Vrindavan', 'Krishna Janmabhoomi', 'Prem Mandir', 'Banke Bihari Temple', 'Vrindavan Chardham', 'Barsana Radha Rani', 'Khatu Shyam Baba', 'Ujjain Mahakaleshwar', 'Kaal Bhairav Temple', 'Omkareshwar Jyotirlinga', 'Mamleshwar Temple', 'Sawariya Seth Mandir', 'Agra Taj Mahal', 'Maa Baglamukhi Temple'],
        inclusions: ['Sleeper Coach (2x2 AC)', '3 Nights AC Hotel (4 sharing)', '2 Meals/Day', 'Tea & Breakfast', 'Drinking Water', 'Travel Insurance'],
        exclusions: ['Puja / Abhishek Charges', 'VIP Darshan Pass', 'Local Travel / Auto Rickshaw / E-Rickshaw', 'Boating Charges', 'Personal Expenses / Shopping'],
        terms: ['Booking confirmed only after advance received', 'No refund on cancellation', 'Substitute traveler allowed'],
        itineraries: [
          { dayNumber: 1, title: 'Departure & Ujjain Mahakal Darshan', description: 'Mahakaleshwar, Kaal Bhairav, and Omkareshwar.', meals: 'Meals Provided', stayDetails: 'AC Sleeper Coach' },
          { dayNumber: 2, title: 'Sawariya Seth Mandir & Mathura Transfer', description: 'Sawariya Seth darshan and travel to Braj.', meals: 'Meals Provided', stayDetails: 'AC Hotel' },
          { dayNumber: 3, title: 'Mathura Janmabhoomi, Prem Mandir & Banke Bihari', description: 'Krishna Janmabhoomi, Prem Mandir, Banke Bihari.', meals: 'Meals Provided', stayDetails: 'AC Hotel' },
          { dayNumber: 4, title: 'Vrindavan Chardham, Barsana & Agra Taj Mahal', description: 'Barsana Radha Rani and Taj Mahal.', meals: 'Meals Provided', stayDetails: 'AC Hotel' },
          { dayNumber: 5, title: 'Khatu Shyam Baba & Maa Baglamukhi', description: 'Khatu Shyam Baba and Maa Baglamukhi darshan.', meals: 'Meals Provided', stayDetails: 'AC Sleeper Coach' },
          { dayNumber: 6, title: 'Blessed Return', description: 'Return journey with divine memories.', meals: 'Breakfast', stayDetails: 'Return Transfer' },
        ],
      },
      {
        slug: 'tirupati-balaji-srisailam-jyotirlinga-kolhapur-mahalakshmi',
        title: 'Tirupati Balaji, Srisailam Jyotirlinga, Mahanandi, Kolhapur Mahalakshmi',
        subtitle: 'Lord Venkateswara Tirupati Balaji, Mallikarjuna Srisailam Jyotirlinga, Kalahasti Rahu-Ketu, Mahanandi & Kolhapur Mahalakshmi',
        description: 'Grand South India Pilgrimage with Lord Venkateswara Balaji, Srisailam Jyotirlinga, and Kolhapur Mahalakshmi in New Urbania AC Pushback Bus.',
        overview: 'Embark on a sanctified South Indian pilgrimage to seek the divine blessings of Lord Venkateswara at Tirupati Balaji, Sri Mallikarjuna Jyotirlinga at Srisailam, Srikalahasti, and Kolhapur Mahalakshmi Mata traveling comfortably in New Urbania AC Pushback Bus.',
        durationDays: 6,
        durationNights: 5,
        basePrice: 10999,
        depositPrice: 2999,
        destinationId: destTirupati._id,
        destination: 'Tirupati & Srisailam',
        state: 'Andhra Pradesh & Maharashtra',
        images: ['https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop'],
        sites: ['Srisailam Jyotirlinga', 'Mahanandi Temple', 'Kalahasti Temple', 'Tirupati Balaji Temple', 'Padmavati Ammavari Temple', 'Kolhapur Mahalakshmi Temple'],
        inclusions: ['New Urbania AC Pushback Bus', 'Hotel Stay (4 sharing)', 'Daily Morning Tea', 'Drinking Water', 'Travel Insurance'],
        exclusions: ['Puja / Abhishek Charges', 'VIP Darshan Pass', 'Local Travel / Auto Rickshaw', 'Boating Charges', 'Personal Expenses / Shopping'],
        terms: ['Booking confirmed only after advance received', 'No refund on cancellation', 'Substitute traveler allowed'],
        itineraries: [
          { dayNumber: 1, title: 'Departure & Kolhapur Mahalakshmi Darshan', description: 'Kolhapur Mahalakshmi Ambabai Temple darshan.', meals: 'Tea', stayDetails: 'Urbania AC' },
          { dayNumber: 2, title: 'Srisailam Mallikarjuna Jyotirlinga', description: 'Mallikarjuna Swamy Jyotirlinga and Bhramaramba Devi.', meals: 'Tea', stayDetails: 'Srisailam Hotel' },
          { dayNumber: 3, title: 'Mahanandi Temple & Kalahasti Drive', description: 'Mahanandi Pushkarini and drive to Kalahasti.', meals: 'Tea', stayDetails: 'Hotel Stay' },
          { dayNumber: 4, title: 'Srikalahasti Temple & Tirupati Arrival', description: 'Srikalahasteeswara Vayu Lingam darshan.', meals: 'Tea', stayDetails: 'Tirupati Hotel' },
          { dayNumber: 5, title: 'Tirumala Tirupati Balaji & Padmavati', description: 'Lord Venkateswara Balaji and Padmavati Ammavari.', meals: 'Tea', stayDetails: 'Tirupati Hotel' },
          { dayNumber: 6, title: 'Return Journey to Pune', description: 'Return journey with holy prasad.', meals: 'Tea', stayDetails: 'Return Transfer' },
        ],
      },
      {
        slug: 'south-india-premium-mysore-ooty-munnar-thekkady-alleppey-kochi',
        title: 'South India Premium Tour – Mysore, Ooty, Pollachi, Munnar, Thekkady, Alleppey, Kochi',
        subtitle: 'Experience royal Mysore, chilly Ooty hills, lush Munnar tea gardens, Thekkady wilderness & serene Alleppey backwaters in AC Urbania comfort',
        description: 'Experience the royal heritage of Mysore, the chilly breeze of Ooty, the lush tea gardens of Munnar, the wilderness of Thekkady, and the serene backwaters of Alleppey—all in one premium 7-day tour package traveling Pune to Pune by comfortable AC Urbania (Pushback seats) for only 15 travelers.',
        overview: 'Experience the royal heritage of Mysore, the chilly breeze of Ooty, the lush tea gardens of Munnar, the wilderness of Thekkady, and the serene backwaters of Alleppey—all in one premium 7-day tour package traveling Pune to Pune by comfortable AC Urbania (Pushback seats) for only 15 travelers.',
        durationDays: 7,
        durationNights: 4,
        basePrice: 15999,
        depositPrice: 4999,
        datesLabel: '01 Oct 2026 – 08 Oct 2026',
        destinationId: destSouthIndia._id,
        destination: 'Mysore, Ooty & Kerala',
        state: 'Karnataka, Tamil Nadu & Kerala',
        images: [
          'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1600100397800-47b2511475e1?q=80&w=1000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=1000&auto=format&fit=crop',
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
        itineraries: [
          { dayNumber: 1, title: 'Thursday Night Departure from Pune to Mysore', description: 'Depart comfortably on Thursday night (01 October 2026) from Pune in New AC Urbania with Pushback seats. Overnight journey to Karnataka.', meals: 'None', stayDetails: 'AC Urbania Pushback' },
          { dayNumber: 2, title: 'Arrival in Royal Mysore – Palace, Chamundeshwari & Brindavan Gardens', description: 'Arrive in Mysore. Hotel check-in. Visit Mysore Palace, Chamundeshwari Temple atop Chamundi Hills, and illuminated Brindavan Gardens.', meals: 'Self-Funded', stayDetails: 'Mysore Hotel' },
          { dayNumber: 3, title: 'Mysore to Ooty – Queen of Hill Stations & Tea Gardens', description: 'Scenic drive ascending Nilgiri Ghats. Visit Doddabetta Peak, Botanical Garden, Pine Forest, Ooty Lake boating, and tea plantations.', meals: 'Self-Funded', stayDetails: 'Ooty Hotel' },
          { dayNumber: 4, title: 'Ooty to Munnar via Pollachi Coconut Groves & Waterfalls', description: 'Drive through scenic Pollachi coconut plantations, waterfalls, and ghats into Munnar tea paradise. Hotel check-in.', meals: 'Self-Funded', stayDetails: 'Munnar Hotel' },
          { dayNumber: 5, title: 'Munnar Sightseeing to Thekkady Spice Trails', description: 'Explore Mattupetty Dam, Echo Point, Kundala Lake, and Munnar Tea Museum. Proceed to Thekkady for spice plantation tour and shopping.', meals: 'Self-Funded', stayDetails: 'Thekkady Hotel' },
          { dayNumber: 6, title: 'Thekkady to Alleppey Backwaters Boating & Fort Kochi', description: 'Alleppey backwaters boating experience. Afternoon transfer to Kochi for Fort Kochi, Chinese Fishing Nets, and Marine Drive.', meals: 'Self-Funded', stayDetails: 'Kochi Hotel / Travel' },
          { dayNumber: 7, title: 'Kochi City Heritage & Return Journey to Pune', description: 'Visit St. Francis Church and local markets. Return journey in AC Urbania, arriving in Pune on Thursday morning, 8 October 2026.', meals: 'Self-Funded', stayDetails: 'Return Transfer to Pune' },
        ],
      },
    ];

    for (const pkgData of defaultPackages) {
      await TourPackage.findOneAndUpdate(
        { slug: pkgData.slug },
        pkgData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    console.log('[Seed] Tour destinations and all 4 packages seeded/upserted successfully');

    // 4. Seed Fleet Categories & 8 Modern Vehicles (Only if not already seeded)
    const vehicleCount = await Vehicle.countDocuments();
    if (vehicleCount === 0) {
      const catHatch = await FleetCategory.create({ name: 'Hatchback', description: 'Compact and efficient self-drive hatchbacks' });
      const catSedan = await FleetCategory.create({ name: 'Sedan', description: 'Executive sedans with plush boot and comfort' });
      const catMPV = await FleetCategory.create({ name: '7-Seater MPV', description: 'Spacious family MPVs for group travel' });
      const catCompactSUV = await FleetCategory.create({ name: 'Compact SUV', description: 'Stylish coupe-SUVs and high-clearance crossovers' });
      const cat4x4 = await FleetCategory.create({ name: '4x4 Lifestyle SUV', description: 'Hardcore off-road 4WD lifestyle vehicles' });
      const catLuxurySUV = await FleetCategory.create({ name: 'Luxury Full-Size SUV', description: 'Flagship full-size 7-seater luxury SUVs' });

    await Vehicle.create([
      {
        name: 'WagonR VXI 2025',
        regNumber: 'MH12-WR-2025',
        categoryId: catHatch._id,
        vehicleType: 'car',
        dailyRate: 2200,
        securityDeposit: 3000,
        status: 'Available',
        images: ['/images/fleet/wagonr_vxi_2025.jpg'],
        specs: { bodyType: 'Tallboy Hatchback', transmission: 'Manual', engine: '1.2L Dual Jet', seats: 5, horsepower: 89, fuel: 'Petrol / Efficient' },
      },
      {
        name: 'Swift Dzire 2025',
        regNumber: 'MH12-DZ-2025',
        categoryId: catSedan._id,
        vehicleType: 'car',
        dailyRate: 2500,
        securityDeposit: 3000,
        status: 'Available',
        images: ['/images/fleet/swift_dzire_2025.jpg'],
        specs: { bodyType: 'Compact Executive Sedan', transmission: 'Manual', engine: '1.2L Z-Series', seats: 5, horsepower: 82, fuel: 'Petrol' },
      },
      {
        name: 'Swift Black 2026',
        regNumber: 'MH12-SW-2026',
        categoryId: catHatch._id,
        vehicleType: 'car',
        dailyRate: 2500,
        securityDeposit: 3000,
        status: 'Available',
        images: ['/images/fleet/swift_black_2026.jpg'],
        specs: { bodyType: 'Sporty Hatchback', transmission: 'Manual', engine: '1.2L Z12E', seats: 5, horsepower: 82, fuel: 'Petrol' },
      },
      {
        name: 'Ertiga 2024',
        regNumber: 'MH12-ER-2024',
        categoryId: catMPV._id,
        vehicleType: 'car',
        dailyRate: 2800,
        securityDeposit: 4000,
        status: 'Available',
        images: ['/images/fleet/ertiga_2024.jpg'],
        specs: { bodyType: '7-Seater Family MPV', transmission: 'Manual', engine: '1.5L Smart Hybrid', seats: 7, horsepower: 102, fuel: 'Petrol / Hybrid' },
      },
      {
        name: 'Fronx Black 2026',
        regNumber: 'MH12-FX-2026',
        categoryId: catCompactSUV._id,
        vehicleType: 'car',
        dailyRate: 2800,
        securityDeposit: 4000,
        status: 'Available',
        images: ['/images/fleet/fronx_black_2026.jpg'],
        specs: { bodyType: 'Coupe-SUV', transmission: 'Manual', engine: '1.0L Turbo Boosterjet', seats: 5, horsepower: 100, fuel: 'Petrol Turbo' },
      },
      {
        name: 'Rumion 2026',
        regNumber: 'MH12-RM-2026',
        categoryId: catMPV._id,
        vehicleType: 'car',
        dailyRate: 3000,
        securityDeposit: 4000,
        status: 'Available',
        images: ['/images/fleet/rumion_2026.jpg'],
        specs: { bodyType: '7-Seater Premium MPV', transmission: 'Manual', engine: '1.5L Dual VVT-i', seats: 7, horsepower: 103, fuel: 'Petrol' },
      },
      {
        name: 'Thar Diesel 2023',
        regNumber: 'MH12-TH-2023',
        categoryId: cat4x4._id,
        vehicleType: 'car',
        dailyRate: 4500,
        securityDeposit: 5000,
        status: 'Available',
        images: ['/images/fleet/thar_diesel_2023.jpg'],
        specs: { bodyType: '4x4 Hardtop Off-Roader', transmission: 'Manual 4x4', engine: '2.2L mHawk Diesel', seats: 4, horsepower: 130, fuel: 'Diesel (4WD)' },
      },
      {
        name: 'Fortuner 2017',
        regNumber: 'MH12-FT-2017',
        categoryId: catLuxurySUV._id,
        vehicleType: 'car',
        dailyRate: 7777,
        securityDeposit: 10000,
        status: 'Available',
        images: ['/images/fleet/fortuner_2017.jpg'],
        specs: { bodyType: 'Full-Size Luxury SUV', transmission: 'Automatic', engine: '2.8L D-4D Diesel', seats: 7, horsepower: 175, fuel: 'Diesel' },
      },
    ]);
    console.log('[Seed] 8 modern fleet vehicles seeded successfully');
    }

    // 5. Seed Promo Codes
    const promoCount = await PromoCode.countDocuments();
    if (promoCount === 0) {
      await PromoCode.create([
        { code: 'WELCOME10', discountPercentage: 10, maxDiscountAmount: 1500, validVertical: 'all' },
        { code: 'TOUR2026', discountPercentage: 15, maxDiscountAmount: 2500, validVertical: 'tours' },
        { code: 'FLEET20', discountPercentage: 20, maxDiscountAmount: 1000, validVertical: 'fleet' },
      ]);
      console.log('[Seed] Initial promo codes created');
    }
  } catch (err: any) {
    console.error('[Seed Failed]', err.message);
  }
};
