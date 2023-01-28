const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/modules/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        card: '0px 4px 12px rgba(0, 0, 0, 0.05)',
        profile: 'rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px',
      },
      colors: {
        'corn-blue': '#2F80ED',
        'light-pencil': '#BDBDBD',
        pencil: '#333333',
        ash: '#E0E0E0',
        gray3: '#828282',
        gray4: '#4f4f4f',
        'off-white': '#f2f2f2',
        'off-white2': '#F8F9FD',
        'off-white3': '#DAE4FD',
        'alt-red': { 100: '#EB5757' },
        astronaut: {
          50: '#f4f7fb',
          100: '#e7eef7',
          200: '#cadbed',
          300: '#9bbcde',
          400: '#6699ca',
          500: '#427cb5',
          600: '#316298',
          700: '#274c77',
          800: '#254467',
          900: '#233a57',
        },
        roman: {
          50: '#fdf3f3',
          100: '#fbe8e8',
          200: '#f7d4d5',
          300: '#f1b0b3',
          400: '#e8848b',
          500: '#db5461',
          600: '#c7374c',
          700: '#a7293f',
          800: '#8c2539',
          900: '#782337',
        },
        brand: {
          50: '#eff8ff',
          100: '#dbeefe',
          200: '#bfe2fe',
          300: '#93d1fd',
          400: '#60b7fa',
          500: '#3b98f6',
          600: '#2f80ec',
          700: '#1d64d8',
          800: '#1e51af',
          900: '#1e468a',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
        poppins: ['Poppins', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
      },
      gridTemplateColumns: {
        list: 'repeat(auto-fill, minmax(min(220px, 100%), 1fr))',
        colors: 'repeat(auto-fill, minmax(min(8rem, 100%), 1fr))',
      },
      gridTemplateRows: {
        layout: 'auto 1fr auto',
        stack: 'repeat(auto-fit, minmax(min(14rem, 100%), 1fr))',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};
