"use strict";

import React, { Component } from "react";
import { StyleSheet, Text, View, Linking } from "react-native";
import Collapsible from 'react-native-collapsible';
import { Ionicons } from '@expo/vector-icons';
import styleConstants from "../../assets/style-constants";

class InfoSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCollapsed: true
        }
        this._componentWillMount();
    }

    _componentWillMount() {

    }

    componentWillUnmount() {
        // console.log("LocationSettings.componentWillUnmount()");
    }

    setIsCollapsedHandler(val) {
        if (typeof val !== "boolean") {
            val = false;
        }
        this.setState({ isCollapsed: val });
    }

    render() {
        /**
         * display variables
         */
        let collapsabelIconColor = styleConstants.fonts.bodyFontColor;
        if (!this.state.isCollapsed) {
            collapsabelIconColor = styleConstants.colors.medGrey;
        }
        return (
            <View style={styles.settingGroup}>
                <View style={styles.settingGroupHeader}>
                    <Text style={styles.settingGroupHeaderTitle}>Info & FAQ</Text>
                    <Ionicons
                        style={{ width: "10%", marginTop: -6 }}
                        name="add"
                        size={32}
                        color={collapsabelIconColor}
                        onPress={() => {
                            let _isCollapsed;
                            if (this.state.isCollapsed == true) {
                                _isCollapsed = false;
                            } else {
                                _isCollapsed = true;
                            }
                            this.setIsCollapsedHandler(_isCollapsed);
                        }}
                    />
                </View>
                <Collapsible collapsed={this.state.isCollapsed}>
                    <Text style={styles.settingGroupHeaderNote}>For support, contact support@forecastflyfishing.com.{"\n"} You can also find more info at <Text style={{color: styleConstants.colors.burntOrange}} onPress={() => Linking.openURL('https://www.forecastflyfishing.com')}>ForecastFlyFishing.com</Text></Text>
                    <View>
                        <Text style={styles.subtitle}>Waterdata Terminology</Text>
                        <Text style={styles.settingGroupHeaderNote}>Water data is pulled from USGS & other State level resources. Below are some of the common status codes returned.</Text>
                        <Text style={styles.subtitle}>ft3/s - Cubic Feet per Second</Text>
                        <Text style={styles.settingGroupHeaderNote}>Used in guaging moving water: cubic feet of water flowing past a guaging point.</Text>
                        <Text style={styles.subtitle}>acft - Acre Feet</Text>
                        <Text style={styles.settingGroupHeaderNote}>Used in guaging impounded water: surface area of one acre, 1 foot deep.</Text>
                        <Text style={styles.subtitle}>Ssn - Seasonal</Text>
                        <Text style={styles.settingGroupHeaderNote}>These are seasonally operated guages, currently in the off-season.</Text>
                        <Text style={styles.subtitle}>Bkw - Backwater</Text>
                        <Text style={styles.settingGroupHeaderNote}>Slow to non-moving water due to downstream ice conditions or blockage.</Text>
                        <Text style={styles.subtitle}>Ice - Ice Affected</Text>
                        <Text style={styles.settingGroupHeaderNote}>The guage is operational, but currently iced over.</Text>
                        <Text style={styles.subtitle}>Eqp - Technical Malfunction</Text>
                        <Text style={styles.settingGroupHeaderNote}>Equiptment malfunction has disrupted reading.</Text>
                    </View>
                </Collapsible>
            </View>
        );
    }

}
export default InfoSettings;

const styles = StyleSheet.create({
    settingGroup: {
        width: "90%",
        borderBottomWidth: 1,
        borderBottomColor: "white",
        paddingBottom: 20,
        marginBottom: 20
    },
    settingGroupHeader: {
        flexDirection: "row"
    },
    settingGroupHeaderTitle: {
        width: "90%",
        fontFamily: styleConstants.fonts.headerFontFamily,
        color: styleConstants.fonts.bodyFontColor,
        fontSize: 21,
        fontWeight: 'bold'
    },
    settingGroupHeaderNote: {
        fontFamily: styleConstants.fonts.bodyFontFamily,
        color: styleConstants.fonts.noteFontColor,
        fontSize: 12,
        marginTop: 0,
        marginBottom: 20,
        fontStyle: "italic",
        lineHeight: 18,
        marginLeft: 10,
        marginRight: 10,
    },
    subtitle: {
        color: styleConstants.fonts.bodyFontColor,
        fontSize: 16,
        marginBottom:10,
        fontWeight: 'bold',
    },
    button: {
        width: "100%",
        alignSelf: 'stretch',
        marginTop: 10,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: styleConstants.colors.burntOrange,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: styleConstants.fonts.bodyFontColor
    },
    buttonDanger: {
        width: "100%",
        alignSelf: 'stretch',
        marginTop: 10,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: styleConstants.colors.dangerRed,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: styleConstants.fonts.bodyFontColor
    },
    buttonText: {
        width: "100%",
        color: styleConstants.fonts.bodyFontColor,
        textAlign: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        fontFamily: styleConstants.headerFontFamily,
        fontSize: 20
    }
});