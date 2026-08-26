import React, { useState, useEffect, useRef } from 'react';
import {
  X, MessageSquare, Copy, Check, Send, Phone, User, Calendar, Car, Compass,
  Sparkles, RefreshCw, AlertCircle, ShieldCheck, MapPin, DollarSign, Edit3, Users
} from 'lucide-react';
import {
  BookingDataInput,
  getTemplatesForBooking,
  TOUR_INSERTABLE_VARIABLES,
  FLEET_INSERTABLE_VARIABLES,
  extractBookingDetails,
  renderBookingTemplate,
  getRecommendedTemplateId,
  MessageTemplate
} from '@/utils/whatsappTemplates';

interface WhatsAppBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingDataInput | null;
  defaultTemplateId?: string;
}

export function WhatsAppBookingModal({
  isOpen,
  onClose,
  booking,
  defaultTemplateId,
}: WhatsAppBookingModalProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [messageText, setMessageText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const bookingDetails = extractBookingDetails(booking);
  const isTour = bookingDetails.vertical === 'tour';
  const availableTemplates = getTemplatesForBooking(booking);
  const insertableVars = isTour ? TOUR_INSERTABLE_VARIABLES : FLEET_INSERTABLE_VARIABLES;

  // Initialize template whenever modal opens or booking changes
  useEffect(() => {
    if (isOpen && booking) {
      const templates = getTemplatesForBooking(booking);
      const initialTemplateId =
        defaultTemplateId && templates.some((t) => t.id === defaultTemplateId)
          ? defaultTemplateId
          : getRecommendedTemplateId(booking);

      setSelectedTemplateId(initialTemplateId);
      const matchedTemplate =
        templates.find((t) => t.id === initialTemplateId) || templates[0];

      if (matchedTemplate) {
        const parsed = renderBookingTemplate(matchedTemplate.template, booking);
        setMessageText(parsed);
      }
      setCopied(false);
    }
  }, [isOpen, booking, defaultTemplateId]);

  if (!isOpen || !booking) return null;

  // Change Template Handler
  const handleSelectTemplate = (template: MessageTemplate) => {
    setSelectedTemplateId(template.id);
    const parsed = renderBookingTemplate(template.template, booking);
    setMessageText(parsed);
  };

  // Reset to current template original parsed text
  const handleResetCurrentTemplate = () => {
    const matchedTemplate =
      availableTemplates.find((t) => t.id === selectedTemplateId) ||
      availableTemplates[0];
    if (matchedTemplate) {
      const parsed = renderBookingTemplate(matchedTemplate.template, booking);
      setMessageText(parsed);
    }
  };

  // Insert Variable at Cursor Position
  const handleInsertVariable = (tag: string) => {
    if (!textareaRef.current) {
      setMessageText((prev) => prev + ` ${tag}`);
      return;
    }

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = messageText.substring(0, start);
    const after = messageText.substring(end);

    const newText = before + tag + after;
    const parsed = renderBookingTemplate(newText, booking);
    setMessageText(parsed);

    // Reposition cursor
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const nextPos = start + tag.length;
        textareaRef.current.setSelectionRange(nextPos, nextPos);
      }
    }, 50);
  };

  // Copy to Clipboard
  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Open in WhatsApp
  const handleSendWhatsApp = () => {
    const rawPhone = bookingDetails.clean_phone;
    if (!rawPhone) {
      alert('No valid customer phone number found for this booking.');
      return;
    }

    // Ensure 91 country code for Indian numbers if not already provided with 91 or +
    const formattedPhone = rawPhone.length === 10 ? `91${rawPhone}` : rawPhone;
    const encodedText = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedText}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[94vh] flex flex-col overflow-hidden border border-gray-100 my-auto">
        
        {/* MODAL HEADER */}
        <div className={`px-5 py-4 border-b border-gray-100 flex items-center justify-between text-white ${
          isTour
            ? 'bg-gradient-to-r from-emerald-950 via-[#12382D] to-[#0A2620]'
            : 'bg-gradient-to-r from-[#171F38] via-[#1E294B] to-[#121A30]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner ${
              isTour
                ? 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-400'
                : 'bg-indigo-500/20 border border-indigo-400/30 text-indigo-300'
            }`}>
              {isTour ? <Compass className="w-5 h-5" /> : <Car className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-syne tracking-tight">
                  {isTour ? 'Tour Package WhatsApp Dispatch' : 'Self-Drive & Fleet Dispatch'}
                </h3>
                <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                  isTour
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                }`}>
                  {isTour ? '🗺️ Tours & Packages Only' : '🚗 Self-Drive / Fleet Only'}
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-0.5">
                {isTour
                  ? 'Send curated itinerary confirmations, driver allotments & tour balance reminders.'
                  : 'Send vehicle handover notices, hub pickup maps & deposit refund confirmations.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL CONTENT BODY */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 text-xs">

          {/* 1. CUSTOMER & BOOKING SUMMARY CARD */}
          <div className={`border rounded-2xl p-3.5 sm:p-4 grid grid-cols-1 md:grid-cols-4 gap-3 shadow-xs ${
            isTour ? 'bg-emerald-50/40 border-emerald-100' : 'bg-slate-50 border-slate-200/80'
          }`}>
            
            {/* Customer Column */}
            <div className="space-y-1 md:border-r border-gray-200/80 pr-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block flex items-center gap-1">
                <User className="w-3 h-3 text-emerald-600" /> Customer Details
              </span>
              <div className="font-bold text-sm text-gray-900 truncate">
                {bookingDetails.customer_name}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
                <span className="font-mono">{bookingDetails.customer_phone || 'No Phone'}</span>
                {bookingDetails.customer_phone && (
                  <a
                    href={`tel:${bookingDetails.customer_phone}`}
                    className="p-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100"
                    title="Call Customer"
                  >
                    <Phone className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Service & Vertical Column */}
            <div className="space-y-1 md:border-r border-gray-200/80 pr-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block flex items-center gap-1">
                {isTour ? <Compass className="w-3 h-3 text-emerald-600" /> : <Car className="w-3 h-3 text-indigo-600" />}
                {isTour ? 'Tour Package' : 'Assigned Vehicle'}
              </span>
              <div className="font-bold text-gray-900 text-xs truncate">
                {bookingDetails.service_type}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {isTour ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded flex items-center gap-1">
                    <Users className="w-3 h-3" /> {bookingDetails.pax_count}
                  </span>
                ) : (
                  <span className="font-mono text-[10px] bg-slate-200/80 px-2 py-0.5 rounded font-bold text-slate-700">
                    {bookingDetails.vehicle_number}
                  </span>
                )}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  isTour ? 'bg-amber-100/80 text-amber-900' : 'bg-indigo-50 text-indigo-600'
                }`}>
                  {bookingDetails.status}
                </span>
              </div>
            </div>

            {/* Schedule Column */}
            <div className="space-y-1 md:border-r border-gray-200/80 pr-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-600" />
                {isTour ? 'Travel Dates' : 'Rental Duration'}
              </span>
              <div className="text-[11px] text-gray-800 font-semibold truncate">
                {isTour ? 'Departure:' : 'Pickup:'} {bookingDetails.pickup_date} ({bookingDetails.pickup_time})
              </div>
              <div className="text-[10px] text-gray-500 truncate">
                {isTour ? 'Return:' : 'Drop-off:'} {bookingDetails.dropoff_date} ({bookingDetails.dropoff_time})
              </div>
            </div>

            {/* Financials Column */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-emerald-600" /> Payment Summary ({bookingDetails.booking_id})
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] text-gray-500">Total Fare:</span>
                <span className="font-bold text-gray-900">₹{bookingDetails.total_amount}</span>
              </div>
              <div className="flex items-baseline justify-between text-[11px]">
                <span className="text-emerald-700 font-medium">Advance: ₹{bookingDetails.advance_paid}</span>
                <span className="text-red-600 font-bold bg-red-50 px-1.5 py-0.2 rounded">
                  Due: ₹{bookingDetails.balance_amount}
                </span>
              </div>
            </div>

          </div>

          {/* 2. DEDICATED TEMPLATE SELECTION CHIPS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-bold text-gray-900 text-xs uppercase tracking-wider">
                  {isTour ? 'Select Tour Message Template' : 'Select Self-Drive & Rental Template'} ({availableTemplates.length})
                </span>
              </div>
            </div>

            {/* Template Chips Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {availableTemplates.map((tpl) => {
                const isSelected = selectedTemplateId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-1 relative cursor-pointer ${
                      isSelected
                        ? isTour
                          ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                          : 'bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{tpl.icon}</span>
                        <span className={`font-bold text-xs ${
                          isSelected ? (isTour ? 'text-emerald-950' : 'text-indigo-950') : 'text-gray-900'
                        }`}>
                          {tpl.title}
                        </span>
                      </div>
                      {isSelected && (
                        <span className={`w-2 h-2 rounded-full shrink-0 mt-1 ${isTour ? 'bg-emerald-500' : 'bg-indigo-600'}`} />
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 line-clamp-2 leading-tight">
                      {tpl.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. QUICK INSERT VARIABLE TAGS */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-gray-500 font-semibold flex items-center gap-1">
                <Edit3 className="w-3 h-3 text-indigo-500" /> Insert Booking Variable Tag at Cursor:
              </span>
              <button
                type="button"
                onClick={handleResetCurrentTemplate}
                className="text-[10px] font-bold text-gray-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                title="Reset message box to template defaults"
              >
                <RefreshCw className="w-2.5 h-2.5" /> Reset Default Template
              </button>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {insertableVars.map((v) => (
                <button
                  key={v.tag}
                  type="button"
                  onClick={() => handleInsertVariable(v.tag)}
                  className={`px-2.5 py-1 rounded-lg border text-[10px] font-mono font-bold whitespace-nowrap transition-all active:scale-95 ${
                    isTour
                      ? 'bg-emerald-50/50 hover:bg-emerald-100 border-emerald-200 text-emerald-800'
                      : 'bg-indigo-50/50 hover:bg-indigo-100 border-indigo-200 text-indigo-800'
                  }`}
                  title={`Insert ${v.tag}`}
                >
                  + {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. LIVE EDITABLE MESSAGE PREVIEW BOX */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-gray-800 text-xs flex items-center gap-1.5">
                <span>Message Draft (WhatsApp Formatted):</span>
                <span className="text-[10px] text-gray-400 font-normal">
                  Review and edit any word before sending
                </span>
              </label>
              <span className="text-[10px] font-mono text-gray-400">
                {messageText.length} characters
              </span>
            </div>

            <div className="relative rounded-2xl border border-gray-200 bg-[#FAF9F5] focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all overflow-hidden shadow-inner">
              <textarea
                ref={textareaRef}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={11}
                className="w-full p-4 bg-transparent text-gray-800 font-sans text-xs sm:text-sm leading-relaxed resize-y focus:outline-none placeholder-gray-400"
                placeholder="Type your WhatsApp message draft here..."
              />
            </div>
          </div>

        </div>

        {/* 5. MODAL FOOTER ACTIONS */}
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3 flex-wrap">
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyMessage}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all border shadow-xs active:scale-95 ${
                copied
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-500" />
                  <span>Copy Message</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 font-bold text-xs hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/30 transition-all hover:scale-102 active:scale-98 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>🟢 Open in WhatsApp & Send</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
