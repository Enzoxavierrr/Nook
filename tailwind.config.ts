import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Design system — dark mode first
        surface: {
          DEFAULT: '#0f0f0f',
          1: '#161616',
          2: '#1e1e1e',
          3: '#2a2a2a',
        },
        accent: {
          DEFAULT: '#7c6ffd',
          hover: '#6b5ef0',
        },
        muted: '#6b7280',
        border: '#2e2e2e',
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
        xl: '16px',
      },
    },
  },
  plugins: [],
} satisfies Config
