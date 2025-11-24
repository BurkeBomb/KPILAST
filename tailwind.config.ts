import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { graphite:"#111114", purpleMetal:"#6b4fd3", brandA:"#0e0e12", brandB:"#111827" },
      boxShadow: { soft:"0 10px 25px rgba(0,0,0,0.25)" },
      borderRadius: { '2xl': '1.25rem' }
    }
  },
  plugins: []
};
export default config;
