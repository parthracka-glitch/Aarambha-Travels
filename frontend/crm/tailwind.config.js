/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
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
        insight: {
          purple: '#F1EFFE',
          orange: '#FFF3EC',
          green: '#EAFFE9',
        },
        ink: {
          DEFAULT: '#081323',
          slate: '#2D3949',
        },
        gold: '#F2C94C',
        heading: '#4F4F4F',
        'text-secondary': '#828282',
        'text-placeholder': '#A2A2A2',
        'surface-card': '#C1D0E4',
        'surface-light': '#FFFDFD',
        terracotta: {
          DEFAULT: "#C85227",
          dark: "#A63E1B",
          light: "#E87A53",
        },
        cream: {
          DEFAULT: "#FAF8F5",
          dark: "#F0ECE1",
        },
        espresso: {
          DEFAULT: "#2C231E",
          light: "#4A3E37",
          dark: "#081323",
        },
        sand: {
          DEFAULT: "#D49B5B",
          light: "#E5B982",
        }
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(90deg, #2AF598 0%, #009EFD 100%)',
        'aether-dark': 'linear-gradient(135deg, #2D384C 0%, #1F2737 50%, #111827 100%)',
      },
      boxShadow: {
        'aether': '0 20px 50px -12px rgba(0, 0, 0, 0.06)',
        'aether-card': '0 4px 20px -2px rgba(17, 24, 39, 0.03)',
        'pill': '0 2px 10px rgba(17, 24, 39, 0.1)',
      }
    },
  },
  plugins: [],
}
