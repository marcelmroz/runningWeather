const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const path = require("path");
const { error } = require("console");

//Used to secure API key
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set('views', path.join(__dirname, 'views'));

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/index.html"));
});


app.post("/submit", function(req, res) {
    //Capitalize even if the city name contain more than one word
    const query = req.body.cityName;
    const words = query.split(/\s+|(?<=-)|(?=-)/); // Split on spaces and retain hyphens with positive lookbehind and lookahead
    const capitalizedQuery = words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    // Check if cityName is provided
    if (!query || query.trim() === "") {
        return res.status(400).send("Please provide a valid city name.");
    }

    const apiKey = process.env.API_KEY;
    const units = "metric";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&APPID=${apiKey}&units=${units}`;
    
    // Check if the response code is not 200
    https.get(url, function(response) {
        if (response.statusCode !== 200) {
            return res.status(404).send("City not found. Please enter a valid city name.");
        }
    
        let data = "";    
        // Register an event listener for the "data" event to accumulate the received data
        response.on("data", function(chunk) {
            data += chunk;
            // console.log(data);
        });
    
        // Register an event listener for the "end" event, which is triggered when all data is received
        response.on("end", function() {
            try {
                
                const weatherData = JSON.parse(data);
    
                const tempDescription = weatherData.weather[0].description;
                const temperature = Math.floor(weatherData.main.temp);
                const icon = weatherData.weather[0].icon;
                const iconHttp = `http://openweathermap.org/img/wn/${icon}@2x.png`;
                const feelsLike = Math.floor(weatherData.main.feels_like);
                const humidity = weatherData.main.humidity;
    
                res.render('result.ejs', {
                    iconHttp_: iconHttp,
                    tempDescription_: tempDescription,
                    temperature_: temperature,
                    query_: capitalizedQuery,
                    feelsLike_: feelsLike,
                    humidity_: humidity
                });
            } catch (error) {
                // Error while parsing the data or accessing properties
                res.status(500).send("An error occurred while processing the weather data.");
            }
        });
    }).on("error", function(error) {
        // Error while making the API request
        res.status(500).send("An error occurred while fetching weather data from the API.");
    });
    
});


app.listen(3000, function(){
    console.log("dziala na porcie 3000");
})