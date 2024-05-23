const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); // JSON 바디를 파싱하는 미들웨어 추가

const geojsonPath = path.join(__dirname, 'all_data_with_geojson_data.geojson');

// 초기 GeoJSON 데이터를 가져오는 함수
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

// 초기 GeoJSON 데이터를 가져오는 엔드포인트
app.get('/geojson', (req, res) => {
  fs.readFile(geojsonPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('GeoJSON 파일 읽기 오류');
      return;
    }

    let geojsonData = JSON.parse(data);
    const weights = [1, 1, 1, 1]; // 기본 가중치
    const statuses = [true, true, true, true]; // 기본 상태

    geojsonData = getComputedGeoJson(geojsonData, weights, statuses);

    res.json(geojsonData);
  });
});

// 사용자 입력을 기반으로 GeoJSON 데이터를 업데이트하는 엔드포인트
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
