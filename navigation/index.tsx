/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName, Modal } from 'react-native';

import { RootState } from "./../lib/store/reducers/rootReducer";
import { useSelector, useDispatch } from "react-redux"
import MainModal from '../components/mainScreen/MainModal';

import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStackParamList } from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  
  // @DEBUG moved the modal functionality here, original config was resulting in error:
  /*
  'UIViewControllerHierarchyInconsistency', reason: 'child view controller:<ABI42_0_0RNScreensViewController: 0x7fe6f0050b80> should have parent view controller:(null) but actual parent is:<ABI42_0_0RNSScreen: 0x7fe6f0192260>'
terminating with uncaught exception of type NSException
abort() called
   */
  let validWaterdataRequestSubmitted = useSelector((state: RootState) => state.waterdata.validWaterdataRequestSubmitted);
  let modalVisible = true;
  if (validWaterdataRequestSubmitted == true) {
    modalVisible = false;
  }
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={DefaultTheme}>
      <Modal animationType="slide"
        presentationStyle="fullScreen"
        visible={modalVisible}
      >
        <MainModal />
      </Modal>
      <RootNavigator />
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root" component={BottomTabNavigator} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  );
}
