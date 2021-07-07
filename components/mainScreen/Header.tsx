"use strict";

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from "react-redux";
import { setValidWaterdataRequestSubmitted } from "../../lib/store/actions/waterdata";
import styleConstants from "../../assets/style-constants";

export default function Header(){

    const dispatch = useDispatch();

    let region = useSelector(state => state.waterdata.region),
        watershed = useSelector(state => state.waterdata.watershed);

    let iconColor = styleConstants.waterdataCards.colors.yellow;
    let content = "Select a Region";

    if (region != null && watershed != null) {
        if(typeof region == "string" && typeof watershed == "string"){
            content = region.toUpperCase() + " | " + watershed.toUpperCase();
        }
    }
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
