import {create} from 'zustand';
import {PermissionStatus} from '../../../infrastructure/interfaces/permissions';
import {
  checkLocationPermission,
  requestLocationPermission,
} from '../../../actions/permissions/location';

interface PermissionsState {
  locationStatus: PermissionStatus;

  requestLocationPermission: () => Promise<PermissionStatus>;
  checktLocationPermission: () => Promise<PermissionStatus>;
}

export const usePermissionStore = create<PermissionsState>()(set => ({
  locationStatus: 'undeterminated',
  requestLocationPermission: async () => {
    const status = await requestLocationPermission();
    set({locationStatus: status});

    return status;
  },
  checktLocationPermission: async () => {
    const status = await checkLocationPermission();
    set({locationStatus: status});

    return status;
  },
}));
