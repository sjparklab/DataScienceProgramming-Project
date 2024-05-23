import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Map, NavigationControl, useControl } from 'react-map-gl';
import { GeoJsonLayer } from 'deck.gl';
import { MapboxOverlay as DeckOverlay } from '@deck.gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.MapboxAccessToken;

const INITIAL_VIEW_STATE = {
  latitude: 35.9078,
  longitude: 127.7669,
  zoom: 7,
  bearing: 0,
  pitch: 30
};

const MAP_STYLE = 'mapbox://styles/mapbox/light-v9';

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
        const response = await fetch('/geojson');
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
      const response = await fetch('/update-geojson', {
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

  const layers = new GeoJsonLayer({
    id: 'geojson-layer',
    data: geoJsonData,
    filled: true,
    extruded: true,
    getFillColor: d => {
      const value = d.properties.computedValue || 0;
      const color = Math.min(255, value * 1.5);
      return [color, 140, 200, 180];
    },
    getLineColor: [255, 255, 255],
    getElevation: d => (d.properties.computedValue || 0) * 2,
    pickable: true,
    visible: true,
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
          <div>평균 전월세 가격지수: ${properties['montly-avg_mean']}</div>
          <div>Computed Value: ${properties['computedValue']}</div>
        `;
      } else {
        tooltip.style.display = 'none';
      }
    }
  });

  return (
    <>
      <div style={{ position: 'absolute', zIndex: 1, background: 'white', padding: '10px', borderRadius: '3px' }}>
        <div>
          {['총세대수', '운송수단수', '상점수', '평균 전월세 가격지수'].map((prop, index) => (
            <div key={index}>
              <label>{prop} 가중치: </label>
              <input 
                type="number" 
                value={weights[index]} 
                onChange={e => {
                  const newWeights = [...weights];
                  newWeights[index] = Number(e.target.value);
                  setWeights(newWeights);
                }} 
              />
              <label> 활성화: </label>
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
          ))}
          <button onClick={updateGeoJson}>업데이트</button>
        </div>
      </div>
      <Map
        initialViewState={INITIAL_VIEW_STATE}
        mapStyle={MAP_STYLE}
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        <DeckGLOverlay layers={[layers]} />
        <NavigationControl position="top-left" />
      </Map>
      <div id="tooltip" style={{ position: 'absolute', zIndex: 1, pointerEvents: 'none', background: 'white', padding: '5px', borderRadius: '3px', display: 'none' }} />
    </>
  );
}

const container = document.body.appendChild(document.createElement('div'));
createRoot(container).render(<Root />);
