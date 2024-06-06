import React, { useState } from 'react';
import { TextField, Button, Paper, Slider, Typography, Box, MenuItem, Select, InputLabel, FormControl, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/system';
import axios from 'axios';
import locationsData from './locations_data.json'; // locations_data.json 파일을 동일한 디렉토리에 위치시킵니다.

const RECOMMENDED_URL = import.meta.env.VITE_RECOMMENDED_URL;

const Root = styled('div')({
  minHeight: '100vh',
  marginTop: '0px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f0f4f8',
});

const StyledPaper = styled(Paper)({
  padding: '30px',
  backgroundColor: '#ffffff',
  boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.16)',
});

const Form = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const SubmitButton = styled(Button)({
  marginTop: '16px',
});

const FormRow = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '16px',
});

const ResultContainer = styled('div')({
  marginTop: '24px',
});

const keyLabels = {
  행정구역_x: "행정구역(행정동)명",
  '2023년_계_총세대수': "지역 내 1인가구수",
  '2023년_계_총인구수': "지역 내 총 인구수",
  '2023년_세대수(전체세대)': "지역 내 총 세대수",
  '지역별 1인세대 / 지역별 전체세대': "지역별 1인세대 / 지역별 전체세대 비율",
  '지역별 1인가구 / 전체인구비': '지역별 1인가구 / 전체인구 비율',
  "sum_과학·기술": "과학기술 상가 갯수",
  "sum_교육": "교육 상가 갯수",
  "sum_보건의료": "보건의료 상가 갯수",
  "sum_부동산": "부동산 상가 갯수",
  "sum_소매": "소매 상가 갯수",
  "sum_수리·개인": "수리·개인 상가 갯수",
  "sum_숙박": "숙박 상가 갯수",
  "sum_시설관리·임대": "시설관리·임대 상가 갯수",
  "sum_예술·스포츠": "예술 상가 갯수",
  "sum_음식": "음식 상가 갯수",
  "sum_all_shop": "전체 상가 갯수",
  count_bus: "버스정류장 갯수",
  count_도시철도: "도시철도 역 갯수",
  count_transport: "전체 대중교통 수",
  priceSum: '면적당 전월세가격 변환 합',
  transportation: '교통규모',
  singleHousehold: '1인가구 거주규모',
  distance: '원 지점과의 거리',
  computedValue: "최종 점수"
};

const PropertyDisplay = ({ properties }) => {
  const formatNumber = (num) => {
    if (typeof num === 'number') {
      return num.toFixed(2);
    }
    return num;
  };
  return (
    <div>
      <Typography>{`${keyLabels['2023년_계_총세대수'] || '2023년_계_총세대수'}: ${formatNumber(properties['2023년_계_총세대수'])}`}</Typography>
      <Typography>{`${keyLabels["sum_all_shop"] || "sum_all_shop"}: ${formatNumber(properties["sum_all_shop"])}`}</Typography>
      <Typography>{`${keyLabels["count_transport"] || "count_transport"}: ${formatNumber(properties["count_transport"])}`}</Typography>
      <Typography>{`${keyLabels['면적 당 1인가구수'] || '면적 당 1인가구수'}: ${formatNumber(properties['면적 당 1인가구수'])}`}</Typography>
      <Typography>{`${keyLabels["면적 당 전체 상점 수"] || "면적 당 전체 상점 수"}: ${formatNumber(properties["면적 당 전체 상점 수"])}`}</Typography>
      <Typography>{`${keyLabels["면적 당 대중교통 수"] || "면적 당 대중교통 수"}: ${formatNumber(properties["면적 당 대중교통 수"])}`}</Typography>
      <Typography>{`평균 단위면적당 월세: ${formatNumber(properties["평균 단위면적당 월세금"])}`}</Typography>
      <Typography>{`평균 월세 단위면적당 보증금: ${formatNumber(properties["평균 월세 단위면적당 보증금"])}`}</Typography>
      <Typography>{`평균 전세 단위면적당 보증금: ${formatNumber(properties["평균 전세 단위면적당 보증금"])}`}</Typography>
      <Typography>{`${keyLabels["priceSum"] || "priceSum"}: ${formatNumber(properties["priceSum"])}`}</Typography>
      <Typography>{`원 지점과의 거리: ${formatNumber(properties["distance"])}`}</Typography>
      <Typography>{`최종 점수: ${formatNumber(properties["computedValue"])}`}</Typography>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>추가 인구정보</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{`${keyLabels['2023년_계_총세대수'] || '2023년_계_총세대수'}: ${formatNumber(properties['2023년_계_총세대수'])}`}</Typography>
          <Typography>{`${keyLabels['2023년_계_총인구수'] || '2023년_계_총인구수'}: ${formatNumber(properties['2023년_계_총인구수'])}`}</Typography>
          <Typography>{`${keyLabels['2023년_세대수(전체세대)'] || '2023년_세대수(전체세대)'}: ${formatNumber(properties['2023년_세대수(전체세대)'])}`}</Typography>
          <Typography>{`${keyLabels['지역별 1인세대 / 지역별 전체세대'] || '지역별 1인세대 / 지역별 전체세대'}: ${formatNumber(properties['지역별 1인세대 / 지역별 전체세대'])}`}</Typography>
          <Typography>{`${keyLabels['지역별 1인가구 / 전체인구비'] || '지역별 1인가구 / 전체인구비'}: ${formatNumber(properties['지역별 1인가구 / 전체인구비'])}`}</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>추가 상가 정보</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{`${keyLabels["sum_과학·기술"] || "sum_과학·기술"}: ${formatNumber(properties["sum_과학·기술"])}`}</Typography>
          <Typography>{`${keyLabels["sum_교육"] || "sum_교육"}: ${formatNumber(properties["sum_교육"])}`}</Typography>
          <Typography>{`${keyLabels["sum_보건의료"] || "sum_보건의료"}: ${formatNumber(properties["sum_보건의료"])}`}</Typography>
          <Typography>{`${keyLabels["sum_부동산"] || "sum_부동산"}: ${formatNumber(properties["sum_부동산"])}`}</Typography>
          <Typography>{`${keyLabels["sum_소매"] || "sum_소매"}: ${formatNumber(properties["sum_소매"])}`}</Typography>
          <Typography>{`${keyLabels["sum_수리·개인"] || "sum_수리·개인"}: ${formatNumber(properties["sum_수리·개인"])}`}</Typography>
          <Typography>{`${keyLabels["sum_숙박"] || "sum_숙박"}: ${formatNumber(properties["sum_숙박"])}`}</Typography>
          <Typography>{`${keyLabels["sum_시설관리·임대"] || "sum_시설관리·임대"}: ${formatNumber(properties["sum_시설관리·임대"])}`}</Typography>
          <Typography>{`${keyLabels["sum_예술·스포츠"] || "sum_예술·스포츠"}: ${formatNumber(properties["sum_예술·스포츠"])}`}</Typography>
          <Typography>{`${keyLabels["sum_음식"] || "sum_음식"}: ${formatNumber(properties["sum_음식"])}`}</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>추가 교통수단 정보</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{`${keyLabels["count_bus"] || "count_bus"}: ${formatNumber(properties["count_bus"])}`}</Typography>
          <Typography>{`${keyLabels["count_도시철도"] || "count_도시철도"}: ${formatNumber(properties["count_도시철도"])}`}</Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>추가 부동산 정보</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{`단독다가구 월세 단위면적당 보증금: ${formatNumber(properties["단독다가구 월세 단위면적당 보증금"])}`}</Typography>
          <Typography>{`단독다가구 단위면적당 월세: ${formatNumber(properties["단독다가구 단위면적당 월세금"])}`}</Typography>
          <Typography>{`단독다가구 전세 단위면적당 보증금: ${formatNumber(properties["단독다가구 전세 단위면적당 보증금"])}`}</Typography>
          <Typography>{`아파트 월세 단위면적당 보증금: ${formatNumber(properties["아파트 월세 단위면적당 보증금"])}`}</Typography>
          <Typography>{`아파트 단위면적당 월세: ${formatNumber(properties["아파트 단위면적당 월세금"])}`}</Typography>
          <Typography>{`아파트 전세 단위면적당 보증금: ${formatNumber(properties["아파트 전세 단위면적당 보증금"])}`}</Typography>
          <Typography>{`연립다세대 월세 단위면적당 보증금: ${formatNumber(properties["연립다세대 월세 단위면적당 보증금"])}`}</Typography>
          <Typography>{`연립다세대 단위면적당 월세: ${formatNumber(properties["연립다세대 단위면적당 월세금"])}`}</Typography>
          <Typography>{`연립다세대 전세 단위면적당 보증금: ${formatNumber(properties["연립다세대 전세 단위면적당 보증금"])}`}</Typography>
          <Typography>{`오피스텔 월세 단위면적당 보증금: ${formatNumber(properties["오피스텔 월세 단위면적당 보증금"])}`}</Typography>
          <Typography>{`오피스텔 단위면적당 월세: ${formatNumber(properties["오피스텔 단위면적당 월세금"])}`}</Typography>
          <Typography>{`오피스텔 전세 단위면적당 보증금: ${formatNumber(properties["오피스텔 전세 단위면적당 보증금"])}`}</Typography>
        </AccordionDetails>
      </Accordion>

    </div>
  );
};

function App() {
  const [formData, setFormData] = useState({
    name: '',
    currentWorkplaceSido: '부산광역시',
    currentWorkplaceSigungu: '부산진구',
    currentWorkplaceEupmyeondong: '가야1동',
    commercialScale: 5,
    rentType: '월세',
    houseType: '오피스텔',
    area: 30,
    minPrice: 0,
    maxPrice: 50,
    transportation: 5,
    singleHousehold: 5,
    maxDistance: 3,
    minDeposit: 0,
    maxDeposit: 5000,
  });

  const [recommendedAreas, setRecommendedAreas] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'currentWorkplaceSido' && { currentWorkplaceSigungu: '', currentWorkplaceEupmyeondong: '' }),
      ...(name === 'currentWorkplaceSigungu' && { currentWorkplaceEupmyeondong: '' }),
      ...(name === 'rentType' && {
        minDeposit: 0,
        maxDeposit: value === '전세' ? 10000 : 1000
      }),
    });
  };

  const handleSliderChange = (name) => (event, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${RECOMMENDED_URL}`, formData);
      const sortedAreas = response.data.sort((a, b) => b.properties.computedValue - a.properties.computedValue);
      setRecommendedAreas(sortedAreas);
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  const { currentWorkplaceSido, currentWorkplaceSigungu } = formData;
  const sigungus = currentWorkplaceSido ? locationsData[currentWorkplaceSido].sigungus : [];
  const eupmyeondongs = currentWorkplaceSigungu ? locationsData[currentWorkplaceSido].eupmyeondongs[currentWorkplaceSigungu] : [];

  const filterProperties = (properties) => {
    const excludedKeys = ['ADM_NM', 'ADM_CD', 'BASE_DATE', 'centroid', 'priceSumNormalized', 'region_code', 'reversepriceSumNormalized', '행정구역분류', '지역별 1인가구수 / 전국 1인가구수비'];
    return Object.keys(properties)
      .filter(key => !excludedKeys.includes(key))
      .reduce((obj, key) => {
        obj[key] = properties[key];
        return obj;
      }, {});
  };

  return (
    <Root>
      <StyledPaper>
        <h1>지역 추천을 위해 정보를 입력해주세요</h1>
        <Form onSubmit={handleSubmit}>
          <FormRow>
            <FormControl fullWidth>
              <InputLabel id="current-workplace-sido-label">현재 직장/학교(시도)</InputLabel>
              <Select
                labelId="current-workplace-sido-label"
                id="current-workplace-sido"
                name="currentWorkplaceSido"
                value={formData.currentWorkplaceSido}
                onChange={handleChange}
                label="현재 직장(시도)"
              >
                {Object.keys(locationsData).map((sido, index) => (
                  <MenuItem key={index} value={sido}>{sido}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="current-workplace-sigungu-label">현재 직장/학교(시군구)</InputLabel>
              <Select
                labelId="current-workplace-sigungu-label"
                id="current-workplace-sigungu"
                name="currentWorkplaceSigungu"
                value={formData.currentWorkplaceSigungu}
                onChange={handleChange}
                disabled={!currentWorkplaceSido}
                label="현재 직장(시군구)"
              >
                {sigungus.map((sigungu, index) => (
                  <MenuItem key={index} value={sigungu}>{sigungu}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="current-workplace-eupmyeondong-label">현재 직장/학교(읍면동)</InputLabel>
              <Select
                labelId="current-workplace-eupmyeondong-label"
                id="current-workplace-eupmyeondong"
                name="currentWorkplaceEupmyeondong"
                value={formData.currentWorkplaceEupmyeondong}
                onChange={handleChange}
                disabled={!currentWorkplaceSigungu}
                label="현재 직장(읍면동)"
              >
                {eupmyeondongs.map((eupmyeondong, index) => (
                  <MenuItem key={index} value={eupmyeondong}>{eupmyeondong}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </FormRow>

          <Box>
            <Typography gutterBottom>상권 접근성</Typography>
            <Slider
              value={formData.commercialScale}
              onChange={handleSliderChange('commercialScale')}
              aria-labelledby="commercial-scale-slider"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={0}
              max={10}
            />
          </Box>

          <Box>
            <Typography gutterBottom>대중교통 접근성</Typography>
            <Slider
              value={formData.transportation}
              onChange={handleSliderChange('transportation')}
              aria-labelledby="transportation-slider"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={0}
              max={10}
            />
          </Box>

          <Box>
            <Typography gutterBottom>1인가구수</Typography>
            <Slider
              value={formData.singleHousehold}
              onChange={handleSliderChange('singleHousehold')}
              aria-labelledby="singleHousehold-slider"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={0}
              max={10}
            />
          </Box>

          <FormRow>
            <FormControl fullWidth>
              <InputLabel id="rent-type-label">전세/월세</InputLabel>
              <Select
                labelId="rent-type-label"
                id="rent-type"
                name="rentType"
                value={formData.rentType}
                onChange={handleChange}
                label="전세/월세"
              >
                <MenuItem value="월세">월세</MenuItem>
                <MenuItem value="전세">전세</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="house-type-label">주택유형</InputLabel>
              <Select
                labelId="house-type-label"
                id="house-type"
                name="houseType"
                value={formData.houseType}
                onChange={handleChange}
                label="주택유형"
              >
                <MenuItem value="단독다가구">단독다가구</MenuItem>
                <MenuItem value="연립다세대">연립다세대</MenuItem>
                <MenuItem value="아파트">아파트</MenuItem>
                <MenuItem value="오피스텔">오피스텔</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              name="area"
              label="희망면적 (㎡)"
              type="number"
              value={formData.area}
              onChange={handleChange}
              inputProps={{ min: 10, max: 60 }}
            />
          </FormRow>
          {formData.rentType !== '전세' && (
            <FormRow>
              <TextField
                fullWidth
                name="minPrice"
                label="최소월세 (만원)"
                type="number"
                value={formData.minPrice}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                name="maxPrice"
                label="최대월세 (만원)"
                type="number"
                value={formData.maxPrice}
                onChange={handleChange}
              />
            </FormRow>
          )}
          <FormRow>
            <TextField
              fullWidth
              name="minDeposit"
              label="최소 보증금 (만원)"
              type="number"
              value={formData.minDeposit}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              name="maxDeposit"
              label="최대 보증금(만원)"
              type="number"
              value={formData.maxDeposit}
              onChange={handleChange}
            />
          </FormRow>

          <FormControl fullWidth>
            <InputLabel id="max-distance-label">최대 추천 거리</InputLabel>
            <Select
              labelId="max-distance-label"
              id="max-distance"
              name="maxDistance"
              value={formData.maxDistance}
              onChange={handleChange}
              label="최대 추천 거리"
            >
              <MenuItem value={1}>1km</MenuItem>
              <MenuItem value={2}>2km</MenuItem>
              <MenuItem value={3}>3km</MenuItem>
              <MenuItem value={5}>5km</MenuItem>
              <MenuItem value={7}>7km</MenuItem>
              <MenuItem value={10}>10km</MenuItem>
              <MenuItem value={15}>15km</MenuItem>
              <MenuItem value={20}>20km</MenuItem>
              <MenuItem value={30}>30km</MenuItem>
              <MenuItem value={40}>40km</MenuItem>
              <MenuItem value={50}>50km</MenuItem>
            </Select>
          </FormControl>

          <SubmitButton type="submit" variant="contained" color="primary">추천받기</SubmitButton>
        </Form>

        {recommendedAreas && (
          <ResultContainer>
            <h2>추천된 지역:</h2>
            {recommendedAreas.length > 0 && (
              <Paper style={{ padding: '16px', marginBottom: '16px' }}>
                <Typography variant="h6">{recommendedAreas[0].properties.행정구역_x}</Typography>
                <PropertyDisplay properties={filterProperties(recommendedAreas[0].properties)} />
              </Paper>
            )}

            {recommendedAreas.length > 1 && (
              <Accordion defaultExpanded={false}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>기타지역</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {recommendedAreas.slice(1).map((area, index) => (
                    <Paper key={index} style={{ padding: '16px', marginBottom: '16px' }}>
                      <Typography variant="h6">{area.properties.행정구역_x}</Typography>
                      <PropertyDisplay properties={filterProperties(area.properties)} />
                    </Paper>
                  ))}
                </AccordionDetails>
              </Accordion>
            )}
          </ResultContainer>
        )}
      </StyledPaper>
    </Root>
  );
}

export default App;
