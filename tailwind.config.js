/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.html",
    "./src/**/*.{js,ts,jsx,tsx,css}"
  ],
  safelist: [
    // Layout
    'flex', 'grid', 'block', 'hidden',
    'flex-col', 'flex-row', 'items-center', 'justify-center', 'gap-4',

    // Responsive layouts
    'lg:flex-row', 'lg:flex', 'lg:grid',
    'md:flex-row', 'md:grid-cols-2', 'md:grid', 'md:flex',

    // Text and alignment
    'text-center', 'text-left', 'text-right',
    'md:text-left', 'lg:text-left',

    // Font sizing
    'text-[clamp(1.5rem,3vw,2rem)]',
    'text-[clamp(1rem,3vw,1.25rem)]',

    // Widths and containers
    'w-full', 'max-w-[1440px]', 'mx-auto'
      'md:flex-row',
  'md:flex',
  'md:grid',
  'md:grid-cols-2',
  'lg:flex-row',
  'lg:flex',
  'lg:grid',
  'text-center',
  'md:text-left',
  'grid',
  'flex',
  'block',
  'hidden'
  ],
  theme: {
    extend: {
      fontFamily: {
        raleway: ['Raleway', 'sans-serif'],
      },
      colors: {
        'gray-custom': '#6D6D6D',
        'line-custom': '#CDC2C2',
        'card-bg': '#F5F5F5',
        'btn-blue': '#3D63C2',
      }
    },
  },
  plugins: [],
}