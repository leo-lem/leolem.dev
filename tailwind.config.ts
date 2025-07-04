import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}',
    './public/**/*.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        slidefadein: {
          '0%': { opacity: '0', transform: 'translateY(-1rem)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        slidefadein: 'slidefadein 0.5s ease-out forwards',
      },
    },
  },
  darkMode: 'media',
  plugins: [],
};

export default config;