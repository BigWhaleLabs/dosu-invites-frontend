/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
  purge: ['./public/index.html', './src/**/!(tailwind).{ts,tsx}'],
  plugins: [require('tailwind-scrollbar-hide')],
  theme: {
    fontFamily: {
      logo: 'Poppins',
      primary: 'Manrope',
    },
    extend: {
      borderRadius: {
        DEFAULT: '1rem',
      },
      corePlugins: {
        transform: true,
      },
      colors: {
        primary: 'var(--primary)',
        'primary-dimmed': 'var(--primary-dimmed)',
        'primary-disabled': 'var(--primary-disabled)',
        'primary-disabled-text': 'var(--primary-disabled-text)',
        'primary-text-dimmed': 'var(--primary-text-dimmed)',
        accent: 'var(--accent)',
        'accent-semi-transparent': 'var(--accent-semi-transparent)',
        background: 'var(--background)',
        border: 'var(--border)',
        error: 'var(--error)',
        success: 'var(--success)',
      },
      fontWeight: {
        medium: 'var(--font-medium)',
        bold: 'var(--font-bold)',
      },
      fontSize: {
        '2xl': 'var(--text-2xl)',
        '6xl': 'var(--text-6xl)',
      },
    },
  },
}
