require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const weatherData = require('./data/weather.json');
const app = express();
const port = 3001;
app.use(cors());

app.get('/', (req, res) => {
    res.send('Server is up and running!');
  });

// Forecast class definition
class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

function handleError(res, error) {
    console.error(error); // Log the error for server-side debugging
    res.status(500).send({ error: 'Something went wrong.' });
  }


  
// Route for /weather
app.get('/weather', async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.WEATHER_API_KEY;
  const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=3`;

  try {
    const response = await axios.get(url);
    const forecasts = response.data.forecast.forecastday.map(day => {
      return new Forecast(`Low of ${day.day.mintemp_c}, high of ${day.day.maxtemp_c} with ${day.day.condition.text}`, day.date);
    });
    res.send(forecasts);
  } catch (error) {
    handleError(error, res);
  }
});
  

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
