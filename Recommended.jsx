import React, { useState } from 'react';
import { Container, TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Checkbox, Paper, Slider, Typography, Box, MenuItem, Select, InputLabel } from '@mui/material';
import axios from 'axios';
import { styled } from '@mui/system';

const Root = styled('div')({
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f0f4f8', // 외부 배경색
});

const StyledPaper = styled(Paper)({
  padding: '16px',
  backgroundColor: '#ffffff', // 내부 박스 배경색
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

function App() {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    currentWorkplace: '',
    commercialScale: 5,
    rentPrice: 5,
    transportation: 5,
    singleHousehold: 5,
    maxDistance: 3,
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
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
      const response = await axios.post('http://localhost:5000/api/recommend', formData);
      console.log('Recommended Area:', response.data);
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  return (
    <Root>
      <StyledPaper>
        <h1>지역 추천을 위해 정보를 입력해주세요</h1>
        <Form onSubmit={handleSubmit}>
          <TextField label="이름" name="name" fullWidth required onChange={handleChange} />
          <FormControl component="fieldset">
            <FormLabel component="legend">성별</FormLabel>
            <RadioGroup row name="gender" onChange={handleChange}>
              <FormControlLabel value="female" control={<Radio />} label="여성" />
              <FormControlLabel value="male" control={<Radio />} label="남성" />
            </RadioGroup>
          </FormControl>
          <TextField label="현재 직장(학교)" name="currentWorkplace" fullWidth required onChange={handleChange} />
          
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
          
          <FormControlLabel control={<Checkbox name="agreeTerms" onChange={handleChange} />} label="이용약관 및 개인정보 수집 동의" />
          <SubmitButton type="submit" variant="contained" color="primary">추천받기</SubmitButton>
        </Form>
      </StyledPaper>
    </Root>
  );
}

export default App;
