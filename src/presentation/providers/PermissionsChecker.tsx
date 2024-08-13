import React, {Children, PropsWithChildren, useEffect} from 'react';
import {AppState, Text, View} from 'react-native';
import {usePermissionStore} from '../stores/permissions/usePermissionStore';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {RootStackParams} from '../navigation/StackNavigation';

export const PermssionsChecker = ({children}: PropsWithChildren) => {
  const {locationStatus, checktLocationPermission} = usePermissionStore();
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  useEffect(() => {
    if (locationStatus === 'granted') {
      navigation.reset({
        index: 0,
        routes: [{name: 'MapScreen'}],
      });

    } else if (locationStatus !== 'undeterminated') {
            navigation.reset({
        index: 0,
        routes: [{name: 'PermissionsScreen'}],
      });
      
    }
  }, [locationStatus]);

  useEffect(() => {
    checktLocationPermission();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        checktLocationPermission();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return <>{children}</>;
};
