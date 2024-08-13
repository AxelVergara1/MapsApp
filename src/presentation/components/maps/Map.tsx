import React, {useEffect, useRef, useState} from 'react';
import MapView, {Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import {Location} from '../../../infrastructure/interfaces/location';
import {FAB} from '../ui/FAB';
import {useLocationStore} from '../../stores/location/useLocationStore';

interface Props {
  showsUserLocation?: boolean;
  initialLocation: Location;
}

export const Map = ({showsUserLocation = true, initialLocation}: Props) => {
  const mapRef = useRef<MapView>();
  const cameraLocation = useRef<Location>(initialLocation);

  const [isFollowingUser, setIsFollowingUser] = useState(true);
  const [isShowingPolyline, setIsShowingPolyline] = useState(true);

  const {
    getLocation,
    lastKnownLocation,
    watchLocation,
    clearWatchLocation,
    userLocationList,
  } = useLocationStore();

  const moveCameraToLocation = (location: Location) => {
    if (!mapRef.current) return;
    mapRef.current.animateCamera({
      center: location,
    });
  };

  const moveToCurrentLocation = async () => {
    if (lastKnownLocation) {
      moveCameraToLocation(initialLocation);
    }
    const location = await getLocation();
    if (!location) return;
    moveCameraToLocation(location);
  };

  useEffect(() => {
    watchLocation();
    return () => {
      clearWatchLocation();
    };
  }, []);

  useEffect(() => {
    if (lastKnownLocation && isFollowingUser) {
      moveCameraToLocation(lastKnownLocation);
    }
  }, [lastKnownLocation, isFollowingUser]);

  return (
    <>
      <MapView
        ref={map => (mapRef.current = map!)}
        showsUserLocation={showsUserLocation}
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        // provider={ Platform.OS === 'ios' ? undefined: PROVIDER_GOOGLE} si tuviera ios
        style={{flex: 1}}
        onTouchStart={() => {
          setIsFollowingUser(false);
        }}
        region={{
          latitude: cameraLocation.current.latitude,
          longitude: cameraLocation.current.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}>
        {isShowingPolyline && (
          <Polyline
            coordinates={userLocationList}
            strokeColor="#484bff"
            strokeWidth={5}
          />
        )}
        {/* <Marker
            coordinate={{
                latitude: 37.78825,
                longitude: -122.4324,
            }}
            title='Titulo del marcador'
            description='cuerpo del marcador'
            image={require('../../../assets/custom-marker.png')}
            /> */}
      </MapView>

      <FAB
        iconName="compass-outline"
        onPress={moveToCurrentLocation}
        style={{bottom: 20, right: 20}}
      />
      <FAB
        iconName={isFollowingUser ? 'walk-outline' : 'accessibility-outline'}
        onPress={() => setIsFollowingUser(!isFollowingUser)}
        style={{bottom: 80, right: 20}}
      />
      <FAB
        iconName={isShowingPolyline ? 'eye-outline' : 'eye-off-outline'}
        onPress={() => setIsShowingPolyline(!isShowingPolyline)}
        style={{bottom: 140, right: 20}}
      />
    </>
  );
};
