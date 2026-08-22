import mongoose, { Schema, Document } from 'mongoose';

export interface IBusRate extends Document {
  busId: string;
  busType: string;
  category: 'local_ac' | 'local_nonac' | 'outstation_ac' | 'outstation_nonac' | 'urbania_per_day' | 'urbania_local' | 'urbania_pune_mumbai';
  seats: number;
  acType: 'AC' | 'Non-AC';
  isUrbania: boolean;
  baseRate?: number;           // 8 Hrs / 80 KM base rate
  extraKmRate?: number;
  extraHourRate?: number;
  mumbaiRate?: number;         // Outstation Mumbai up to 350 KM
  mahabaleshwarRate?: number;  // Outstation Mahabaleshwar up to 300 KM
  specialPermit?: number;
  minKmPerDay?: number;        // Urbania per day min KM
  acPerKmRate?: number;        // Urbania per KM rate
  tollParkingDriverDA?: number;
  tollNote?: string;
  packageRate?: number;        // Urbania local or Pune-Mumbai package rate
  kmIncluded?: number;
  hoursIncluded?: number;
  status: 'Active' | 'Inactive';
  updatedAt: Date;
}

const BusRateSchema = new Schema<IBusRate>({
  busId: { type: String, required: true, unique: true },
  busType: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['local_ac', 'local_nonac', 'outstation_ac', 'outstation_nonac', 'urbania_per_day', 'urbania_local', 'urbania_pune_mumbai']
  },
  seats: { type: Number, required: true },
  acType: { type: String, enum: ['AC', 'Non-AC'], default: 'AC' },
  isUrbania: { type: Boolean, default: false },
  baseRate: { type: Number, default: 0 },
  extraKmRate: { type: Number, default: 0 },
  extraHourRate: { type: Number, default: 0 },
  mumbaiRate: { type: Number, default: 0 },
  mahabaleshwarRate: { type: Number, default: 0 },
  specialPermit: { type: Number, default: 0 },
  minKmPerDay: { type: Number, default: 0 },
  acPerKmRate: { type: Number, default: 0 },
  tollParkingDriverDA: { type: Number, default: 0 },
  tollNote: { type: String, default: '' },
  packageRate: { type: Number, default: 0 },
  kmIncluded: { type: Number, default: 0 },
  hoursIncluded: { type: Number, default: 0 },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  updatedAt: { type: Date, default: Date.now },
});

export const BusRate = mongoose.model<IBusRate>('BusRate', BusRateSchema);
