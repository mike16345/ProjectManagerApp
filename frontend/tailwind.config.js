/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit",
  important: true,
  content: ["./src/*.{js,jsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#252225",
        secondary: "#5a575a",
        primaryBlue: "#4672af",
        buttonGrey: "#8f8f8f",
        disabled: "#818181",
        header: "#69758b",
      },
      backgroundColor: {
        primary: "#252225",
        secondary: "#5a575a",
        primaryBlue: "#4672af",
        buttonGrey: "#8f8f8f",
        disabled: "#818181",
        header: "#69758b",
      },
      boxShadow: {
        tide: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;",
        material:
          "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;",
        default: "black 0px 0px 10px, rgb(255 255 255) 0px 0px 0px 2px",
        darker: "black 0px 0px 15px, rgb(58, 58, 58) 0px 0px 0px 4px",
        black: "0 0 10px black, 0 0 0 2px black",
        dark: "0 0 2px black, 0 0 0 1px black",
        clicked:
          "rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset",
      },
    },
  },
  plugins: [],
};
