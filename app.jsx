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
  const [zoomLevel, setZoomLevel] = useState(INITIAL_VIEW_STATE.zoom);
  const [extruded, setExtruded] = useState(false);
  const [useTownData, setUseTownData] = useState(true);
  const [statuses, setStatuses] = useState([true, true, true, true]);

  useEffect(() => {
    const fetchGeoJson = async () => {
      const url = useTownData ? '/geojson/town' : '/geojson/city';
      try {
        const response = await fetch(url);
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
  }, [useTownData]);

  useEffect(() => {
    const handleZoom = () => {
      if (zoomLevel >= 12 && !useTownData) {
        setUseTownData(true);
      } else if (zoomLevel < 12 && useTownData) {
        setUseTownData(false);
      }
    };
    handleZoom();
  }, [zoomLevel]);

  const updateGeoJson = async () => {
    try {
      const response = await fetch('https://sjpark-dev.com/update-geojson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statuses })
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

  const colorScale = scaleSequential(interpolateBlues)
    .domain([0, 100]);

  const geoJsonLayer = new GeoJsonLayer({
    id: 'geojson-layer',
    data: geoJsonData,
    filled: true,
    extruded: extruded,
    getFillColor: d => {
      const value = d.properties.computedValue || 0;
      const color = rgb(colorScale(value));
      return [color.r, color.g, color.b, 180];
    },
    getLineColor: [255, 255, 255],
    getLineWidth: 1,
    getElevation: d => (d.properties.computedValue || 0) * 50,
    pickable: true,
    visible: true,
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
        <img src="/path/to/deu_logo.png" alt="동의대학교 로고" className="logo" />
        동의대학교 컴퓨터공학과 데이터과학프로그래밍 4조
      </header>
      <aside className="side-bar">
        <div className="control-panel">
          <div className="control-box">
            <label>GeoJSON 레이어 활성화:</label>
            <div className="toggle-button-group">
              <button
                className={`toggle-button ${statuses[0] ? 'active' : 'inactive'}`}
                onClick={() => {
                  const newStatuses = [...statuses];
                  newStatuses[0] = true;
                  setStatuses(newStatuses);
                }}
              >
                활성화
              </button>
              <button
                className={`toggle-button ${!statuses[0] ? 'active' : 'inactive'}`}
                onClick={() => {
                  const newStatuses = [...statuses];
                  newStatuses[0] = false;
                  setStatuses(newStatuses);
                }}
              >
                비활성화
              </button>
            </div>
          </div>
          <div className="control-box">
            <label>2D/3D 모드:</label>
            <div className="toggle-button-group">
              <button
                className={`toggle-button ${extruded ? 'inactive' : 'active'}`}
                onClick={() => setExtruded(false)}
              >
                2D 모드
              </button>
              <button
                className={`toggle-button ${extruded ? 'active' : 'inactive'}`}
                onClick={() => setExtruded(true)}
              >
                3D 모드
              </button>
            </div>
          </div>
          <button className="update-button" onClick={updateGeoJson}>
            업데이트
          </button>
        </div>
      </aside>
      <main className="map-container">
        <Map
          initialViewState={INITIAL_VIEW_STATE}
          mapStyle={MAP_STYLE}
          mapboxAccessToken={MAPBOX_TOKEN}
          onViewportChange={(viewport) => setZoomLevel(viewport.zoom)}
        >
          <DeckGLOverlay layers={[geoJsonLayer]} />
          <NavigationControl position="top-left" />
        </Map>
        <div
          id="tooltip"
          style={{
            position: 'absolute',
            zIndex: 1,
            pointerEvents: 'none',
            background: 'white',
            padding: '5px',
            borderRadius: '3px',
            display: 'none',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        />
      </main>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Root />);
