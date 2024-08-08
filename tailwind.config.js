/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./index.html"
  ],
  theme: {
    extend: {
      fontSize: {
        xxs: ["0.6rem", "0.675rem"],
      },
      screens: {
        xxs: "280px",
        xs: "375px",
      },
      backgroundColor: {
        primaryBg: "#f5f3f3",
      },
      colors: {
        primary: "#ea5765",
        secondary: "#65ea57",
        primaryLight: "#f7aaad",
        primaryHover: "#d42a42",
        headingColor: "#2e2e2e",
        textColor: "#515151",
        cartNumBg: "#e80013",
        cardOverlay: "rgba(256,256,256,0.4)",
        lighttextGray: "#9ca0ab",
        card: "rgba(256,256,256,0.8)",
        cartBg: "#282a2c",
        cartItem: "#2e3033",
        cartTotal: "#343739",
      },
      fontFamily: {
        rubik: ["Rubik", "sans-serif"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
  ],
};
