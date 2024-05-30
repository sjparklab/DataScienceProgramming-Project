import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MapIcon from '@mui/icons-material/Map';
import HomePage from './HomePage';
import Recommended from './Recommended';
import MapPage from './MapPage';
import './styles.css';

const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  palette: {
    primary: {
      main: '#007bff',
    },
    secondary: {
      main: '#dc3545',
    },
    background: {
      default: '#f8f9fa',
    },
  },
});

function Root() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppBar position="fixed" color="default" style={{ background: '#ffffff' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="logo" component={Link} to="/">
              <img src="deu_logo.png" alt="동의대학교 로고" style={{ height: '40px' }} />
            </IconButton>
            <Typography variant="h6" style={{ flexGrow: 1, color: '#000000', fontWeight: 'bold' }}>
              동의대학교 컴퓨터공학과 데이터과학프로그래밍 4조
            </Typography>
            <Button color="inherit" component={Link} to="/">메인페이지</Button>
            <Button color="inherit" component={Link} to="/recommended">추천시스템</Button>
            <Button color="inherit" component={Link} to="/map"><MapIcon />지도</Button>
          </Toolbar>
        </AppBar>
        <Box mt={8}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recommended" element={<Recommended />} />
            <Route path="/map" element={<MapPage />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Root />);
