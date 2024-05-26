import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Map, NavigationControl, useControl } from 'react-map-gl';
import { GeoJsonLayer } from 'deck.gl';
import { MapboxOverlay as DeckOverlay } from '@deck.gl/mapbox';
import { scaleSequential } from 'd3-scale';
import { interpolateGreens } from 'd3-scale-chromatic';
import { rgb } from 'd3-color';
import 'mapbox-gl/dist/mapbox-gl.css';
import './styles.css';

const MAPBOX_TOKEN = process.env.MapboxAccessToken;

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

function Root() {
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [statuses, setStatuses] = useState([true, true, true, true]);
  const [useTownData, setUseTownData] = useState(true);
  const [extruded, setExtruded] = useState(true);

  const fetchGeoJson = async () => {
    try {
      const response = await fetch(`/geojson/${useTownData ? 'town' : 'city'}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setGeoJsonData(data);
    } catch (error) {
      console.error('GeoJSON 데이터 가져오기 오류:', error);
    }
  };

  useEffect(() => {
    fetchGeoJson();
  }, [useTownData]);

  const updateGeoJson = async () => {
    try {
      const response = await fetch('https://sjpark-dev.com/update-geojson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statuses, useTownData })
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

  const handleZoomChange = (viewState) => {
    if (viewState.zoom >= 10 && !useTownData) {
      setUseTownData(true);
    } else if (viewState.zoom < 10 && useTownData) {
      setUseTownData(false);
    }
  };

  if (!geoJsonData) {
    return <div>로딩 중...</div>;
  }

  const colorScale = scaleSequential(interpolateGreens)
    .domain([0, 100]);

  const layers = new GeoJsonLayer({
    id: 'geojson-layer',
    data: geoJsonData,
    filled: true,
    extruded: extruded,
    getFillColor: d => {
      const value = d.properties.computedValue || 0;
      const color = rgb(colorScale(value));
      return [color.r, color.g, color.b, 180];
    },
    getLineColor: [0, 0, 0],
    getElevation: d => (d.properties.computedValue || 0) * 50,
    pickable: true,
    visible: true,
    wireframe: true,
    onHover: info => {
      const tooltip = document.getElementById('tooltip');
      if (info.object) {
        const properties = info.object.properties;
        tooltip.style.display = 'block';
        tooltip.style.left = `${info.x + 10}px`;
        tooltip.style.top = `${info.y + 10}px`;
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
      <header className="top-bar">
        <img src="deu_logo.png" alt="동의대학교 로고" />
        동의대학교 컴퓨터공학과 데이터과학프로그래밍 4조
      </header>
      <aside className="side-bar">
        <div className="control-panel">
          <div className="control-box">
            <label>GeoJSON 레이어 활성화:</label>
            <div className="button-group">
              <button className={geoJsonData ? 'active' : ''} onClick={() => setGeoJsonData(null)}>비활성화</button>
              <button className={geoJsonData ? '' : 'active'} onClick={fetchGeoJson}>활성화</button>
            </div>
          </div>
          <div className="control-box">
            <label>총세대수 활성화:</label>
            <div className="button-group">
              <button className={statuses[0] ? 'active' : ''} onClick={() => setStatuses([!statuses[0], statuses[1], statuses[2], statuses[3]])}>활성화</button>
              <button className={statuses[0] ? '' : 'active'} onClick={() => setStatuses([!statuses[0], statuses[1], statuses[2], statuses[3]])}>비활성화</button>
            </div>
          </div>
          <div className="control-box">
            <label>운송수단수 활성화:</label>
            <div className="button-group">
              <button className={statuses[1] ? 'active' : ''} onClick={() => setStatuses([statuses[0], !statuses[1], statuses[2], statuses[3]])}>활성화</button>
              <button className={statuses[1] ? '' : 'active'} onClick={() => setStatuses([statuses[0], !statuses[1], statuses[2], statuses[3]])}>비활성화</button>
            </div>
          </div>
          <div className="control-box">
            <label>상점수 활성화:</label>
            <div className="button-group">
              <button className={statuses[2] ? 'active' : ''} onClick={() => setStatuses([statuses[0], statuses[1], !statuses[2], statuses[3]])}>활성화</button>
              <button className={statuses[2] ? '' : 'active'} onClick={() => setStatuses([statuses[0], statuses[1], !statuses[2], statuses[3]])}>비활성화</button>
            </div>
          </div>
          <div className="control-box">
            <label>평균 전월세 가격지수 활성화:</label>
            <div className="button-group">
              <button className={statuses[3] ? 'active' : ''} onClick={() => setStatuses([statuses[0], statuses[1], statuses[2], !statuses[3]])}>활성화</button>
              <button className={statuses[3] ? '' : 'active'} onClick={() => setStatuses([statuses[0], statuses[1], statuses[2], !statuses[3]])}>비활성화</button>
            </div>
          </div>
          <div className="control-box">
            <label>지도 모드:</label>
            <div className="button-group">
              <button className={!useTownData ? 'active' : ''} onClick={() => setUseTownData(false)}>시군구</button>
              <button className={useTownData ? 'active' : ''} onClick={() => setUseTownData(true)}>읍면동</button>
            </div>
          </div>
          <div className="control-box">
            <label>3D/2D 모드:</label>
            <div className="button-group">
              <button className={extruded ? 'active' : ''} onClick={() => setExtruded(true)}>3D</button>
              <button className={!extruded ? 'active' : ''} onClick={() => setExtruded(false)}>2D</button>
            </div>
          </div>
          <button className="update-button" onClick={updateGeoJson}>업데이트</button>
        </div>
      </aside>
      <main className="main-content">
        <Map
          initialViewState={INITIAL_VIEW_STATE}
          mapStyle={MAP_STYLE}
          mapboxAccessToken={MAPBOX_TOKEN}
          onViewportChange={handleZoomChange}
        >
          <DeckGLOverlay layers={[layers]} />
          <NavigationControl position="top-left" />
        </Map>
        <div id="tooltip" style={{ position: 'absolute', zIndex: 1, pointerEvents: 'none', background: 'white', padding: '5px', borderRadius: '3px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)', display: 'none' }} />
      </main>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Root />);
