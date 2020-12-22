import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';

export default function useCachedResources() {
  
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();
        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          // 'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
          "pt-sans": require("../assets/fonts/PTSansCaption-Bold.ttf"),
          "work-sans": require("../assets/fonts/WorkSans-Black.ttf")
        });

        // @debug begin moving JSON data to external source 12-2020
        // try {
        //   let response = await fetch('https://reactnative.dev/movies.json');
        //   let json = await response.json();
        //   console.log("we got the JSON");
        //   // now what? the best way to store this data?
        // } catch (error) {
        //   console.log("@hooks.useCachedResources.tsx", "error: " + error);
        // } finally {
        // }


      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.log("@hooks.useCachedResources.tsx", "error: " + e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
        console.log("endcached");
      }
    }
    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
