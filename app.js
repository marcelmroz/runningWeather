const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const path = require('path');
const {error} = require('console');

// Used to secure API key
require('dotenv').config();

const app = express();

function getBodyClass(tempDescription) {
  switch (tempDescription) {
    case 'clear sky':
      return 'url(\'../static/images/clear_sky.jpg\')';
    case 'few clouds':
      return 'url(\'../static/images/few_clouds.jpg\')';
    case 'scattered clouds':
      return 'url(\'../static/images/scattered_clouds.jpg\')';
    case 'overcast clouds':
      return 'url(\'../static/images/scattered_clouds.jpg\')';
    case 'broken clouds':
      return 'url(\'../static/images/broken_cloud.jpg\')';
    case 'shower rain':
      return 'url(\'../static/images/shower_rain.jpg\')';
    case 'light rain':
      return 'url(\'../static/images/shower_rain.jpg\')';
    case 'moderate rain':
      return 'url(\'../static/images/shower_rain.jpg\')';
    case 'rain':
      return 'url(\'../static/images/rain.jpg\')';
    case 'thunderstorm':
      return 'url(\'../static/images/thunderstorm.jpg\')';
    case 'snow':
      return 'url(\'../static/images/snow.jpg\')';
    case 'mist':
      return 'url(\'../static/images/mist.jpg\')';
    default:
      return 'white';
  }
}

app.use(bodyParser.urlencoded({extended: true}));
app.use('/static', express.static('static'));
app.set('views', path.join(__dirname, 'views'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/html/index.html'));
});

app.get('/forecast', function(req, res) {
  res.sendFile(path.join(__dirname, './html/forecast.html'));
});

app.post('/login', function(req, res) {
  console.log('login clicked');
});

app.post('/submit', function(req, res) {
  // Capitalize even if the city name contain more than one word
  const query = req.body.cityName;
  // Split on spaces and retain hyphens with positive lookbehind and lookahead
  const words = query.split(/\s+|(?<=-)|(?=-)/); 
  let capitalizedQuery = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const apiKey = process.env.API_KEY;
  const units = 'metric';
  const lat = req.body.latitude;
  const lon = req.body.longitude;
  let url = '';

  // Check if cityName is provided
  if (!query || query.trim() === '') {
    if (!lat||!lon) {
      return res.status(400).send('Please provide a valid city name or allow location access.');
    }
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
    capitalizedQuery = 'your location';
  } else {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&APPID=${apiKey}&units=${units}`;
  }

  // Check if the response code is not 200
  https.get(url, function(response) {
    if (response.statusCode !== 200) {
      if (response.statusCode === 404) {
        return res.status(404).send('City not found. Please enter a valid city name.');
      } else if (response.statusCode === 401) {
        return res.status(401).send('Unauthorized. Please check your API key.');
      } else {
        return res.status(500).send('An error occurred while fetching weather data from the API.');
      }
    }

    let data = '';
    // Register an event listener for the "data" event to accumulate the received data
    response.on('data', function(chunk) {
      data += chunk;
      // console.log(data);
    });

    // Register an event listener for the "end" event, which is triggered when all data is received
    response.on('end', function() {
      try {
        const weatherData = JSON.parse(data);

        const tempDescription = weatherData.weather[0].description;
        const temperature = Math.floor(weatherData.main.temp);
        const icon = weatherData.weather[0].icon;
        const iconHttp = `http://openweathermap.org/img/wn/${icon}@2x.png`;
        const feelsLike = Math.floor(weatherData.main.feels_like);
        const humidity = weatherData.main.humidity;
        const bgPicture = getBodyClass(tempDescription);
        res.render('result.ejs', {
          iconHttp_: iconHttp,
          tempDescription_: tempDescription,
          temperature_: temperature,
          query_: capitalizedQuery,
          feelsLike_: feelsLike,
          humidity_: humidity,
          bgPicture: bgPicture,
        });
      } catch (error) {
        // Error while parsing the data or accessing properties
        res.status(500).send('An error occurred while processing the weather data.');
      }
    });
  }).on('error', function(error) {
    // Error while making the API request
    res.status(500).send('An error occurred while fetching weather data from the API.');
  });
});

app.post('/forecast', function(req, res) {
  // Capitalize even if the city name contain more than one word
  const query = req.body.cityName;
  const words = query.split(/\s+|(?<=-)|(?=-)/); // Split on spaces and retain hyphens with positive lookbehind and lookahead
  let capitalizedQuery = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const apiKey = process.env.API_KEY;
  const units = 'metric';
  const lat = req.body.latitude;
  const lon = req.body.longitude;
  let url = '';
  const timeOfRun = req.body.timeOfRun;
  const selectedDate = req.body.selectedDate;

  // Check if cityName is provided
  if (!query || query.trim() === '') {
    if (!lat||!lon) {
      return res.status(400).send('Please provide a valid city name or allow location access.');
    }
    url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
    capitalizedQuery = 'your location';
  } else {
    url = `https://api.openweathermap.org/data/2.5/forecast?q=${query}&APPID=${apiKey}&units=${units}`;
  }

  if (!timeOfRun || !selectedDate) {
    return res.status(400).send('Please provide both time and date.');
  }


  // Check if the response code is not 200
  https.get(url, function(response) {
    if (response.statusCode !== 200) {
      if (response.statusCode === 404) {
        return res.status(404).send('City not found. Please enter a valid city name.');
      } else if (response.statusCode === 401) {
        return res.status(401).send('Unauthorized. Please check your API key.');
      } else {
        return res.status(500).send('An error occurred while fetching weather data from the API.');
      }
    }

    let data = '';
    // Register an event listener for the "data" event to accumulate the received data
    response.on('data', function(chunk) {
      data += chunk;
      // console.log(data);
    });

    // Register an event listener for the "end" event, which is triggered when all data is received
    response.on('end', function() {
      try {
        const weatherData = JSON.parse(data);

        // Parse the selected date
        const parsedDate = new Date(selectedDate);
        const day = parsedDate.getDate();
        const month = parsedDate.getMonth() + 1;
        const year = parsedDate.getFullYear();
        const [hours, minutes] = timeOfRun.split(':');
        const combinedDateTime = new Date(year, month - 1, day, hours, minutes);
        const unixTimestamp = combinedDateTime.getTime() / 1000;

        const forecasts = new Map();

        for (let i=0; i<weatherData.list.length; i++) {
          const dateUnix = weatherData.list[i].dt;
          //const date = new Date(dateUnix*1000).toLocaleDateString('en-US');
          forecasts.set(i, dateUnix);
        }
        // console.log(`datetime provided by user to unix: ${unixTimestamp}`);

        let closestKey;
        let closestDiff = Infinity;

        forecasts.forEach((value, key) => {
          const diff = Math.abs(value - unixTimestamp);
          if (diff < closestDiff) {
            closestDiff = diff;
            closestKey = key;
          }
        });
        // console.log(`Closest key to unixTimestamp: ${closestKey}`);

        const currentForecast = weatherData.list[closestKey];


        function formatUnixTimestamp(unixTimestamp) {
          const date = new Date(unixTimestamp * 1000);
          const now = new Date();

          const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
          const isTomorrow = date.getDate() === now.getDate() + 1 && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();

          if (isToday) {
            //const day = date.getDate();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            return `Today at ${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
          } else if (isTomorrow) {
            //const day = date.getDate();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            return `Tomorrow at ${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
          } else {
            const day = date.getDate();
            const month = date.toLocaleString('en-GB', {month: 'long'});
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const suffix = day % 10 === 1 && day !== 11 ? 'st' :
                                       day % 10 === 2 && day !== 12 ? 'nd' :
                                       day % 10 === 3 && day !== 13 ? 'rd' : 'th';

            return `On ${day}${suffix} of ${month} at ${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
          }
        }

        const forecastDate = formatUnixTimestamp(unixTimestamp);

        const temperature = Math.floor(currentForecast.main.temp);
        const description = currentForecast.weather[0].description;
        const icon = currentForecast.weather[0].icon;
        const iconHttp = `http://openweathermap.org/img/wn/${icon}@2x.png`;
        const feelsLike = Math.floor(currentForecast.main.feels_like);
        const humidity = currentForecast.main.humidity;
        const bgPicture = getBodyClass(description);

        res.render('forecast.ejs', {
          temperature: temperature,
          capitalizedQuery: capitalizedQuery,
          description: description,
          iconHttp: iconHttp,
          forecastDate: forecastDate,
          feelsLike: feelsLike,
          humidity: humidity,
          bgPicture: bgPicture,
        });
      } catch (error) {
        // Error while parsing the data or accessing properties
        res.status(500).send('An error occurred while processing the weather data.');
      }
    });
  }).on('error', function(error) {
    // Error while making the API request
    res.status(500).send('An error occurred while fetching weather data from the API.');
  });
});

app.listen(3000, function() {
  console.log('Working on port: 3000');
});
