/** @format */

const express = require("express");
const router = express.Router();

// Determine middlewares
const { oktaAuth } = require("../middleware/oktaAuth");
const { cors } = require("../middleware/cors");

const firebaseAdmin = require("firebase-admin");

// Initialize Firebase app
const firebaseApp = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(
    require("../config/serviceAccountKey.json")
  ),
});

// @route    GET /api/firebaseCustomToken
// @desc     Returns a token Firebases generated
// @access   Private
router.get("/", [cors, oktaAuth], async (req, res) => {
  // Get a Firebase custom auth token for the authenticated Okta user.
  // This endpoint uses the `oktaAuth` middleware defined above to
  // ensure requests have a valid Okta access token.
  const oktaUid = req.jwt.claims.uid;
  try {
    const firebaseToken = await firebaseApp.auth().createCustomToken(oktaUid);
    res.send(firebaseToken);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error minting token.");
  }
});

module.exports = router;
