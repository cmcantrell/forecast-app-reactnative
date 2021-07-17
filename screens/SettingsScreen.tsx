import * as React from 'react';
import { ScrollView } from 'react-native';

import MainSettings from "../components/settingsScreen/MainSettings";
import styleConstants from "../assets/style-constants.json";

export default function SeetingsScreen() {
  return (
    <ScrollView style={{backgroundColor:styleConstants.colors.darkGrey}}>
      <MainSettings />
    </ScrollView>
  );
}
