/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        sw: {
          bg: '#0A0F1A',
          card: '#0F1422',
          border: 'rgba(255,255,255,.08)',
          ink: '#EAF2FF',
          mute: '#A7B6CE',
          blue: '#6EA8FF',
          violet: '#9B8CFF',
          peach: '#FFB37A',
          teal: '#56F2C3',
          warn: '#FFC069',
          danger: '#FF6B6B',
        },
      },
      backgroundImage: {
        'sw-hero': 'linear-gradient(90deg,#6EA8FF 0%,#9B8CFF 55%,#FFB37A 100%)',
        'sw-alt': 'linear-gradient(90deg,#6EA8FF 0%,#9B8CFF 100%)',
      },
      boxShadow: {
        'sw-glow': '0 0 24px rgba(155,140,255,.35)',
      },
    },
  },
  plugins: [],
}
