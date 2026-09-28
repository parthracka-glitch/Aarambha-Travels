'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import {
  ChevronLeft,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Car,
  Fuel,
  Settings,
  Users,
  Gauge,
  Zap,
  Sparkles,
  CreditCard,
  MessageCircle,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TermsConditionsSection from '@/components/shared/TermsConditionsSection';
import BookingModal, { BookingModalItem } from '@/components/booking/BookingModal';
import { FLEET_VEHICLES, CarVehicle } from '@/constants/carsData';
import { fetchLiveVehicleById } from '@/services/fleet.service';

export default function CarDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FCFAF6]" />}>
      <CarDetailPageContent />
    </Suspense>
  );
}

function CarDetailPageContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const carId = params?.id as string;

  const defaultVehicle = FLEET_VEHICLES.find((v) => v.id === carId) || FLEET_VEHICLES[0];
  const [vehicle, setVehicle] = useState<CarVehicle>(defaultVehicle);
  const [selectedImage, setSelectedImage] = useState(defaultVehicle.image);

  useEffect(() => {
    if (carId) {
      fetchLiveVehicleById(carId).then((liveVeh) => {
        if (liveVeh) {
          setVehicle(liveVeh);
          setSelectedImage(liveVeh.image);
        }
      });
    }
  }, [carId]);

  // Dates & Customer Booking State
  const [pickupDate, setPickupDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const [returnDate, setReturnDate] = useState(() => {
    const future = new Date(Date.now() + 86400000 * 3);
    return future.toISOString().split('T')[0];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('book') === 'true') {
      setIsModalOpen(true);
    }
  }, [searchParams]);

  // Rental math calculation
  const startD = new Date(pickupDate || Date.now());
  const endD = new Date(returnDate || Date.now() + 86400000 * 3);
  const diffTime = Math.max(86400000, endD.getTime() - startD.getTime());
  const computedDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const dailyRateINR = vehicle.pricePerDay;
  const totalRentalAmount = dailyRateINR * computedDays;
  const depositAmount = 500;

  const modalItem: BookingModalItem = {
    id: vehicle.id,
    type: 'car',
    title: vehicle.name,
    subtitle: `${vehicle.category} • ${vehicle.specs.transmission}`,
    image: vehicle.image,
    price: dailyRateINR,
    deposit: depositAmount,
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const whatsappMessage = `*AARAMBHA SELF-DRIVE INQUIRY*%0A━━━━━━━━━━━━━━━━━━━━%0A🚗 *Vehicle:* ${vehicle.name}%0A📅 *Pickup Date:* ${pickupDate}%0A📅 *Return Date:* ${returnDate}%0A⏱ *Duration:* ${computedDays} Days%0A💰 *Estimated Total:* ₹${totalRentalAmount.toLocaleString('en-IN')}%0A━━━━━━━━━━━━━━━━━━━━%0APlease confirm availability for doorstep delivery.`;

  return (
    <div className="min-h-screen bg-[#FCFAF6] text-[#493B34] flex flex-col font-sans">
      
      <Navbar vertical="fleet" />

      {/* ─── 1. BREADCRUMB & HEADER BANNER ─────────────────────────── */}
      <section className="pt-24 pb-12 bg-[#2D1F18] text-white border-b border-[#EDE2D0]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              href="/car-rentals/cars"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#EDE2D0] hover:text-white transition-colors bg-white/10 px-3.5 py-1.5 rounded-full border border-white/20 backdrop-blur-sm"
            >
              <ChevronLeft className="w-4 h-4" /> Back to All Cars
            </Link>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-white pt-2">
              {vehicle.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#C65A2E] hover:bg-[#B24E25] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Reserve (₹500 Deposit)</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─── 2. MAIN VEHICLE SHOWCASE & BOOKING FORM ────────────────── */}
      <section className="py-10 sm:py-12 bg-[#FCFAF6] border-b border-[#EDE2D0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Showcase (8 Cols) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Studio Car Photo Gallery */}
              <div className="space-y-3">
                <div className="relative h-[280px] sm:h-[400px] bg-white rounded-2xl border border-[#EDE2D0] overflow-hidden flex items-center justify-center p-6 shadow-2xs">
                  <img
                    src={selectedImage}
                    alt={vehicle.name}
                    className="w-full h-full object-contain filter contrast-105"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#493B34] text-white text-xs font-semibold">
                    {vehicle.category}
                  </div>
                </div>

                {/* Thumbnails */}
                <div className="grid grid-cols-4 gap-3">
                  {vehicle.gallery.map((thumb, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(thumb)}
                      className={`bg-white rounded-xl p-2 h-20 border transition-all flex items-center justify-center overflow-hidden cursor-pointer ${
                        selectedImage === thumb
                          ? 'border-2 border-[#C65A2E] ring-2 ring-[#C65A2E]/30'
                          : 'border-[#EDE2D0] hover:border-[#E8B9A5]'
                      }`}
                    >
                      <img src={thumb} alt={`Thumbnail ${idx}`} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Basic Car Overview */}
              <div className="bg-white rounded-2xl p-6 border border-[#EDE2D0] space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="px-3 py-1 bg-[#F8EFEA] text-[#C65A2E] font-bold text-xs rounded-full border border-[#E8B9A5]/50 inline-block">
                      {vehicle.category}
                    </span>
                    <h2 className="font-serif text-xl font-bold text-[#493B34] mt-1.5">
                      About {vehicle.name}
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#756B63] font-bold block uppercase tracking-wider">DAILY FARE</span>
                    <span className="font-serif text-2xl font-bold text-[#493B34]">
                      ₹{dailyRateINR.toLocaleString('en-IN')}<span className="text-xs text-[#756B63] font-normal">/day</span>
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#756B63] leading-relaxed">
                  {vehicle.description}
                </p>
              </div>

              {/* TECHNICAL SPECIFICATIONS GRID */}
              <div className="space-y-3.5">
                <h3 className="font-serif text-base font-bold text-[#493B34] flex items-center gap-2">
                  <Settings className="w-4 h-4 text-[#C65A2E]" /> Technical Specifications
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-white border border-[#EDE2D0] p-3.5 rounded-xl space-y-1 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[#756B63] text-xs font-medium">
                      <Car className="w-3.5 h-3.5 text-[#C65A2E]" /> Body Type
                    </div>
                    <div className="font-semibold text-xs text-[#493B34]">{vehicle.specs.bodyType}</div>
                  </div>

                  <div className="bg-white border border-[#EDE2D0] p-3.5 rounded-xl space-y-1 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[#756B63] text-xs font-medium">
                      <Settings className="w-3.5 h-3.5 text-[#C65A2E]" /> Transmission
                    </div>
                    <div className="font-semibold text-xs text-[#493B34]">{vehicle.specs.transmission}</div>
                  </div>

                  <div className="bg-white border border-[#EDE2D0] p-3.5 rounded-xl space-y-1 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[#756B63] text-xs font-medium">
                      <Gauge className="w-3.5 h-3.5 text-[#C65A2E]" /> Engine Output
                    </div>
                    <div className="font-semibold text-xs text-[#493B34]">{vehicle.specs.engine}</div>
                  </div>

                  <div className="bg-white border border-[#EDE2D0] p-3.5 rounded-xl space-y-1 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[#756B63] text-xs font-medium">
                      <Users className="w-3.5 h-3.5 text-[#C65A2E]" /> Seating Capacity
                    </div>
                    <div className="font-semibold text-xs text-[#493B34]">{vehicle.specs.passengers} Passengers</div>
                  </div>

                  <div className="bg-white border border-[#EDE2D0] p-3.5 rounded-xl space-y-1 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[#756B63] text-xs font-medium">
                      <Zap className="w-3.5 h-3.5 text-[#C65A2E]" /> Power Output
                    </div>
                    <div className="font-semibold text-xs text-[#493B34]">{vehicle.specs.horsepower} HP</div>
                  </div>

                  <div className="bg-white border border-[#EDE2D0] p-3.5 rounded-xl space-y-1 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[#756B63] text-xs font-medium">
                      <Fuel className="w-3.5 h-3.5 text-[#C65A2E]" /> Fuel Type
                    </div>
                    <div className="font-semibold text-xs text-[#493B34]">{vehicle.specs.fuelType}</div>
                  </div>
                </div>
              </div>

              {/* INCLUDED FEATURES & AMENITIES */}
              <div className="space-y-3.5">
                <h3 className="font-serif text-base font-bold text-[#493B34] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C65A2E]" /> Key Vehicle Amenities
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {vehicle.features.map((feat, idx) => (
                    <div key={idx} className="bg-white border border-[#EDE2D0] rounded-2xl p-3.5 space-y-1 shadow-2xs">
                      <div className="flex items-center gap-2 font-semibold text-xs text-[#493B34]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        {feat.title}
                      </div>
                      <p className="text-[11px] text-[#756B63] leading-relaxed font-normal pl-6">
                        {feat.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Booking Sticky Card (4 Cols) */}
            <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
              
              <div className="bg-white border border-[#EDE2D0] rounded-2xl p-6 space-y-5 shadow-md">
                
                {/* Fare Breakdown */}
                <div className="space-y-2 pb-4 border-b border-[#EDE2D0]">
                  <span className="text-[10px] text-[#756B63] block uppercase font-bold tracking-wider">
                    Instant Self-Drive Booking
                  </span>
                  
                  <div className="flex items-baseline justify-between">
                    <div className="font-serif text-2xl font-bold text-[#493B34]">
                      ₹{dailyRateINR.toLocaleString('en-IN')}<span className="text-xs text-[#756B63] font-normal"> /day</span>
                    </div>
                    <span className="text-xs font-semibold text-[#756B63]">
                      {computedDays} Day{computedDays > 1 ? 's' : ''} Duration
                    </span>
                  </div>

                  <div className="p-3 bg-[#F8EFEA] rounded-xl border border-[#E8B9A5]/50 text-[#C65A2E] text-xs flex items-center justify-between">
                    <span className="font-semibold text-[#493B34]">Advance to Reserve:</span>
                    <strong className="font-bold text-[#C65A2E]">₹{depositAmount} Only</strong>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleBookingSubmit} className="space-y-3.5 text-xs">
                  
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="font-semibold text-[#493B34] block">Pickup Date</label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full bg-[#FCFAF6] border border-[#EDE2D0] rounded-xl px-2.5 py-2 text-xs text-[#493B34] focus:outline-none focus:border-[#C65A2E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-[#493B34] block">Return Date</label>
                      <input
                        type="date"
                        required
                        min={pickupDate}
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="w-full bg-[#FCFAF6] border border-[#EDE2D0] rounded-xl px-2.5 py-2 text-xs text-[#493B34] focus:outline-none focus:border-[#C65A2E]"
                      />
                    </div>
                  </div>

                  {/* Pricing Summary */}
                  <div className="p-3.5 bg-[#FCFAF6] rounded-xl border border-[#EDE2D0] space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#756B63]">
                      <span>Daily Rate:</span>
                      <span>₹{dailyRateINR.toLocaleString('en-IN')} × {computedDays}d</span>
                    </div>
                    <div className="flex justify-between text-[#756B63]">
                      <span>Total Estimated Fare:</span>
                      <strong className="text-[#493B34]">₹{totalRentalAmount.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="flex justify-between pt-1.5 border-t border-[#EDE2D0] text-[#493B34] font-bold">
                      <span>Payable Now (Advance):</span>
                      <span className="text-[#C65A2E]">₹{depositAmount}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#C65A2E] hover:bg-[#B24E25] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Reserve Vehicle Now (₹{depositAmount})</span>
                  </button>

                  <a
                    href={`https://wa.me/918208211478?text=${encodeURIComponent(whatsappMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Inquire on WhatsApp</span>
                  </a>

                </form>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Terms & Conditions Section */}
      <TermsConditionsSection mode="cars" />

      <Footer />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={modalItem}
      />
    </div>
  );
}
