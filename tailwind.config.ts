import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          DEFAULT: '#a8b89a',
          light: '#c8d9bc',
          pale: '#eaf0e6',
          deep: '#7a9470',
        },
        clay: {
          DEFAULT: '#c4956a',
          light: '#dbb08a',
          pale: '#f5ebe0',
        },
        sand: {
          DEFAULT: '#e8ddd0',
          light: '#f5f0e8',
          deep: '#c9b8a4',
        },
        stone: {
          DEFAULT: '#6b6560',
          light: '#9b938d',
        },
        ink: '#2c2825',
        cream: '#fdfcfa',
        off: '#f8f5f0',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'blob-morph': 'blobMorph 8s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'reveal': 'reveal 0.6s ease forwards',
      },
      keyframes: {
        blobMorph: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        reveal: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
