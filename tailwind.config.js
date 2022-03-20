module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern: /grid-cols-(1|2|3|4)/,
      variants: ["md", "lg", "xl"],
    },
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
