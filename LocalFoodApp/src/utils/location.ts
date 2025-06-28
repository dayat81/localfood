import Geolocation from 'react-native-geolocation-service';
import { Platform, PermissionsAndroid } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export interface Location {
  latitude: number;
  longitude: number;
}

export interface LocationError {
  code: number;
  message: string;
}

// Calculate distance between two coordinates in kilometers
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Format distance for display
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

// Check location permission
export const checkLocationPermission = async (): Promise<boolean> => {
  const permission = Platform.select({
    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  });

  if (!permission) return false;

  const result = await check(permission);
  return result === RESULTS.GRANTED;
};

// Request location permission
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'LocalFood needs access to your location to show nearby restaurants.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
      const result = await request(permission);
      return result === RESULTS.GRANTED;
    }
  } catch (err) {
    console.warn('Location permission error:', err);
    return false;
  }
};

// Get current location
export const getCurrentLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject({
          code: error.code,
          message: error.message,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  });
};

// Watch location changes
export const watchLocation = (
  onSuccess: (location: Location) => void,
  onError: (error: LocationError) => void
): number => {
  return Geolocation.watchPosition(
    (position) => {
      onSuccess({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    (error) => {
      onError({
        code: error.code,
        message: error.message,
      });
    },
    {
      enableHighAccuracy: true,
      distanceFilter: 100, // Update every 100 meters
      interval: 10000, // Update every 10 seconds
    }
  );
};

// Clear location watch
export const clearLocationWatch = (watchId: number): void => {
  Geolocation.clearWatch(watchId);
};

// Sort locations by distance
export const sortByDistance = <T extends { latitude: number; longitude: number }>(
  items: T[],
  userLocation: Location
): T[] => {
  return [...items].sort((a, b) => {
    const distanceA = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      a.latitude,
      a.longitude
    );
    const distanceB = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      b.latitude,
      b.longitude
    );
    return distanceA - distanceB;
  });
};

// Filter locations by radius
export const filterByRadius = <T extends { latitude: number; longitude: number }>(
  items: T[],
  userLocation: Location,
  radius: number // in kilometers
): T[] => {
  return items.filter(item => {
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      item.latitude,
      item.longitude
    );
    return distance <= radius;
  });
};