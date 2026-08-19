/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        aether: {
          bg: '#EDF1F7',
          canvas: '#FAFAFC',
          card: '#FFFFFF',
          sidebar: '#F3F5F9',
          black: '#111827',
          dark: '#1F2937',
          muted: '#6B7280',
          border: '#E5E7EB',
        },
        kpi: {
          peach: '#FFF2E2',
          blue: '#DCE8FE',
          purple: '#EBEAF8',
          green: '#E4F7EC',
        },
        ink: {
          DEFAULT: '#111827',
          slate: '#1F2737',
          navy: '#2D384C',
        },
        brand: {
          primary: '#111827',
          accent: '#4F46E5',
          emerald: '#059669',
          terracotta: '#C85227',
          gold: '#F59E0B',
        },
        surface: {
          card: '#F3F5F9',
          light: '#FAFAFC',
          border: '#E5E7EB',
        },
        heading: '#111827',
        'text-secondary': '#6B7280',
        'text-placeholder': '#9CA3AF',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(17, 24, 39, 0.05)',
        'floating': '0 12px 36px -6px rgba(17, 24, 39, 0.08)',
        'card': '0 2px 12px rgba(17, 24, 39, 0.04)',
      },
    },
  },
  plugins: [],
};
