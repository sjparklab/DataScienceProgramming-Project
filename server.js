const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

const allowedOrigins = ['http://sjpark-dev.com:5173', 'http://sjpark-dev.com', 'https://sjpark-dev.com', 'https://sjpark-dev.com:5173'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());

const geojsonTownPath = path.join(__dirname, 'all_data_with_geojson_data.geojson');
const geojsonCityPath = path.join(__dirname, 'all_data_with_geojson_data.geojson');

const getComputedGeoJson = (geojsonData, weights, statuses) => {
  const columns = [
    '2023년_계_총세대수',
    'count_transport',
    'sum_all_shop',
    'montly-avg_mean'
  ];

  const minMaxValues = columns.reduce((acc, column) => {
    const values = geojsonData.features.map(f => parseFloat(f.properties[column]) || 0);
    acc[column] = { min: Math.min(...values), max: Math.max(...values) };
    return acc;
  }, {});

  const normalize = (value, column) => {
    const { min, max } = minMaxValues[column];
    return (value - min) / (max - min);
  };

  const computedValues = geojsonData.features.map(feature => {
    const values = columns.map(column => parseFloat(feature.properties[column]) || 0);
    const normalizedValues = values.map((value, index) => normalize(value, columns[index]));

    const averagePriceIndex = (values[3] / 3);
    const reverseAveragePriceIndex = 1 - normalize(averagePriceIndex, columns[3]);

    const computedValue = 
      (statuses[0] ? normalizedValues[0] * weights[0] : 0) +
      (statuses[1] ? normalizedValues[1] * weights[1] : 0) +
      (statuses[2] ? normalizedValues[2] * weights[2] : 0) +
      (statuses[3] ? reverseAveragePriceIndex * weights[3] : 0);

    feature.properties.computedValue = computedValue;
    feature.properties.priceSumNormalized = normalizedValues[3];
    return feature;
  });

  geojsonData.features = computedValues;
  return geojsonData;
};

app.get('/geojson/town', (req, res) => {
  fs.readFile(geojsonTownPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('GeoJSON 파일 읽기 오류');
      return;
    }

    let geojsonData = JSON.parse(data);
    const weights = [1, 1, 1, 1];
    const statuses = [true, true, true, true];

    geojsonData = getComputedGeoJson(geojsonData, weights, statuses);
    res.json(geojsonData);
  });
});

app.get('/geojson/city', (req, res) => {
  fs.readFile(geojsonCityPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('GeoJSON 파일 읽기 오류');
      return;
    }

    let geojsonData = JSON.parse(data);
    const weights = [1, 1, 1, 1];
    const statuses = [true, true, true, true];

    geojsonData = getComputedGeoJson(geojsonData, weights, statuses);
    res.json(geojsonData);
  });
});

app.post('/update-geojson', (req, res) => {
  const { weights, statuses } = req.body;
  const geojsonPath = req.body.useTownData ? geojsonTownPath : geojsonCityPath;

  fs.readFile(geojsonPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('GeoJSON 파일 읽기 오류');
      return;
    }

    let geojsonData = JSON.parse(data);
    geojsonData = getComputedGeoJson(geojsonData, weights, statuses);
    res.json(geojsonData);
  });
});

const server = app.listen(process.env.PORT || 3001, () => {
  console.log(`서버가 ${server.address().port} 포트에서 실행 중입니다`);
});

server.timeout = 600000; // 10 minutes
