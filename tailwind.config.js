module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        yellow: {
          DEFAULT: "#EAA700",
        },
        dark: {
          200: "#45556c",
          300: "#00000052",
          400: "#202b38",
          500: "#273446db ",
        },
      },
      fontFamily: {
        sans: ["Dosis", "sans-serif"],
      },
    },
  },
  plugins: [],
};
