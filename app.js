const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
require('dotenv').config();

console.log(process.env);

const app = express();

app.use(bodyParser.urlencoded({extended: true}));


app.get("/",function(req,res){

    res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req,res) {
    const query = req.body.cityName;
    const apiKey = process.env.API_KEY;
    const units = "metric";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&APPID=${apiKey}&units=${units}`;

    https.get(url, function(respose){
        console.log(respose.statusCode);
        respose.on("data", function(data){
        const weatherData = JSON.parse(data);
        // console.log(weatherData);
        
        const tempDescription = weatherData.weather[0].description;
        const temp = weatherData.main.temp;
        const icon = weatherData.weather[0].icon;
        const iconHttp = `http://openweathermap.org/img/wn/${icon}@2x.png`;
        // console.log(temp);
        res.write(`<p>The weather in ${query} is: ${tempDescription}</p>`);
        res.write(`<h1>Temperature in ${query} is ${temp} degrees Celcius</h1>`);
        res.write(`<img src =${iconHttp}>`);
        res.send();
        // res.sendFile(iconHttp);
        })
    });
});





app.listen(3000, function(){
    console.log("dziala na porcie 3000");
})