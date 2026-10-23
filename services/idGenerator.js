/*
Supports the generation of 9^12 = 282,429,536,481 unique IDs
(over 282 billion combinations).

If the assumption is that 100 million IDs are generated per day,
it would take between 7 and 8 years (ie. 7.620) to exhaust all possible IDs.
*/

const { customAlphabet } = require('nanoid');
const generateId = customAlphabet('123456789', 12);

function generateNumericId() {
  return +generateId();
}

module.exports = generateNumericId;
