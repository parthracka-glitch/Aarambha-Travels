'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  MapPin,
  Star,
  Compass,
  Phone,
  Calendar,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Headphones,
  Utensils,
  Award,
  CreditCard,
  MessageCircle,
  Users,
  CheckCircle2,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CompanyLocationSection from '@/components/home/CompanyLocationSection';
import BookingModal, { BookingModalItem } from '@/components/booking/BookingModal';
import { TOUR_PACKAGES, SHARED_TOUR_CONTACT, TourPackage } from '@/constants/toursData';
import { fetchLiveTourPackages } from '@/services/tours.service';

export default function ToursTravelsLandingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedDestination, setSelectedDestination] = useState('all');
  const [selectedBookingTour, setSelectedBookingTour] = useState<BookingModalItem | null>(null);
  const [packagesList, setPackagesList] = useState<TourPackage[]>(TOUR_PACKAGES);

  useEffect(() => {
    fetchLiveTourPackages().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setPackagesList(data);
      }
    });
  }, []);

  const filteredPackages = packagesList.filter((pkg) => {
    const matchesSearch =
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.sites.some((site) => site.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDuration =
      selectedDuration === 'all' ||
      (selectedDuration === 'short' && pkg.durationDays <= 3) ||
      (selectedDuration === 'long' && pkg.durationDays > 3);

    const matchesDest =
      selectedDestination === 'all' ||
      pkg.destination.toLowerCase().includes(selectedDestination.toLowerCase()) ||
      pkg.state.toLowerCase().includes(selectedDestination.toLowerCase());

    return matchesSearch && matchesDuration && matchesDest;
  });

  const tourReviews = [
    {
      name: 'Sunil & Sunita Joshi',
      location: 'Kothrud, Pune',
      tour: '3 Jyotirlinga Darshan (Mahakaleshwar & Omkareshwar)',
      rating: 5,
      date: 'Aug 2026',
      review:
        'The arrangements for senior citizens were exceptional. From VIP Bhasma Aarti at Mahakaleshwar to satvik hot meals on time, आरंभ made our spiritual yatra peaceful and memorable.',
    },
    {
      name: 'Amitabh Sharma',
      location: 'Baner, Pune',
      tour: 'Mathura, Vrindavan & Agra Yatra',
      rating: 5,
      date: 'Jul 2026',
      review:
        'Very punctual and professional tour captain. Hotel rooms were spotlessly clean and the AC pushback bus was extremely comfortable for the long journey.',
    },
    {
      name: 'Pooja Kulkarni',
      location: 'Nigdi, Pune',
      tour: 'Ashtavinayak Darshan 2-Day Package',
      rating: 5,
      date: 'Aug 2026',
      review:
        'Booked for our entire extended family of 14 people. Best pricing in Pune with zero hidden charges. Highly recommended for devotional family yatras!',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FCFAF6] text-[#493B34] flex flex-col font-sans select-none">
      {/* Top Navbar */}
      <Navbar vertical="tours" />

      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION: DEVOTIONAL & PILGRIMAGE PORTAL BANNER
          ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-20 bg-[#FCFAF6] border-b border-[#EDE2D0] overflow-hidden">
        {/* Background Image & Ambient Scrim */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src="/images/hero_spiritual_tours.jpg"
            alt="Varanasi Ganga Aarti Sacred Temple Ghats"
            className="w-full h-full object-cover object-right lg:object-center opacity-90 contrast-[1.05]"
          />
          {/* Gentle scrim on left side for text readability while leaving the sacred temple ghats & sunrise vivid */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FCFAF6]/95 via-[#FCFAF6]/75 to-transparent w-full md:w-3/5" />
          {/* Subtle bottom fade into next section */}
          <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#FCFAF6] to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#EDE2D0] shadow-2xs text-[#493B34] text-xs font-semibold uppercase tracking-wider">
              <span className="text-sm text-[#C65A2E]">🪷</span>
              <span>आरंभ Sacred Journeys &amp; Pilgrimages</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-50/90 backdrop-blur-md border border-amber-200/80 text-amber-800 text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#C65A2E]" />
              Departing from Pune
            </span>
          </div>

          <div className="max-w-3xl space-y-3">
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-[#493B34]">
              Curated Devotional <br />
              <span className="text-[#C65A2E] font-serif italic">Pilgrimage Yatras</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#756B63] max-w-2xl leading-relaxed font-normal">
              All-inclusive devotional tours departing from Pune with confirmed AC pushback transport, pre-verified 3-star stays, pure satvik meals, and dedicated tour captains.
            </p>
          </div>

          {/* Minimal Floating Search & Filter Bar */}
          <div className="bg-white/95 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-[#EDE2D0] shadow-lg shadow-[#493B34]/5 max-w-4xl text-[#493B34]">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center">
              
              <div className="md:col-span-6 relative">
                <Search className="w-4 h-4 text-[#756B63] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search temple, state or package (e.g. Mahakal, Vrindavan)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#FCFAF6] border border-[#EDE2D0] text-xs font-medium text-[#493B34] placeholder:text-[#756B63] focus:outline-none focus:border-[#C65A2E] focus:bg-white transition-colors"
                />
              </div>

              <div className="md:col-span-3">
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#FCFAF6] border border-[#EDE2D0] text-xs font-semibold text-[#493B34] focus:outline-none focus:border-[#C65A2E] cursor-pointer"
                >
                  <option value="all">All Durations</option>
                  <option value="short">Short Getaways (1–3 Days)</option>
                  <option value="long">Extended Yatras (4+ Days)</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <a
                  href="#tour-packages"
                  className="w-full py-2.5 rounded-xl bg-[#C65A2E] hover:bg-[#B24E25] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <span>Explore Tours</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </a>
              </div>

            </div>

            {/* Quick Popular Yatra Tags */}
            <div className="pt-2.5 mt-2.5 border-t border-[#EDE2D0]/60 flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-[#756B63] font-medium mr-1 flex items-center gap-1">
                <Compass className="w-3 h-3 text-[#C65A2E]" /> Popular:
              </span>
              {[
                { label: '🕉️ 3 Jyotirlinga (Mahakal)', query: 'Mahakal' },
                { label: '🌸 Khatu Shyam & Salasar', query: 'Khatu Shyam' },
                { label: '⚡ Mumbai to Ujjain', query: 'Mumbai' },
                { label: '🚩 Mathura Vrindavan', query: 'Vrindavan' },
                { label: '🔱 Ashtavinayak Darshan', query: 'Ashtavinayak' },
              ].map((chip) => (
                <button
                  key={chip.query}
                  onClick={() => {
                    setSearchQuery(chip.query);
                    const el = document.getElementById('tour-packages');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#FCFAF6] hover:bg-[#F8EFEA] border border-[#EDE2D0] hover:border-[#E8B9A5] text-[#493B34] hover:text-[#C65A2E] transition-all cursor-pointer font-medium"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Minimal 4-Pillar Devotional Guarantees */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl pt-1">
            <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#EDE2D0] shadow-sm">
              <span className="text-sm font-bold text-[#493B34] block flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Verified 3★ Stays
              </span>
              <span className="text-[11px] text-[#756B63] mt-0.5 block">Hygienic, tested hotels</span>
            </div>
            <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#EDE2D0] shadow-sm">
              <span className="text-sm font-bold text-[#493B34] block flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-[#C65A2E] shrink-0" /> Pure Satvik Meals
              </span>
              <span className="text-[11px] text-[#756B63] mt-0.5 block">Fresh vegetarian dining</span>
            </div>
            <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#EDE2D0] shadow-sm">
              <span className="text-sm font-bold text-[#493B34] block flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#C65A2E] shrink-0" /> AC Pushback Fleet
              </span>
              <span className="text-[11px] text-[#756B63] mt-0.5 block">Urbania &amp; Luxury Coaches</span>
            </div>
            <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#EDE2D0] shadow-sm">
              <span className="text-sm font-bold text-[#493B34] block flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" /> Zero Hidden Costs
              </span>
              <span className="text-[11px] text-[#756B63] mt-0.5 block">100% transparent pricing</span>
            </div>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. ALL PACKAGES CATALOG & LIVE BOOKINGS
          ───────────────────────────────────────────────────────────── */}
      <section id="tour-packages" className="py-14 bg-[#FCFAF6] border-b border-[#EDE2D0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#EDE2D0] pb-4">
            <div>
              <span className="text-xs font-bold text-[#C65A2E] uppercase tracking-wider block mb-0.5">
                Confirmed Departures
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#493B34] tracking-tight">
                All Pilgrimage Packages &amp; Yatras
              </h2>
              <p className="text-xs text-[#756B63] mt-0.5 font-normal">
                Showing {filteredPackages.length} available all-inclusive packages departing from Pune.
              </p>
            </div>

            {/* Destination Filter Tabs */}
            <div className="flex flex-wrap gap-1.5">
              {['all', 'Madhya Pradesh', 'Uttar Pradesh', 'Maharashtra'].map((dest) => (
                <button
                  key={dest}
                  onClick={() => setSelectedDestination(dest)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedDestination === dest
                      ? 'bg-[#C65A2E] text-white shadow-xs'
                      : 'bg-white text-[#756B63] border border-[#EDE2D0] hover:border-[#C65A2E] hover:text-[#C65A2E]'
                  }`}
                >
                  {dest === 'all' ? 'All Destinations' : dest}
                </button>
              ))}
            </div>
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#EDE2D0] shadow-sm hover:shadow-md hover:border-[#E8B9A5] transition-all duration-300 flex flex-col group relative"
              >
                <div className="relative h-56 w-full overflow-hidden bg-[#FDFBF7]">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg bg-[#C65A2E] text-white text-xs font-semibold shadow-xs">
                      {pkg.durationLabel || `${pkg.durationDays}D / ${pkg.durationNights}N`}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-xs text-[#493B34] text-xs font-semibold border border-[#EDE2D0] shadow-xs flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{pkg.rating} ({pkg.reviewsCount})</span>
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#C65A2E]">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{pkg.destination}, {pkg.state}</span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-[#493B34] leading-snug group-hover:text-[#C65A2E] transition-colors">
                      {pkg.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#756B63] line-clamp-2 leading-relaxed">
                      {pkg.subtitle}
                    </p>

                    {/* Key Temple Sites */}
                    <div className="pt-1 flex flex-wrap gap-1">
                      {pkg.sites.slice(0, 3).map((site, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-[#FCFAF6] text-[#756B63] text-[11px] font-medium border border-[#EDE2D0]"
                        >
                          {site}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-3 border-t border-[#EDE2D0] space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10.5px] text-[#756B63] block font-medium">All-Inclusive Fare</span>
                        <span className="text-lg sm:text-xl font-bold text-[#493B34]">
                          {pkg.priceDisplay || `₹${pkg.basePrice.toLocaleString('en-IN')}`}
                        </span>
                        <span className="text-[10px] text-[#756B63] block">per passenger</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[11px] font-semibold text-[#C65A2E] bg-[#F8EFEA] border border-[#E8B9A5]/50 px-2.5 py-1 rounded-lg">
                          ₹{pkg.depositPrice} Advance Reserve
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/tours-travels/${pkg.slug}`}
                        className="h-10 rounded-xl border border-[#EDE2D0] text-[#493B34] hover:text-[#C65A2E] hover:border-[#C65A2E] hover:bg-[#F8EFEA]/40 text-xs font-semibold flex items-center justify-center transition-all"
                      >
                        View Itinerary
                      </Link>
                      <Link
                        href={`/tours-travels/${pkg.slug}`}
                        className="h-10 rounded-xl bg-[#C65A2E] hover:bg-[#B24E25] text-white text-xs font-semibold flex items-center justify-center transition-all shadow-xs"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. DEVOTIONAL INCLUSIONS & SATVIK MEALS STANDARD
          ───────────────────────────────────────────────────────────── */}
      <section className="py-14 bg-white border-b border-[#EDE2D0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#C65A2E] uppercase tracking-wider block">
              The आरंभ Devotional Standard
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#493B34] tracking-tight">
              What Makes Our Pilgrimages Sacred &amp; Worry-Free
            </h2>
            <p className="text-xs sm:text-sm text-[#756B63]">
              Every yatra is designed with senior citizens and devout families in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-2xl bg-[#FCFAF6] border border-[#EDE2D0] space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#F8EFEA] text-[#C65A2E] flex items-center justify-center">
                <Utensils className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#493B34]">Pure Satvik Meals</h3>
              <p className="text-xs sm:text-sm text-[#756B63] leading-relaxed">
                Hygienic, freshly prepared satvik vegetarian breakfast, lunch, and dinner with tea/coffee included.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FCFAF6] border border-[#EDE2D0] space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#F8EFEA] text-[#C65A2E] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#493B34]">Pre-Verified AC Hotels</h3>
              <p className="text-xs sm:text-sm text-[#756B63] leading-relaxed">
                Handpicked 3-star AC family hotels near temples with clean washrooms and elevators for seniors.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FCFAF6] border border-[#EDE2D0] space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#F8EFEA] text-[#C65A2E] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#493B34]">Dedicated Tour Captain</h3>
              <p className="text-xs sm:text-sm text-[#756B63] leading-relaxed">
                Experienced Marathi &amp; Hindi speaking tour managers who handle temple protocols, queues, and hotel check-ins.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FCFAF6] border border-[#EDE2D0] space-y-3 shadow-2xs">
              <div className="w-10 h-10 rounded-xl bg-[#F8EFEA] text-[#C65A2E] flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-bold text-[#493B34]">Zero Hidden Charges</h3>
              <p className="text-xs sm:text-sm text-[#756B63] leading-relaxed">
                Transparent pricing inclusive of toll taxes, driver allowances, state permits, and accommodation GST.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. PILGRIM TESTIMONIALS & REVIEWS
          ───────────────────────────────────────────────────────────── */}
      <section className="py-14 bg-[#FCFAF6] border-b border-[#EDE2D0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#C65A2E] uppercase tracking-wider block">
              Devotee Experiences
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#493B34] tracking-tight">
              Words From Devotees Who Traveled With Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tourReviews.map((rev, i) => (
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
                  <p className="text-[11px] text-[#756B63]">{rev.location} • {rev.tour}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. LOCATION / MAP SECTION */}
      <CompanyLocationSection />

      {/* 6. FOOTER */}
      <Footer />

      {/* Booking Modal */}
      {selectedBookingTour && (
        <BookingModal
          item={selectedBookingTour}
          isOpen={!!selectedBookingTour}
          onClose={() => setSelectedBookingTour(null)}
        />
      )}
    </div>
  );
}
