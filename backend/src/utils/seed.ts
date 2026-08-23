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

    // 3. Seed Tour Destinations & Packages (Only if not already seeded)
    const packageCount = await TourPackage.countDocuments();
    if (packageCount === 0) {

    const destUjjain = await TourDestination.create({
      name: 'Ujjain & Omkareshwar',
      state: 'Madhya Pradesh',
      country: 'India',
      description: 'Sacred Jyotirlinga temples, Mahakal Corridor, and Narmada ghats.',
      imageUrl: '/images/tours_travels_bg.jpg',
    });

    const destMathura = await TourDestination.create({
      name: 'Mathura & Vrindavan',
      state: 'Uttar Pradesh',
      country: 'India',
      description: 'Divine Braj Bhoomi, Krishna Janmabhoomi, Prem Mandir, and Khatu Shyam.',
      imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800&auto=format&fit=crop',
    });

    const destTirupati = await TourDestination.create({
      name: 'Tirupati & Srisailam',
      state: 'Andhra Pradesh',
      country: 'India',
      description: 'Lord Venkateswara Balaji, Srisailam Mallikarjuna Jyotirlinga, and Kolhapur Mahalakshmi.',
      imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop',
    });

    await TourPackage.create([
      {
        slug: '3-jyotirlinga-yatra-ujjain-omkareshwar-ghrishneshwar',
        title: '3 Jyotirlinga Yatra – Ujjain, Omkareshwar, Ghrishneshwar, Maheshwar',
        description: 'Holy Darshan of 3 Sacred Jyotirlingas, 15 Temples & Shaktipeeths with New Urbania Pushback AC comfort.',
        durationDays: 3,
        durationNights: 2,
        basePrice: 6499,
        depositPrice: 1999,
        destinationId: destUjjain._id,
        images: ['/images/tours_travels_bg.jpg'],
        inclusions: ['New Urbania Pushback AC Bus', 'Hotel Stay (4-5 sharing)', '1 Veg Meal/Day', 'Drinking Water', 'Travel Insurance'],
        itineraries: [
          { dayNumber: 1, title: 'Ujjain Mahakal & Corridor Darshan', description: 'Mahakaleshwar Jyotirlinga, Mahakal Corridor, Shaktipeeths and Ram Ghat.', meals: 'Veg Meal', stayDetails: 'Ujjain Hotel' },
          { dayNumber: 2, title: 'Omkareshwar Jyotirlinga & Maheshwar Rajwada', description: 'Omkareshwar Jyotirlinga, Mamleshwar, and Maheshwar Ghats.', meals: 'Veg Meal', stayDetails: 'Hotel Stay' },
          { dayNumber: 3, title: 'Ghrishneshwar Jyotirlinga & Return', description: 'Ghrishneshwar Jyotirlinga darshan and return journey.', meals: 'Veg Meal', stayDetails: 'Return Transfer' },
        ],
      },
      {
        slug: 'krishna-yatra-vrindavan-mathura-khatu-shyam-ujjain',
        title: 'Krishna Yatra – Vrindavan, Mathura, Khatu Shyam Baba, Ujjain Mahakal',
        description: 'Divine Braj Bhoomi pilgrimage with Khatu Shyam Baba, Taj Mahal, and Ujjain Mahakal in 2x2 AC Sleeper Coach.',
        durationDays: 6,
        durationNights: 3,
        basePrice: 12999,
        depositPrice: 2999,
        destinationId: destMathura._id,
        images: ['https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800&auto=format&fit=crop'],
        inclusions: ['Sleeper Coach (2x2 AC)', '3 Nights AC Hotel (4 sharing)', '2 Meals/Day', 'Tea & Breakfast', 'Drinking Water', 'Travel Insurance'],
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
        description: 'Grand South India Pilgrimage with Lord Venkateswara Balaji, Srisailam Jyotirlinga, and Kolhapur Mahalakshmi in New Urbania AC Pushback Bus.',
        durationDays: 6,
        durationNights: 5,
        basePrice: 10999,
        depositPrice: 2999,
        destinationId: destTirupati._id,
        images: ['https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop'],
        inclusions: ['New Urbania AC Pushback Bus', 'Hotel Stay (4 sharing)', 'Daily Morning Tea', 'Drinking Water', 'Travel Insurance'],
        itineraries: [
          { dayNumber: 1, title: 'Departure & Kolhapur Mahalakshmi Darshan', description: 'Kolhapur Mahalakshmi Ambabai Temple darshan.', meals: 'Tea', stayDetails: 'Urbania AC' },
          { dayNumber: 2, title: 'Srisailam Mallikarjuna Jyotirlinga', description: 'Mallikarjuna Swamy Jyotirlinga and Bhramaramba Devi.', meals: 'Tea', stayDetails: 'Srisailam Hotel' },
          { dayNumber: 3, title: 'Mahanandi Temple & Kalahasti Drive', description: 'Mahanandi Pushkarini and drive to Kalahasti.', meals: 'Tea', stayDetails: 'Hotel Stay' },
          { dayNumber: 4, title: 'Srikalahasti Temple & Tirupati Arrival', description: 'Srikalahasteeswara Vayu Lingam darshan.', meals: 'Tea', stayDetails: 'Tirupati Hotel' },
          { dayNumber: 5, title: 'Tirumala Tirupati Balaji & Padmavati', description: 'Lord Venkateswara Balaji and Padmavati Ammavari.', meals: 'Tea', stayDetails: 'Tirupati Hotel' },
          { dayNumber: 6, title: 'Return Journey to Pune', description: 'Return journey with holy prasad.', meals: 'Tea', stayDetails: 'Return Transfer' },
        ],
      },
    ]);
    console.log('[Seed] 3 new pilgrimage tour destinations and packages seeded successfully');
    }

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
