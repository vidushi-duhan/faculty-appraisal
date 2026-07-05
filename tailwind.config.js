/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,.05), 0 4px 16px -6px rgba(16,24,40,.08)',
        lift: '0 12px 32px -10px rgba(79,70,229,.45)',
        pop: '0 12px 40px -8px rgba(16,24,40,.18)',
      },
    },
  },
  plugins: [],
}
