const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

const allowedOrigins = ['http://sjpark-dev.com:5173', 'https://sjpark-dev.com:5173', 'http://sjpark-dev.com', 'https://sjpark-dev.com'];

app.use(cors({
  origin: function (origin, callback) {
    // origin이 없는 경우 (예: 서버 간 통신)와 허용된 origin 목록에 있는 경우에만 허용
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
  const columns = [
    '2023년_계_총세대수', 'count_transport', 'sum_all_shop', 
    'montly-avg_mean', 'dep-avg_rent_mean', 'dep-avg_deposit_mean'
  ];

  // min-max 정규화
  const minMaxValues = columns.reduce((acc, column) => {
    const values = geojsonData.features.map(f => parseFloat(f.properties[column].replace(/,/g, '')) || 0);
    acc[column] = { min: Math.min(...values), max: Math.max(...values) };
    return acc;
  }, {});

  const normalize = (value, column) => {
    const { min, max } = minMaxValues[column];
    return (value - min) / (max - min);
  };

  // 가중치를 적용하여 계산
  geojsonData.features = geojsonData.features.map(feature => {
    const normalizedValues = columns.map(column => normalize(parseFloat(feature.properties[column].replace(/,/g, '')) || 0, column));
    const computedValue = 
      (statuses[0] ? normalizedValues[0] * weights[0] * 100 : 0) +
      (statuses[1] ? normalizedValues[1] * weights[1] * 100 : 0) +
      (statuses[2] ? normalizedValues[2] * weights[2] * 100 : 0) +
      (statuses[3] ? ((normalizedValues[3] + normalizedValues[4] + normalizedValues[5]) / 3) * weights[3] * 100 : 0);
    
    feature.properties.computedValue = computedValue;
    return feature;
  });

  return geojsonData;
};

app.get('/geojson', (req, res) => {
  fs.readFile(geojsonPath, 'utf8', (err, data) => {
    if (err) {
      console.error('GeoJSON 파일 읽기 오류:', err); // 에러 로그 추가
      res.status(500).send('GeoJSON 파일 읽기 오류');
      return;
    }

    let geojsonData;
    try {
      geojsonData = JSON.parse(data);
    } catch (parseError) {
      console.error('GeoJSON 파싱 오류:', parseError); // 에러 로그 추가
      res.status(500).send('GeoJSON 파싱 오류');
      return;
    }
    
    const weights = [1, 1, 1, 1];
    const statuses = [true, true, true, true];

    geojsonData = getComputedGeoJson(geojsonData, weights, statuses);
    res.json(geojsonData);
  });
});

app.post('/update-geojson', (req, res) => {
  const { weights, statuses } = req.body;

  console.log('받은 가중치:', weights); // 디버깅 로그 추가
  console.log('받은 상태:', statuses); // 디버깅 로그 추가

  fs.readFile(geojsonPath, 'utf8', (err, data) => {
    if (err) {
      console.error('GeoJSON 파일 읽기 오류:', err); // 에러 로그 추가
      res.status(500).send('GeoJSON 파일 읽기 오류');
      return;
    }

    let geojsonData;
    try {
      geojsonData = JSON.parse(data);
    } catch (parseError) {
      console.error('GeoJSON 파싱 오류:', parseError); // 에러 로그 추가
      res.status(500).send('GeoJSON 파싱 오류');
      return;
    }

    geojsonData = getComputedGeoJson(geojsonData, weights, statuses);
    res.json(geojsonData);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT} 포트에서 실행 중입니다`);
});
