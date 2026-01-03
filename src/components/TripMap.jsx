import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';
import './TripMap.css';

// Fix for default marker icons in Leaflet with Webpack/Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIconRetina,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper to center map when destination changes
const ChangeView = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, 12);
        }
    }, [center, map]);
    return null;
};

const TripMap = ({ destination, height = "400px" }) => {
    // Mock coordinates for major Indian cities
    const cityCoords = {
        'Mumbai, Maharashtra': [19.0760, 72.8777],
        'Goa, Goa': [15.2993, 74.1240],
        'Jaipur, Rajasthan': [26.9124, 75.7873],
        'Manali, Himachal Pradesh': [32.2432, 77.1892],
        'Udaipur, Rajasthan': [24.5854, 73.7125],
        'Varanasi, Uttar Pradesh': [25.3176, 82.9739],
        'Agra, Uttar Pradesh': [27.1767, 78.0081],
        'Shimla, Himachal Pradesh': [31.1048, 77.1734],
        'Darjeeling, West Bengal': [27.0410, 88.2663],
        'Kochi, Kerala': [9.9312, 76.2673],
        'Delhi': [28.6139, 77.2090],
        'Bangalore': [12.9716, 77.5946],
    };

    // Find best match or default to Delhi
    const getCoords = (dest) => {
        if (!dest) return [28.6139, 77.2090];

        for (const city in cityCoords) {
            if (dest.includes(city) || city.includes(dest)) {
                return cityCoords[city];
            }
        }
        return [28.6139, 77.2090];
    };

    const position = getCoords(destination);

    return (
        <div className="trip-map-container" style={{ height }}>
            <MapContainer
                center={position}
                zoom={12}
                scrollWheelZoom={true}
                dragging={true}
                style={{ height: '100%', width: '100%', borderRadius: '16px' }}
            >
                <ChangeView center={position} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>
                        <div className="map-popup">
                            <strong>{destination}</strong>
                            <p>Your destination</p>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

export default TripMap;
