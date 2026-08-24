import fs from 'fs';
import path from 'path';

interface LocalDBData {
  toursBookings: any[];
  fleetBookings: any[];
  toursInquiries: any[];
  fleetInquiries: any[];
  toursPackages: any[];
}

const DATA_DIR = path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'local_db.json');

const INITIAL_DATA: LocalDBData = {
  toursBookings: [],
  fleetBookings: [],
  toursInquiries: [],
  fleetInquiries: [],
  toursPackages: [],
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
  updateToursBookingStatus(id: string, status: string, rejectionReason?: string) {
    const b = this.data.toursBookings.find(x => x._id === id || x.id === id || x.bookingCode === id || x.booking_code === id);
    if (b) {
      b.status = status;
      b.verifiedAt = new Date().toISOString();
      if (rejectionReason) b.rejectionReason = rejectionReason;
      this.save();
      return b;
    }
    return null;
  }
  deleteToursBooking(id: string) {
    this.data.toursBookings = this.data.toursBookings.filter(b => b._id !== id && b.id !== id && b.bookingCode !== id);
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
  updateFleetBookingStatus(id: string, status: string, rejectionReason?: string) {
    const b = this.data.fleetBookings.find(x => x._id === id || x.id === id || x.bookingCode === id || x.booking_code === id);
    if (b) {
      b.status = status;
      b.verifiedAt = new Date().toISOString();
      if (rejectionReason) b.rejectionReason = rejectionReason;
      this.save();
      return b;
    }
    return null;
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

  // Tours Packages
  getTourPackages() {
    if (!this.data.toursPackages) this.data.toursPackages = [];
    return this.data.toursPackages;
  }
  setTourPackages(pkgs: any[]) {
    this.data.toursPackages = pkgs;
    this.save();
  }
  addTourPackage(pkg: any) {
    if (!this.data.toursPackages) this.data.toursPackages = [];
    this.data.toursPackages.push(pkg);
    this.save();
    return pkg;
  }
  getTourPackageByIdOrSlug(idOrSlug: string) {
    if (!this.data.toursPackages) this.data.toursPackages = [];
    return this.data.toursPackages.find(p => p._id === idOrSlug || p.id === idOrSlug || p.slug === idOrSlug) || null;
  }
  updateTourPackage(idOrSlug: string, data: any) {
    if (!this.data.toursPackages) this.data.toursPackages = [];
    const idx = this.data.toursPackages.findIndex(p => p._id === idOrSlug || p.id === idOrSlug || p.slug === idOrSlug || (data.slug && p.slug === data.slug));
    if (idx !== -1) {
      this.data.toursPackages[idx] = {
        ...this.data.toursPackages[idx],
        ...data,
      };
      this.save();
      return this.data.toursPackages[idx];
    } else {
      const newPkg = {
        _id: idOrSlug.startsWith('pkg-') ? idOrSlug : 'pkg-' + Date.now(),
        id: idOrSlug,
        ...data,
      };
      this.data.toursPackages.push(newPkg);
      this.save();
      return newPkg;
    }
  }
  deleteTourPackage(idOrSlug: string) {
    if (!this.data.toursPackages) this.data.toursPackages = [];
    this.data.toursPackages = this.data.toursPackages.filter(p => p._id !== idOrSlug && p.id !== idOrSlug && p.slug !== idOrSlug);
    this.save();
  }
}

export const localStore = new LocalStore();
