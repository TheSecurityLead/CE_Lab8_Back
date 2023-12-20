require('dotenv').config();
const express = require('express');
const cors = require('cors');
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
app.get('/weather', (req, res) => {
    try {
      const { lat, lon, searchQuery } = req.query;
      const cityData = weatherData.find(city => city.lat === lat && city.lon === lon && city.city_name.toLowerCase() === searchQuery.toLowerCase());
  
      if (!cityData) {
        res.status(404).send({ error: 'City not found' });
        return;
      }
  
      const forecasts = cityData.data.map(d => new Forecast(d.valid_date, `Low of ${d.low_temp}, high of ${d.high_temp} with ${d.weather.description}`));
      res.json(forecasts);
    } catch (error) {
      handleError(res, error);
    }
  });
  

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
