/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          lightest: '#e8f7f9',
          light: '#b8e8f0',
          mid: '#6ec6d8',
          deep: '#3a9ab5',
          darker: '#1d6d87',
          dark: '#0d4a62',
        },
        seafoam: '#a8ddd6',
        coral: '#f06b8a',
        sand: '#f5e6c8',
        seaweed: '#5aab7a',
        bubble: 'rgba(255,255,255,0.6)',
      },
      fontFamily: {
        bubble: ['Baloo 2', 'cursive'],
        body: ['Nunito', 'sans-serif'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        bubble: 'bubble 8s linear infinite',
        swim: 'swim 12s linear infinite',
        sway: 'sway 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        bubble: {
          '0%': { transform: 'translateY(100vh) scale(0)', opacity: '0.7' },
          '100%': { transform: 'translateY(-100px) scale(1)', opacity: '0' },
        },
        swim: {
          '0%': { transform: 'translateX(-120px)' },
          '100%': { transform: 'translateX(calc(100vw + 120px))' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
        },
      },
    },
  },
  plugins: [],
}
