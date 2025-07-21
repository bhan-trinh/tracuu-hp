// Pad a string with leading zeroes
module.exports = {
  padDate: (number) => {
    return number.toString().padStart(2, "0");
  },
};
