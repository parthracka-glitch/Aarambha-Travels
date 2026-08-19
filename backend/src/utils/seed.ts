import { AdminUser, Setting, PromoCode, TourDestination, TourPackage, FleetCategory, Vehicle } from '../models';
import { hashPassword } from '../middlewares/auth.middleware';

export const seedDatabase = async (): Promise<void> => {
  try {
    // 1. Seed & Update Admin Users
    const hashedSuperAdmin = await hashPassword('Admin@123');
    const hashedViewer = await hashPassword('Viewer@123');

    // Ensure default superadmin exists and has 'superadmin' role
    const existingSuperAdmin = await AdminUser.findOne({ email: 'admin@aarambhatravels.in' });
    if (!existingSuperAdmin) {
      await AdminUser.create({
        name: 'Kushal Parakh',
        email: 'admin@aarambhatravels.in',
        hashedPassword: hashedSuperAdmin,
        role: 'superadmin',
        isActive: true,
      });
      console.log('[Seed] Superadmin user created: admin@aarambhatravels.in / Admin@123');
    } else {
      // Ensure existing primary admin account's role is 'superadmin'
      if (existingSuperAdmin.role !== 'superadmin') {
        existingSuperAdmin.role = 'superadmin';
        await existingSuperAdmin.save();
        console.log('[Seed] Existing admin updated to superadmin role');
      }
    }

    // Ensure Viewer 1 exists
    const existingViewer1 = await AdminUser.findOne({ email: 'viewer1@aarambhatravels.in' });
    if (!existingViewer1) {
      await AdminUser.create({
        name: 'Booking Viewer 1',
        email: 'viewer1@aarambhatravels.in',
        hashedPassword: hashedViewer,
        role: 'viewer',
        isActive: true,
      });
      console.log('[Seed] Viewer 1 created: viewer1@aarambhatravels.in / Viewer@123');
    }

    // Ensure Viewer 2 exists
    const existingViewer2 = await AdminUser.findOne({ email: 'viewer2@aarambhatravels.in' });
    if (!existingViewer2) {
      await AdminUser.create({
        name: 'Booking Viewer 2',
        email: 'viewer2@aarambhatravels.in',
        hashedPassword: hashedViewer,
        role: 'viewer',
        isActive: true,
      });
      console.log('[Seed] Viewer 2 created: viewer2@aarambhatravels.in / Viewer@123');
    }

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

    // 3. Seed Tour Destinations & Packages
    await TourPackage.deleteMany({});
    await TourDestination.deleteMany({});

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

    // 4. Seed Fleet Categories & Vehicles
    const vehCount = await Vehicle.countDocuments();
    if (vehCount === 0) {
      const catSuv = await FleetCategory.create({ name: 'SUV & 4x4', description: 'Rugged terrain and luxury family SUVs' });
      const catBike = await FleetCategory.create({ name: 'Adventure Bikes', description: 'High performance touring and cruiser bikes' });

      await Vehicle.create([
        {
          name: 'Mahindra Thar 4x4',
          regNumber: 'RJ14-AB-1001',
          categoryId: catSuv._id,
          vehicleType: 'car',
          dailyRate: 3500,
          securityDeposit: 5000,
          status: 'Available',
          images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop'],
          specs: { transmission: 'Manual', fuel: 'Diesel', seats: 4 },
        },
        {
          name: 'Hyundai Creta SX',
          regNumber: 'RJ14-CD-2002',
          categoryId: catSuv._id,
          vehicleType: 'car',
          dailyRate: 2800,
          securityDeposit: 3000,
          status: 'Available',
          images: ['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=800&auto=format&fit=crop'],
          specs: { transmission: 'Automatic', fuel: 'Petrol', seats: 5 },
        },
        {
          name: 'Royal Enfield Himalayan 450',
          regNumber: 'RJ14-BK-3003',
          categoryId: catBike._id,
          vehicleType: 'bike',
          dailyRate: 1200,
          securityDeposit: 2000,
          status: 'Available',
          images: ['https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=800&auto=format&fit=crop'],
          specs: { engine: '450cc', ABS: 'Dual Channel' },
        },
      ]);
      console.log('[Seed] Sample fleet categories and vehicles created');
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
