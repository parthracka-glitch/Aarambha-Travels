'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Car,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Phone,
  MessageCircle,
  Clock,
  Award,
  Users,
  Fuel,
  Gauge,
  Sparkles,
  ArrowRight,
  Star,
  Zap,
  Calendar,
  Key,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CompanyLocationSection from '@/components/home/CompanyLocationSection';
import TermsConditionsSection from '@/components/shared/TermsConditionsSection';
import BookingModal, { BookingModalItem } from '@/components/booking/BookingModal';
import { FLEET_VEHICLES, CarVehicle } from '@/constants/carsData';
import { SHARED_BUS_CONTACT } from '@/constants/busData';
import { fetchLiveFleetVehicles } from '@/services/fleet.service';

export default function CarRentalsLandingPage() {
  const [carsList, setCarsList] = useState<CarVehicle[]>(FLEET_VEHICLES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCarForModal, setSelectedCarForModal] = useState<CarVehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchLiveFleetVehicles().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setCarsList(data);
      }
    });
  }, []);

  const categories = [
    { id: 'all', label: 'All Fleet' },
    { id: 'Hatchback', label: 'Hatchbacks' },
    { id: 'Sedan', label: 'Sedans' },
    { id: 'SUV', label: 'SUVs & 7-Seaters' },
  ];

  const filteredCars = selectedCategory === 'all'
    ? carsList
    : carsList.filter((car) => car.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleOpenBooking = (car: CarVehicle) => {
    setSelectedCarForModal(car);
    setIsModalOpen(true);
  };

  const modalItem: BookingModalItem | undefined = selectedCarForModal
    ? {
        id: selectedCarForModal.id,
        type: 'car',
        title: selectedCarForModal.name,
        subtitle: `${selectedCarForModal.category} • ${selectedCarForModal.specs.transmission} • ${selectedCarForModal.specs.fuelType}`,
        image: selectedCarForModal.image,
        price: selectedCarForModal.pricePerDay,
        deposit: 500,
      }
    : undefined;

  const carReviews = [
    {
      name: 'Rohan Deshmukh',
      role: 'Self-Drive Customer',
      location: 'Viman Nagar, Pune',
      vehicle: 'Mahindra Thar 4x4 Diesel',
      rating: 5,
      review:
        'Zero security deposit hassle, car was delivered to my doorstep in 45 minutes, clean condition and well maintained engine for our Goa road trip.',
    },
    {
      name: 'Pooja Sharma',
      role: 'Weekend Traveler',
      location: 'Baner, Pune',
      vehicle: 'Maruti Baleno Automatic',
      rating: 5,
      review:
        'Seamless experience! Booking took less than 2 minutes, smooth automatic transmission, and the car smelled fresh. Will definitely rent again for my next trip to Mahabaleshwar.',
    },
    {
      name: 'Amitabh Sen',
      role: 'Family Vacationer',
      location: 'Kothrud, Pune',
      vehicle: 'Toyota Innova Crysta',
      rating: 5,
      review:
        'Rented the Innova Crysta for a family visit to Shirdi and Nashik. Immensely comfortable, great fuel efficiency, and super responsive support team in Pune.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FCFAF6] text-[#493B34] flex flex-col font-sans select-none">
      {/* Top Navbar */}
      <Navbar vertical="fleet" />

      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION: SELF-DRIVE CARS BANNER
          ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-20 bg-[#FCFAF6] border-b border-[#EDE2D0] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src="/images/car_rentals_bg.jpg"
            alt="Self-Drive Car Fleet Background"
            className="w-full h-full object-cover opacity-60 filter brightness-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/luxury_fleet_vehicles.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FCFAF6] via-[#FCFAF6]/50 to-[#FCFAF6]/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FCFAF6]/85 via-[#FCFAF6]/55 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/90 border border-[#EDE2D0] shadow-2xs text-[#493B34] text-xs font-semibold uppercase tracking-wider">
            <Car className="w-3.5 h-3.5 text-[#C65A2E]" />
            <span>आरंभ Self-Drive Mobility</span>
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-[#493B34]">
              Self-Drive Car <br />
              <span className="text-[#C65A2E] font-serif italic">Rentals in Pune</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#756B63] max-w-2xl leading-relaxed font-normal">
              Rent sanitized Maruti Swift, Hyundai Creta, Mahindra Thar, Ertiga, and Innova Crysta with ₹0 security deposit hassle, unlimited kilometers, and doorstep delivery across Pune.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl pt-2">
            <div className="bg-white/90 p-3.5 rounded-2xl border border-[#EDE2D0] shadow-2xs">
              <span className="text-xl font-bold text-[#C65A2E] block">₹0 Deposit</span>
              <span className="text-[11px] text-[#756B63]">No Security Blocking</span>
            </div>
            <div className="bg-white/90 p-3.5 rounded-2xl border border-[#EDE2D0] shadow-2xs">
              <span className="text-xl font-bold text-[#493B34] block">Unlimited KM</span>
              <span className="text-[11px] text-[#756B63]">Drive Without Limits</span>
            </div>
            <div className="bg-white/90 p-3.5 rounded-2xl border border-[#EDE2D0] shadow-2xs">
              <span className="text-xl font-bold text-[#493B34] block">Doorstep Delivery</span>
              <span className="text-[11px] text-[#756B63]">Anywhere in Pune</span>
            </div>
            <div className="bg-white/90 p-3.5 rounded-2xl border border-[#EDE2D0] shadow-2xs">
              <span className="text-xl font-bold text-[#493B34] block">24/7 Roadside</span>
              <span className="text-[11px] text-[#756B63]">Instant Assistance</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. FLEET INVENTORY SECTION
          ───────────────────────────────────────────────────────────── */}
      <section id="fleet-inventory" className="py-14 bg-[#FCFAF6] border-b border-[#EDE2D0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EDE2D0] pb-4">
            <div>
              <span className="text-xs font-bold text-[#C65A2E] uppercase tracking-wider block mb-0.5">
                Verified Available Vehicles
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#493B34] tracking-tight">
                Self-Drive Car Catalog
              </h2>
              <p className="text-xs text-[#756B63] mt-0.5 font-normal">
                Choose your favorite hatchback, sedan, or rugged SUV.
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap items-center bg-[#EDE2D0]/40 p-1 rounded-xl border border-[#EDE2D0] shadow-2xs text-xs font-semibold gap-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#C65A2E] text-white shadow-xs'
                      : 'text-[#756B63] hover:text-[#493B34]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <div
                key={car.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#EDE2D0] shadow-sm hover:shadow-md hover:border-[#E8B9A5] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-52 w-full overflow-hidden bg-[#FDFBF7] flex items-center justify-center p-4">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg bg-[#493B34] text-white text-xs font-semibold shadow-xs">
                        {car.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <h3 className="font-serif text-lg font-bold text-[#493B34] group-hover:text-[#C65A2E] transition-colors">
                      {car.name}
                    </h3>

                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#EDE2D0] text-center text-xs text-[#756B63]">
                      <div className="flex flex-col items-center">
                        <Users className="w-3.5 h-3.5 text-[#C65A2E] mb-0.5" />
                        <span>{car.specs.passengers} Seats</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Gauge className="w-3.5 h-3.5 text-[#C65A2E] mb-0.5" />
                        <span>{car.specs.transmission}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Fuel className="w-3.5 h-3.5 text-[#C65A2E] mb-0.5" />
                        <span>{car.specs.fuelType}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#756B63] pt-1">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#C65A2E]" /> Zero Deposit
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#C65A2E]" /> Pune Delivery
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-[#EDE2D0] mt-4 space-y-3">
                  <div className="flex items-center justify-between pt-3">
                    <div>
                      <span className="text-[11px] text-[#756B63] block font-medium">Daily Rate</span>
                      <span className="text-lg sm:text-xl font-bold text-[#493B34]">
                        ₹{car.pricePerDay.toLocaleString('en-IN')}{' '}
                        <span className="text-xs text-[#756B63]">/day</span>
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-[#C65A2E] bg-[#F8EFEA] border border-[#E8B9A5]/50 px-2.5 py-1 rounded-lg">
                      ₹500 Deposit
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/car-rentals/cars/${car.id}`}
                      className="h-10 rounded-xl bg-[#FCFAF6] hover:bg-[#EDE2D0]/60 border border-[#EDE2D0] text-[#493B34] text-xs font-semibold flex items-center justify-center transition-all shadow-2xs"
                    >
                      View Specs
                    </Link>
                    <button
                      onClick={() => handleOpenBooking(car)}
                      className="h-10 rounded-xl bg-[#C65A2E] hover:bg-[#B24E25] text-white text-xs font-semibold flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer"
                    >
                      <span>Book Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. HOW IT WORKS / EASY 3-STEP PROCESS
          ───────────────────────────────────────────────────────────── */}
      <section className="py-14 bg-white border-b border-[#EDE2D0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#C65A2E] uppercase tracking-wider block">
              Quick &amp; Hassle-Free
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#493B34] tracking-tight">
              How Self-Drive Rental Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#FCFAF6] border border-[#EDE2D0] shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F8EFEA] border border-[#E8B9A5]/50 flex items-center justify-center text-[#C65A2E] font-bold text-sm">
                1
              </div>
              <h3 className="font-serif text-lg font-bold text-[#493B34]">Select Car &amp; Dates</h3>
              <p className="text-xs text-[#756B63] leading-relaxed">
                Pick your preferred car model, specify pickup date/time, and choose doorstep delivery anywhere in Pune.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FCFAF6] border border-[#EDE2D0] shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F8EFEA] border border-[#E8B9A5]/50 flex items-center justify-center text-[#C65A2E] font-bold text-sm">
                2
              </div>
              <h3 className="font-serif text-lg font-bold text-[#493B34]">Reserve with ₹500</h3>
              <p className="text-xs text-[#756B63] leading-relaxed">
                Fill the simple traveler form and pay a nominal ₹500 advance deposit via instant UPI to lock your car.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FCFAF6] border border-[#EDE2D0] shadow-2xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F8EFEA] border border-[#E8B9A5]/50 flex items-center justify-center text-[#C65A2E] font-bold text-sm">
                3
              </div>
              <h3 className="font-serif text-lg font-bold text-[#493B34]">Doorstep Handover &amp; Drive</h3>
              <p className="text-xs text-[#756B63] leading-relaxed">
                Our representative brings the sanitized vehicle to your location, verifies your Driving License, and hands over keys!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. REVIEWS SECTION
          ───────────────────────────────────────────────────────────── */}
      <section className="py-14 bg-[#FCFAF6] border-b border-[#EDE2D0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#C65A2E] uppercase tracking-wider block">
              Customer Experiences
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#493B34] tracking-tight">
              Verified Self-Drive Reviews
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {carReviews.map((rev, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white border border-[#EDE2D0] shadow-2xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, r) => (
                      <Star key={r} className="w-4 h-4 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#756B63] leading-relaxed italic">
                    &ldquo;{rev.review}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EDE2D0]">
                  <p className="text-xs font-bold text-[#493B34]">{rev.name}</p>
                  <p className="text-[11px] text-[#756B63]">{rev.role} • {rev.vehicle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CAR RENTAL TERMS & CONDITIONS */}
      <TermsConditionsSection mode="cars" />

      {/* 6. LOCATION */}
      <CompanyLocationSection />

      {/* 7. FOOTER */}
      <Footer />

      {/* Live Booking Modal */}
      {modalItem && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          item={modalItem}
        />
      )}
    </div>
  );
}
