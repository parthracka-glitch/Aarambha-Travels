/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  compress: true,
  transpilePackages: ['lucide-react'],
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async redirects() {
    return [
      {
        source: '/cars',
        destination: '/rentals',
        permanent: false,
      },
      {
        source: '/bus-rentals',
        destination: '/rentals',
        permanent: false,
      },
      {
        source: '/car-rentals',
        destination: '/rentals',
        permanent: false,
      },
      {
        source: '/tours-travels',
        destination: '/tours',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
