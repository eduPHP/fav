module.exports = {
  mode: 'jit',
  purge: ['./src/pages/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['Open Sans', 'sans-serif'],
    },
    extend: {
      cursor: {
        'not-allowed': 'not-allowed',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
