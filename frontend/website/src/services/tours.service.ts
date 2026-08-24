import { apiFetch } from './api-client';
import { TOUR_PACKAGES, TourPackage } from '@/constants/toursData';

export function formatTourPackageFromApi(apiPkg: any, fallback?: TourPackage): TourPackage {
  const match = fallback || TOUR_PACKAGES.find(p => p.slug === apiPkg.slug || p.id === apiPkg.slug || p.id === apiPkg._id) || TOUR_PACKAGES[0];
  
  const basePrice = Number(apiPkg.basePrice ?? apiPkg.base_price ?? match.basePrice);
  const depositPrice = Number(apiPkg.depositPrice ?? apiPkg.deposit_price ?? match.depositPrice);
  const durationDays = Number(apiPkg.durationDays ?? apiPkg.duration_days ?? match.durationDays);
  const durationNights = Number(apiPkg.durationNights ?? apiPkg.duration_nights ?? match.durationNights);

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
  if (!datesLabel) {
    if (batchDates.length === 1) {
      datesLabel = batchDates[0].label;
    } else if (batchDates.length > 1) {
      const availableBatches = batchDates.filter((b: any) => b.status !== 'disabled');
      const firstBatch = availableBatches[0] || batchDates[0];
      const startTag = firstBatch.label ? firstBatch.label.split('–')[0].trim() : firstBatch.startDate;
      datesLabel = `${startTag} Onwards (${batchDates.length} Batches)`;
    } else {
      datesLabel = '';
    }
  }

  return {
    ...match,
    id: apiPkg._id || apiPkg.id || match.id,
    slug: apiPkg.slug || match.slug,
    title: apiPkg.title || match.title,
    subtitle: apiPkg.subtitle || match.subtitle,
    destination: apiPkg.destinationId?.name || apiPkg.destination || match.destination,
    state: apiPkg.destinationId?.state || apiPkg.state || match.state,
    durationDays,
    durationNights,
    durationLabel: `${durationDays} Days / ${durationNights} Nights`,
    datesLabel,
    basePrice,
    priceDisplay: `₹${basePrice.toLocaleString('en-IN')}`,
    depositPrice,
    advanceLabel: `₹${depositPrice.toLocaleString('en-IN')} Advance`,
    lowerSeatPrice: apiPkg.lowerSeatPrice ?? match.lowerSeatPrice,
    upperSeatPrice: apiPkg.upperSeatPrice ?? match.upperSeatPrice,
    rating: apiPkg.rating ?? match.rating ?? 4.9,
    reviewsCount: apiPkg.reviewsCount ?? match.reviewsCount ?? 120,
    featured: apiPkg.featured ?? match.featured ?? true,
    image: (Array.isArray(apiPkg.images) && apiPkg.images[0]) || apiPkg.image || match.image,
    gallery: (Array.isArray(apiPkg.images) && apiPkg.images.length > 0) ? apiPkg.images : match.gallery,
    sites: Array.isArray(apiPkg.sites) && apiPkg.sites.length > 0 ? apiPkg.sites : match.sites,
    overview: apiPkg.description || apiPkg.overview || match.overview,
    inclusions: Array.isArray(apiPkg.inclusions) && apiPkg.inclusions.length > 0 ? apiPkg.inclusions : match.inclusions,
    exclusions: Array.isArray(apiPkg.exclusions) && apiPkg.exclusions.length > 0 ? apiPkg.exclusions : match.exclusions,
    terms: Array.isArray(apiPkg.terms) && apiPkg.terms.length > 0 ? apiPkg.terms : match.terms,
    itinerary: Array.isArray(apiPkg.itineraries) && apiPkg.itineraries.length > 0 
      ? apiPkg.itineraries.map((it: any, idx: number) => ({
          day: it.dayNumber || it.day || (idx + 1),
          title: it.title || `Day ${idx + 1}`,
          description: it.description || '',
          highlights: Array.isArray(it.highlights) ? it.highlights : [],
        }))
      : match.itinerary,
    batchDates,
  };
}

export function formatTourPackagesFromApi(liveList: any[] | null): TourPackage[] {
  if (!Array.isArray(liveList) || liveList.length === 0) {
    return TOUR_PACKAGES.map(p => formatTourPackageFromApi(p, p));
  }

  // Map each static package to its live API counterpart, plus any new packages from API
  const matched = TOUR_PACKAGES.map(staticPkg => {
    const apiMatch = liveList.find(a => a.slug === staticPkg.slug || a._id === staticPkg.id || a.id === staticPkg.id);
    return apiMatch ? formatTourPackageFromApi(apiMatch, staticPkg) : formatTourPackageFromApi(staticPkg, staticPkg);
  });

  // Add any completely new packages created in CRM that don't match static ones
  const newOnes = liveList
    .filter(a => !TOUR_PACKAGES.some(s => s.slug === a.slug || s.id === a._id || s.id === a.id))
    .map(a => formatTourPackageFromApi(a));

  return [...matched, ...newOnes];
}

export async function fetchLiveTourPackages(): Promise<TourPackage[]> {
  try {
    const res = await apiFetch<any>('/api/tours/packages');
    const data = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : null);
    if (Array.isArray(data) && data.length > 0) {
      return formatTourPackagesFromApi(data);
    }
  } catch (e) {
    console.warn('[ToursService] Failed to fetch live tour packages from API, using default static packages.', e);
  }
  return TOUR_PACKAGES;
}

export async function fetchLiveTourPackageBySlug(slug: string): Promise<TourPackage> {
  const fallback = TOUR_PACKAGES.find(p => p.slug === slug || p.id === slug) || TOUR_PACKAGES[0];
  try {
    const res = await apiFetch<any>(`/api/tours/packages/${slug}`);
    const data = res?.data || res;
    if (data && (data._id || data.slug || data.title)) {
      return formatTourPackageFromApi(data, fallback);
    }
  } catch (e) {
    console.warn(`[ToursService] Failed to fetch live tour package (${slug}), using default static package.`, e);
  }
  return fallback;
}

export const getTourPackages = () => apiFetch<any[]>('/api/tours/packages');
export const getTourPackageBySlug = (slug: string) => apiFetch<any>(`/api/tours/packages/${slug}`);
export const createTourInquiry = (data: any) =>
  apiFetch('/api/tours/inquiries', { method: 'POST', body: JSON.stringify(data) });

