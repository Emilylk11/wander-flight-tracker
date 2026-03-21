import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FAF8F3',
          2: '#F3EFE6',
          3: '#EAE4D6',
        },
        gold: {
          DEFAULT: '#B8965A',
          2: '#D4AF72',
          3: '#8B6E3A',
        },
        wtext: {
          DEFAULT: '#1C1A16',
          2: '#5C5749',
          3: '#9C9485',
        },
        wborder: {
          DEFAULT: 'rgba(184,150,90,0.15)',
          2: 'rgba(184,150,90,0.3)',
        },
        wshadow: 'rgba(28,26,22,0.08)',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      borderRadius: {
        card: '14px',
      },
      width: {
        sidebar: '260px',
      },
    },
  },
  plugins: [],
};
export default config;
