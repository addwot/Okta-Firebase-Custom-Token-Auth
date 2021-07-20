/** @format */

const CORS_ORIGIN = "http://localhost:3000";

// Set cors
const cors = require("cors")({ origin: CORS_ORIGIN });

module.exports = { cors };
