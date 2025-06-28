import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

interface LocationState {
  currentLocation: Location | null;
  permissionStatus: 'granted' | 'denied' | 'prompt' | 'checking';
  loading: boolean;
  error: string | null;
  selectedRadius: number;
}

const initialState: LocationState = {
  currentLocation: null,
  permissionStatus: 'prompt',
  loading: false,
  error: null,
  selectedRadius: 5,
};

export const getCurrentLocation = createAsyncThunk(
  'location/getCurrentLocation',
  async (_, { rejectWithValue }) => {
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        });
      });

      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<Location>) => {
      state.currentLocation = action.payload;
      state.error = null;
    },
    setRadius: (state, action: PayloadAction<number>) => {
      state.selectedRadius = action.payload;
    },
    clearLocation: (state) => {
      state.currentLocation = null;
      state.error = null;
    },
    setPermissionStatus: (state, action: PayloadAction<LocationState['permissionStatus']>) => {
      state.permissionStatus = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.permissionStatus = 'checking';
      })
      .addCase(getCurrentLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLocation = action.payload;
        state.permissionStatus = 'granted';
      })
      .addCase(getCurrentLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.permissionStatus = 'denied';
      });
  },
});

export const {
  setLocation,
  setRadius,
  clearLocation,
  setPermissionStatus,
} = locationSlice.actions;

export default locationSlice.reducer;