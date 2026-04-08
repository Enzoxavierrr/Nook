import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ─── Typography ────────────────────────────────────────
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        // Design system type scale — "Editorial Authority"
        'display-lg':  ['3.5rem',    { lineHeight: '1.1',  letterSpacing: '-0.04em', fontWeight: '700' }],
        'headline-sm': ['1.5rem',    { lineHeight: '1.25', letterSpacing: '-0.02em', fontWeight: '600' }],
        'title-md':    ['1.125rem',  { lineHeight: '1.4',  letterSpacing: '0',       fontWeight: '500' }],
        'body-md':     ['0.875rem',  { lineHeight: '1.5',  letterSpacing: '+0.01em', fontWeight: '400' }],
        'label-sm':    ['0.6875rem', { lineHeight: '1.4',  letterSpacing: '+0.06em', fontWeight: '700' }],
      },

      // ─── Colors: "The Tonal Spectrum" ──────────────────────
      colors: {
        // Background
        background: '#131313',

        // Accent / brand
        primary: {
          DEFAULT: '#ffffff',
          fixed:     '#494bd6',    // Electric Pulse — CTAs, focus
          fixed_dim:  '#2f2ebe',   // CTA gradient endpoint
        },
        on_primary: '#07006c',     // Text on primary button

        // Surface tiers (tonal layering, no hard borders)
        surface: {
          lowest:  '#0e0e0e',  // Recessed areas (deepest)
          low:     '#1c1b1b',  // Standard workspace
          DEFAULT: '#1c1b1b',
          high:    '#2a2a2a',  // Elevated / floating cards
          variant: '#1c1b1b',  // For glassmorphism overlays
        },

        // Text & icons
        on_surface:     '#e5e2e1',
        on_surface_var: '#c8c5c5',
        muted:          '#7a7878',

        // Ghost border fallback (use at 15% opacity via CSS)
        outline_variant: '#474747',

        // Semantic
        error:           '#ffb4ab',
        error_container: '#93000a',
        success:         '#6ee7a0',
      },

      // ─── Border Radius ─────────────────────────────────────
      borderRadius: {
        DEFAULT: '0.5rem',   // standard components
        lg:      '0.75rem',
        xl:      '1.5rem',   // Command Hub
        full:    '9999px',   // status chips
      },

      // ─── Spacing whitespace grid ───────────────────────────
      spacing: {
        section_sm: '32px',
        section_md: '48px',
        section_lg: '64px',
      },

      // ─── Box shadows: "Ambient" only ──────────────────────
      boxShadow: {
        // Soft ambient glow for floating modals (no hard drop shadows)
        modal:   '0 0 40px 0 rgba(229, 226, 225, 0.06)',
        // Electric Pulse glow for focus states
        glow:    '0 0 0 4px rgba(73, 75, 214, 0.20)',
      },

      // ─── Backdrop blur ─────────────────────────────────────
      backdropBlur: {
        glass: '20px',
      },

      // ─── Keyframe animations ───────────────────────────────
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateX(-8px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in':  'fade-in 0.2s ease-out',
        'slide-in': 'slide-in 0.2s ease-out',
        'scale-in': 'scale-in 0.15s ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config
