/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app.tsx',
    './components/**/*.{ts,tsx}',
    './utils/**/*.{ts,tsx}',
    './styles/**/*.{css}'
  ],
  theme: {
    extend: {
      colors: {
        'sonix-black': 'var(--color-sonix-black)',
        'sonix-card': 'var(--color-sonix-card)',
        'sonix-primary-text': 'var(--color-sonix-primary-text)',
        'sonix-secondary-text': 'var(--color-sonix-secondary-text)',
        'sonix-electric-purple': 'var(--color-sonix-electric-purple)',
        'sonix-neon-green': 'var(--color-sonix-neon-green)',
        'sonix-error-red': 'var(--color-sonix-error-red)',
        'sonix-tag': 'var(--color-sonix-tag)',
        'sonix-hover': 'var(--color-sonix-hover)',
        'sonix-table-hover': 'var(--color-sonix-table-hover)',
        'sonix-border': 'var(--color-sonix-border)'
      }
    }
  },
  plugins: []
};
