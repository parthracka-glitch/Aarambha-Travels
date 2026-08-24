'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, CheckCircle2, Calendar, MapPin, User, Phone, Car, Compass, ArrowRight } from 'lucide-react';
import { FLEET_VEHICLES, CarVehicle } from '@/constants/carsData';
import { TOUR_PACKAGES, TourPackage } from '@/constants/toursData';
import { apiFetch } from '@/services/api-client';
import { fetchLiveFleetVehicles } from '@/services/fleet.service';
import { fetchLiveTourPackages } from '@/services/tours.service';

import { BUS_CAROUSEL_IMAGES } from '@/constants/busData';

export default function WhatsAppEnquiryForm({ mode = 'cars' }: { mode?: 'cars' | 'tours' | 'buses' }) {
  const [carsList, setCarsList] = useState<CarVehicle[]>(FLEET_VEHICLES);
  const [toursList, setToursList] = useState<TourPackage[]>(TOUR_PACKAGES);

  // Car Rental Form State
  const [carForm, setCarForm] = useState({
    name: '',
    phone: '',
    carId: FLEET_VEHICLES[0]?.id || 'thar-4x4',
    date: '',
    pickupLocation: 'Green Hills Society, Katraj, Pune',
    message: '',
  });
  const [carSubmitted, setCarSubmitted] = useState(false);

  // Bus Rental Form State
  const [busForm, setBusForm] = useState({
    name: '',
    phone: '',
    busType: '13-seater-urbania',
    date: '',
    pickupLocation: 'Pune (Local / Outstation)',
    message: '',
  });
  const [busSubmitted, setBusSubmitted] = useState(false);

  // Tour Form State
  const [tourForm, setTourForm] = useState({
    name: '',
    phone: '',
    tourId: TOUR_PACKAGES[0]?.id || '3-jyotirlinga-yatra-ujjain-omkareshwar-ghrishneshwar',
    date: '',
    destination: '3 Jyotirlinga / Krishna Yatra / Tirupati Balaji',
    message: '',
  });
  const [tourSubmitted, setTourSubmitted] = useState(false);

  useEffect(() => {
    fetchLiveFleetVehicles().then(cars => {
      if (Array.isArray(cars) && cars.length > 0) setCarsList(cars);
    });
    fetchLiveTourPackages().then(tours => {
      if (Array.isArray(tours) && tours.length > 0) setToursList(tours);
    });
  }, []);

  const carWhatsAppNumber = '918208211478';
  const busWhatsAppNumber = '919021878717';
  const tourWhatsAppNumber = '919067617451';

  const busFleetOptions = [
    { id: '13-seater-urbania', label: '13-Seater Force Urbania (Luxury AC)' },
    { id: '17-seater-urbania', label: '17-Seater Force Urbania (Luxury AC)' },
    { id: '20-seater-ac', label: '20-Seater AC Luxury Bus' },
    { id: '27-seater-ac', label: '27-Seater AC Coach' },
    { id: '35-seater-ac', label: '35-Seater AC Luxury Bus' },
    { id: '45-seater-ac', label: '45-Seater AC Coach' },
    { id: '17-seater-nonac', label: '17-Seater Non-AC Bus' },
    { id: '32-seater-nonac', label: '32-Seater Non-AC Bus' },
    { id: '49-seater-nonac', label: '49-Seater Non-AC Bus' },
    { id: 'pune-mumbai-5s', label: 'Pune → Mumbai Sedan Cab (5-Seater with Driver)' },
    { id: 'pune-mumbai-7s', label: 'Pune → Mumbai MPV Cab (7-Seater with Driver)' },
  ];

  // Handle Bus Form Submit
  const handleBusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const foundBus = busFleetOptions.find(b => b.id === busForm.busType);
    const busName = foundBus ? foundBus.label : busForm.busType;

    const textMessage = 
      `*AARAMBHA BUS RENTAL INQUIRY*%0A` +
      `━━━━━━━━━━━━━━━━━━━━%0A` +
      `👤 *Name:* ${busForm.name}%0A` +
      `📞 *Phone:* ${busForm.phone}%0A` +
      `🚌 *Selected Bus / Vehicle:* ${busName}%0A` +
      `📅 *Journey Date:* ${busForm.date || 'Flexible'}%0A` +
      `📍 *Pickup / Route:* ${busForm.pickupLocation}%0A` +
      `📝 *Notes:* ${busForm.message || 'Please confirm availability & pricing.'}%0A` +
      `━━━━━━━━━━━━━━━━━━━━%0A` +
      `_Sent via Aarambha Bus Rentals Hub_`;

    const whatsappUrl = `https://wa.me/${busWhatsAppNumber}?text=${textMessage}`;

    try {
      await apiFetch('/api/fleet/inquiries', {
        method: 'POST',
        body: JSON.stringify({
          name: busForm.name,
          phone: busForm.phone,
          carName: busName,
          date: busForm.date,
          pickupLocation: busForm.pickupLocation,
          message: busForm.message,
        }),
      }).catch(() => {});
    } catch (_err) {}

    setBusSubmitted(true);
    window.open(whatsappUrl, '_blank');
  };

  // Handle Car Form Submit
  const handleCarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const foundCar = carsList.find(c => c.id === carForm.carId);
    const carName = foundCar ? `${foundCar.name} (${foundCar.category || 'Self-Drive'}) - ₹${foundCar.pricePerDay.toLocaleString('en-IN')}/day` : 'Self-Drive Vehicle';

    const textMessage = 
      `*AARAMBHA CAR RENTAL INQUIRY*%0A` +
      `━━━━━━━━━━━━━━━━━━━━%0A` +
      `👤 *Name:* ${carForm.name}%0A` +
      `📞 *Phone:* ${carForm.phone}%0A` +
      `🚗 *Selected Car:* ${carName}%0A` +
      `📅 *Pickup Date:* ${carForm.date || 'Flexible'}%0A` +
      `📍 *Pickup Point:* ${carForm.pickupLocation}%0A` +
      `📝 *Notes:* ${carForm.message || 'Please confirm vehicle availability.'}%0A` +
      `━━━━━━━━━━━━━━━━━━━━%0A` +
      `_Sent via Aarambha Self-Drive Hub_`;

    const whatsappUrl = `https://wa.me/${carWhatsAppNumber}?text=${textMessage}`;

    try {
      await apiFetch('/api/fleet/inquiries', {
        method: 'POST',
        body: JSON.stringify({
          name: carForm.name,
          phone: carForm.phone,
          carName,
          date: carForm.date,
          pickupLocation: carForm.pickupLocation,
          message: carForm.message,
        }),
      }).catch(() => {});
    } catch (_err) {}

    setCarSubmitted(true);
    window.open(whatsappUrl, '_blank');
  };

  // Handle Tour Form Submit
  const handleTourSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const foundTour = TOUR_PACKAGES.find(t => t.id === tourForm.tourId);
    const tourTitle = foundTour ? `${foundTour.title} (${foundTour.durationDays}D/${foundTour.durationNights}N) - ₹${foundTour.basePrice.toLocaleString('en-IN')}` : 'Tour Package';

    const textMessage = 
      `*AARAMBHA TOUR PACKAGE INQUIRY*%0A` +
      `━━━━━━━━━━━━━━━━━━━━%0A` +
      `👤 *Name:* ${tourForm.name}%0A` +
      `📞 *Phone:* ${tourForm.phone}%0A` +
      `🧭 *Selected Tour:* ${tourTitle}%0A` +
      `📅 *Travel Start Date:* ${tourForm.date || 'Flexible'}%0A` +
      `📍 *Destination:* ${tourForm.destination}%0A` +
      `📝 *Notes:* ${tourForm.message || 'Please send itinerary details & pricing.'}%0A` +
      `━━━━━━━━━━━━━━━━━━━━%0A` +
      `_Sent via Aarambha Tours Hub_`;

    const whatsappUrl = `https://wa.me/${tourWhatsAppNumber}?text=${textMessage}`;

    try {
      await apiFetch('/api/tours/inquiries', {
        method: 'POST',
        body: JSON.stringify({
          name: tourForm.name,
          phone: tourForm.phone,
          tourTitle,
          date: tourForm.date,
          destination: tourForm.destination,
          message: tourForm.message,
        }),
      }).catch(() => {});
    } catch (_err) {}

    setTourSubmitted(true);
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section className="py-16 bg-[#171721] text-[#EDEDF3] relative overflow-hidden border-t border-[#272735]">
      
      {/* Ambient Glows */}
      <div className={`absolute top-1/3 left-1/4 w-[500px] h-[300px] blur-[130px] rounded-full pointer-events-none ${
        mode === 'cars' ? 'bg-[#5266EB]/10' : mode === 'buses' ? 'bg-[#5266EB]/10' : 'bg-[#9CB4E8]/10'
      }`} />

      <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10 space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-[#EDEDF3] text-xs font-extrabold font-syne uppercase tracking-wider backdrop-blur-md">
            <MessageSquare className={`w-3.5 h-3.5 ${mode === 'cars' || mode === 'buses' ? 'text-[#5266EB]' : 'text-[#9CB4E8]'}`} />
            {mode === 'cars'
              ? 'SELF-DRIVE FLEET WHATSAPP INQUIRY'
              : mode === 'buses'
              ? 'BUS RENTALS & URBANIA WHATSAPP INQUIRY'
              : 'TOUR PACKAGES WHATSAPP INQUIRY'}
          </span>

          <h2 className="font-syne text-3xl sm:text-4xl font-extrabold text-[#EDEDF3] tracking-tight">
            {mode === 'cars'
              ? 'Car Rental WhatsApp Inquiry'
              : mode === 'buses'
              ? 'Bus Rental WhatsApp Inquiry'
              : 'Tour Package WhatsApp Inquiry'}
          </h2>

          <p className="text-xs text-[#AFB2CE] max-w-xl mx-auto leading-relaxed font-normal">
            {mode === 'cars'
              ? 'Select your preferred self-drive vehicle below to send a direct WhatsApp inquiry to our office hotline.'
              : mode === 'buses'
              ? 'Select your preferred bus or Urbania configuration below to send an instant WhatsApp inquiry.'
              : 'Select your preferred tour package below to send a direct WhatsApp inquiry to our office hotline.'}
          </p>
        </div>

        {/* 🚗 BOX 1: CAR RENTALS DEDICATED WHATSAPP INQUIRY BOX */}
        {mode === 'cars' && (
          <div className="rounded-3xl border p-6 sm:p-10 space-y-6 shadow-2xl transition-all duration-300 bg-[#272735]/80 border-[#5266EB]/30">
            
            {/* Box Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#5266EB]/20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#5266EB]/20 text-[#5266EB] border border-[#5266EB]/30">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-syne text-xl font-bold text-[#EDEDF3] flex items-center gap-2">
                    Self-Drive Fleet Inquiry
                  </h3>
                  <p className="text-xs text-[#9CB4E8]">Direct Vehicle Booking Desk</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#5266EB]/20 text-[#9CB4E8] text-xs font-bold font-syne border border-[#5266EB]/30 uppercase">
                Cars Only
              </span>
            </div>

            {carSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 bg-[#5266EB]/20 text-[#5266EB] rounded-full flex items-center justify-center mx-auto border border-[#5266EB]/40 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-syne text-2xl font-bold text-[#EDEDF3]">Car Inquiry Sent!</h4>
                <p className="text-xs text-gray-300">WhatsApp opened with your selected vehicle inquiry.</p>
                <button
                  onClick={() => setCarSubmitted(false)}
                  className="mt-2 text-xs font-bold text-[#9CB4E8] underline cursor-pointer"
                >
                  Send Another Car Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleCarSubmit} className="space-y-5 text-xs">
                
                {/* Select Car Model Dropdown */}
                <div className="space-y-1.5">
                  <label className="font-bold text-[#9CB4E8] uppercase tracking-wider flex items-center gap-1.5 text-xs">
                    <Car className="w-4 h-4 text-[#9CB4E8]" /> Select Fleet Vehicle Model <span className="text-[#5266EB]">*</span>
                  </label>
                  <select
                    name="carId"
                    value={carForm.carId}
                    onChange={(e) => setCarForm({ ...carForm, carId: e.target.value })}
                    className="w-full bg-[#171721] border border-[#5266EB]/30 rounded-xl p-3.5 text-xs sm:text-sm text-[#EDEDF3] focus:outline-none focus:border-[#5266EB] font-syne font-bold cursor-pointer"
                  >
                    {carsList.map((car) => (
                      <option key={car.id} value={car.id} className="bg-[#171721] text-white">
                        🚗 {car.name} — ₹{car.pricePerDay.toLocaleString('en-IN')}/day ({car.category || 'Luxury'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#EDEDF3] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#9CB4E8]" /> Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={carForm.name}
                      onChange={(e) => setCarForm({ ...carForm, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-[#171721] border border-white/15 rounded-xl p-3.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#5266EB]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-[#EDEDF3] flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#9CB4E8]" /> WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={carForm.phone}
                      onChange={(e) => setCarForm({ ...carForm, phone: e.target.value })}
                      placeholder="e.g. +91 82082 11478"
                      className="w-full bg-[#171721] border border-white/15 rounded-xl p-3.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#5266EB]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#EDEDF3] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#9CB4E8]" /> Pickup Date
                    </label>
                    <input
                      type="date"
                      value={carForm.date}
                      onChange={(e) => setCarForm({ ...carForm, date: e.target.value })}
                      className="w-full bg-[#171721] border border-white/15 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-[#5266EB]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-[#EDEDF3] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#9CB4E8]" /> Pickup Location
                    </label>
                    <input
                      type="text"
                      value={carForm.pickupLocation}
                      onChange={(e) => setCarForm({ ...carForm, pickupLocation: e.target.value })}
                      placeholder="e.g. Green Hills Society, Katraj, Pune"
                      className="w-full bg-[#171721] border border-white/15 rounded-xl p-3.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#5266EB]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#EDEDF3]">Message / Special Car Request</label>
                  <textarea
                    rows={3}
                    value={carForm.message}
                    onChange={(e) => setCarForm({ ...carForm, message: e.target.value })}
                    placeholder="e.g. Automatic transmission required, Mopa Airport delivery..."
                    className="w-full bg-[#171721] border border-white/15 rounded-xl p-3.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#5266EB] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-[#5266EB] hover:bg-[#3E51D4] text-[#EDEDF3] font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#5266EB]/20 cursor-pointer hover:scale-[1.01]"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>Send Car Inquiry on WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </form>
            )}

          </div>
        )}

        {/* 🚌 BOX: BUS RENTALS DEDICATED WHATSAPP INQUIRY BOX */}
        {mode === 'buses' && (
          <div className="rounded-3xl border p-6 sm:p-10 space-y-6 shadow-2xl transition-all duration-300 bg-[#272735]/80 border-[#5266EB]/30">
            
            {/* Box Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#5266EB]/20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#5266EB]/20 text-[#5266EB] border border-[#5266EB]/30">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-syne text-xl font-bold text-[#EDEDF3] flex items-center gap-2">
                    Bus & Urbania Fleet Inquiry
                  </h3>
                  <p className="text-xs text-[#9CB4E8]">Direct Bus Hire & Chauffeur Desk</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#5266EB]/20 text-[#9CB4E8] text-xs font-bold font-syne border border-[#5266EB]/30 uppercase">
                Buses & Urbania
              </span>
            </div>

            {busSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 bg-[#5266EB]/20 text-[#5266EB] rounded-full flex items-center justify-center mx-auto border border-[#5266EB]/40 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-syne text-2xl font-bold text-[#EDEDF3]">Bus Inquiry Sent!</h4>
                <p className="text-xs text-gray-300">WhatsApp opened with your selected bus rental inquiry.</p>
                <button
                  onClick={() => setBusSubmitted(false)}
                  className="mt-2 text-xs font-bold text-[#9CB4E8] underline cursor-pointer"
                >
                  Send Another Bus Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleBusSubmit} className="space-y-5 text-xs">
                
                {/* Select Bus Model Dropdown */}
                <div className="space-y-1.5">
                  <label className="font-bold text-[#9CB4E8] uppercase tracking-wider flex items-center gap-1.5 text-xs">
                    <Car className="w-4 h-4 text-[#9CB4E8]" /> Select Bus / Urbania Option <span className="text-[#5266EB]">*</span>
                  </label>
                  <select
                    name="busType"
                    value={busForm.busType}
                    onChange={(e) => setBusForm({ ...busForm, busType: e.target.value })}
                    className="w-full bg-[#171721] border border-[#5266EB]/30 rounded-xl p-3.5 text-xs sm:text-sm text-[#EDEDF3] focus:outline-none focus:border-[#5266EB] font-syne font-bold cursor-pointer"
                  >
                    {busFleetOptions.map((opt) => (
                      <option key={opt.id} value={opt.id} className="bg-[#171721] text-white">
                        🚌 {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#EDEDF3] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#9CB4E8]" /> Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={busForm.name}
                      onChange={(e) => setBusForm({ ...busForm, name: e.target.value })}
                      placeholder="e.g. Sachin Jadhav"
                      className="w-full bg-[#171721] border border-white/15 rounded-xl p-3.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#5266EB]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-[#EDEDF3] flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#9CB4E8]" /> WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={busForm.phone}
                      onChange={(e) => setBusForm({ ...busForm, phone: e.target.value })}
                      placeholder="e.g. +91 90218 78717"
                      className="w-full bg-[#171721] border border-white/15 rounded-xl p-3.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#5266EB]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#EDEDF3] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#9CB4E8]" /> Journey Date
                    </label>
                    <input
                      type="date"
                      value={busForm.date}
                      onChange={(e) => setBusForm({ ...busForm, date: e.target.value })}
                      className="w-full bg-[#171721] border border-white/15 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-[#5266EB]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-[#EDEDF3] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#9CB4E8]" /> Pickup / Route
                    </label>
                    <input
                      type="text"
                      value={busForm.pickupLocation}
                      onChange={(e) => setBusForm({ ...busForm, pickupLocation: e.target.value })}
                      placeholder="e.g. Pune to Mahabaleshwar / Mumbai / Local"
                      className="w-full bg-[#171721] border border-white/15 rounded-xl p-3.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#5266EB]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#EDEDF3]">Message / Special Requirement</label>
                  <textarea
                    rows={3}
                    value={busForm.message}
                    onChange={(e) => setBusForm({ ...busForm, message: e.target.value })}
                    placeholder="e.g. 2-day outstation trip, AC coach required, 25 passengers..."
                    className="w-full bg-[#171721] border border-white/15 rounded-xl p-3.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#5266EB] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-[#5266EB] hover:bg-[#3E51D4] text-[#EDEDF3] font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#5266EB]/20 cursor-pointer hover:scale-[1.01]"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>Send Bus Inquiry on WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </form>
            )}

          </div>
        )}

        {/* 🧭 BOX 2: TOURS & TRAVEL PACKAGES DEDICATED WHATSAPP INQUIRY BOX */}
        {mode === 'tours' && (
          <div className="rounded-3xl border p-6 sm:p-10 space-y-6 shadow-2xl transition-all duration-300 bg-[#04120c] border-emerald-500/30">
            
            {/* Box Header */}
            <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-syne text-xl font-bold text-white flex items-center gap-2">
                    Tour Packages Inquiry
                  </h3>
                  <p className="text-xs text-emerald-300">Direct Travel Itinerary Desk</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold font-syne border border-emerald-500/30 uppercase">
                Tours Only
              </span>
            </div>

            {tourSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-syne text-2xl font-bold text-white">Tour Inquiry Sent!</h4>
                <p className="text-xs text-gray-300">WhatsApp opened with your selected tour package details.</p>
                <button
                  onClick={() => setTourSubmitted(false)}
                  className="mt-2 text-xs font-bold text-emerald-400 underline cursor-pointer"
                >
                  Send Another Tour Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleTourSubmit} className="space-y-5 text-xs">
                
                {/* Select Tour Package Dropdown */}
                <div className="space-y-1.5">
                  <label className="font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5 text-xs">
                    <Compass className="w-4 h-4 text-emerald-400" /> Select Tour Package <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="tourId"
                    value={tourForm.tourId}
                    onChange={(e) => setTourForm({ ...tourForm, tourId: e.target.value })}
                    className="w-full bg-black/60 border border-emerald-500/30 rounded-xl p-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-syne font-bold cursor-pointer"
                  >
                    {toursList.map((pkg) => (
                      <option key={pkg.id} value={pkg.id} className="bg-gray-900 text-white">
                        🧭 {pkg.title} — ₹{pkg.basePrice.toLocaleString('en-IN')} ({pkg.durationDays}D/{pkg.durationNights}N)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-300 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-400" /> Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={tourForm.name}
                      onChange={(e) => setTourForm({ ...tourForm, name: e.target.value })}
                      placeholder="e.g. Priya Sharma"
                      className="w-full bg-black/40 border border-white/15 rounded-xl p-3.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-300 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={tourForm.phone}
                      onChange={(e) => setTourForm({ ...tourForm, phone: e.target.value })}
                      placeholder="e.g. +91 82082 11478"
                      className="w-full bg-black/40 border border-white/15 rounded-xl p-3.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-300 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Travel Start Date
                    </label>
                    <input
                      type="date"
                      value={tourForm.date}
                      onChange={(e) => setTourForm({ ...tourForm, date: e.target.value })}
                      className="w-full bg-black/40 border border-white/15 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-gray-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Preferred Destination
                    </label>
                    <input
                      type="text"
                      value={tourForm.destination}
                      onChange={(e) => setTourForm({ ...tourForm, destination: e.target.value })}
                      placeholder="e.g. Rajasthan / Kerala / Himachal"
                      className="w-full bg-black/40 border border-white/15 rounded-xl p-3.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-300">Message / Custom Group Request</label>
                  <textarea
                    rows={3}
                    value={tourForm.message}
                    onChange={(e) => setTourForm({ ...tourForm, message: e.target.value })}
                    placeholder="e.g. 4 adults family trip, requiring 4-star hotel stay..."
                    className="w-full bg-black/40 border border-white/15 rounded-xl p-3.5 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-[#5266EB] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-[#5266EB] hover:bg-[#3E51D4] text-[#EDEDF3] font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#5266EB]/30 cursor-pointer hover:scale-[1.01]"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>Send Tour Inquiry on WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

              </form>
            )}

          </div>
        )}

      </div>
    </section>
  );
}
