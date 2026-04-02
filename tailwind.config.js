/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:                '#1a1a1a',
        'bg-elevated':     '#252220',
        'bg-elevated-2':   '#2e2b28',
        'text-primary':    '#f0ebe3',
        'text-secondary':  '#a09080',
        'text-muted':      '#6b5f54',
        accent:            '#d4956a',
        'accent-dim':      '#7a4a28',
      },
      fontFamily: {
        serif: ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
