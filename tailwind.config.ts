import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        cover: "url('images/cover.jpg')",
      },
      colors: {
        baseGreen: "#D0E1D4",
        brightOrange: "#E4BE9E",
        slightGray: "#707070",
      },
    },
  },
  plugins: [],
} satisfies Config;
