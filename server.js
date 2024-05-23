const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

const allowedOrigins = ['http://sjpark-dev.com:5173', 'https://sjpark-dev.com:5173'];

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

const geojsonPath = path.join(__dirname, 'all_data_with_geojson_data.geojson');

const getComputedGeoJson = (geojsonData, weights, statuses) => {
  // ... 기존 코드
};

app.get('/geojson', (req, res) => {
  fs.readFile(geojsonPath, 'utf8', (err, data) => {
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT} 포트에서 실행 중입니다`);
});
