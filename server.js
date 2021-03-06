const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();
require("dotenv").config();

const apiKey = process.env.API_KEY;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("pages/index", {
    weather: null,
    error: null,
  });
});

app.post("/", function (req, res) {
  let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  request(url, function (err, response, body) {
    if (err) {
      res.render("pages/index", {
        weather: null,
        error: "Error, please try again",
      });
    } else {
      let weather = JSON.parse(body);
      if (weather.main == undefined) {
        res.render("pages/index", {
          weather: null,
          error: "Error, please try again",
        });
      } else {
        let weatherText = `It's ${weather.main.temp} degrees Celsius in ${weather.name}. It feels like ${weather.main.feels_like} degrees. Humidity is ${weather.main.humidity} %.`;
        res.render("pages/index", { weather: weatherText, error: null });
      }
    }
  });
});
app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});
