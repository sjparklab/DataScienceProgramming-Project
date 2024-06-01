import React, { useState } from 'react';
import { TextField, Button, Paper, Slider, Typography, Box, MenuItem, Select, InputLabel, FormControl, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/system';
import axios from 'axios';

// JSON 데이터를 import 합니다.
import locationsData from './locations_data.json'; // locations_data.json 파일을 동일한 디렉토리에 위치시킵니다.

const RECOMMENDED_URL = import.meta.env.VITE_RECOMMENDED_URL;

const Root = styled('div')({
  minHeight: 'calc(100vh - 64px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f0f4f8',
});

const StyledPaper = styled(Paper)({
  padding: '16px',
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

function App() {
  const [formData, setFormData] = useState({
    name: '',
    currentWorkplaceSido: '',
    currentWorkplaceSigungu: '',
    currentWorkplaceEupmyeondong: '',
    commercialScale: 5,
    rentPrice: 5,
    transportation: 5,
    singleHousehold: 5,
    maxDistance: 3,
  });

  const [recommendedAreas, setRecommendedAreas] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'currentWorkplaceSido' && { currentWorkplaceSigungu: '', currentWorkplaceEupmyeondong: '' }),
      ...(name === 'currentWorkplaceSigungu' && { currentWorkplaceEupmyeondong: '' }),
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
    const excludedKeys = ['ADM_NM', 'ADM_CD', 'BASE_DATE', 'centroid', 'priceSumNormalized', 'region_code'];
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
              <InputLabel id="current-workplace-sido-label">현재 직장(시도)</InputLabel>
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
              <InputLabel id="current-workplace-sigungu-label">현재 직장(시군구)</InputLabel>
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
              <InputLabel id="current-workplace-eupmyeondong-label">현재 직장(읍면동)</InputLabel>
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
            <Typography gutterBottom>상업규모</Typography>
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
            <Typography gutterBottom>평균 전월세가격</Typography>
            <Slider
              value={formData.rentPrice}
              onChange={handleSliderChange('rentPrice')}
              aria-labelledby="rent-price-slider"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={0}
              max={10}
            />
          </Box>

          <Box>
            <Typography gutterBottom>교통규모</Typography>
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
            <Typography gutterBottom>1인가구 거주규모</Typography>
            <Slider
              value={formData.singleHousehold}
              onChange={handleSliderChange('singleHousehold')}
              aria-labelledby="single-household-slider"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={0}
              max={10}
            />
          </Box>

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
                {Object.entries(filterProperties(recommendedAreas[0].properties)).map(([key, value]) => (
                  <Typography key={key}>{`${key}: ${value}`}</Typography>
                ))}
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
                      {Object.entries(filterProperties(area.properties)).map(([key, value]) => (
                        <Typography key={key}>{`${key}: ${value}`}</Typography>
                      ))}
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
