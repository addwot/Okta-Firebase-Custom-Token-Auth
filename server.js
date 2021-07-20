/** @format */

var express = require("express");
var http = require("http");
var app = express();
var server = http.createServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Determine static files
app.use(express.static(__dirname + "/public"));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// The API route client uses to create custom token
app.use("/api/firebaseCustomToken", require("./api/firebaseCustomToken"));

// Default 404 route
app.use("*", require("./api/404"));
