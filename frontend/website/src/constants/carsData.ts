export interface CarVehicle {
  id: string;
  name: string;
  category: string;
  pricePerDay: number;
  featured?: boolean;
  image: string;
  gallery: string[];
  specs: {
    bodyType: string;
    transmission: string;
    engine: string;
    passengers: number;
    horsepower: number;
    fuelType: string;
  };
  availableColors: string[];
  features: {
    title: string;
    description: string;
  }[];
  description: string;
}

export interface CarContactInfo {
  callPhone: string;
  callPhoneDisplay: string;
  whatsappPhone: string;
  whatsappPhoneDisplay: string;
  address: string;
}

export const SHARED_CAR_CONTACT: CarContactInfo = {
  callPhone: '7820802985',
  callPhoneDisplay: '+91 78208 02985',
  whatsappPhone: '8208211478',
  whatsappPhoneDisplay: '+91 82082 11478',
  address: 'Green Hills Society, Near Mastan Hotel, Mangdewadi, Katraj, Pune - 411046, Maharashtra',
};

export const FLEET_VEHICLES: CarVehicle[] = [
  {
    id: 'wagonr-vxi-2025',
    name: 'WagonR VXI 2025',
    category: 'Hatchback',
    pricePerDay: 2200,
    featured: true,
    image: '/images/fleet/wagonr_vxi_2025.jpg',
    gallery: [
      '/images/fleet/wagonr_vxi_2025.jpg',
      '/images/fleet/wagonr_vxi_2025.jpg',
    ],
    specs: {
      bodyType: 'Tallboy Hatchback',
      transmission: 'Manual',
      engine: '1.2L Advanced K-Series Dual Jet',
      passengers: 5,
      horsepower: 89,
      fuelType: 'Petrol / Efficient',
    },
    availableColors: ['#FFFFFF', '#C0C0C0', '#475569'],
    features: [
      { title: 'TALLBOY CABIN', description: 'Exceptional headroom and expansive leg space for 5 adult passengers.' },
      { title: 'HIGH FUEL EFFICIENCY', description: 'Class-leading mileage of 24.4+ kmpl for cost-effective outstation trips.' },
      { title: 'SMARTPLAY TOUCHSCREEN', description: 'Bluetooth, smartphone audio connectivity, and clear music output.' },
      { title: 'DUAL AIRBAGS & ABS', description: 'Electronic Brake Distribution and dual front SRS airbags standard.' },
      { title: 'EASY CITY DRIVE', description: 'High seating position with panoramic road visibility and effortless steering.' },
      { title: 'SPACIOUS BOOT', description: '341 Liters large boot easily carrying 3 medium luggage bags.' },
    ],
    description: 'The nation’s favorite reliable hatchback. Unmatched cabin roominess, supreme fuel economy, and effortless city & highway drivability for weekend family getaways.',
  },
  {
    id: 'swift-dzire-2025',
    name: 'Swift Dzire 2025',
    category: 'Sedan',
    pricePerDay: 2500,
    featured: true,
    image: '/images/fleet/swift_dzire_2025.jpg',
    gallery: [
      '/images/fleet/swift_dzire_2025.jpg',
      '/images/fleet/swift_dzire_2025.jpg',
    ],
    specs: {
      bodyType: 'Compact Executive Sedan',
      transmission: 'Manual',
      engine: '1.2L Z-Series Dual VVT',
      passengers: 5,
      horsepower: 82,
      fuelType: 'Petrol',
    },
    availableColors: ['#FFFFFF', '#E2E8F0', '#1E293B'],
    features: [
      { title: 'PLUSH SEDAN COMFORT', description: 'Premium sculpted seats with rear AC vents and center armrest.' },
      { title: 'LARGE 378L BOOT', description: 'Dedicated sedan boot space tailored for airport runs and road trips.' },
      { title: 'HIGHWAY STABILITY', description: 'Refined suspension tuned for smooth high-speed expressway gliding.' },
      { title: 'CRUISE CONTROL', description: 'Relaxed distance-cruising on Mumbai-Pune Expressway & highways.' },
      { title: '6 AIRBAGS SAFETY', description: 'Advanced safety cage, ESP with Hill Hold Assist, and ABS+EBD.' },
      { title: 'WIRELESS CONNECTIVITY', description: 'Seamless Android Auto, Apple CarPlay, and crisp audio.' },
    ],
    description: 'Sophisticated executive sedan styling paired with supreme rear seat comfort and remarkable boot capacity. The premier choice for executive trips and outstation travel.',
  },
  {
    id: 'swift-black-2026',
    name: 'Swift Black 2026',
    category: 'Hatchback',
    pricePerDay: 2500,
    featured: true,
    image: '/images/fleet/swift_black_2026.jpg',
    gallery: [
      '/images/fleet/swift_black_2026.jpg',
      '/images/fleet/swift_black_2026.jpg',
    ],
    specs: {
      bodyType: 'Sporty Hatchback',
      transmission: 'Manual',
      engine: '1.2L Z12E 3-Cylinder High Efficiency',
      passengers: 5,
      horsepower: 82,
      fuelType: 'Petrol',
    },
    availableColors: ['#111111', '#1E293B', '#334155'],
    features: [
      { title: 'MIDNIGHT BLACK EDITION', description: 'Stunning black exterior package with smoked alloy accents.' },
      { title: 'SPORT TUNED CHASSIS', description: 'Agile cornering, tight steering response, and thrilling handling.' },
      { title: '9-INCH SMART INFOTAINMENT', description: 'High-definition touchscreen display with wireless phone mirroring.' },
      { title: 'AUTOMATIC CLIMATE CONTROL', description: 'Fast cabin cooling designed for long summer drives.' },
      { title: 'LED PROJECTOR HEADLAMPS', description: 'Razor-sharp nighttime illumination with striking LED DRL signatures.' },
      { title: 'EXCELLENT HIGHWAY PULL', description: 'Punchy low-end torque for confident overtakes.' },
    ],
    description: 'The all-new generation Swift in commanding Midnight Black. Sporty, agile, and high on style — crafted for drivers who demand modern aesthetics and spirited dynamics.',
  },
  {
    id: 'ertiga-2024',
    name: 'Ertiga 2024',
    category: '7-Seater MPV',
    pricePerDay: 2800,
    featured: true,
    image: '/images/fleet/ertiga_2024.jpg',
    gallery: [
      '/images/fleet/ertiga_2024.jpg',
      '/images/fleet/ertiga_2024.jpg',
    ],
    specs: {
      bodyType: '7-Seater Family MPV',
      transmission: 'Manual',
      engine: '1.5L K15C Smart Hybrid Petrol',
      passengers: 7,
      horsepower: 102,
      fuelType: 'Petrol / Hybrid',
    },
    availableColors: ['#6B7280', '#FFFFFF', '#1F2937'],
    features: [
      { title: 'TRUE 7-SEATER SPACE', description: 'Three spacious rows with reclining second and third-row seats.' },
      { title: 'ROOF-MOUNTED REAR AC', description: 'Dedicated blower controls ensuring cool comfort for all 7 travelers.' },
      { title: 'SMART HYBRID TECH', description: 'Brake energy regeneration for unmatched fuel efficiency in a 7-seater.' },
      { title: 'FLEXIBLE FOLDING SEATS', description: '50:50 split third row flat-folding into a massive 803L cargo floor.' },
      { title: 'CRUISE & STEERING CONTROLS', description: 'Ergonomic multi-function steering for effortless long drives.' },
      { title: 'COOLED CUP HOLDERS', description: 'Keep your road trip beverages chilled on hot highway stretches.' },
    ],
    description: 'The quintessential 7-seater family vehicle in Metallic Grey. Unrivalled passenger comfort, independent AC vents for all rows, and generous versatility for group vacations.',
  },
  {
    id: 'fronx-black-2026',
    name: 'Fronx Black 2026',
    category: 'Compact SUV',
    pricePerDay: 2800,
    featured: true,
    image: '/images/fleet/fronx_black_2026.jpg',
    gallery: [
      '/images/fleet/fronx_black_2026.jpg',
      '/images/fleet/fronx_black_2026.jpg',
    ],
    specs: {
      bodyType: 'Coupe-SUV',
      transmission: 'Manual',
      engine: '1.0L Turbo Boosterjet Petrol',
      passengers: 5,
      horsepower: 100,
      fuelType: 'Petrol Turbo',
    },
    availableColors: ['#111111', '#1F2937', '#374151'],
    features: [
      { title: 'COUPE-SUV AERODYNAMICS', description: 'Muscular sloping roofline with aggressive black styling.' },
      { title: '190MM HIGH GROUND CLEARANCE', description: 'Tackle broken roads, speed breakers, and ghat trails with ease.' },
      { title: 'HEADS-UP DISPLAY (HUD)', description: 'Turn-by-turn navigation and speed projected directly on windshield.' },
      { title: '360-DEGREE VIEW CAMERA', description: 'Bird’s-eye parking cameras for effortless tight spot maneuvering.' },
      { title: 'WIRELESS CHARGING PAD', description: 'Built-in fast smartphone charging without cable clutter.' },
      { title: 'TURBOCHARGED ACCELERATION', description: 'Instant boost and robust low-end torque for spirited driving.' },
    ],
    description: 'Cutting-edge coupe-SUV posture cloaked in Jet Black. Features high ground clearance, turbo boost, and advanced tech like 360° cameras and HUD for the contemporary explorer.',
  },
  {
    id: 'rumion-2026',
    name: 'Rumion 2026',
    category: '7-Seater MPV',
    pricePerDay: 3000,
    featured: true,
    image: '/images/fleet/rumion_2026.jpg',
    gallery: [
      '/images/fleet/rumion_2026.jpg',
      '/images/fleet/rumion_2026.jpg',
    ],
    specs: {
      bodyType: '7-Seater Premium MPV',
      transmission: 'Manual',
      engine: '1.5L Dual VVT-i K-Series Petrol',
      passengers: 7,
      horsepower: 103,
      fuelType: 'Petrol',
    },
    availableColors: ['#CBD5E1', '#FFFFFF', '#334155'],
    features: [
      { title: 'TOYOTA RELIABILITY & REFINEMENT', description: 'Signature Toyota chrome grille, quiet NVH levels, and bulletproof engineering.' },
      { title: 'CAPACIOUS 7-SEATER LUXURY', description: 'Premium dual-tone interior with plush captain style comfort.' },
      { title: 'SMARTPLAY CAST AUDIO', description: 'Crisp multi-speaker sound with wireless Apple CarPlay & Android Auto.' },
      { title: 'INDEPENDENT REAR AIRFLOW', description: 'Rear roof AC blowers keeping all 3 rows uniformly cooled.' },
      { title: 'TOYOTA CONNECTED SUITE', description: 'Vehicle health tracking, geofencing, and smart trip telemetry.' },
      { title: 'EXPANSIVE MODULAR LUGGAGE', description: 'Foldable 2nd & 3rd row configurations for heavy travel baggage.' },
    ],
    description: 'Toyota’s esteemed 7-seater MPV in Silky Silver. Built with peerless durability, ultra-smooth ride quality, and expansive room for extended interstate family journeys.',
  },
  {
    id: 'thar-diesel-2023',
    name: 'Thar Diesel 2023',
    category: '4x4 Lifestyle SUV',
    pricePerDay: 4500,
    featured: true,
    image: '/images/fleet/thar_diesel_2023.jpg',
    gallery: [
      '/images/fleet/thar_diesel_2023.jpg',
      '/images/fleet/thar_diesel_2023.jpg',
    ],
    specs: {
      bodyType: '4x4 Hardtop Off-Roader',
      transmission: 'Manual 4x4',
      engine: '2.2L mHawk 130 Turbo Diesel',
      passengers: 4,
      horsepower: 130,
      fuelType: 'Diesel (4WD Low/High)',
    },
    availableColors: ['#374151', '#111111', '#991B1B'],
    features: [
      { title: 'TRUE 4X4 LOW-RANGE TRANSFER CASE', description: 'Mechanical shift-on-the-fly 4WD to conquer deep mud, sand, and rock.' },
      { title: '300 NM TORQUE BEAST', description: 'Massive pulling power from the legendary 2.2L mHawk Turbo Diesel engine.' },
      { title: '226MM CLASS-LEADING CLEARANCE', description: '650mm water wading capacity and high approach/departure angles.' },
      { title: 'FACTORY HARDTOP ROOF', description: 'All-weather insulation with roll-cage certified safety construction.' },
      { title: 'ALL-TERRAIN CEAT CZAR TYRES', description: 'Deep-tread 18-inch all-terrain rubber for supreme gravel traction.' },
      { title: 'IP54 DRIZZLE RESISTANT CABIN', description: 'Washable interior floor with drain plugs and adventure telemetry.' },
    ],
    description: 'The undisputed king of Indian off-roading in Deep Grey Matte. 4x4 low range, 300 Nm diesel torque, and unmatched presence for expeditions to Konkan, Ladakh, or Western Ghats.',
  },
  {
    id: 'fortuner-2017',
    name: 'Fortuner 2017',
    category: 'Luxury Full-Size SUV',
    pricePerDay: 7777,
    featured: true,
    image: '/images/fleet/fortuner_2017.jpg',
    gallery: [
      '/images/fleet/fortuner_2017.jpg',
      '/images/fleet/fortuner_2017.jpg',
    ],
    specs: {
      bodyType: 'Full-Size Body-on-Frame SUV',
      transmission: 'Automatic',
      engine: '2.8L D-4D Turbo Diesel',
      passengers: 7,
      horsepower: 175,
      fuelType: 'Diesel',
    },
    availableColors: ['#FFFFFF', '#111111', '#52525B'],
    features: [
      { title: 'IMPERIAL ROAD PRESENCE', description: 'Towering stance in pristine Pearl White commanding absolute highway respect.' },
      { title: '450 NM TORQUE TURBO DIESEL', description: 'Effortless high-speed overtaking and effortless mountain hill climbs.' },
      { title: 'PLUSH 7-SEATER LEATHER LOUNGE', description: 'Full leather upholstery with 8-way power adjustable driver seat.' },
      { title: 'AUTOMATIC TRANSMISSION', description: 'Silky smooth 6-speed automatic gearbox with paddle shifters.' },
      { title: 'PREMIUM SOUND & REAR CLIMATE', description: 'Dual-zone climate control with roof AC vents across all 3 rows.' },
      { title: '7 AIRBAGS & VEHICLE STABILITY', description: 'Active Traction Control, Hill Assist, and 5-star Global NCAP safety.' },
    ],
    description: 'The ultimate symbol of luxury, power, and road authority in Pearl White. High-riding 7-passenger capability, 450 Nm diesel torque, and peerless Toyota build quality for VIP travel.',
  },
];

export const SIDEBAR_POPULAR_CARS = [
  { id: 'swift-black-2026', name: 'Swift Black 2026', price: '₹2,500/day', image: '/images/fleet/swift_black_2026.jpg' },
  { id: 'ertiga-2024', name: 'Ertiga 2024 (7-Seater)', price: '₹2,800/day', image: '/images/fleet/ertiga_2024.jpg' },
  { id: 'thar-diesel-2023', name: 'Thar Diesel 2023 4x4', price: '₹4,500/day', image: '/images/fleet/thar_diesel_2023.jpg' },
  { id: 'fortuner-2017', name: 'Fortuner 2017 Luxury', price: '₹7,777/day', image: '/images/fleet/fortuner_2017.jpg' },
];

export const CATEGORIES_LIST = [
  'Hatchback',
  'Sedan',
  '7-Seater MPV',
  'Compact SUV',
  '4x4 Lifestyle SUV',
  'Luxury Full-Size SUV',
];

export const TAGS_LIST = [
  'Self-Drive',
  '7-Seater',
  '4x4 Offroad',
  'Luxury SUV',
  'Automatic',
  'Pune Airport',
  'Outstation',
  'Doorstep Delivery',
];

