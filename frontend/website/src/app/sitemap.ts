import { MetadataRoute } from 'next';
import { TOUR_PACKAGES } from '@/constants/toursData';
import { FLEET_VEHICLES } from '@/constants/carsData';

const BASE_URL = 'https://aarambhatravels.in';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}`,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/tours-travels`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/bus-rentals`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/car-rentals`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/cars`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/car-rentals/faq`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/my-bookings`,
      lastModified,
      changeFrequency: 'always',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/terms-and-conditions`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/legal`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  // Dynamic Tour Package Routes
  const tourRoutes: MetadataRoute.Sitemap = TOUR_PACKAGES.map((tour) => ({
    url: `${BASE_URL}/tours-travels/${tour.slug}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Dynamic Car Rental Routes
  const carRoutes: MetadataRoute.Sitemap = FLEET_VEHICLES.map((car) => ({
    url: `${BASE_URL}/car-rentals/cars/${car.id}`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  return [...staticRoutes, ...tourRoutes, ...carRoutes];
}
