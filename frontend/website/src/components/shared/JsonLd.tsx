import React from 'react';

interface JsonLdProps {
  data: Record<string, any>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Standard Organization & Local Travel Agency Schema
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': 'https://aarambhatravels.in/#organization',
    name: 'आरंभ Tours & Travels',
    alternateName: 'Aarambha Tours & Travels',
    url: 'https://aarambhatravels.in',
    logo: 'https://aarambhatravels.in/images/aarambha_logo.png',
    image: 'https://aarambhatravels.in/images/tours_travels_bg.jpg',
    description: 'Premier tours, spiritual pilgrimages, luxury bus rentals, and self-drive car rentals across India.',
    telephone: '+919067617451',
    email: 'contact@aarambhatravels.in',
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Indore',
      addressRegion: 'Madhya Pradesh',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 22.7196,
      longitude: 75.8577,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
    sameAs: [
      'https://wa.me/919067617451',
    ],
  };
}

/**
 * Tour Package Schema for Google Rich Results
 */
export function getTourPackageSchema(tour: {
  title: string;
  subtitle?: string;
  description?: string;
  tourDescription?: string;
  price?: number;
  basePrice?: number;
  durationDays?: number;
  image: string;
  slug: string;
  rating?: number;
  reviewsCount?: number;
}) {
  const descriptionText = tour.description || tour.tourDescription || tour.subtitle || tour.title;
  const tourPrice = tour.price ?? tour.basePrice ?? 6499;

  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.title,
    description: descriptionText,
    image: tour.image?.startsWith('http') ? tour.image : `https://aarambhatravels.in${tour.image || ''}`,
    touristType: ['Pilgrimage', 'Spiritual', 'Family', 'Group'],
    offers: {
      '@type': 'Offer',
      price: tourPrice,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: `https://aarambhatravels.in/tours-travels/${tour.slug}`,
      validFrom: '2026-01-01',
    },
    provider: {
      '@type': 'TravelAgency',
      name: 'आरंभ Tours & Travels',
      url: 'https://aarambhatravels.in',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: tour.rating || 4.9,
      reviewCount: tour.reviewsCount || 120,
    },
  };
}
