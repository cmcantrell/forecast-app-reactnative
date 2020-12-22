"use strict";

import React from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";
import { dataStoreRegionKey, dataStoreWatershedKey, getData } from "../../lib/helper/AsyncHelper";
import { useSelector, useDispatch } from "react-redux";
import { setValidWaterdataRequestSubmitted, setRegion, setWatershed, setLocationSettingsLoaded } from "../../lib/store/actions/waterdata";
import RegionPicker from "./RegionPicker";
import WatershedPicker from "./WatershedPicker";
import styleConstants from "../../assets/style-constants";

export default function MainModal() {

    const dispatch = useDispatch();

    let region = useSelector(state => state.waterdata.region),
        watershed = useSelector(state => state.waterdata.watershed),
        validWaterdataRequestSubmitted = useSelector(state => state.waterdata.validWaterdataRequestSubmitted),
        locationSettingsLoaded = useSelector(state => state.waterdata.locationSettingsLoaded);

    const setDataRequestSubmittedHandler = (val) => {
        if (typeof val !== "boolean") {
            val = false;
        };
        if (region === null || watershed == null) {
            val === false;
        };
        dispatch(setValidWaterdataRequestSubmitted(val));
    };

    let content = <Text style={{ color: "black" }}>Something in MainModal isn't loading</Text>;
    let buttonDisabled = true;
    let buttonStyles = { ...styles.button, ...styles.buttonDisabled };
    if (region != null && watershed != null) {
        console.log("@mainmodal.region/watershed", region, watershed);
        buttonDisabled = false;
        buttonStyles = styles.button;
    }
    if (region == null && watershed == null && locationSettingsLoaded == false) {
        // load location settings on intial app load
        getData(dataStoreRegionKey).then((response) => {
            if (response != null) {
                if (region == null) {
                    region = response;
                    dispatch(setRegion(response));
                }
                getData(dataStoreWatershedKey).then((_response) => {
                    if (_response != null) {
                        if (watershed == null) {
                            watershed = _response;
                            dispatch(setWatershed(_response));
                            if (region !== null && watershed !== null) {
                                dispatch(setLocationSettingsLoaded(true));
                            }
                        }
                    }
                });
            }
        });
    }

    if (validWaterdataRequestSubmitted !== true) {
        content = <View style={styles.modalContainer}>
            <Modal animationType="slide"
                presentationStyle="fullScreen"
                visible={true}
            >
                <View style={{paddingTop:200}}>
                    <RegionPicker selectedValue={region} />
                    <WatershedPicker selectedValue={watershed} />
                    <View styles={styles.button}>
                        <TouchableOpacity
                            style={buttonStyles}
                            onPress={() => {
                                setDataRequestSubmittedHandler(true);
                            }}
                            underlayColor={styleConstants.colors.burntOrange}
                            disabled={buttonDisabled} >
                            <Text style={styles.buttonText}>GET DATA</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{width:"90%",marginLeft:"5%",marginTop:20,fontSize:11,textAlign:"center",color:styleConstants.colors.lightGrey}}>contact, support & FAQ details can be found on the Settings tab. Contact support if you don't see your local waters.</Text>
                </View>
            </Modal>
        </View>
    }

    return (
        <View style={styles.container}>
            {content}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "auto",
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
    },
    modalContainer: {
        width: "100%",
        height: "auto",
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start"
    },
    button: {
        marginRight: 80,
        marginLeft: 80,
        marginTop: 40,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: styleConstants.colors.burntOrange,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: styleConstants.fonts.bodyFontColor
    },
    buttonDisabled: styleConstants.buttons.disabled,
    buttonText: {
        color: styleConstants.fonts.bodyFontColor,
        textAlign: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        fontFamily: styleConstants.headerFontFamily,
        fontSize: 18
    }
});
