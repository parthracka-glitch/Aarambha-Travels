'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Globe, MessageCircle, Share2, Compass, Sparkles, Star, CheckCircle2, Phone } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TermsConditionsSection from '@/components/shared/TermsConditionsSection';
import FAQSection from '@/components/home/FAQSection';
import WhatsAppEnquiryForm from '@/components/home/WhatsAppEnquiryForm';
import CompanyLocationSection from '@/components/home/CompanyLocationSection';
import { FLEET_VEHICLES, SHARED_CAR_CONTACT } from '@/constants/carsData';

export default function CarRentalHomePage() {
  const [activeCarIndex, setActiveCarIndex] = useState(1); // Zephyr A4 Stratos active
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      quote: "My Aarambha experience was nothing short of incredible. The pristine car and impeccable service made my trip unforgettable. I'll be back for more.",
      name: "Aleea Thompson",
      role: "Verified Self-Drive Client",
      location: "Jaipur, Rajasthan",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=70&w=150&auto=format&fit=crop",
    },
    {
      quote: "Renting from Aarambha was smooth from start to finish. The vehicle was in mint condition and doorstep delivery saved me so much time!",
      name: "David Vance",
      role: "Corporate Traveler",
      location: "Shimla, Himachal Pradesh",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=70&w=150&auto=format&fit=crop",
    },
    {
      quote: "Top notch fleet and transparent pricing with zero hidden security deposit hassles. Aarambha is now our go-to for luxury family road trips.",
      name: "Priya Sharma",
      role: "Executive Member",
      location: "Munnar, Kerala",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=70&w=150&auto=format&fit=crop",
    },
  ];

  // Auto-rotate review cards every 4.5s (pauses on hover)
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const homepageFleet = FLEET_VEHICLES;

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#18181B] flex flex-col font-sans selection:bg-[#FF3B30] selection:text-white">
      
      <Navbar vertical="fleet" />

      {/* ─── 1. FULL-SCREEN HERO SECTION ──────────────────────────── */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center text-center overflow-hidden bg-gray-900 text-white border-b border-gray-800">
        
        {/* Full-bleed background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/car_rentals_bg.jpg?v=2"
            alt="Aarambha Luxury Self-Drive Car"
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover object-center scale-105 filter brightness-115 contrast-105"
          />
          {/* Lightened soft vignette for crystal clear vehicle visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
        </div>

        {/* Hero Content Overlay (Centered) */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-24 w-full flex flex-col items-center justify-center text-center">
          <div className="max-w-3xl space-y-6 flex flex-col items-center justify-center text-center">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-xs font-extrabold text-amber-400 tracking-widest uppercase shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> SELF-DRIVE LUXURY FLEET
            </div>

            <h1 className="font-syne text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white drop-shadow-2xl leading-none">
              CAR RENTALS
            </h1>

            <p className="text-xs sm:text-base text-gray-200 max-w-xl mx-auto leading-relaxed font-medium drop-shadow">
              Drive 4x4 SUVs, luxury sedans, coupes & convertibles with 100% full insurance, doorstep pickup & delivery with zero security deposit friction.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/car-rentals/cars"
                className="btn-red-pill text-xs font-extrabold px-9 py-4 rounded-full bg-[#FF3B30] text-white hover:bg-[#E03126] hover:scale-105 transition-all inline-flex items-center gap-2 shadow-2xl shadow-red-600/40 uppercase tracking-widest"
              >
                <span>EXPLORE FLEET</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={`tel:+91${SHARED_CAR_CONTACT.callPhone}`}
                className="text-xs font-bold px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md transition-all inline-flex items-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-[#FF3B30]" />
                <span>Call {SHARED_CAR_CONTACT.callPhoneDisplay}</span>
              </a>

              <a
                href={`https://wa.me/91${SHARED_CAR_CONTACT.whatsappPhone}?text=Hi%20Aarambha%20Car%20Rentals,%20I%20would%20like%20to%20inquire%20about%20self-drive%20cars.`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold px-6 py-4 rounded-full bg-emerald-600/90 hover:bg-emerald-600 text-white border border-emerald-400/40 backdrop-blur-md transition-all inline-flex items-center gap-2 shadow-lg"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>WhatsApp {SHARED_CAR_CONTACT.whatsappPhoneDisplay}</span>
              </a>
            </div>

            {/* Social Icons (Centered) */}
            <div className="pt-4 flex items-center justify-center gap-3 text-gray-300">
              <button className="w-9 h-9 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm flex items-center justify-center hover:text-[#FF3B30] hover:border-[#FF3B30] transition-all">
                <Globe className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm flex items-center justify-center hover:text-[#FF3B30] hover:border-[#FF3B30] transition-all">
                <MessageCircle className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm flex items-center justify-center hover:text-[#FF3B30] hover:border-[#FF3B30] transition-all">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm flex items-center justify-center hover:text-[#FF3B30] hover:border-[#FF3B30] transition-all">
                <Compass className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </section>

      {/* ─── 2. PARTNER LOGO STRIP ───────────────────────────────── */}
      <section className="bg-white py-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-wrap items-center justify-between gap-6 opacity-60">
            {['Logoipsum', 'logoipsum', 'logoipsum', 'logoipsum', 'Logoipsum', 'Logoipsum'].map((logo, idx) => (
              <div key={idx} className="flex items-center gap-2 font-bold text-xs text-gray-700 tracking-tight">
                <div className="w-4 h-4 bg-gray-900 rounded-sm flex items-center justify-center text-white text-[8px]">●</div>
                <span>{logo}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. OUR IMPRESSIVE FLEET ───────────────────────────────── */}
      <section className="py-20 bg-[#FAFAFC] content-defer border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#FF3B30] tracking-widest uppercase block font-syne">
              THE FLEET
            </span>
            <h2 className="font-syne text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
              Our Impressive Fleet
            </h2>
            <p className="text-xs text-gray-500 font-normal">
              Select from our meticulously maintained fleet of self-drive vehicles for every journey.
            </p>
          </div>

          {/* Minimal & Professional Fleet Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {homepageFleet.map((car) => {
              const priceINR = car.pricePerDay;
              return (
                <div
                  key={car.id}
                  className="group rounded-2xl bg-white border border-gray-200/80 hover:border-gray-300 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
                >
                  {/* Clean Studio Image Header */}
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#F4F5F7] flex items-center justify-center">
                    <img
                      src={car.image}
                      alt={car.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-semibold text-white border border-white/20">
                      {car.category || 'Luxury'}
                    </div>
                  </div>

                  {/* Minimal Card Details */}
                  <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                    <div className="space-y-3">
                      <h3 className="font-syne text-lg font-bold text-gray-900 group-hover:text-[#FF3B30] transition-colors">
                        {car.name}
                      </h3>

                      {/* Specs Badges */}
                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-gray-600">
                        <span className="bg-gray-100 px-2.5 py-1 rounded-md font-medium">
                          {car.specs?.transmission || 'Automatic'}
                        </span>
                        <span className="bg-gray-100 px-2.5 py-1 rounded-md font-medium">
                          {car.specs?.fuelType || 'Petrol'}
                        </span>
                        <span className="bg-gray-100 px-2.5 py-1 rounded-md font-medium">
                          {car.specs?.passengers || 5} Seats
                        </span>
                      </div>
                    </div>

                    {/* Footer Price & Action */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <span className="text-[9px] text-gray-400 block uppercase font-semibold">Starting at</span>
                        <span className="text-lg font-extrabold text-gray-900 font-syne">
                          ₹{priceINR.toLocaleString('en-IN')}<span className="text-xs font-normal text-gray-500"> / day</span>
                        </span>
                      </div>

                      <Link
                        href={`/car-rentals/cars/${car.id}`}
                        className="text-xs font-bold px-5 py-2.5 rounded-full bg-[#111111] hover:bg-[#FF3B30] text-white transition-all duration-200 inline-flex items-center gap-1.5 shadow-sm"
                      >
                        <span>Book Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ─── 4. WHY CHOOSE AARAMBHA? ───────────────────────────────── */}
      <section className="py-16 bg-white border-t border-gray-200 content-defer">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-4 space-y-3">
              <h2 className="font-syne text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
                Why Choose<br />Aarambha?
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed font-normal">
                Join our satisfied customers who trust us for their journeys. We serve with a lot of values that you can feel directly.
              </p>
            </div>

            <div className="lg:col-span-8 relative py-4 flex items-center justify-center">
              <div className="w-full max-w-lg aspect-[16/9] relative">
                <img
                  src="https://images.unsplash.com/photo-1555215695-3004980ad54e?q=70&w=800&auto=format&fit=crop"
                  alt="Why Choose Red Car"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Floating Feature Cards */}
              <div className="absolute top-0 left-2 bg-white border border-gray-200 rounded-xl p-3 max-w-[180px] text-xs space-y-0.5 hidden sm:block">
                <h4 className="font-bold text-[#111111]">Easy Booking</h4>
                <p className="text-[10px] text-gray-500 leading-tight">Reserve your car in a few clicks.</p>
              </div>

              <div className="absolute top-2 right-2 bg-white border border-gray-200 rounded-xl p-3 max-w-[180px] text-xs space-y-0.5 hidden sm:block">
                <h4 className="font-bold text-[#111111]">Quality & Variety</h4>
                <p className="text-[10px] text-gray-500 leading-tight">Explore diverse premium vehicles.</p>
              </div>

              <div className="absolute bottom-2 right-2 bg-white border border-gray-200 rounded-xl p-3 max-w-[180px] text-xs space-y-0.5 hidden sm:block">
                <h4 className="font-bold text-[#111111]">Affordable Rates</h4>
                <p className="text-[10px] text-gray-500 leading-tight">Competitive prices without hidden fees.</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─── 5. EXECUTIVE TESTIMONIAL SHOWCASE ──────────────────────── */}
      <section className="py-24 bg-[#090D14] text-white relative overflow-hidden content-defer border-t border-gray-800">
        
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-10 text-center">
          
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#FF3B30] tracking-widest uppercase block font-syne">
              CLIENT TESTIMONIALS
            </span>
            <h2 className="font-syne text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Trusted by Discerning Travelers
            </h2>
          </div>

          {/* Luxury Glassmorphism Card (Auto-rotating, pauses on hover) */}
          <div
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12 space-y-8 shadow-2xl relative transition-all duration-300 hover:border-white/20"
          >
            
            {/* 5-Star Rating & Verified Badge */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div className="flex items-center gap-1.5 text-amber-400">
                {[...Array(testimonials[currentTestimonialIndex].rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs font-bold text-gray-300 ml-1">5.0 / 5.0</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Reservation
              </div>
            </div>

            {/* Quote Body */}
            <blockquote className="font-serif text-lg sm:text-2xl italic font-normal text-gray-100 leading-relaxed max-w-2xl mx-auto min-h-[90px] flex items-center justify-center transition-all duration-300">
              &ldquo;{testimonials[currentTestimonialIndex].quote}&rdquo;
            </blockquote>

            {/* Author Profile & Navigation Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3.5 text-center sm:text-left">
                <img
                  src={testimonials[currentTestimonialIndex].avatar}
                  alt={testimonials[currentTestimonialIndex].name}
                  loading="lazy"
                  decoding="async"
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#FF3B30]"
                />
                <div>
                  <h4 className="font-bold text-sm text-white font-syne">
                    {testimonials[currentTestimonialIndex].name}
                  </h4>
                  <p className="text-xs text-gray-400 font-medium">
                    {testimonials[currentTestimonialIndex].role} &bull; <span className="text-gray-300">{testimonials[currentTestimonialIndex].location}</span>
                  </p>
                </div>
              </div>

              {/* Navigation & Progress Dots */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentTestimonialIndex(idx)}
                      aria-label={`Review ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentTestimonialIndex
                          ? 'w-6 bg-[#FF3B30]'
                          : 'w-1.5 bg-white/30 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
                  <button
                    onClick={() => setCurrentTestimonialIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                    aria-label="Previous Testimonial"
                    className="w-9 h-9 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-all duration-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentTestimonialIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                    aria-label="Next Testimonial"
                    className="w-9 h-9 rounded-full border border-white/20 bg-white/5 hover:bg-white/15 text-white flex items-center justify-center transition-all duration-200"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─── 6. HOW IT WORKS ──────────────────────────────────────── */}
      <section id="how-it-works" className="py-16 bg-white border-t border-gray-200 content-defer">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 space-y-12">
          
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block font-syne">
              HOW IT WORKS
            </span>
            <h2 className="font-syne text-2xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
              Simple Steps to Get the Car
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="space-y-2 text-center sm:text-left p-4 rounded-xl border border-gray-200 bg-[#FAFAFC]">
              <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-xs">
                👆
              </div>
              <h3 className="font-syne text-sm font-bold text-[#111111]">1. Select</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-normal">
                Choose your desired car from our fleet.
              </p>
            </div>

            <div className="space-y-2 text-center sm:text-left p-4 rounded-xl border border-red-200 bg-red-50/50">
              <div className="w-12 h-12 rounded-lg bg-[#FF3B30] text-white flex items-center justify-center font-bold text-xs">
                📑
              </div>
              <h3 className="font-syne text-sm font-bold text-[#111111]">2. Book</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-normal">
                Reserve your car online or through our app.
              </p>
            </div>

            <div className="space-y-2 text-center sm:text-left p-4 rounded-xl border border-gray-200 bg-[#FAFAFC]">
              <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-xs">
                🚗
              </div>
              <h3 className="font-syne text-sm font-bold text-[#111111]">3. Drive</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-normal">
                Pick up your car and hit the road.
              </p>
            </div>

            <div className="space-y-2 text-center sm:text-left p-4 rounded-xl border border-gray-200 bg-[#FAFAFC]">
              <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-xs">
                🏁
              </div>
              <h3 className="font-syne text-sm font-bold text-[#111111]">4. Return</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-normal">
                Bring the car back at the end of your rental.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ─── 7. DEDICATED CAR RENTALS FAQS ────────────────────────── */}
      <FAQSection mode="cars" />

      {/* ─── 8. DEDICATED CAR RENTALS WHATSAPP INQUIRY FORM ───────── */}
      <WhatsAppEnquiryForm mode="cars" />

      {/* ─── 9. CAR RENTAL LOCATION & CONTACT ─────────────────────── */}
      <CompanyLocationSection mode="cars" />

      {/* ─── 10. CAR RENTALS DEDICATED TERMS & CONDITIONS ─────────── */}
      <TermsConditionsSection mode="cars" />

      <Footer />

    </div>
  );
}
