/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
        colors: {
            primary: '#2e7d32',
            background: '#2e7d32',
            iconBackground: 'rgba(255, 255, 255, 0.15)',
        }
    },
  },
  plugins: [],
}
