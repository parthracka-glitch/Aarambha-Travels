'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Calendar,
  User,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Car,
  Fuel,
  Settings,
  Users,
  Gauge,
  Zap,
  MapPin,
  Sparkles,
  CreditCard,
  FileText,
  Clock,
  ArrowRight,
  Check,
  MessageCircle,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TermsConditionsSection from '@/components/shared/TermsConditionsSection';
import BookingModal, { BookingModalItem } from '@/components/booking/BookingModal';
import { FLEET_VEHICLES } from '@/constants/carsData';
import { apiFetch } from '@/services/api-client';

export default function CarDetailPage() {
  const params = useParams();
  const carId = params?.id as string;

  const vehicle = FLEET_VEHICLES.find((v) => v.id === carId) || FLEET_VEHICLES[0];

  const [selectedImage, setSelectedImage] = useState(vehicle.image);
  const [selectedColor, setSelectedColor] = useState(vehicle.availableColors[0] || '#FF3B30');

  // Dates & Customer Booking State
  const [pickupDate, setPickupDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const [returnDate, setReturnDate] = useState(() => {
    const future = new Date(Date.now() + 86400000 * 3);
    return future.toISOString().split('T')[0];
  });

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);

  // Modal control fallback
  const [isModalOpen, setIsModalOpen] = useState(false);

  const relatedVehicles = FLEET_VEHICLES.filter((v) => v.id !== vehicle.id).slice(0, 4);

  // Rental math calculation
  const startD = new Date(pickupDate || Date.now());
  const endD = new Date(returnDate || Date.now() + 86400000 * 3);
  const diffTime = Math.max(86400000, endD.getTime() - startD.getTime());
  const computedDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const dailyRateINR = vehicle.pricePerDay;
  const totalRentalAmount = dailyRateINR * computedDays;
  const depositAmount = 500;

  const handleDirectBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const bookingRef = 'FL-' + Math.floor(100000 + Math.random() * 900000);

    const bookingPayload = {
      id: bookingRef,
      bookingCode: bookingRef,
      type: 'car',
      title: vehicle.name,
      vehicleName: vehicle.name,
      image: selectedImage || vehicle.image,
      startDate: pickupDate,
      endDate: returnDate,
      pickupDate,
      returnDate,
      guestsCount: 1,
      totalPrice: totalRentalAmount,
      depositPaid: depositAmount,
      customerName: fullName || 'Valued Guest',
      customerEmail: (email || 'guest@example.com').trim().toLowerCase(),
      email: (email || 'guest@example.com').trim().toLowerCase(),
      accountEmail: (email || 'guest@example.com').trim().toLowerCase(),
      userEmail: (email || 'guest@example.com').trim().toLowerCase(),
      customerPhone: phone || '+91 82082 11478',
      phone: phone || '+91 82082 11478',
      licenseNumber: licenseNumber || 'DL-PENDING',
      agreementAccepted: true,
      termsAccepted: true,
      termsAcceptedAt: new Date().toISOString(),
      termsVersion: '2026.1-STANDARD',
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };

    // If user entered an email, make sure session exists
    if (email && email.trim()) {
      try {
        const stored = localStorage.getItem('aarambha_user');
        if (!stored) {
          localStorage.setItem(
            'aarambha_user',
            JSON.stringify({
              name: fullName || 'Valued Guest',
              email: email.trim().toLowerCase(),
              phone: phone || '+91 82082 11478',
              loggedIn: true,
            })
          );
          window.dispatchEvent(new Event('aarambha_auth_changed'));
        }
      } catch (_e) {}
    }

    // Save locally
    try {
      const existingStr = localStorage.getItem('aarambha_user_bookings');
      const existing = existingStr ? JSON.parse(existingStr) : [];
      existing.unshift(bookingPayload);
      localStorage.setItem('aarambha_user_bookings', JSON.stringify(existing));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }

    // Sync to Express Backend CRM
    try {
      await apiFetch('/api/fleet/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingPayload),
      });
    } catch (err) {
      console.warn('Backend sync warning:', err);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setBookingSuccess({
        refNo: bookingRef,
        totalCost: totalRentalAmount,
        pickupDate,
        returnDate,
        days: computedDays,
        fullName: fullName || 'Valued Guest',
      });
    }, 1000);
  };

  const modalItem: BookingModalItem = {
    id: vehicle.id,
    type: 'car',
    title: vehicle.name,
    subtitle: `${vehicle.category} • ${vehicle.specs.transmission}`,
    image: vehicle.image,
    price: totalRentalAmount,
    deposit: depositAmount,
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#18181B] flex flex-col font-sans selection:bg-[#FF3B30] selection:text-white">
      <Navbar vertical="fleet" />

      {/* ─── 1. BREADCRUMB & CAR HEADER ─────────────────────────── */}
      <section className="relative bg-[#111111] text-white py-14 overflow-hidden border-b border-gray-800">
        <img
          src="https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=1600&auto=format&fit=crop"
          alt="Car Details Header"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-gray-300 text-xs font-semibold backdrop-blur-md">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/car-rentals/cars" className="hover:text-white transition-colors">Self-Drive Fleet</Link>
            <span>/</span>
            <span className="text-[#FF3B30] font-bold">{vehicle.name}</span>
          </div>
          <h1 className="font-syne text-3xl sm:text-5xl font-extrabold tracking-tight">
            {vehicle.name}
          </h1>
          <p className="text-sm text-gray-300 max-w-2xl mx-auto font-light">
            Premium self-drive luxury experience with doorstep delivery, comprehensive insurance & ₹500 refundable deposit.
          </p>
        </div>
      </section>

      {/* ─── 2. MAIN CONTENT & DIRECT BOOKING GRID ────────────────── */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* LEFT COLUMN: Gallery + Comprehensive Specifications & Features */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Image Gallery Showcase */}
              <div className="space-y-4">
                <div className="bg-[#F8F9FA] rounded-3xl p-6 h-[320px] sm:h-[420px] flex items-center justify-center border border-gray-200 shadow-sm overflow-hidden group">
                  <img
                    src={selectedImage}
                    alt={vehicle.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Gallery Thumbnails */}
                <div className="grid grid-cols-3 gap-3">
                  {vehicle.gallery.map((thumb, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(thumb)}
                      className={`bg-[#F8F9FA] rounded-2xl p-2 h-24 border transition-all flex items-center justify-center overflow-hidden ${
                        selectedImage === thumb
                          ? 'border-2 border-[#FF3B30] ring-2 ring-[#FF3B30]/20 scale-105'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img src={thumb} alt={`Thumbnail ${idx}`} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Basic Car Overview & Colors */}
              <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="px-3 py-1 bg-red-100 text-[#FF3B30] font-bold text-xs rounded-full inline-block">
                      {vehicle.category}
                    </span>
                    <h2 className="font-syne text-2xl font-extrabold text-[#111111] mt-2">
                      About {vehicle.name}
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">DAILY RATE</span>
                    <span className="font-syne text-2xl font-extrabold text-[#111111]">
                      ₹{dailyRateINR.toLocaleString('en-IN')}<span className="text-xs text-gray-500 font-normal">/day</span>
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed">
                  {vehicle.description}
                </p>

                {/* Available Color Selector */}
                <div className="pt-2 border-t border-gray-200 flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Available Colors:</span>
                  <div className="flex items-center gap-2">
                    {vehicle.availableColors.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(color)}
                        style={{ backgroundColor: color }}
                        className={`w-6 h-6 rounded-full border transition-all ${
                          selectedColor === color
                            ? 'border-[#FF3B30] border-2 scale-110 shadow-sm'
                            : 'border-gray-300 hover:scale-105'
                        }`}
                        title={`Select Color ${color}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* TECHNICAL SPECIFICATIONS GRID */}
              <div className="space-y-4">
                <h3 className="font-syne text-lg font-bold text-[#111111] flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#FF3B30]" /> Basic Car Technical Specifications
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-white border border-gray-200 p-4 rounded-xl space-y-1 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                      <Car className="w-4 h-4 text-[#FF3B30]" /> Body Type
                    </div>
                    <div className="font-bold text-xs text-[#111111]">{vehicle.specs.bodyType}</div>
                  </div>

                  <div className="bg-white border border-gray-200 p-4 rounded-xl space-y-1 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                      <Settings className="w-4 h-4 text-[#FF3B30]" /> Transmission
                    </div>
                    <div className="font-bold text-xs text-[#111111]">{vehicle.specs.transmission}</div>
                  </div>

                  <div className="bg-white border border-gray-200 p-4 rounded-xl space-y-1 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                      <Gauge className="w-4 h-4 text-[#FF3B30]" /> Engine Output
                    </div>
                    <div className="font-bold text-xs text-[#111111]">{vehicle.specs.engine}</div>
                  </div>

                  <div className="bg-white border border-gray-200 p-4 rounded-xl space-y-1 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                      <Users className="w-4 h-4 text-[#FF3B30]" /> Capacity
                    </div>
                    <div className="font-bold text-xs text-[#111111]">{vehicle.specs.passengers} Passengers</div>
                  </div>

                  <div className="bg-white border border-gray-200 p-4 rounded-xl space-y-1 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                      <Zap className="w-4 h-4 text-[#FF3B30]" /> Power output
                    </div>
                    <div className="font-bold text-xs text-[#111111]">{vehicle.specs.horsepower} Horsepower</div>
                  </div>

                  <div className="bg-white border border-gray-200 p-4 rounded-xl space-y-1 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                      <Fuel className="w-4 h-4 text-[#FF3B30]" /> Fuel Category
                    </div>
                    <div className="font-bold text-xs text-[#111111]">{vehicle.specs.fuelType}</div>
                  </div>
                </div>
              </div>

              {/* INCLUDED FEATURES & AMENITIES */}
              <div className="space-y-4">
                <h3 className="font-syne text-lg font-bold text-[#111111] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#FF3B30]" /> Key Vehicle Features & Amenities
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {vehicle.features.map((feat, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 rounded-xl p-4 space-y-1 shadow-sm">
                      <div className="flex items-center gap-2 font-bold text-xs text-[#111111]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        {feat.title}
                      </div>
                      <p className="text-[11px] text-gray-500 leading-relaxed font-normal pl-6">
                        {feat.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* RENTAL POLICIES & REQUIREMENTS */}
              <div className="bg-[#9CB4E8]/10 rounded-2xl p-6 border border-[#9CB4E8]/30 space-y-3">
                <h4 className="font-syne text-xs font-bold text-[#5266EB] uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#5266EB]" /> Rental Verification & Requirements
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Original DL & Aadhaar / Passport
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Driver Age 21 Years or Above
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> ₹500 Refundable Deposit Only
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Free Cancellation Up to 24h Before
                  </li>
                </ul>
              </div>

            </div>

            {/* RIGHT COLUMN: RENTAL OVERVIEW & PROCEED TO BOOKING CTA */}
            <div className="lg:col-span-5 sticky top-24">
              
              <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden space-y-6 p-6">
                
                {/* Header */}
                <div className="bg-[#111111] text-white p-6 -m-6 mb-2 space-y-1 relative">
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#FF3B30] bg-[#FF3B30]/10 px-2.5 py-0.5 rounded-full border border-[#FF3B30]/30 font-syne uppercase">
                    <Sparkles className="w-3 h-3" /> Step 1 of 2: Vehicle Overview
                  </div>
                  <h3 className="font-syne text-xl font-extrabold text-white">
                    Rental Overview & Pricing
                  </h3>
                  <p className="text-xs text-gray-400">
                    Review specs and proceed to next page for booking details
                  </p>
                </div>

                {/* Rental Rate Summary */}
                <div className="space-y-4 pt-2">
                  
                  <div className="bg-[#FAFAFC] rounded-2xl p-5 border border-gray-200 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">DAILY RENTAL RATE</span>
                      <div className="text-right">
                        <span className="font-syne text-3xl font-extrabold text-[#111111]">
                          ₹{dailyRateINR.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-gray-500 font-normal"> / day</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-200/70 space-y-2 text-xs text-gray-600">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Reserve Deposit
                        </span>
                        <strong className="text-emerald-700 font-syne">₹500 (100% Refundable)</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Doorstep Handover
                        </span>
                        <strong className="text-[#111111]">Airports & Hotels (Goa)</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Full Insurance
                        </span>
                        <strong className="text-[#111111]">100% Zero-Dep Covered</strong>
                      </div>
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <span className="text-[10px] text-gray-400 block uppercase font-bold">TRANSMISSION</span>
                      <strong className="text-[#111111] font-syne">{vehicle.specs.transmission}</strong>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <span className="text-[10px] text-gray-400 block uppercase font-bold">CAPACITY</span>
                      <strong className="text-[#111111] font-syne">{vehicle.specs.passengers} Seats</strong>
                    </div>
                  </div>

                  {/* PROCEED TO PAGE 2 BOOKING BUTTON */}
                  <div className="pt-2 space-y-3">
                    <Link
                      href={`/car-rentals/cars/${vehicle.id}/book`}
                      className="w-full py-4 rounded-2xl bg-[#5266EB] hover:bg-[#3E51D4] text-[#EDEDF3] font-extrabold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#5266EB]/20 text-center block cursor-pointer hover:scale-[1.01]"
                    >
                      <span>Proceed to Booking Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href="https://wa.me/918208211478?text=Hi%20Aarambha,%20I%20would%20like%20to%20inquire%20about%20booking%20the%20vehicle."
                        target="_blank"
                        rel="noreferrer"
                        className="py-3 px-3 rounded-2xl bg-[#272735] hover:bg-[#171721] text-[#9CB4E8] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 text-center shadow-md border border-[#9CB4E8]/30"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-[#9CB4E8]" />
                        <span>WhatsApp (8208211478)</span>
                      </a>

                      <a
                        href="tel:+917820802985"
                        className="py-3 px-3 rounded-2xl bg-[#171721] hover:bg-[#272735] text-[#EDEDF3] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 text-center shadow-md"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#5266EB]" />
                        <span>Call (7820802985)</span>
                      </a>
                    </div>
                  </div>

                  <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                    ⚡ Instant booking confirmation. Select dates, location, and guest options on the next page.
                  </p>

                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ─── 3. YOU MAY ALSO LIKE ─────────────────────────────────── */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-8">
          
          <div className="flex items-center justify-between">
            <h2 className="font-syne text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
              You May Also Like
            </h2>

            <div className="flex items-center gap-2">
              <Link href="/car-rentals/cars" className="text-xs font-bold text-[#FF3B30] hover:underline flex items-center gap-1">
                View All Vehicles <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedVehicles.map((relCar) => {
              const relRateINR = relCar.pricePerDay;
              return (
                <div
                  key={relCar.id}
                  className="rounded-2xl p-4 bg-white border border-gray-200 hover:border-[#FF3B30] transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
                >
                  <div className="bg-[#F8F9FA] rounded-xl p-3 mb-3 h-32 flex items-center justify-center overflow-hidden">
                    <img src={relCar.image} alt={relCar.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-syne text-sm font-bold text-[#111111] truncate">
                      {relCar.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#FF3B30] font-syne">
                        ₹{relRateINR.toLocaleString('en-IN')}/day
                      </span>
                      <Link
                        href={`/car-rentals/cars/${relCar.id}`}
                        className="px-3 py-1 bg-gray-100 hover:bg-[#FF3B30] hover:text-white text-gray-700 text-[11px] font-bold rounded-full transition-colors"
                      >
                        Book
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Booking Modal Fallback */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={modalItem}
        onSuccess={() => setBookingSuccess({ refNo: 'FL-' + Math.floor(100000 + Math.random() * 900000), totalCost: totalRentalAmount, pickupDate, returnDate, days: computedDays, fullName: 'Valued Guest' })}
      />

      {/* Car Rental Terms & Conditions */}
      <TermsConditionsSection mode="cars" />

      <Footer />
    </div>
  );
}
