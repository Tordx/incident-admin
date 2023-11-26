import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

type Props = {
  coordinates: [number, number][];
};

const Maps: React.FC<Props> = ({ coordinates }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current || coordinates.length === 0) {
      return;
    }

    mapboxgl.accessToken =
      'pk.eyJ1Ijoia2Fsb2thbG8iLCJhIjoiY2xkeXV5bWxwMHY3aTNvcjNsc3Bsc3hmdyJ9.n-Gnaro_yu9dj5PnUhNgfQ';

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: coordinates[0], // Use the first coordinate as the initial center
      zoom: 13,
      attributionControl: false,
    });

    mapRef.current = map;

    markersRef.current = coordinates.map((coord, index) => {
      const markerContainer = document.createElement('div');
      markerContainer.className = 'custom-marker';
      markerContainer.style.width = '20px'; // Adjust to your marker width
      markerContainer.style.height = '20px'; // Adjust to your marker height

      const marker = new mapboxgl.Marker(markerContainer).setLngLat(coord).addTo(map);

      return marker;
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [coordinates]);

  const mapContainerStyle = {
    width: '100%',
    height: '500px',
  };

  return <div ref={mapContainerRef} style={mapContainerStyle} />;
};

export default Maps;
