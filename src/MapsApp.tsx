import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import 'react-native-gesture-handler';
import {StackNavigaiton} from './presentation/navigation/StackNavigation';
import {PermssionsChecker} from './presentation/providers/PermissionsChecker';

// enableLatestRenderer()

export const MapsApp = () => {
  return (
    <NavigationContainer>
      <PermssionsChecker>
        <StackNavigaiton />
      </PermssionsChecker>
    </NavigationContainer>
  );
};
