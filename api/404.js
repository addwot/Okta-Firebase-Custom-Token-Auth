/** @format */

const express = require("express");
const router = express.Router();

// @route    GET /unknown
// @desc     Returns 'Not Found' message if the route doesn't exist
// @access   Public
router.get("/", async (req, res) => {
  try {
    return res.status(404).send("Not Found");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
