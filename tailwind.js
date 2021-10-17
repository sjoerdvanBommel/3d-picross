module.exports = {
  mode: 'jit',
  purge: [
    './src/**/*.html',
    './src/**/*.tsx'
  ],
  theme: {
    extend: {
      colors: {
        'picross-blue': {
          light: '#00B6FF',
          dark: '#0083CC'
        }
      }
    }
  },
  variants: {},
  plugins: [],
}