"use strict";

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import LocationSettings from "./LocationSettings";
import InfoSettings from "./InfoSettings";
import PushNotificationSettings from "./PushNotificationSettings";
import styleConstants from "../../assets/style-constants";

export default function MainSettings() {

    return (
        <View style={styles.container}>
            <View style={styles.screenTitleView}>
                <Text style={styles.screenTitle}>Settings</Text>
            </View>
            <LocationSettings />
            <InfoSettings />
            <PushNotificationSettings />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        paddingTop:80,
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