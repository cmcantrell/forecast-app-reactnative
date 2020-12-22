"use strict";

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import styleConstants from "../../assets/style-constants";

export default function MainLoadingScreen(props){

    let content = props.text;

    return (
        <View style={styles.container}>
            <Text style={styles.text} >{content}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        width:"100%",
        height: "80%",
        justifyContent:"center",
    },
    text: {
        width: "100%",
        fontSize:18,
        fontFamily : styleConstants.fonts.bodyFontFamily,
        color : styleConstants.fonts.bodyFontColor,
        textAlign: "center",
        paddingRight:20,
        paddingLeft:20
    }
});
