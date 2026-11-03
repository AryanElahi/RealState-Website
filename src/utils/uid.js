const crypto = require("crypto");

// Numeric string id, kept numeric for compatibility with existing records and
// the admin panel search (which may send the Uid as a JavaScript number).
// Date.now() has 13 digits; a 3 digit random suffix keeps the result at 16
// digits, below Number.MAX_SAFE_INTEGER, while making it very unlikely that two
// records created in the same millisecond collide on the unique Uid column.
const generateUid = () => `${Date.now()}${crypto.randomInt(100, 1000)}`;

module.exports = { generateUid };
