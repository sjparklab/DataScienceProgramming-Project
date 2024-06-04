import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import HomePage from './HomePage';
import Recommended from './Recommended';
import MapPage from './MapPage';
import Analysis from './Analysis'
import './styles.css';

const theme = createTheme({
  typography: {
    fontFamily: 'Nanum Gothic, sans-serif',
    fontWeight: 700,
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
        <header className="header">
          <h1><Link to="/" style={{textDecoration: 'none', color: '#FFFFFF'}}>SingleNest</Link></h1>
          <nav>
            <ul>
              <li><Link to="/">HOME</Link></li>
              <li><Link to="/analysis">ANALYSIS</Link></li>
              <li><Link to="/map">MAP</Link></li>
              <li><Link to="/recommended">RECOMMENDATION</Link></li>
            </ul>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path='/analysis' element={<Analysis/>} />
          <Route path="/recommended" element={<Recommended />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Root />);
