import React, { useState, useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import useColorScheme from '../hooks/useColorScheme';
import MainScreen from '../screens/MainScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { BottomTabParamList, TabOneParamList, TabTwoParamList } from '../types';
import styleConstants from "../assets/style-constants";

// import * as notifications from "expo-notifications";
// import * as Permissions from "expo-permissions";

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {

  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: styleConstants.colors.burntOrange,
        inactiveTintColor: styleConstants.fonts.bodyFontColor,
        inactiveBackgroundColor: styleConstants.colors.darkGrey,
        activeBackgroundColor: styleConstants.colors.darkGrey,
        showLabel: false,
        style: {
          backgroundColor: styleConstants.colors.darkGrey
        }
      }} >
      <BottomTab.Screen
        name="Home"
        component={MainScreenNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="md-home" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={SettingsScreenNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-settings" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string }) {
  return <Ionicons size={32} style={{ marginBottom: -3, height: 32 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabOneStack = createStackNavigator<TabOneParamList>();

const MainScreenNavigator = function () {
  return (
    <TabOneStack.Navigator>
      <TabOneStack.Screen
        name="Home"
        component={MainScreen}
        options={{ headerShown: false }}
      />
    </TabOneStack.Navigator>
  );
}

const TabTwoStack = createStackNavigator<TabTwoParamList>();

const SettingsScreenNavigator = function () {
  return (
    <TabTwoStack.Navigator>
      <TabTwoStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
    </TabTwoStack.Navigator>
  );
}
