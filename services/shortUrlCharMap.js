/*
  Creates an object with the properties from 0 to 61, where each property is a
  character from 0 to 9, A to Z, and a to z.

  Usage:
  shortUrlCharMap[61] // gives 'Z'
  shortUrlCharMap[10] // gives 'a'

  Note that some sources on Internet place uppercase letters before lowercase
  letters which means that uppercase letters are from 10 to 35, and lowercase
  letters are from 36 to 61.

  Both approaches are valid because Base 62 encoding is not standardized.
  */
const shortUrlCharMap = [
  ...Array.from({length: 10}, (_, i) => i + 48), // Numbers
  ...Array.from({length: 26}, (_, i) => i + 65), // Uppercase
  ...Array.from({length: 26}, (_, i) => i + 97)  // Lowercase
].reduce((obj, code) => {
  let key;
  if(code >= 48 && code <=57) { // [0-9]
    key = code - 48; // key from 0 to 9
  } else if(code >= 65 && code <= 90) { // [A-Z]
    key = code - 65 + 36; // keys from 36 to 61
  } else if(code >= 97 && code <= 122) { // [a-z]
    key = code - 97 + 10; // keys from 10 to 35
  } else {
    throw new Error(`Invalid ASCII code: ${code}`);
  }
  // 0 -> 0, ..., 10 -> a, ..., 35 -> z, 36 -> A, ..., 61 -> Z
  obj[key] = String.fromCharCode(code);
  return obj;
}, {});

module.exports = shortUrlCharMap;
