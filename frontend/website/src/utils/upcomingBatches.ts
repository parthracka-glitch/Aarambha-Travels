/**
 * Utility for auto-fetching and calculating the nearest upcoming departure batch
 * for spiritual tour packages, rendering dynamic countdowns & badges on the live website.
 */

export interface UpcomingBatchInfo {
  hasBatch: boolean;
  batchId: string;
  label: string; // e.g. "27 Nov – 03 Dec 2026"
  startDate?: string;
  endDate?: string;
  daysRemaining?: number;
  badgeText: string;
  isAvailable: boolean;
  totalActiveBatches: number;
}

/**
 * Computes the closest upcoming departure batch for a package.
 * Prioritizes active, future batches in chronological order.
 * If no future batches exist, dynamically schedules the upcoming guaranteed weekend departure.
 */
export function getUpcomingBatchInfo(batchDates?: any[], durationDays: number = 3): UpcomingBatchInfo {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // If no batches configured by admin, provide smart upcoming weekend schedule
  if (!Array.isArray(batchDates) || batchDates.length === 0) {
    const nextFriday = new Date();
    const dayOfWeek = nextFriday.getDay();
    const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7;
    nextFriday.setDate(nextFriday.getDate() + daysUntilFriday);
    const returnDate = new Date(nextFriday);
    returnDate.setDate(returnDate.getDate() + Math.max(1, durationDays - 1));

    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
    const label = `${nextFriday.toLocaleDateString('en-IN', options)} – ${returnDate.toLocaleDateString('en-IN', options)}`;

    return {
      hasBatch: true,
      batchId: 'dynamic-weekend',
      label,
      startDate: nextFriday.toISOString().split('T')[0],
      endDate: returnDate.toISOString().split('T')[0],
      daysRemaining: daysUntilFriday,
      badgeText: `⚡ Guaranteed Departure: ${label}`,
      isAvailable: true,
      totalActiveBatches: 1,
    };
  }

  // Filter available batches (not disabled)
  const availableBatches = batchDates.filter(b => b.status !== 'disabled');

  // Find all future batches (startDate >= today)
  const futureBatches: Array<{ batch: any; timeDiff: number; days: number }> = [];

  for (const b of availableBatches) {
    if (b.startDate) {
      const bDate = new Date(b.startDate);
      bDate.setHours(0, 0, 0, 0);
      const diffMs = bDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      if (diffDays >= 0) {
        futureBatches.push({ batch: b, timeDiff: diffMs, days: diffDays });
      }
    }
  }

  // Sort chronologically (closest date first)
  if (futureBatches.length > 0) {
    futureBatches.sort((a, b) => a.timeDiff - b.timeDiff);
    const nearest = futureBatches[0];
    const b = nearest.batch;
    const cleanLabel = (b.label || '').split('(')[0].trim() || `${b.startDate} – ${b.endDate}`;

    let badgeText = `Next Batch: ${cleanLabel}`;
    if (nearest.days === 0) {
      badgeText = `🟢 Departing Today: ${cleanLabel}`;
    } else if (nearest.days === 1) {
      badgeText = `⚡ Departs Tomorrow: ${cleanLabel}`;
    } else if (nearest.days <= 14) {
      badgeText = `⚡ Next Batch in ${nearest.days} Days (${cleanLabel})`;
    }

    return {
      hasBatch: true,
      batchId: b.id || 'batch-0',
      label: cleanLabel,
      startDate: b.startDate,
      endDate: b.endDate,
      daysRemaining: nearest.days,
      badgeText,
      isAvailable: b.status !== 'full',
      totalActiveBatches: availableBatches.length,
    };
  }

  // If batches exist but are dated prior to today or have no startDate, pick the first configured batch
  const firstBatch = availableBatches[0] || batchDates[0];
  const cleanLabel = (firstBatch.label || '').split('(')[0].trim() || 'Guaranteed Departure';

  return {
    hasBatch: true,
    batchId: firstBatch.id || 'batch-0',
    label: cleanLabel,
    startDate: firstBatch.startDate,
    endDate: firstBatch.endDate,
    badgeText: `Next Batch: ${cleanLabel}`,
    isAvailable: firstBatch.status !== 'full',
    totalActiveBatches: availableBatches.length,
  };
}

