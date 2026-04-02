/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:               '#1a1a1a',
        'bg-elevated':    '#252220',
        'bg-elevated-2':  '#2e2b28',
        'text-primary':   '#f0ebe3',
        'text-secondary': '#a09080',
        'text-muted':     '#6b5f54',
        accent:           '#d4956a',
        'accent-dim':     '#7a4a28',
      },
      fontFamily: {
        serif: ['Georgia', '"Times New Roman"', 'serif'],
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '50%':      { opacity: '1',   transform: 'scale(1)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.3s ease both',
        blink:  'blink 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
