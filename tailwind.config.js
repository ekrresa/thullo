module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/modules/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      boxShadow: { card: ' 0px 4px 12px rgba(0, 0, 0, 0.05)' },
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
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
      },
      gridTemplateColumns: {
        list: 'repeat(auto-fill, minmax(min(14rem, 100%), 1fr))',
        colors: 'repeat(auto-fill, minmax(min(8rem, 100%), 1fr))',
      },
      gridTemplateRows: {
        layout: 'auto 1fr auto',
        stack: 'repeat(auto-fit, minmax(min(14rem, 100%), 1fr))',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
