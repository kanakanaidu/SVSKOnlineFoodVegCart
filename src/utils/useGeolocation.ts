import { useState, useEffect } from 'react';

const useGeolocation = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    const success = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      setLocation({ lat: latitude, lng: longitude });
      setError(null);
    };

    const error = () => {
      setError('Unable to retrieve your location');
    };

    navigator.geolocation.getCurrentPosition(success, error);
  }, []);

  return { location, error };
};

export default useGeolocation;
