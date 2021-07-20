/** @format */

const CORS_ORIGIN = "*";

// Set cors
const cors = require("cors")({ origin: CORS_ORIGIN });

module.exports = { cors };
