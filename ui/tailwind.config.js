/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {},
  },
  colors: {
    transparent: 'transparent',
    current: 'currentColor',
    black: colors.black,
    white: colors.white,
    gray: colors.slate,
    green: colors.emerald,
    purple: colors.violet,
    yellow: colors.amber,
    pink: colors.fuchsia,
  },
  
  plugins: [
    require('flowbite/plugin')
]
}