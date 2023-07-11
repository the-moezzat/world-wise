import styles from './Map.module.css';
import { TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { MapContainer } from 'react-leaflet';
import { useCities } from '../contexts/CitiesContext';
import { useUrlPosition } from '../hooks/useUrlPosition';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { useGeolocation } from '../hooks/useGeoLocation';

export default function Map() {
  const [mapPosition, setMapPosition] = useState<[number, number]>([30, 30]);
  const { getPosition, isLoading, position } = useGeolocation();

  const { cities } = useCities();
  const [lat, lng] = useUrlPosition();

  useEffect(
    function () {
      if (lat && lng) setMapPosition([+lat, +lng]);
    },
    [lat, lng]
  );

  useEffect(
    function () {
      if (position) setMapPosition([position.lat, position.lng]);
    },
    [position]
  );

  return (
    <div className={styles.mapContainer}>
      {!position && (
        <Button type="position" onClick={getPosition}>
          {isLoading ? '...loading' : 'Use my location'}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />

        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              {city.notes} <br /> -- {city.cityName}, {city.country} --
            </Popup>
          </Marker>
        ))}

        <MapPosition position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

function MapPosition({ position }: { position: [number, number] }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => {
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });

  return null;
}
