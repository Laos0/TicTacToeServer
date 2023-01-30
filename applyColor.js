
// purpose of this module is to apply colors on characters in console
// example of usage: console.log(applyColor.red(), "Hello, World");
// IMPORTANT: Make sure to reset the color everytime you change color
// console.log(applyColor.resetColor);

/*
\x1b[30m: Black
\x1b[31m: Red
\x1b[32m: Green
\x1b[33m: Yellow
\x1b[34m: Blue
\x1b[35m: Magenta
\x1b[36m: Cyan
\x1b[37m: White
\x1b[0m: resetColor
*/

const red = `\x1b[31m`;
const green = `\x1b[32m`;
const yellow = `\x1b[33m`;
const resetColor = `\x1b[0m`;

module.exports = {red, green, yellow, resetColor};