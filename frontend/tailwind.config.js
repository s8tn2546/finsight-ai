export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#000000',
        secondary: '#1D283A',
        primary: '#63D3F2',
        accent: '#22C4D3',
        textMain: '#F8FAFC',
        text: '#F8FAFC',
      },
      fontFamily: {
        inter: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'],
      },
    },
  },
  plugins: [],
}
