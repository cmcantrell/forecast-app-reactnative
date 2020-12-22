import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import waterdataReducer from "./lib/store/reducers/waterdata";

const appReducer = combineReducers({
  waterdata: waterdataReducer
});
const store = createStore(appReducer);

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Provider store={store}>
          <Navigation colorScheme={colorScheme} />
          <StatusBar style="light" />
        </Provider>
      </SafeAreaProvider>
    );
  }
}
