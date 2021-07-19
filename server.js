const express = require("express");
const app = express();
// const bodyParser = require("body-parser");
// require('dotenv').load()
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

let routes = require("./api/routes"); //importing route
routes(app);

app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + " not found" });
});

app.listen(port);

console.log("RESTful API server started on: " + port);
