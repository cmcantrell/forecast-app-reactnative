"use strict";

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../lib/store/reducers/rootReducer";
import { setValidWaterdataRequestSubmitted } from "../../lib/store/actions/waterdata";

import styleConstants from "../../assets/style-constants.json";

export default function Header() {

    const dispatch = useDispatch();

    let region = useSelector((state: RootState) => state.waterdata.region),
        watershed = useSelector((state: RootState) => state.waterdata.watershed),
        dataRequestSubmitted = useSelector((state: RootState) => state.waterdata.validWaterdataRequestSubmitted);

    let iconColor = styleConstants.waterdataCards.colors.yellow;
    let content = "";

    if (region != null && watershed != null) {
        if (typeof region == "string" && typeof watershed == "string") {
            content = region.toUpperCase() + " | " + watershed.toUpperCase();
        }
    }
    if (dataRequestSubmitted != true) {
        return (<View style={styles.container}></View>);
    } else {
        return (
            <View style={styles.container}>
                <Text style={styles.header} ellipsizeMode="middle" numberOfLines={2}>{content}</Text>
                <Ionicons
                    // name="ios-refresh" 
                    name="ios-backspace-outline"
                    // name="md-backspace-outline"  
                    size={42}
                    style={styles.icon}
                    color={iconColor}
                    onPress={() => {
                        dispatch(setValidWaterdataRequestSubmitted(false));
                    }} />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        width: "100%",
        paddingLeft: 10,
        paddingRight: 10,
        height: "15%",
        paddingTop: 45,
        alignItems: "flex-start",
        borderBottomWidth: 1,
        borderBottomColor: styleConstants.borders.borderColor
    },
    header: {
        fontSize: 21,
        fontFamily: styleConstants.fonts.headerFontFamily,
        color: styleConstants.fonts.bodyFontColor,
        alignSelf: "center",
        width: "90%"
    },
    icon: {
        alignSelf: "center",
        textAlign: "right"
    }
});
