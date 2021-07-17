"use strict";

import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { useSelector, useDispatch } from "react-redux";
import {RootState} from "../lib/store/reducers/rootReducer";

import Header from "../components/mainScreen/Header";
import MainLoadingScreen from "../components/mainScreen/MainLoadingScreen";
import MainModal from "../components/mainScreen/MainModal";
import WaterdataComponent from '../components/mainScreen/WaterdataComponent';

import styleConstants from "../assets/style-constants.json";

export default function MainScreen() {

  const dispatch = useDispatch();

  let region = useSelector((state:RootState) => state.waterdata.region),
    watershed = useSelector((state:RootState) => state.waterdata.watershed),
    dataRequestSubmitted = useSelector((state:RootState) => state.waterdata.validWaterdataRequestSubmitted);
  /**
  * @returns bool
  */
  const dataRequestIsValid = () => {
    if (region ===  null || watershed === null || dataRequestSubmitted != true) {
      return false;
    }
    return true;
  };

  let content = <MainLoadingScreen text="Select Your Location" />
  let dataRequestStatus = dataRequestIsValid();
  if (dataRequestStatus == false) {
    content = <MainModal />
  } else if (dataRequestStatus == true) {
    content = <WaterdataComponent />
  }

  return (
    <View style={styles.container}>
      <Header />
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    flexDirection: "column",
    backgroundColor: styleConstants.colors.darkGrey
  }
});
