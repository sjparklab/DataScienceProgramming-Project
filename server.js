const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://sjpark-dev.com:5173',
  'http://sjpark-dev.com',
  'https://sjpark-dev.com',
  'https://sjpark-dev.com:5173'
];

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
const geojsonCityPath = path.join(__dirname, 'updated_merged_data_final.geojson');

const getComputedGeoJson = (geojsonData, weights, statuses) => {
  const columns = [
    '2023년_계_총세대수',
    'count_transport',
    'sum_all_shop',
    'montly-avg_mean'
  ];

  // Check if features array exists and is an array
  if (!Array.isArray(geojsonData.features)) {
    console.error('Invalid GeoJSON data: features is not an array');
    throw new Error('Invalid GeoJSON data: features is not an array');
  }

  const minMaxValues = columns.reduce((acc, column) => {
    const values = geojsonData.features.map(f => {
      if (!f.properties || f.properties[column] === undefined) {
        console.error(`Invalid feature: properties or ${column} is undefined`, f);
        throw new Error(`Invalid feature: properties or ${column} is undefined`);
      }
      return parseFloat(f.properties[column]) || 0;
    });
    acc[column] = { min: Math.min(...values), max: Math.max(...values) };
    return acc;
  }, {});

  const normalize = (value, column) => {
    const { min, max } = minMaxValues[column];
    return (value - min) / (max - min);
  };

  geojsonData.features.forEach(feature => {
    if (!feature.properties) {
      console.error('Invalid feature: properties is undefined', feature);
      throw new Error('Invalid feature: properties is undefined');
    }

    const values = columns.map(column => parseFloat(feature.properties[column]) || 0);
    const normalizedValues = values.map((value, index) => {
      const minMax = minMaxValues[columns[index]];
      return minMax ? normalize(value, columns[index]) : 0;
    });

    const averagePriceIndex = (values[3] / 3) || 0;
    const reverseAveragePriceIndex = 1 - (normalize(averagePriceIndex, columns[3]) || 0);

    const computedValue = 
      (statuses[0] ? normalizedValues[0] * weights[0] : 0) +
      (statuses[1] ? normalizedValues[1] * weights[1] : 0) +
      (statuses[2] ? normalizedValues[2] * weights[2] : 0) +
      (statuses[3] ? reverseAveragePriceIndex * weights[3] : 0);

    feature.properties.computedValue = computedValue;
    feature.properties.priceSumNormalized = normalizedValues[3];
  });

  return geojsonData;
};

const readGeoJsonFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('GeoJSON 파일 읽기 오류', err);
        reject('GeoJSON 파일 읽기 오류');
      } else {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (parseErr) {
          console.error('GeoJSON 파싱 오류', parseErr);
          reject('GeoJSON 파싱 오류');
        }
      }
    });
  });
};

app.get('/geojson/town', async (req, res) => {
  try {
    let geojsonData = await readGeoJsonFile(geojsonTownPath);
    console.log('GeoJSON Town Data:', geojsonData); // Log the data structure
    const weights = [1, 1, 1, 1];
    const statuses = [true, true, true, true];

    geojsonData = getComputedGeoJson(geojsonData, weights, statuses);
    res.json(geojsonData);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

app.get('/geojson/city', async (req, res) => {
  try {
    let geojsonData = await readGeoJsonFile(geojsonCityPath);
    console.log('GeoJSON City Data:', geojsonData); // Log the data structure
    const weights = [1, 1, 1, 1];
    const statuses = [true, true, true, true];

    geojsonData = getComputedGeoJson(geojsonData, weights, statuses);
    res.json(geojsonData);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

app.post('/update-geojson', async (req, res) => {
  const { weights, statuses, useTownData } = req.body;
  const geojsonPath = useTownData ? geojsonTownPath : geojsonCityPath;

  try {
    let geojsonData = await readGeoJsonFile(geojsonPath);
    console.log('GeoJSON Data for Update:', geojsonData); // Log the data structure
    geojsonData = getComputedGeoJson(geojsonData, weights, statuses);
    res.json(geojsonData);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

const server = app.listen(process.env.PORT || 3001, () => {
  console.log(`서버가 ${server.address().port} 포트에서 실행 중입니다`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${error.port} is already in use`);
  } else {
    console.error(error);
  }
});

server.timeout = 600000; // 10 minutes
