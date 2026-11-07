/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Inter"',
          '"Plus Jakarta Sans"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        heading: [
          '"Plus Jakarta Sans"',
          '"Inter"',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        // ─── AARAMBHA CRM PREMIUM SAAS DESIGN SYSTEM ───
        navy: {
          950: '#0A1329',
          900: '#101F40', // Primary Navy Sidebar
          850: '#15284F',
          800: '#1C315A', // Secondary Navy Active/Hover
          700: '#253F72',
          600: '#325291',
        },
        brand: {
          blue: '#3569F6',        // Primary Blue
          'blue-hover': '#2455DC',
          'soft-blue': '#EDF3FF', // Soft Blue Background / Pill
          navy: '#101F40',        // Primary Navy
          'navy-secondary': '#1C315A',
          success: '#12A879',     // Live / Active Success Green
          'success-soft': '#E7F7F2',
          warning: '#F3A23A',     // Warning / Inquiry Orange
          'warning-soft': '#FEF5EB',
          purple: '#9560EF',      // Purple Fleet Accent
          'purple-soft': '#F4EEFD',
          bg: '#F5F7FC',          // App Background Canvas
          card: '#FFFFFF',        // Pure White Surface
          border: '#E8ECF4',      // Crisp Border
          text: '#17233D',        // Dark Primary Text
          muted: '#77839A',       // Secondary / Muted Text
        },
        primary: {
          DEFAULT: '#3569F6',
          hover: '#2455DC',
          light: '#EDF3FF',
          dark: '#101F40',
        },
        // Legacy fallbacks for existing modules
        ivory: '#FCFAF6',
        sand: '#EDE2D0',
        taupe: '#756B63',
        terracotta: {
          DEFAULT: '#3569F6',
          hover: '#2455DC',
          light: '#EDF3FF',
          border: '#E8ECF4',
        },
        cocoa: {
          DEFAULT: '#17233D',
          dark: '#101F40',
          light: '#77839A',
        },
        charcoal: '#17233D',
        surface: {
          DEFAULT: '#F5F7FC',
          subtle: '#EDF3FF',
          border: '#E8ECF4',
          white: '#FFFFFF',
        },
      },
      borderRadius: {
        'btn': '10px',
        'input': '10px',
        'card': '16px',
        'badge': '8px',
        'md': '10px',
        'lg': '14px',
        'xl': '18px',
        '2xl': '24px',
      },
      boxShadow: {
        'card-subtle': '0px 2px 8px rgba(16, 31, 64, 0.04)',
        'card-hover': '0px 8px 24px rgba(16, 31, 64, 0.08)',
        'btn-hover': '0px 4px 12px rgba(53, 105, 246, 0.25)',
        'dropdown': '0px 12px 36px rgba(16, 31, 64, 0.12)',
        'sidebar-pill': '0px 2px 6px rgba(0, 0, 0, 0.15)',
        '2xs': '0 1px 2px 0 rgba(16, 31, 64, 0.03)',
        'xs': '0 1px 3px 0 rgba(16, 31, 64, 0.05)',
      },
      spacing: {
        '4.5': '18px',
        '15': '60px',
      },
    },
  },
  plugins: [],
};
