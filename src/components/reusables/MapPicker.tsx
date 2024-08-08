import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 13.037058788807446,
  lng: 77.71893635909642
};

type MapPickerProps = {
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  initialLocation?: { lat: number; lng: number } | null;
};

const MapPicker: React.FC<MapPickerProps> = ({ onLocationSelect, initialLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(initialLocation || null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  
  useEffect(() => {
    if (initialLocation) {
      setSelectedLocation(initialLocation);
    }
  }, [initialLocation]);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const location = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
      setSelectedLocation(location);
      console.log('selectedLocation: ', selectedLocation);
      // localStorage.setItem("custLocation", `${location.lat},${location.lng}`);
      localStorage.setItem("custLocation", JSON.stringify(location));
      onLocationSelect(location);
    }
  };

  // @ts-ignore
  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        setSelectedLocation(location);
        onLocationSelect(location);
        if (mapRef.current) {
          mapRef.current.panTo(location);
        }
      }
    }
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyAii_VVuGuJjWJKZRmwV3QkCV5CWjYUpNg" 
    // libraries={['places']}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={selectedLocation || center}
        zoom={10}
        onClick={handleMapClick}
        onLoad={(map) => {mapRef.current = map}}
      >
        {selectedLocation && <Marker position={selectedLocation} />}
        {/* <Autocomplete
          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
          onPlaceChanged={handlePlaceChanged}
        >
          <input
            type="text"
            placeholder="Search for a location"
            style={{
              boxSizing: 'border-box',
              border: '1px solid transparent',
              width: '240px',
              height: '32px',
              padding: '0 12px',
              borderRadius: '3px',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
              fontSize: '14px',
              outline: 'none',
              textOverflow: 'ellipses',
              position: 'absolute',
              left: '50%',
              marginLeft: '-120px'
            }}
          />
        </Autocomplete> */}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapPicker;