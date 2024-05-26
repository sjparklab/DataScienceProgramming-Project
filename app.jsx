import React, { useEffect, useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { Map, NavigationControl, useControl } from 'react-map-gl';
import { GeoJsonLayer } from 'deck.gl';
import { MapboxOverlay as DeckOverlay } from '@deck.gl/mapbox';
import { scaleSequential } from 'd3-scale';
import { interpolateGreens } from 'd3-scale-chromatic';
import { rgb } from 'd3-color';
import 'mapbox-gl/dist/mapbox-gl.css';
import './styles.css';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const GEOJSON_URL = import.meta.env.VITE_GEOJSON_URL;
const UPDATE_GEOJSON_URL = 'http://localhost:3001/update-geojson';

const INITIAL_VIEW_STATE = {
  latitude: 35.9078,
  longitude: 127.7669,
  zoom: 7,
  bearing: 0,
  pitch: 30
};

const MAP_STYLE = 'mapbox://styles/mapbox/standard';

function DeckGLOverlay(props) {
  const overlay = useControl(() => new DeckOverlay(props));
  overlay.setProps(props);
  return null;
}

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
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [statuses, setStatuses] = useState([true, true, true, true]);
  const [isLayerVisible, setIsLayerVisible] = useState(true);
  const [is3D, setIs3D] = useState(true);
  const [selectedData, setSelectedData] = useState('sigungu');
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const fetchGeoJson = useCallback(async (type) => {
    try {
      const response = await fetch(`${GEOJSON_URL}/${type}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setGeoJsonData(data);
    } catch (error) {
      console.error('GeoJSON 데이터 가져오기 오류:', error);
    }
  }, []);

  useEffect(() => {
    fetchGeoJson(selectedData);
  }, [fetchGeoJson, selectedData]);

  const updateGeoJson = useCallback(async (newStatuses) => {
    try {
      const response = await fetch(`${UPDATE_GEOJSON_URL}/${selectedData}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weights: [1, 1, 1, 1], statuses: newStatuses })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setGeoJsonData(data);
    } catch (error) {
      console.error('GeoJSON 데이터 업데이트 오류:', error);
    }
  }, [selectedData]);

  const handleStatusChange = (index, value) => {
    const newStatuses = [...statuses];
    newStatuses[index] = value;
    setStatuses(newStatuses);
    updateGeoJson(newStatuses);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300);
  };

  if (!geoJsonData) {
    return <div>로딩 중...</div>;
  }

  const colorScale = scaleSequential(interpolateGreens).domain([0, 100]);

  const geoJsonLayer = new GeoJsonLayer({
    id: 'geojson-layer',
    data: geoJsonData,
    filled: true,
    extruded: is3D,
    wireframe: true,
    getFillColor: d => {
      const value = d.properties.computedValue || 0;
      const color = rgb(colorScale(value));
      return [color.r, color.g, color.b, 180];
    },
    getLineColor: [0, 0, 0, 255],
    getLineWidth: 2,
    getElevation: d => is3D ? (d.properties.computedValue || 0) * 50 : 0,
    pickable: true,
    visible: isLayerVisible,
    lineWidthMinPixels: is3D ? 2 : 1,
    onHover: info => {
      const tooltip = document.getElementById('tooltip');
      if (info.object) {
        const properties = info.object.properties;
        tooltip.style.display = 'block';
        tooltip.style.left = `${info.x}px`;
        tooltip.style.top = `${info.y}px`;
        tooltip.innerHTML = `
          <div><strong>${properties['행정구역_x']}</strong></div>
          <div>총세대수: ${properties['2023년_계_총세대수']}</div>
          <div>운송수단수: ${properties['count_transport']}</div>
          <div>상점수: ${properties['sum_all_shop']}</div>
          <div>평균 전월세 가격지수: ${properties.priceSumNormalized !== undefined ? (100 - properties.priceSumNormalized * 100).toFixed(2) : 'N/A'}</div>
          <div>Computed Value: ${properties['computedValue'].toFixed(2)}</div>
        `;
      } else {
        tooltip.style.display = 'none';
      }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="container">
        <AppBar position="fixed" color="default" style={{ background: '#ffffff' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
            <IconButton edge="start" color="inherit" aria-label="logo" style={{ marginLeft: '10px' }}>
              <img src="deu_logo.png" alt="동의대학교 로고" style={{ height: '40px' }} />
            </IconButton>
            <Typography variant="h6" style={{ flexGrow: 1, color: '#000000', fontWeight: 'bold' }}>
              동의대학교 컴퓨터공학과 데이터과학프로그래밍 4조
            </Typography>
          </Toolbar>
        </AppBar>
        <div className="main-content" style={{ marginTop: '64px' }}>
          <Drawer
            variant="persistent"
            anchor="left"
            open={isDrawerOpen}
            PaperProps={{
              style: {
                width: 360,  // 사이드바의 총 너비를 설정
                borderTopRightRadius: 16,
                borderBottomRightRadius: 16,
                boxShadow: '2px 0 4px rgba(0, 0, 0, 0.1)',
                padding: '10px',  // 사이드바의 내부 패딩 설정
                marginTop: '64px'
              }
            }}
          >
            <div className="control-panel">
              <div className="control-box">
                <Typography className="sidebar-title">레이어 설정</Typography>
                <div className="toggle-button-group">
                  <Button
                    variant={isLayerVisible ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => setIsLayerVisible(true)}
                    className="toggle-button"
                  >
                    활성화
                  </Button>
                  <Button
                    variant={!isLayerVisible ? "contained" : "outlined"}
                    color="secondary"
                    onClick={() => setIsLayerVisible(false)}
                    className="toggle-button"
                  >
                    비활성화
                  </Button>
                </div>
              </div>
              <div className="control-box">
                <Typography className="sidebar-title">화면모드 설정</Typography>
                <div className="toggle-button-group">
                  <Button
                    variant={is3D ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => setIs3D(true)}
                    className="toggle-button"
                  >
                    3D 모드
                  </Button>
                  <Button
                    variant={!is3D ? "contained" : "outlined"}
                    color="secondary"
                    onClick={() => setIs3D(false)}
                    className="toggle-button"
                  >
                    2D 모드
                  </Button>
                </div>
              </div>
              <div className="control-box">
                <Typography className="sidebar-title">데이터 파일 선택</Typography>
                <div className="toggle-button-group">
                  <Button
                    variant={selectedData === 'sigungu' ? "contained" : "outlined"}
                    color="primary"
                    onClick={() => setSelectedData('sigungu')}
                    className="toggle-button"
                  >
                    시군구
                  </Button>
                  <Button
                    variant={selectedData === 'dong' ? "contained" : "outlined"}
                    color="secondary"
                    onClick={() => setSelectedData('dong')}
                    className="toggle-button"
                  >
                    읍면동
                  </Button>
                </div>
              </div>
              {['총세대수', '운송수단수', '상점수', '평균 전월세 가격지수'].map((prop, index) => (
                <div className="control-box" key={index}>
                  <Typography className="sidebar-label">{prop}</Typography>
                  <div className="toggle-button-group">
                    <Button
                      variant={statuses[index] ? "contained" : "outlined"}
                      color="primary"
                      onClick={() => handleStatusChange(index, true)}
                      className="toggle-button"
                    >
                      활성화
                    </Button>
                    <Button
                      variant={!statuses[index] ? "contained" : "outlined"}
                      color="secondary"
                      onClick={() => handleStatusChange(index, false)}
                      className="toggle-button"
                    >
                      비활성화
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Drawer>
          <main className="map-container" style={{ marginLeft: isDrawerOpen ? '360px' : '0', transition: 'margin-left 0.3s' }}>
            <Map
              initialViewState={INITIAL_VIEW_STATE}
              mapStyle={MAP_STYLE}
              mapboxAccessToken={MAPBOX_TOKEN}
            >
              <DeckGLOverlay layers={[geoJsonLayer]} />
              <NavigationControl position="top-left" />
            </Map>
            <div id="tooltip" style={{ position: 'absolute', zIndex: 1001, pointerEvents: 'none', background: 'rgba(0, 0, 0, 0.8)', padding: '10px', borderRadius: '3px', color: 'white', display: 'none', fontSize: '14px', maxWidth: '300px', lineHeight: '1.5' }} />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Root />);
