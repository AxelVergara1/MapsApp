import {create} from 'zustand';
import {Location} from '../../../infrastructure/interfaces/location';
import {
  clearWatchLocation,
  getCurrentLocarion,
  watchCurrentLocation,
} from '../../../actions/location/location';

interface locationState {
  lastKnownLocation: Location | null;
  userLocationList: Location[];
  watchId: number | null;

  getLocation: () => Promise<Location | null>;
  watchLocation: () => void;
  clearWatchLocation: () => void;
}

export const useLocationStore = create<locationState>()((set, get) => ({
  lastKnownLocation: null,
  userLocationList: [],
  watchId: null,

  getLocation: async () => {
    const location = await getCurrentLocarion();
    set({lastKnownLocation: location});
    return location;
  },

  watchLocation: () => {
    const watchId = get().watchId;
    if (watchId !== null) {
      get().clearWatchLocation();
    }

    const id = watchCurrentLocation(location => {
      set({
        lastKnownLocation: location,
        userLocationList: [...get().userLocationList, location],
      });
    });

    set({watchId: id});
  },

  clearWatchLocation: () => {
    const watchId = get().watchId;
    if (watchId !== null) {
      clearWatchLocation(watchId);
    }
  },
}));
