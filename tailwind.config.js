/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        yellowGreen: "#9ACD32",
        lightBlue: "#9AC6C5",
        platinum: "#DBDBDB",
      },
    },
  },
  plugins: [],
};
