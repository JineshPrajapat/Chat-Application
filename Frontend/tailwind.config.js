/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {},
      screens: {
        'sm': '320px',
        'md': '768px',
        'lg': '976px',
        'xl': '1440px',
      },
      fontFamily: {
        sans: ['Graphik', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
    },
    plugins: [
      require('tailwindcss'),
      require('autoprefixer'),
    ],
    style: {
      postcss: {
        plugins: [require('tailwindcss'), require('autoprefixer')],
      },
    },
  }
  
   