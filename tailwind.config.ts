import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#2E7D32",
          amber: "#E65100",
          slate: "#1A1C1E",
        },
      },
      borderRadius: {
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
};
export default config;

