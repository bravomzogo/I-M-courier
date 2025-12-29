// components/MapWrapper.jsx
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapWrapper = ({ center, zoom, markers, route, onMapInit }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Initialize map
    mapInstance.current = L.map(mapRef.current).setView(center, zoom);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapInstance.current);

    if (onMapInit) {
      onMapInit(mapInstance.current);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Update markers
  useEffect(() => {
    if (!mapInstance.current) return;

    // Clear existing markers
    mapInstance.current.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        mapInstance.current.removeLayer(layer);
      }
    });

    // Add new markers
    markers.forEach((marker) => {
      L.marker([marker.lat, marker.lng])
        .addTo(mapInstance.current)
        .bindPopup(marker.popup);
    });

    // Add route if exists
    if (route && route.length > 1) {
      L.polyline(route, {
        color: '#3B82F6',
        weight: 3,
        opacity: 0.7,
      }).addTo(mapInstance.current);
    }
  }, [markers, route]);

  // Update center
  useEffect(() => {
    if (mapInstance.current && center) {
      mapInstance.current.setView(center, mapInstance.current.getZoom());
    }
  }, [center]);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
};

export default MapWrapper;