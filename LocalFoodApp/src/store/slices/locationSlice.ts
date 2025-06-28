import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getCurrentLocation,
  checkLocationPermission,
  requestLocationPermission,
  Location,
  LocationError,
} from '../../utils/location';

interface LocationState {
  currentLocation: Location | null;
  permissionStatus: 'granted' | 'denied' | 'not-asked' | 'checking';
  loading: boolean;
  error: string | null;
  selectedRadius: number; // in kilometers
  watchId: number | null;
}

const initialState: LocationState = {
  currentLocation: null,
  permissionStatus: 'not-asked',
  loading: false,
  error: null,
  selectedRadius: 5, // 5km default radius
  watchId: null,
};

// Async thunk to check permission
export const checkPermission = createAsyncThunk(
  'location/checkPermission',
  async () => {
    const hasPermission = await checkLocationPermission();
    return hasPermission;
  }
);

// Async thunk to request permission
export const requestPermission = createAsyncThunk(
  'location/requestPermission',
  async () => {
    const granted = await requestLocationPermission();
    return granted;
  }
);

// Async thunk to get current location
export const fetchCurrentLocation = createAsyncThunk(
  'location/fetchCurrentLocation',
  async (_, { rejectWithValue }) => {
    try {
      const location = await getCurrentLocation();
      return location;
    } catch (error) {
      const locationError = error as LocationError;
      return rejectWithValue(locationError.message);
    }
  }
);

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setCurrentLocation: (state, action: PayloadAction<Location>) => {
      state.currentLocation = action.payload;
      state.error = null;
    },
    setRadius: (state, action: PayloadAction<number>) => {
      state.selectedRadius = action.payload;
    },
    setWatchId: (state, action: PayloadAction<number | null>) => {
      state.watchId = action.payload;
    },
    clearLocation: (state) => {
      state.currentLocation = null;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    // Check permission
    builder
      .addCase(checkPermission.pending, (state) => {
        state.permissionStatus = 'checking';
      })
      .addCase(checkPermission.fulfilled, (state, action) => {
        state.permissionStatus = action.payload ? 'granted' : 'not-asked';
      })
      .addCase(checkPermission.rejected, (state) => {
        state.permissionStatus = 'not-asked';
      });

    // Request permission
    builder
      .addCase(requestPermission.pending, (state) => {
        state.permissionStatus = 'checking';
      })
      .addCase(requestPermission.fulfilled, (state, action) => {
        state.permissionStatus = action.payload ? 'granted' : 'denied';
      })
      .addCase(requestPermission.rejected, (state) => {
        state.permissionStatus = 'denied';
      });

    // Fetch current location
    builder
      .addCase(fetchCurrentLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLocation = action.payload;
        state.error = null;
      })
      .addCase(fetchCurrentLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentLocation,
  setRadius,
  setWatchId,
  clearLocation,
  setError,
} = locationSlice.actions;

export default locationSlice.reducer;