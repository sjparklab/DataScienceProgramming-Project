import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Map, NavigationControl, useControl } from 'react-map-gl';
import { GeoJsonLayer } from 'deck.gl';
import { MapboxOverlay as DeckOverlay } from '@deck.gl/mapbox';
import { scaleSequential } from 'd3-scale';
import { interpolateBlues } from 'd3-scale-chromatic';
import { rgb } from 'd3-color';
import 'mapbox-gl/dist/mapbox-gl.css';
import './styles.css';

const MAPBOX_TOKEN = process.env.MapboxAccessToken;

const INITIAL_VIEW_STATE = {
  latitude: 35.9078, // 대한민국 중심부
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

function Root() {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [weights, setWeights] = useState([1, 1, 1, 1]);
  const [statuses, setStatuses] = useState([true, true, true, true]);

  useEffect(() => {
    const fetchGeoJson = async () => {
      try {
        const response = await fetch('https://sjpark-dev.com/geojson');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setGeoJsonData(data);
      } catch (error) {
        console.error('GeoJSON 데이터 가져오기 오류:', error);
      }
    };
    fetchGeoJson();
  }, []);

  const updateGeoJson = async () => {
    try {
      const response = await fetch('https://sjpark-dev.com/update-geojson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weights, statuses })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setGeoJsonData(data);
    } catch (error) {
      console.error('GeoJSON 데이터 업데이트 오류:', error);
    }
  };

  if (!geoJsonData) {
    return <div>로딩 중...</div>;
  }

  // d3-scale을 사용하여 색상 범위 정의
  const colorScale = scaleSequential(interpolateBlues)
    .domain([0, 100]); // 데이터 범위에 맞게 조정

  const geoJsonLayer = new GeoJsonLayer({
    id: 'geojson-layer',
    data: geoJsonData,
    filled: true,
    extruded: true,
    wireframe: true, // wireframe 사용
    getFillColor: d => {
      const value = d.properties.computedValue || 0;
      const color = rgb(colorScale(value));
      return [color.r, color.g, color.b, 180]; // RGBA
    },
    getLineColor: [0, 0, 0, 255], // 경계선 색상 (검정색)
    getLineWidth: 2, // 경계선 두께
    getElevation: d => (d.properties.computedValue || 0) * 50, // 높이 값 조정, 50배 확대
    pickable: true,
    visible: true,
    lineWidthMinPixels: 2, // 최소 경계선 두께
    onHover: info => {
      const tooltip = document.getElementById('tooltip');
      if (info.object) {
        const properties = info.object.properties;
        const pixelRatio = window.devicePixelRatio || 1;
        tooltip.style.display = 'block';
        tooltip.style.left = `${info.x + 370}px`; // 마우스 포인터에서 10px 오른쪽으로 위치
        tooltip.style.top = `${info.y}px`; // 마우스 포인터에서 10px 아래로 위치
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
    <div className="container">
      <header className="top-bar">상단바 내용</header>
      <div className="main-content">
        <aside className="side-bar">
          <div className="control-panel">
            {['총세대수', '운송수단수', '상점수', '평균 전월세 가격지수'].map((prop, index) => (
              <div className="control-box" key={index}>
                <label>{prop} 가중치:</label>
                <input 
                  type="number" 
                  value={weights[index]} 
                  onChange={e => {
                    const newWeights = [...weights];
                    newWeights[index] = Number(e.target.value);
                    setWeights(newWeights);
                  }} 
                />
                <div className="activation">
                  <label>활성화:</label>
                  <input 
                    type="checkbox" 
                    checked={statuses[index]} 
                    onChange={e => {
                      const newStatuses = [...statuses];
                      newStatuses[index] = e.target.checked;
                      setStatuses(newStatuses);
                    }} 
                  />
                </div>
              </div>
            ))}
            <button className="update-button" onClick={updateGeoJson}>업데이트</button>
          </div>
        </aside>
        <div className="map-container">
          <Map
            initialViewState={INITIAL_VIEW_STATE}
            mapStyle={MAP_STYLE}
            mapboxAccessToken={MAPBOX_TOKEN}
          >
            <DeckGLOverlay layers={[geoJsonLayer]} />
            <NavigationControl position="top-left" />
          </Map>
          <div id="tooltip" style={{ position: 'absolute', zIndex: 1001, pointerEvents: 'none', background: 'white', padding: '5px', borderRadius: '3px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)', display: 'none' }} />
        </div>
      </div>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Root />);
