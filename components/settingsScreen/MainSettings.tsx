import * as React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Linking } from "react-native";

import styleConstants from "../../assets/style-constants.json";

import InfoSettings from "./InfoSettings";
import LocationSettings from "./LocationSettings";

export default function MainSettings() {
  return (
    <View style={styles.container}>
      <View style={styles.screenTitleView}>
        <Text style={styles.screenTitle}>Settings</Text>
      </View>
      <LocationSettings />
      <InfoSettings />
      <TouchableOpacity
        onPress={() => {
          Linking.openURL("https://www.forecastflyfishing.com");
        }}>
        <Image
          style={{ height: 60, resizeMode: "contain", marginTop: 40, opacity: 0.67 }}
          source={require('../../assets/images/icon-display.png')}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    paddingTop: 80,
    flexDirection: "column",
    backgroundColor: styleConstants.colors.darkGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitleView: {
    width: "90%",
    marginBottom: 20,
    borderBottomColor: "white",
    borderBottomWidth: 1
  },
  screenTitle: {
    marginBottom: 20,
    borderBottomColor: "white",
    borderBottomWidth: 1,
    color: "white",
    fontSize: 24,
    fontWeight: 'bold',
  }
});
