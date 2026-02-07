/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cairo', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0fdfa', // Teal-50
          100: '#ccfbf1', // Teal-100
          500: '#14b8a6', // Teal-500 (Calming Primary)
          600: '#0d9488', // Teal-600
          700: '#0f766e', // Teal-700
          900: '#134e4a', // Teal-900
        },
        gray: {
          50: '#f8fafc', // Slate-50 (Cooler, softer than gray)
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155', // Soft dark text
          800: '#1e293b',
          900: '#0f172a',
        },
        sidebar: {
          DEFAULT: '#ffffff'
        }
      }
    }
  },
  plugins: []
}
