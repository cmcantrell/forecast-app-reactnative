"use strict";

import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, Linking } from "react-native";
import { dataStoreRegionKey, dataStoreWatershedKey, getData } from "../../lib/helper/AsyncHelper";

import { useSelector, useDispatch } from "react-redux";
import { setValidWaterdataRequestSubmitted, setRegion, setWatershed, setLocationSettingsLoaded } from "../../lib/store/actions/waterdata";
import { RootState } from "../../lib/store/reducers/rootReducer";

import RegionPicker from "./RegionPicker";
import WatershedPicker from "./WatershedPicker";
import styleConstants from "../../assets/style-constants.json";

export default function MainModal() {

    const dispatch = useDispatch();

    let region = useSelector((state: RootState) => state.waterdata.region),
        watershed = useSelector((state: RootState) => state.waterdata.watershed),
        locationSettingsLoaded = useSelector((state: RootState) => state.waterdata.locationSettingsLoaded);

    let buttonDisabled = true;
    let buttonStyles = { ...styles.button, ...styles.buttonDisabled };
    if (region != null && watershed != null) {
        buttonDisabled = false;
        buttonStyles = styles.button;
    }

    if (region == null && watershed == null && locationSettingsLoaded == false) {
        // load saved location settings on intial app load
        getData(dataStoreRegionKey).then((regionResponse: any) => {
            if (regionResponse != null) {
                if (region == null) {
                    region = regionResponse;
                    dispatch(setRegion(regionResponse));
                }
                getData(dataStoreWatershedKey).then((watershedResponse: any) => {
                    if (watershedResponse != null) {
                        if (watershed == null) {
                            watershed = watershedResponse;
                            dispatch(setWatershed(watershedResponse));
                            if (region !== null && watershed !== null) {
                                dispatch(setLocationSettingsLoaded(true));
                            }
                        }
                    }
                });
            }
        });
    }

    return (
        <View style={styles.container}>
            <View>
                <View style={{ paddingTop: "50%" }}>
                    <RegionPicker selectedValue={region} />
                    <WatershedPicker selectedValue={watershed} />
                    <View style={{ marginLeft: 10, marginRight: 10 }}>
                        <TouchableOpacity
                            style={buttonStyles}
                            onPress={() => {
                                if (region != null && watershed != null) {
                                    dispatch(setValidWaterdataRequestSubmitted(true));
                                }
                            }}
                            disabled={buttonDisabled} >
                            <Text style={styles.buttonText}>GET DATA</Text>
                        </TouchableOpacity>
                        <Text style={{ marginTop: 20, fontSize: 11, textAlign: "center", color: styleConstants.colors.lightGrey }}>contact, support & FAQ details can be found on the Settings tab. Contact support if you don't see your local waters.</Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity
                onPress={() => {
                    Linking.openURL("https://www.forecastflyfishing.com");
                }}>
                <Image
                    style={{ height: 60, resizeMode: "contain", marginTop: 60, opacity: 0.67 }}
                    source={require('../../assets/images/icon-display-black.png')}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "#fff"
    },
    button: {
        marginTop: 40,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: styleConstants.colors.burntOrange,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: styleConstants.fonts.bodyFontColor,
        opacity: 1
    },
    buttonDisabled: styleConstants.buttons.disabled,
    buttonText: {
        color: styleConstants.fonts.bodyFontColor,
        textAlign: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        fontFamily: styleConstants.fonts.headerFontFamily,
        fontSize: 18
    }
});
