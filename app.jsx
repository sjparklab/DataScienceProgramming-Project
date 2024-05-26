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
  latitude: 35.9078, // 대한민국 중심부
  longitude: 127.7669,
  zoom: 7,
  bearing: 0,
  pitch: 30,
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
  const [statuses, setStatuses] = useState([true, true, true, true]);
  const [isLayerVisible, setIsLayerVisible] = useState(true);
  const [is3D, setIs3D] = useState(true);
  const [geoJsonMode, setGeoJsonMode] = useState('읍면동'); // 기본 모드는 읍면동

  useEffect(() => {
    const fetchGeoJson = async () => {
      try {
        const response = await fetch(`https://sjpark-dev.com/geojson?zoom=${zoomLevel}`);
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
  }, [zoomLevel]);

  const updateGeoJson = async () => {
    try {
      const response = await fetch('https://sjpark-dev.com/update-geojson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weights: [1, 1, 1, 1], statuses }),
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
  const colorScale = scaleSequential(interpolateGreens).domain([0, 100]); // 데이터 범위에 맞게 조정

  const geoJsonLayer = new GeoJsonLayer({
    id: 'geojson-layer',
    data: geoJsonData,
    filled: true,
    extruded: is3D,
    wireframe: true,
    getFillColor: (d) => {
      const value = d.properties.computedValue || 0;
      const color = rgb(colorScale(value));
      return [color.r, color.g, color.b, 180]; // RGBA
    },
    getLineColor: [0, 0, 0, 255], // 경계선 색상 (검정색)
    getLineWidth: is3D ? 2 : 1, // 경계선 두께, 3D에서는 두껍게
    getElevation: (d) => (d.properties.computedValue || 0) * 50, // 높이 값 조정, 50배 확대
    pickable: true,
    visible: isLayerVisible,
    lineWidthMinPixels: 1, // 최소 경계선 두께
    onHover: (info) => {
      const tooltip = document.getElementById('tooltip');
      if (info.object) {
        const properties = info.object.properties;
        tooltip.style.display = 'block';
        tooltip.style.left = `${info.x + 10}px`; // 마우스 포인터에서 10px 오른쪽으로 위치
        tooltip.style.top = `${info.y + 10}px`; // 마우스 포인터에서 10px 아래로 위치
        tooltip.innerHTML = `
          <div><strong>${properties['행정구역_x']}</strong></div>
          <div>총세대수: ${properties['2023년_계_총세대수']}</div>
          <div>운송수단수: ${properties['count_transport']}</div>
          <div>상점수: ${properties['sum_all_shop']}</div>
          <div>평균 전월세 가격지수: ${
            properties.priceSumNormalized !== undefined
              ? (100 - properties.priceSumNormalized * 100).toFixed(2)
              : 'N/A'
          }</div>
          <div>Computed Value: ${properties['computedValue'].toFixed(2)}</div>
        `;
      } else {
        tooltip.style.display = 'none';
      }
    },
  });

  return (
    <div className="container">
      <header className="top-bar">
        <img className="logo" src="/path/to/deu_logo.png" alt="동의대학교 로고" />
        동의대학교 컴퓨터공학과 데이터과학프로그래밍 4조
      </header>
      <div className="main-content">
        <aside className="side-bar">
          <div className="control-panel">
            <div className="control-box">
              <label>GeoJSON 레이어 활성화:</label>
              <div className="toggle-button-group">
                <button
                  className={`toggle-button ${isLayerVisible ? 'active' : 'inactive'}`}
                  onClick={() => setIsLayerVisible(true)}
                >
                  활성화
                </button>
                <button
                  className={`toggle-button ${!isLayerVisible ? 'active' : 'inactive'}`}
                  onClick={() => setIsLayerVisible(false)}
                >
                  비활성화
                </button>
              </div>
            </div>
            <div className="control-box">
              <label>지도 모드:</label>
              <div className="toggle-button-group">
                <button
                  className={`toggle-button ${is3D ? 'active' : 'inactive'}`}
                  onClick={() => setIs3D(true)}
                >
                  3D 모드
                </button>
                <button
                  className={`toggle-button ${!is3D ? 'active' : 'inactive'}`}
                  onClick={() => setIs3D(false)}
                >
                  2D 모드
                </button>
              </div>
            </div>
            <div className="control-box">
              <label>GeoJSON 모드:</label>
              <div className="toggle-button-group">
                <button
                  className={`toggle-button ${geoJsonMode === '읍면동' ? 'active' : 'inactive'}`}
                  onClick={() => setGeoJsonMode('읍면동')}
                >
                  읍면동
                </button>
                <button
                  className={`toggle-button ${geoJsonMode === '시군구' ? 'active' : 'inactive'}`}
                  onClick={() => setGeoJsonMode('시군구')}
                >
                  시군구
                </button>
              </div>
            </div>
            <div className="control-box">
              <label>총세대수 활성화:</label>
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
              <label>운송수단수 활성화:</label>
              <div className="toggle-button-group">
                <button
                  className={`toggle-button ${statuses[1] ? 'active' : 'inactive'}`}
                  onClick={() => {
                    const newStatuses = [...statuses];
                    newStatuses[1] = true;
                    setStatuses(newStatuses);
                  }}
                >
                  활성화
                </button>
                <button
                  className={`toggle-button ${!statuses[1] ? 'active' : 'inactive'}`}
                  onClick={() => {
                    const newStatuses = [...statuses];
                    newStatuses[1] = false;
                    setStatuses(newStatuses);
                  }}
                >
                  비활성화
                </button>
              </div>
            </div>
            <div className="control-box">
              <label>상점수 활성화:</label>
              <div className="toggle-button-group">
                <button
                  className={`toggle-button ${statuses[2] ? 'active' : 'inactive'}`}
                  onClick={() => {
                    const newStatuses = [...statuses];
                    newStatuses[2] = true;
                    setStatuses(newStatuses);
                  }}
                >
                  활성화
                </button>
                <button
                  className={`toggle-button ${!statuses[2] ? 'active' : 'inactive'}`}
                  onClick={() => {
                    const newStatuses = [...statuses];
                    newStatuses[2] = false;
                    setStatuses(newStatuses);
                  }}
                >
                  비활성화
                </button>
              </div>
            </div>
            <div className="control-box">
              <label>평균 전월세 가격지수 활성화:</label>
              <div className="toggle-button-group">
                <button
                  className={`toggle-button ${statuses[3] ? 'active' : 'inactive'}`}
                  onClick={() => {
                    const newStatuses = [...statuses];
                    newStatuses[3] = true;
                    setStatuses(newStatuses);
                  }}
                >
                  활성화
                </button>
                <button
                  className={`toggle-button ${!statuses[3] ? 'active' : 'inactive'}`}
                  onClick={() => {
                    const newStatuses = [...statuses];
                    newStatuses[3] = false;
                    setStatuses(newStatuses);
                  }}
                >
                  비활성화
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
            onZoom={(e) => setZoomLevel(e.viewState.zoom)}
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
            }}
          />
        </main>
      </div>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Root />);
