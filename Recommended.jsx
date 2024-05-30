// App.js
import React, { useState } from 'react';
import { Container, TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Checkbox } from '@mui/material';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    gender: '',
    location: '',
    commercialScale: '',
    rentPrice: '',
    transportation: '',
    singleHousehold: '',
    maxDistance: '',
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/recommend', formData);
      console.log('Recommended Area:', response.data);
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <h1>회원 가입을 위해 정보를 입력해주세요</h1>
      <form onSubmit={handleSubmit}>
        <TextField label="이메일" name="email" fullWidth margin="normal" required onChange={handleChange} />
        <TextField label="이름" name="name" fullWidth margin="normal" required onChange={handleChange} />
        <TextField type="password" label="비밀번호" name="password" fullWidth margin="normal" required onChange={handleChange} />
        <TextField type="password" label="비밀번호 확인" name="confirmPassword" fullWidth margin="normal" required onChange={handleChange} />
        <FormControl component="fieldset" margin="normal">
          <FormLabel component="legend">성별</FormLabel>
          <RadioGroup row name="gender" onChange={handleChange}>
            <FormControlLabel value="female" control={<Radio />} label="여성" />
            <FormControlLabel value="male" control={<Radio />} label="남성" />
          </RadioGroup>
        </FormControl>
        <TextField label="현재 거주지" name="location" fullWidth margin="normal" required onChange={handleChange} />
        <TextField label="상업규모" name="commercialScale" fullWidth margin="normal" onChange={handleChange} />
        <TextField label="평균 전월세가격" name="rentPrice" fullWidth margin="normal" onChange={handleChange} />
        <TextField label="교통규모" name="transportation" fullWidth margin="normal" onChange={handleChange} />
        <TextField label="1인가구 거주규모" name="singleHousehold" fullWidth margin="normal" onChange={handleChange} />
        <TextField label="최대 추천 거리" name="maxDistance" fullWidth margin="normal" onChange={handleChange} />
        <FormControlLabel control={<Checkbox name="agreeTerms" onChange={handleChange} />} label="이용약관 및 개인정보 수집 동의" />
        <Button type="submit" variant="contained" color="primary" fullWidth>가입하기</Button>
      </form>
    </Container>
  );
}

export default App;
