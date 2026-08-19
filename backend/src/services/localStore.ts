import fs from 'fs';
import path from 'path';

interface LocalDBData {
  toursBookings: any[];
  fleetBookings: any[];
  toursInquiries: any[];
  fleetInquiries: any[];
}

const DATA_DIR = path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'local_db.json');

const INITIAL_DATA: LocalDBData = {
  toursBookings: [
    {
      _id: 'tb-101',
      id: 'tb-101',
      bookingCode: 'TR-89A12F',
      customerName: 'Kushal Parakh',
      customerEmail: 'kushal@example.com',
      customerPhone: '+91 82082 11478',
      packageName: 'Royal Rajasthan Heritage',
      packageId: 'royal-rajasthan-heritage',
      travelDate: '2026-08-15',
      paxCount: 2,
      totalAmount: 48000,
      depositPaid: 1000,
      balanceAmount: 47000,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'tb-102',
      id: 'tb-102',
      bookingCode: 'TR-77C401',
      customerName: 'Aleea Thompson',
      customerEmail: 'aleea@example.com',
      customerPhone: '+91 98123 45678',
      packageName: 'Kerala Backwaters & Coastal Serenity',
      packageId: 'kerala-backwaters-coastal',
      travelDate: '2026-09-01',
      paxCount: 2,
      totalAmount: 33000,
      depositPaid: 1000,
      balanceAmount: 32000,
      status: 'Deposit Paid',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
  ],
  fleetBookings: [
    {
      _id: 'fb-201',
      id: 'fb-201',
      booking_code: 'FL-44B908',
      bookingCode: 'FL-44B908',
      customer_name: 'David Vance',
      customerName: 'David Vance',
      customer_email: 'david@example.com',
      customerEmail: 'david@example.com',
      customer_phone: '+91 99887 76655',
      customerPhone: '+91 99887 76655',
      vehicle_name: 'Zephyr A4 Stratos',
      vehicleName: 'Zephyr A4 Stratos',
      vehicleId: 'zephyr-a4-stratos',
      pickup_date: '2026-08-14',
      return_date: '2026-08-18',
      total_price: 12740,
      totalPrice: 12740,
      security_deposit: 500,
      deposit_paid: 500,
      depositPaid: 500,
      status: 'Confirmed',
      created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
  ],
  toursInquiries: [
    {
      _id: 'ti-301',
      id: 'ti-301',
      customerName: 'Priya Sharma',
      customerEmail: 'priya@example.com',
      customerPhone: '+91 97766 55443',
      notes: 'Looking for Leh Ladakh High Altitude Expedition in September',
      status: 'New',
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    },
  ],
  fleetInquiries: [
    {
      _id: 'fi-401',
      id: 'fi-401',
      customer_name: 'Rahul Verma',
      customerName: 'Rahul Verma',
      customer_email: 'rahul@example.com',
      customerEmail: 'rahul@example.com',
      customer_phone: '+91 98877 66554',
      customerPhone: '+91 98877 66554',
      notes: 'Interested in renting SUV for Shimla road trip',
      status: 'New',
      created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
  ],
};

class LocalStore {
  private data: LocalDBData;

  constructor() {
    this.data = this.load();
  }

  private load(): LocalDBData {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_DATA, null, 2));
      return INITIAL_DATA;
    } catch (err) {
      console.error('[LocalStore Error] Failed loading local_db.json:', err);
      return INITIAL_DATA;
    }
  }

  private save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2));
    } catch (err) {
      console.error('[LocalStore Error] Failed saving local_db.json:', err);
    }
  }

  // Tours Bookings
  getToursBookings() {
    return this.data.toursBookings;
  }
  addToursBooking(booking: any) {
    this.data.toursBookings.unshift(booking);
    this.save();
    return booking;
  }
  deleteToursBooking(id: string) {
    this.data.toursBookings = this.data.toursBookings.filter(b => b._id !== id && b.id !== id);
    this.save();
  }

  // Fleet Bookings
  getFleetBookings() {
    return this.data.fleetBookings;
  }
  addFleetBooking(booking: any) {
    this.data.fleetBookings.unshift(booking);
    this.save();
    return booking;
  }
  deleteFleetBooking(id: string) {
    this.data.fleetBookings = this.data.fleetBookings.filter(b => b._id !== id && b.id !== id);
    this.save();
  }

  // Tours Inquiries
  getToursInquiries() {
    return this.data.toursInquiries;
  }
  addToursInquiry(inquiry: any) {
    this.data.toursInquiries.unshift(inquiry);
    this.save();
    return inquiry;
  }
  deleteToursInquiry(id: string) {
    this.data.toursInquiries = this.data.toursInquiries.filter(i => i._id !== id && i.id !== id);
    this.save();
  }

  // Fleet Inquiries
  getFleetInquiries() {
    return this.data.fleetInquiries;
  }
  addFleetInquiry(inquiry: any) {
    this.data.fleetInquiries.unshift(inquiry);
    this.save();
    return inquiry;
  }
  deleteFleetInquiry(id: string) {
    this.data.fleetInquiries = this.data.fleetInquiries.filter(i => i._id !== id && i.id !== id);
    this.save();
  }
}

export const localStore = new LocalStore();
