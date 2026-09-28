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
        ivory: '#FCFAF6',
        sand: '#EDE2D0',
        peach: '#E8B9A5',
        taupe: '#756B63',
        cocoa: {
          DEFAULT: '#493B34',
          dark: '#2D1F18',
          light: '#756B63',
        },
        terracotta: {
          DEFAULT: '#C65A2E',
          hover: '#B24E25',
          light: '#F8EFEA',
          border: '#E8B9A5',
        },
        ramp: {
          primary: '#C65A2E',          // Brand Terracotta
          navy: '#493B34',             // Deep Cocoa
          charcoal: '#2D1F18',         // Dark text
          cta: '#C65A2E',              // Terracotta CTA
          'cta-hover': '#B24E25',      // Hover Terracotta
          'cta-active': '#9E431E',
          'blue-light': '#E8B9A5',     // Peach Light
          'blue-pale': '#F8EFEA',      // Warm Pale
          surface: '#FCFAF6',          // Cloud Ivory surface
          'surface-subtle': '#F8EFEA', // Light Warm subtle
          border: '#EDE2D0',           // Sand border
          stone: '#756B63',
          slate: '#756B63',            // Muted text
          nearBlack: '#2D1F18',
          black: '#1A120E',
        },
        primary: {
          DEFAULT: '#C65A2E',
          hover: '#B24E25',
          light: '#E8B9A5',
          pale: '#F8EFEA',
          dark: '#493B34',
        },
        secondary: {
          DEFAULT: '#493B34',
          hover: '#2D1F18',
          light: '#756B63',
        },
        cta: {
          DEFAULT: '#C65A2E',
          hover: '#B24E25',
          active: '#9E431E',
          text: '#FFFFFF',
        },
        charcoal: '#2D1F18',
        surface: {
          DEFAULT: '#FCFAF6',
          subtle: '#F8EFEA',
          border: '#EDE2D0',
          white: '#FFFFFF',
        },
      },
      borderRadius: {
        'btn': '8px',
        'input': '10px',
        'card': '14px',
        'badge': '6px',
        'md': '10px',
        'lg': '14px',
        'xl': '18px',
        '2xl': '22px',
      },
      boxShadow: {
        'subtle': 'rgba(73, 59, 52, 0.04) 0px 1px 3px',
        'card-hover': 'rgba(73, 59, 52, 0.08) 0px 4px 12px',
        'btn-hover': 'rgba(198, 90, 46, 0.2) 0px 2px 6px',
        'cta-glow': 'rgba(198, 90, 46, 0.2) 0px 8px 24px',
        'dropdown': 'rgba(73, 59, 52, 0.1) 0px 10px 30px 0px, rgba(73, 59, 52, 0.05) 0px 1px 3px 0px',
        'focus-ring': '0px 0px 0px 3px rgba(198, 90, 46, 0.2)',
      },
      spacing: {
        '4.5': '18px',
        '15': '60px',
      },
    },
  },
  plugins: [],
};
