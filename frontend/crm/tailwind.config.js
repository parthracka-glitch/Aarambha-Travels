/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Arcadia'", "'arcadia'", "'Outfit'", "'Plus Jakarta Sans'", 'system-ui', '-apple-system', 'sans-serif'],
        arcadia: ["'Arcadia'", "'arcadia'", 'system-ui', '-apple-system', 'sans-serif'],
        arcadiaDisplay: ["'Arcadia Display'", "'arcadiaDisplay'", "'arcadia-display'", 'system-ui', '-apple-system', 'sans-serif'],
        'arcadia-display': ["'Arcadia Display'", "'arcadia-display'", "'arcadiaDisplay'", 'system-ui', '-apple-system', 'sans-serif'],
        syne: ["'Arcadia Display'", "'arcadiaDisplay'", "'Syne'", 'sans-serif'],
        outfit: ["'Arcadia'", "'Outfit'", 'sans-serif'],
        jakarta: ["'Arcadia'", "'Plus Jakarta Sans'", 'sans-serif'],
      },
      fontWeight: {
        '420': '420',
        '480': '480',
      },
      colors: {
        mercury: {
          primary: '#AFB2CE',
          'primary-interactive': '#5266EB',
          secondary: '#9CB4E8',
          surface: '#000000',
          'on-surface': '#FFFFFF',
          'accent-soft': '#AFB2CE',
          'accent-light': '#EDEDF3',
          'surface-dark': '#171721',
          'surface-darker': '#272735',
          'interactive-ghost': '#171721',
          'interactive-tertiary': '#272735',
          'text-primary': '#000000',
          'text-inverse': '#EDEDF3',
          'text-tertiary': '#C3C3CC',
          'border-subtle': '#EBEBEB',
          'border-muted': '#F5F5F5',
        },
        aether: {
          bg: '#EDEDF3',
          canvas: '#FAFAFC',
          card: '#FFFFFF',
          sidebar: '#171721',
          black: '#000000',
          dark: '#171721',
          muted: '#C3C3CC',
          border: '#EBEBEB',
        },
        kpi: {
          peach: '#F5F5F9',
          blue: 'rgba(156, 180, 232, 0.2)',
          purple: 'rgba(82, 102, 235, 0.1)',
          green: 'rgba(175, 178, 206, 0.2)',
        },
        insight: {
          purple: 'rgba(82, 102, 235, 0.08)',
          orange: 'rgba(156, 180, 232, 0.15)',
          green: 'rgba(175, 178, 206, 0.15)',
        },
        ink: {
          DEFAULT: '#000000',
          slate: '#171721',
        },
        gold: '#9CB4E8',
        heading: '#000000',
        'text-secondary': '#6B7280',
        'text-placeholder': '#C3C3CC',
        'surface-card': '#FFFFFF',
        'surface-light': '#EDEDF3',
        terracotta: {
          DEFAULT: "#5266EB",
          dark: "#3E51D4",
          light: "#9CB4E8",
        },
        cream: {
          DEFAULT: "#FAFAFC",
          dark: "#EDEDF3",
        },
        espresso: {
          DEFAULT: "#171721",
          light: "#272735",
          dark: "#000000",
        },
        sand: {
          DEFAULT: "#AFB2CE",
          light: "#EDEDF3",
        }
      },
      borderRadius: {
        'md': '33554400px',
        'pill': '40px',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(90deg, #5266EB 0%, #9CB4E8 100%)',
        'aether-dark': 'linear-gradient(135deg, #272735 0%, #171721 50%, #000000 100%)',
      },
      boxShadow: {
        'aether': '0 20px 50px -12px rgba(0, 0, 0, 0.06)',
        'aether-card': 'rgba(28, 28, 35, 0.02) 0px 10px 16px 0px, rgba(28, 28, 35, 0.04) 0px 6px 10px 0px, rgba(28, 28, 35, 0.09) 0px 0px 3px 0px',
        'pill': '0 2px 10px rgba(82, 102, 235, 0.1)',
        'navigation': 'rgba(86, 86, 118, 0.1) 0px 0px 6px 0px',
        'hover': 'rgba(28, 28, 35, 0.02) 0px 10px 16px 0px, rgba(28, 28, 35, 0.04) 0px 6px 10px 0px, rgba(28, 28, 35, 0.09) 0px 0px 3px 0px',
        'elevated': 'rgba(0, 0, 0, 0.05) 0px 0px 3px 0px, rgba(0, 0, 0, 0.05) 0px 8px 12px 0px, rgba(0, 0, 0, 0.05) 0px 12px 20px 0px',
      }
    },
  },
  plugins: [],
}

