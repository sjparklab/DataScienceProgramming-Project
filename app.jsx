import React, { useEffect, useState } from 'react';
import { DeckGL, GeoJsonLayer } from 'deck.gl';
import { StaticMap } from 'react-map-gl';
import { Checkbox, FormControlLabel, FormGroup } from '@material-ui/core';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_ACCESS_TOKEN = 'YOUR_MAPBOX_ACCESS_TOKEN';
const INITIAL_VIEW_STATE = {
  longitude: 129.0756,
  latitude: 35.1796,
  zoom: 11,
  pitch: 0,
  bearing: 0
};

const App = () => {
  const [data, setData] = useState(null);
  const [checked, setChecked] = useState({
    townData: false,
    cityData: false
  });

  const fetchGeoJsonData = async (useTownData) => {
    const response = await fetch(`/geojson/${useTownData ? 'town' : 'city'}`);
    const geoJson = await response.json();
    setData(geoJson);
  };

  useEffect(() => {
    fetchGeoJsonData(checked.townData);
  }, [checked]);

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setChecked((prev) => ({
      ...prev,
      [name]: checked
    }));
  };

  const renderLayer = () => {
    if (!data) return null;

    return new GeoJsonLayer({
      id: 'geojson-layer',
      data,
      pickable: true,
      filled: true,
      pointRadiusMinPixels: 2,
      pointRadiusScale: 2000,
      getRadius: (f) => Math.sqrt(f.properties.point_count),
      getFillColor: (f) => {
        const value = f.properties.computedValue;
        if (value > 0.75) return [255, 0, 0, 200];
        if (value > 0.5) return [255, 165, 0, 200];
        if (value > 0.25) return [255, 255, 0, 200];
        return [0, 128, 0, 200];
      },
      getLineColor: [0, 0, 0, 255],
      getLineWidth: 1
    });
  };

  return (
    <div>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[renderLayer()]}
      >
        <StaticMap
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
        />
      </DeckGL>
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox
              checked={checked.townData}
              onChange={handleCheckboxChange}
              name="townData"
            />
          }
          label="Town Data"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={checked.cityData}
              onChange={handleCheckboxChange}
              name="cityData"
            />
          }
          label="City Data"
        />
      </FormGroup>
    </div>
  );
};

export default App;
