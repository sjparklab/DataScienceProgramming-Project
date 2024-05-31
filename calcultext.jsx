import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [maxDistance, setMaxDistance] = useState('');
    const [results, setResults] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3001/calculate-distances', {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                maxDistance: parseFloat(maxDistance)
            });

            setResults(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div>
            <h1>Distance Calculator</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Latitude:
                        <input type="number" value={latitude} onChange={(e) => setLatitude(e.target.value)} required />
                    </label>
                </div>
                <div>
                    <label>
                        Longitude:
                        <input type="number" value={longitude} onChange={(e) => setLongitude(e.target.value)} required />
                    </label>
                </div>
                <div>
                    <label>
                        Max Distance (km):
                        <input type="number" value={maxDistance} onChange={(e) => setMaxDistance(e.target.value)} required />
                    </label>
                </div>
                <button type="submit">Calculate</button>
            </form>
            <h2>Results</h2>
            <ul>
                {results.map((result, index) => (
                    <li key={index}>
                        Feature: {JSON.stringify(result.feature)}, Centroid: {result.centroid.join(', ')}, Distance: {result.distance.toFixed(2)} km
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
