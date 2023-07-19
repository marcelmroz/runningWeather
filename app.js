const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const path = require("path");
require('dotenv').config();

// console.log(process.env);

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set('views', path.join(__dirname, 'views'));

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/index.html"));
});

app.post("/submit", function(req, res) {
    const query = req.body.cityName;
    const apiKey = process.env.API_KEY;
    const units = "metric";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&APPID=${apiKey}&units=${units}`;

    https.get(url, function(response) {
        // console.log(response.statusCode);
        response.on("data", function(data) {
            const weatherData = JSON.parse(data);
            const tempDescription = weatherData.weather[0].description;
            const temp = weatherData.main.temp;
            const icon = weatherData.weather[0].icon;
            const iconHttp = `http://openweathermap.org/img/wn/${icon}@2x.png`;

            res.render('result.ejs', {
                iconHttp_: iconHttp,
                tempDescription_: tempDescription,
                temp_: temp,
                query_: query
            });
        });
    });
});


app.listen(3000, function(){
    console.log("dziala na porcie 3000");
})