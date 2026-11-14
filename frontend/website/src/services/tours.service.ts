import { apiFetch } from './api-client';
import { TOUR_PACKAGES, TourPackage } from '@/constants/toursData';

export function formatTourPackageFromApi(apiPkg: any, fallback?: TourPackage): TourPackage {
  const match = fallback || TOUR_PACKAGES.find(p => 
    p.slug === apiPkg.slug || 
    p.id === apiPkg.slug || 
    p.id === apiPkg._id ||
    p.slug === `pune-to-${apiPkg.slug}` ||
    apiPkg.slug === `pune-to-${p.slug}`
  );
  
  const basePrice = Number(apiPkg.basePrice ?? apiPkg.base_price ?? match?.basePrice ?? 6499);
  const depositPrice = Number(apiPkg.depositPrice ?? apiPkg.deposit_price ?? match?.depositPrice ?? 1999);
  const durationDays = Number(apiPkg.durationDays ?? apiPkg.duration_days ?? match?.durationDays ?? 3);
  const durationNights = Number(apiPkg.durationNights ?? apiPkg.duration_nights ?? match?.durationNights ?? 2);

  // Extract live batch dates with exact respect for empty array []
  let batchDates: any[] = [];
  if (apiPkg && Array.isArray(apiPkg.batchDates)) {
    batchDates = apiPkg.batchDates;
  } else if (apiPkg && Array.isArray(apiPkg.batches)) {
    batchDates = apiPkg.batches;
  } else if (apiPkg && Array.isArray(apiPkg.batch_dates)) {
    batchDates = apiPkg.batch_dates;
  } else if (match && Array.isArray(match.batchDates)) {
    batchDates = match.batchDates;
  }

  // Derive dynamic live datesLabel
  let datesLabel = apiPkg.datesLabel || apiPkg.dates_label;
  if (!datesLabel || datesLabel.trim() === '') {
    if (batchDates.length === 1) {
      datesLabel = batchDates[0].label;
    } else if (batchDates.length > 1) {
      const availableBatches = batchDates.filter((b: any) => b.status !== 'disabled' && b.status !== 'full');
      const firstBatch = availableBatches[0] || batchDates[0];
      const startTag = firstBatch.label ? firstBatch.label.split('–')[0].trim() : (firstBatch.startDate || '');
      datesLabel = `${startTag} Onwards (${batchDates.length} Batches)`;
    } else {
      datesLabel = 'Upcoming Departures';
    }
  }

  const sites = Array.isArray(apiPkg.sites) && apiPkg.sites.length > 0 
    ? apiPkg.sites 
    : (match?.sites || ['Sacred Temples', 'Holy Ghats', 'Guided Darshan']);

  const inclusions = Array.isArray(apiPkg.inclusions) && apiPkg.inclusions.length > 0 
    ? apiPkg.inclusions 
    : (match?.inclusions || ['AC Pushback Transport', 'Hotel Stay', 'Satvik Meals', 'Drinking Water', 'Travel Insurance']);

  const exclusions = Array.isArray(apiPkg.exclusions) && apiPkg.exclusions.length > 0 
    ? apiPkg.exclusions 
    : (match?.exclusions || ['Personal Expenses', 'VIP Passes', 'Special Puja']);

  const terms = Array.isArray(apiPkg.terms) && apiPkg.terms.length > 0 
    ? apiPkg.terms 
    : (match?.terms || ['Booking confirmed on advance', 'No refund on cancellation', 'Passenger replacement allowed']);

  const itinerary = Array.isArray(apiPkg.itineraries) && apiPkg.itineraries.length > 0
    ? apiPkg.itineraries.map((it: any, idx: number) => ({
        day: it.dayNumber || it.day || (idx + 1),
        title: it.title || `Day ${idx + 1} Sacred Journey`,
        description: it.description || '',
        highlights: Array.isArray(it.highlights) ? it.highlights : [],
      }))
    : (match?.itinerary || [
        { day: 1, title: 'Departure & Sacred Arrival', description: 'Journey and holy temple darshan.', highlights: [] },
        { day: 2, title: 'Holy Darshan & Rituals', description: 'Darshan, prayers and Aarti.', highlights: [] },
        { day: 3, title: 'Return Journey', description: 'Safe return journey.', highlights: [] },
      ]);

  let image = (Array.isArray(apiPkg.images) && apiPkg.images[0]) || apiPkg.image || match?.image || '/images/hero_spiritual_tours.jpg';
  if ((apiPkg.slug?.includes('girnar') || apiPkg.id?.includes('girnar') || match?.slug?.includes('girnar')) && (image.includes('unsplash') || image.includes('himalayan'))) {
    image = '/images/tours/somnath_jyotirlinga_temple.jpg';
  }
  let gallery = (Array.isArray(apiPkg.images) && apiPkg.images.length > 0) ? apiPkg.images : (match?.gallery || [image]);
  if (apiPkg.slug?.includes('girnar') || apiPkg.id?.includes('girnar') || match?.slug?.includes('girnar')) {
    gallery = ['/images/tours/somnath_jyotirlinga_temple.jpg', ...gallery.filter((g: string) => !g.includes('unsplash') && !g.includes('himalayan'))];
  }

  return {
    id: apiPkg._id || apiPkg.id || match?.id || apiPkg.slug,
    slug: apiPkg.slug || match?.slug || 'tour-package',
    title: apiPkg.title || match?.title || 'Pilgrimage Tour Package',
    subtitle: apiPkg.subtitle || match?.subtitle || 'Sacred pilgrimage journey departing from Pune',
    destination: apiPkg.destinationId?.name || apiPkg.destination || match?.destination || 'Holy Dham',
    state: apiPkg.destinationId?.state || apiPkg.state || match?.state || 'India',
    durationDays,
    durationNights,
    durationLabel: `${durationDays} Days / ${durationNights} Nights`,
    datesLabel,
    basePrice,
    priceDisplay: `₹${basePrice.toLocaleString('en-IN')}`,
    depositPrice,
    advanceLabel: `₹${depositPrice.toLocaleString('en-IN')} Advance`,
    lowerSeatPrice: apiPkg.lowerSeatPrice ?? match?.lowerSeatPrice,
    upperSeatPrice: apiPkg.upperSeatPrice ?? match?.upperSeatPrice,
    rating: apiPkg.rating ?? match?.rating ?? 4.9,
    reviewsCount: apiPkg.reviewsCount ?? match?.reviewsCount ?? 120,
    featured: apiPkg.featured ?? match?.featured ?? true,
    image,
    gallery,
    sites,
    overview: apiPkg.overview || apiPkg.description || match?.overview || 'Sacred pilgrimage tour with comfortable AC transport and verified accommodations.',
    inclusions,
    exclusions,
    terms,
    itinerary,
    batchDates,
  };
}

export function formatTourPackagesFromApi(liveList: any[] | null): TourPackage[] {
  if (!Array.isArray(liveList) || liveList.length === 0) {
    return TOUR_PACKAGES;
  }

  // Live API data is the absolute source of truth
  return liveList.map(apiPkg => {
    const fallback = TOUR_PACKAGES.find(
      p => p.slug === apiPkg.slug || 
           p.id === apiPkg._id || 
           p.id === apiPkg.id || 
           p.slug === apiPkg.id ||
           p.slug === `pune-to-${apiPkg.slug}` ||
           apiPkg.slug === `pune-to-${p.slug}`
    );
    return formatTourPackageFromApi(apiPkg, fallback);
  });
}

export async function fetchLiveTourPackages(forceFresh: boolean = false): Promise<TourPackage[]> {
  try {
    const res = await apiFetch<any>('/api/tours/packages', { 
      cache: 'no-store',
      bypassCache: forceFresh,
    });
    const data = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : null);
    if (Array.isArray(data) && data.length > 0) {
      return formatTourPackagesFromApi(data);
    }
  } catch (e) {
    console.warn('[ToursService] Failed to fetch live tour packages from API, using default static packages.', e);
  }
  return TOUR_PACKAGES;
}

export async function fetchLiveTourPackageBySlug(slug: string, forceFresh: boolean = false): Promise<TourPackage> {
  const fallback = TOUR_PACKAGES.find(p => 
    p.slug === slug || 
    p.id === slug || 
    p.slug === `pune-to-${slug}` ||
    slug === `pune-to-${p.slug}` ||
    (slug.includes('2-jyotirlinga') && p.slug.includes('2-jyotirlinga')) ||
    (slug.includes('girnar') && p.slug.includes('girnar'))
  ) || TOUR_PACKAGES[0];

  try {
    const res = await apiFetch<any>(`/api/tours/packages/${slug}`, { 
      cache: 'no-store',
      bypassCache: forceFresh,
    });
    const data = res?.data || res;
    if (data && (data._id || data.slug || data.title)) {
      return formatTourPackageFromApi(data, fallback);
    }
  } catch (e) {
    // If slug lookup failed, try alternate candidate (with or without 'pune-to-')
    const alternateSlug = slug.startsWith('pune-to-') ? slug.replace(/^pune-to-/, '') : `pune-to-${slug}`;
    try {
      const altRes = await apiFetch<any>(`/api/tours/packages/${alternateSlug}`, {
        cache: 'no-store',
        bypassCache: forceFresh,
      });
      const altData = altRes?.data || altRes;
      if (altData && (altData._id || altData.slug || altData.title)) {
        return formatTourPackageFromApi(altData, fallback);
      }
    } catch (_altErr) {}
    console.warn(`[ToursService] Failed to fetch live tour package (${slug}), using fallback.`, e);
  }
  return fallback;
}

export const getTourPackages = () => apiFetch<any[]>('/api/tours/packages', { cache: 'no-store' });
export const getTourPackageBySlug = (slug: string) => apiFetch<any>(`/api/tours/packages/${slug}`, { cache: 'no-store' });
export const createTourInquiry = (data: any) =>
  apiFetch('/api/tours/inquiries', { method: 'POST', body: JSON.stringify(data) });
