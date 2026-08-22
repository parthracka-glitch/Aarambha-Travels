'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Globe, MessageCircle, Share2, Compass, Sparkles, Star, CheckCircle2, Phone, X, Bus, MapPin, Users, Clock, Shield } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import TermsConditionsSection from '@/components/shared/TermsConditionsSection';
import FAQSection from '@/components/home/FAQSection';
import WhatsAppEnquiryForm from '@/components/home/WhatsAppEnquiryForm';
import CompanyLocationSection from '@/components/home/CompanyLocationSection';
import { BUS_CAROUSEL_IMAGES, BUS_RULES_AND_GUIDELINES, SHARED_BUS_CONTACT } from '@/constants/busData';

export default function BusRentalHomePage() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate hero bus carousel images every 4s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % BUS_CAROUSEL_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const testimonials = [
    {
      quote: "Renting a 35-seater bus for our Pune to Mahabaleshwar family trip was seamless with Aarambha. Driver was punctual, vehicle was clean, and rates were completely transparent.",
      name: "Rahul Deshmukh",
      role: "Family Group Organizer",
      location: "Pune, Maharashtra",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=70&w=150&auto=format&fit=crop",
    },
    {
      quote: "We hired 2 Urbania 17-seaters for our company corporate retreat from Pune to Mumbai. Top notch AC, comfortable seats, and zero hassles.",
      name: "Ananya Kulkarni",
      role: "Corporate Travel Manager",
      location: "Kharadi, Pune",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=70&w=150&auto=format&fit=crop",
    },
    {
      quote: "Best bus rental service in Katraj & Pune! Booked a 45-seater bus for a wedding party. Honest pricing with no hidden charges.",
      name: "Vikram Patil",
      role: "Wedding Host",
      location: "Katraj, Pune",
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

  const subsections = [
    {
      id: 'bus-rental',
      title: 'Outstation Bus Rental',
      subtitle: 'Pune–Mumbai, Mahabaleshwar & Per-KM Rates',
      description: '5-seater to 50-seater AC & Non-AC buses, Urbania & Tempo Travellers for outstation travel.',
      href: '/bus-rentals/bus-rental',
      icon: <Bus className="w-7 h-7" />,
      gradient: 'from-[#5266EB] to-[#3E51D4]',
      badge: 'Outstation Packages',
      features: ['Pune → Mumbai (up to 350 KM)', 'Pune → Mahabaleshwar (up to 300 KM)', 'Urbania Per-Day Rates (300 KM/day)', 'AC & Non-AC Luxury Coaches'],
    },
    {
      id: 'local-trips',
      title: 'Local Rental Trips',
      subtitle: 'Pune City Packages (8 Hrs / 80 KM)',
      description: 'Local AC/Non-AC bus rentals in Pune for corporate events, weddings, city sightseeing, & functions.',
      href: '/bus-rentals/local-trips',
      icon: <MapPin className="w-7 h-7" />,
      gradient: 'from-[#9CB4E8] to-[#5266EB]',
      badge: '8 Hrs / 80 KM Included',
      features: ['Local AC Bus Packages', 'Local Non-AC Bus Packages', 'Urbania Local 80 KM Package', 'Wedding & Corporate Events'],
    },
    {
      id: 'car-rental',
      title: 'Car Rental',
      subtitle: 'Self-Drive Luxury Fleet',
      description: 'Self-drive SUVs, sedans, and hatchbacks with zero deposit friction and doorstep delivery across Pune.',
      href: '/bus-rentals/car-rental',
      icon: <Sparkles className="w-7 h-7" />,
      gradient: 'from-[#171721] to-[#272735]',
      badge: 'Self-Drive Fleet',
      features: ['Luxury SUVs & Sedans', '100% Full Insurance Included', 'Doorstep Pickup & Delivery', 'Zero Deposit Friction'],
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#18181B] flex flex-col font-sans selection:bg-[#5266EB] selection:text-white">
      
      <Navbar vertical="fleet" />

      {/* ─── 1. FULL-SCREEN HERO CAROUSEL SECTION ─────────────────── */}
      <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center text-center overflow-hidden bg-gray-900 text-white border-b border-gray-800">
        
        {/* Full-bleed background slideshow */}
        {BUS_CAROUSEL_IMAGES.map((img, idx) => (
          <div
            key={img.src}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlideIndex ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
            }`}
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover object-center filter brightness-110 contrast-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20" />
          </div>
        ))}

        {/* TOP RIGHT CLOSE ICON (X) */}
        <Link
          href="/"
          aria-label="Return to Dashboard / Home"
          title="Return to Dashboard / Home"
          className="absolute top-4 right-4 sm:top-8 sm:right-8 z-30 p-2.5 sm:p-3.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all cursor-pointer border border-white/30 shadow-2xl hover:scale-110 active:scale-95 group"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3] group-hover:rotate-90 transition-transform duration-300" />
        </Link>

        {/* Carousel Slide Indicators (Left / Right Controls) */}
        <button
          onClick={() => setCurrentSlideIndex((prev) => (prev === 0 ? BUS_CAROUSEL_IMAGES.length - 1 : prev - 1))}
          aria-label="Previous Slide"
          className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={() => setCurrentSlideIndex((prev) => (prev === BUS_CAROUSEL_IMAGES.length - 1 ? 0 : prev + 1))}
          aria-label="Next Slide"
          className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Hero Content Overlay (Centered) */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-24 w-full flex flex-col items-center justify-center text-center">
          <div className="max-w-3xl space-y-6 flex flex-col items-center justify-center text-center">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5266EB]/20 backdrop-blur-md border border-[#5266EB]/40 text-xs font-extrabold text-[#9CB4E8] tracking-widest uppercase shadow-lg">
              <Bus className="w-3.5 h-3.5 text-[#5266EB]" /> 5 TO 50 SEATER BUS & URBANIA FLEET
            </div>

            <h1 className="font-syne text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white drop-shadow-2xl leading-none">
              BUS RENTALS
            </h1>

            <p className="text-xs sm:text-base text-gray-200 max-w-xl mx-auto leading-relaxed font-medium drop-shadow">
              Rent 13 to 49 seater AC & Non-AC buses, Force Urbania, and yellow-plate outstation transport between Pune, Mumbai & Mahabaleshwar with 100% transparent pricing.
            </p>

            {/* Current Slide Label Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-gray-200">
              <span>Showing: <strong className="text-white">{BUS_CAROUSEL_IMAGES[currentSlideIndex].label}</strong></span>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#subsections"
                className="btn-red-pill text-xs font-extrabold px-9 py-4 rounded-full bg-[#5266EB] text-white hover:bg-[#3E51D4] hover:scale-105 transition-all inline-flex items-center gap-2 shadow-2xl shadow-[#5266EB]/40 uppercase tracking-widest"
              >
                <span>EXPLORE SERVICES</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={`tel:+91${SHARED_BUS_CONTACT.callPhone}`}
                className="text-xs font-bold px-6 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md transition-all inline-flex items-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-[#5266EB]" />
                <span>Call {SHARED_BUS_CONTACT.callPhoneDisplay}</span>
              </a>

              <a
                href={`https://wa.me/91${SHARED_BUS_CONTACT.whatsappPhone}?text=Hi%20Aarambha%20Bus%20Rentals,%20I%20would%20like%20to%20inquire%20about%20bus%20hire.`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold px-6 py-4 rounded-full bg-green-600 hover:bg-green-700 text-white border border-green-500/40 backdrop-blur-md transition-all inline-flex items-center gap-2 shadow-lg shadow-green-600/20"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>WhatsApp {SHARED_BUS_CONTACT.whatsappPhoneDisplay}</span>
              </a>
            </div>

            {/* Carousel Dots */}
            <div className="pt-3 flex items-center justify-center gap-2">
              {BUS_CAROUSEL_IMAGES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  aria-label={`Slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentSlideIndex ? 'w-8 bg-[#5266EB]' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>

            {/* Social Icons */}
            <div className="pt-2 flex items-center justify-center gap-3 text-gray-300">
              <button className="w-9 h-9 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm flex items-center justify-center hover:text-[#5266EB] hover:border-[#5266EB] transition-all">
                <Globe className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm flex items-center justify-center hover:text-[#5266EB] hover:border-[#5266EB] transition-all">
                <MessageCircle className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm flex items-center justify-center hover:text-[#5266EB] hover:border-[#5266EB] transition-all">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="w-9 h-9 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm flex items-center justify-center hover:text-[#5266EB] hover:border-[#5266EB] transition-all">
                <Compass className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </section>

      {/* ─── 2. TRUST HIGHLIGHT BAR ───────────────────────────────── */}
      <section className="bg-white py-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FAFAFC] border border-gray-200">
              <Users className="w-5 h-5 text-[#5266EB] flex-shrink-0" />
              <div>
                <h4 className="font-bold text-[#000000] text-xs font-syne">5 to 50 Seater Fleet</h4>
                <p className="text-[11px] text-gray-500">Buses, Urbania & Tempo Travellers.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FAFAFC] border border-gray-200">
              <MapPin className="w-5 h-5 text-[#5266EB] flex-shrink-0" />
              <div>
                <h4 className="font-bold text-[#000000] text-xs font-syne">Local & Outstation</h4>
                <p className="text-[11px] text-gray-500">Pune, Mumbai, Mahabaleshwar & more.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FAFAFC] border border-gray-200">
              <Clock className="w-5 h-5 text-[#9CB4E8] flex-shrink-0" />
              <div>
                <h4 className="font-bold text-[#000000] text-xs font-syne">24/7 Dedicated Support</h4>
                <p className="text-[11px] text-gray-500">Round-the-clock helpline & WhatsApp.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FAFAFC] border border-gray-200">
              <Shield className="w-5 h-5 text-[#5266EB] flex-shrink-0" />
              <div>
                <h4 className="font-bold text-[#000000] text-xs font-syne">Transparent Pricing</h4>
                <p className="text-[11px] text-gray-500">No hidden charges. Actuals as per rules.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. SUBSECTIONS GRID ───────────────────────────────────── */}
      <section id="subsections" className="py-20 bg-[#FAFAFC] content-defer border-b border-gray-200/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
          
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#5266EB] tracking-widest uppercase block font-syne">
              OUR SERVICES
            </span>
            <h2 className="font-syne text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
              Choose Your Rental Category
            </h2>
            <p className="text-xs text-gray-500 font-normal">
              Explore outstation bus hire, local Pune trips, or self-drive car rentals with full rate cards and instant booking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {subsections.map((sub) => (
              <Link
                key={sub.id}
                href={sub.href}
                className="group relative bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Header Banner */}
                <div className={`h-44 bg-gradient-to-br ${sub.gradient} flex items-center justify-center text-white relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="relative z-10 text-center space-y-2 p-4">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-white/90 bg-white/20 px-3 py-1 rounded-full border border-white/30 backdrop-blur-md">
                      {sub.badge}
                    </span>
                    <h3 className="font-syne text-2xl font-black">{sub.title}</h3>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-[#5266EB] uppercase tracking-wider">{sub.subtitle}</p>
                    <p className="text-xs text-gray-600 leading-relaxed font-normal">{sub.description}</p>

                    <div className="space-y-2 pt-2 border-t border-gray-100">
                      {sub.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#5266EB] flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-gray-100">
                    <span className="text-xs font-bold text-[#5266EB] uppercase tracking-wider group-hover:underline">
                      View Rate Cards & Book
                    </span>
                    <div className="w-9 h-9 rounded-full bg-[#5266EB] text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ─── 4. WHY CHOOSE AARAMBHA BUS RENTALS? ───────────────────── */}
      <section className="py-16 bg-white border-t border-gray-200 content-defer">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-4 space-y-3">
              <h2 className="font-syne text-3xl sm:text-4xl font-extrabold text-[#111111] tracking-tight">
                Why Choose<br />Aarambha Bus Rentals?
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed font-normal">
                Whether you need a 13-seater Urbania for an outstation trip or a 49-seater coach for a wedding, we deliver well-maintained vehicles and experienced drivers.
              </p>
            </div>

            <div className="lg:col-span-8 relative py-4 flex items-center justify-center">
              <div className="w-full max-w-lg aspect-[16/9] relative rounded-2xl overflow-hidden shadow-xl border border-gray-200">
                <img
                  src="/images/fleet/bus_35_seater.jpg"
                  alt="Aarambha 35 Seater Bus"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Feature Cards */}
              <div className="absolute top-0 left-2 bg-white border border-gray-200 rounded-xl p-3 max-w-[180px] text-xs space-y-0.5 hidden sm:block shadow-lg">
                <h4 className="font-bold text-[#111111]">Transparent Rates</h4>
                <p className="text-[10px] text-gray-500 leading-tight">Clear per-KM and package rates.</p>
              </div>

              <div className="absolute top-2 right-2 bg-white border border-gray-200 rounded-xl p-3 max-w-[180px] text-xs space-y-0.5 hidden sm:block shadow-lg">
                <h4 className="font-bold text-[#111111]">Verified Drivers</h4>
                <p className="text-[10px] text-gray-500 leading-tight">Punctual & experienced crew.</p>
              </div>

              <div className="absolute bottom-2 right-2 bg-white border border-gray-200 rounded-xl p-3 max-w-[180px] text-xs space-y-0.5 hidden sm:block shadow-lg">
                <h4 className="font-bold text-[#111111]">Clean & Sanitized</h4>
                <p className="text-[10px] text-gray-500 leading-tight">Pristine AC & Non-AC interiors.</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─── 5. EXECUTIVE TESTIMONIAL SHOWCASE ──────────────────────── */}
      <section className="py-24 bg-[#090D14] text-white relative overflow-hidden content-defer border-t border-gray-800">
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-10 text-center">
          
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#5266EB] tracking-widest uppercase block font-syne">
              CLIENT TESTIMONIALS
            </span>
            <h2 className="font-syne text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Trusted by Groups & Organizations
            </h2>
          </div>

          <div
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-12 space-y-8 shadow-2xl relative transition-all duration-300 hover:border-white/20"
          >
            
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div className="flex items-center gap-1.5 text-amber-400">
                {[...Array(testimonials[currentTestimonialIndex].rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-xs font-bold text-gray-300 ml-1">5.0 / 5.0</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified Bus Trip
              </div>
            </div>

            <blockquote className="font-serif text-lg sm:text-2xl italic font-normal text-gray-100 leading-relaxed max-w-2xl mx-auto min-h-[90px] flex items-center justify-center transition-all duration-300">
              &ldquo;{testimonials[currentTestimonialIndex].quote}&rdquo;
            </blockquote>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/10">
              <div className="flex items-center gap-3.5 text-center sm:text-left">
                <img
                  src={testimonials[currentTestimonialIndex].avatar}
                  alt={testimonials[currentTestimonialIndex].name}
                  loading="lazy"
                  decoding="async"
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#5266EB]"
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

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentTestimonialIndex(idx)}
                      aria-label={`Review ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentTestimonialIndex
                          ? 'w-6 bg-[#5266EB]'
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
              4 Easy Steps to Rent a Bus
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="space-y-2 text-center sm:text-left p-4 rounded-xl border border-gray-200 bg-[#FAFAFC]">
              <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-xs">
                🚌
              </div>
              <h3 className="font-syne text-sm font-bold text-[#111111]">1. Choose Category</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-normal">
                Select Outstation, Local Pune, or Urbania packages.
              </p>
            </div>

            <div className="space-y-2 text-center sm:text-left p-4 rounded-xl border border-blue-200 bg-blue-50/50">
              <div className="w-12 h-12 rounded-lg bg-[#5266EB] text-white flex items-center justify-center font-bold text-xs">
                📊
              </div>
              <h3 className="font-syne text-sm font-bold text-[#111111]">2. Pick Seater & Rate</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-normal">
                Compare 13 to 49 seater AC & Non-AC rate cards.
              </p>
            </div>

            <div className="space-y-2 text-center sm:text-left p-4 rounded-xl border border-gray-200 bg-[#FAFAFC]">
              <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-xs">
                📅
              </div>
              <h3 className="font-syne text-sm font-bold text-[#111111]">3. Enter Travel Details</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-normal">
                Enter your pickup date, address, and passenger info.
              </p>
            </div>

            <div className="space-y-2 text-center sm:text-left p-4 rounded-xl border border-gray-200 bg-[#FAFAFC]">
              <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-xs">
                ✅
              </div>
              <h3 className="font-syne text-sm font-bold text-[#111111]">4. Instant Confirm</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-normal">
                Receive your confirmation voucher and invoice instantly.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ─── 7. RULES & GUIDELINES FOOTNOTE ────────────────────────── */}
      <section className="py-12 bg-[#FAFAFC] border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 space-y-6">
          <div className="text-center space-y-1">
            <h3 className="font-syne text-xl font-extrabold text-gray-900">Rules & Guidelines</h3>
            <p className="text-xs text-gray-500">Official terms governing all bus & Urbania rentals</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BUS_RULES_AND_GUIDELINES.map((rule, i) => (
              <div key={i} className="flex items-start gap-3 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <div className="w-6 h-6 rounded-full bg-[#5266EB]/10 text-[#5266EB] text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{rule}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 8. DEDICATED BUS RENTALS FAQS ────────────────────────── */}
      <FAQSection mode="cars" />

      {/* ─── 9. DEDICATED BUS RENTALS WHATSAPP INQUIRY FORM ───────── */}
      <WhatsAppEnquiryForm mode="cars" />

      {/* ─── 10. LOCATION & CONTACT ───────────────────────────────── */}
      <CompanyLocationSection mode="cars" />

      {/* ─── 11. TERMS & CONDITIONS ───────────────────────────────── */}
      <TermsConditionsSection mode="cars" />

      <Footer />

    </div>
  );
}
