/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ms: {
          blue:    '#0078D4',   // Microsoft Blue : CTA principal
          blueDark:'#005A9E',   // hover
          dark:    '#243A5E',   // header / sidebar
          light:   '#50E6FF',   // accent
          purple:  '#8661C5',   // Copilot
          teal:    '#00B7C3',   // Teams
        },
      },
    },
  },
  plugins: [],
};
