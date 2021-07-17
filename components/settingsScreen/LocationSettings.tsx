"use strict";

import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Picker } from '@react-native-picker/picker';
import Collapsible from 'react-native-collapsible';
import { Ionicons } from '@expo/vector-icons';
import Spinner from 'react-native-loading-spinner-overlay';
import { dataStoreRegionKey, dataStoreWatershedKey, setData, getData } from "../../lib/helper/AsyncHelper";
import { getRegionSource, getWatershedSource } from "../../lib/helper/Helper";
import Waterdata from "../../lib/datasource/waterdata.json";
import styleConstants from "../../assets/style-constants.json";

class LocationSettings extends React.Component<{}, { selectedRegion: any, savedRegion: any, selectedWatershed: any, savedWatershed: any, isCollapsed: boolean, transactionInProgress: boolean }> {
    constructor(props: {}) {
        super(props);
        this.state = {
            selectedRegion: null,
            savedRegion: null,
            selectedWatershed: null,
            savedWatershed: null,
            isCollapsed: true,
            transactionInProgress: false
        }
        this._componentWillMount();
    }

    _componentWillMount() {
        getData(dataStoreRegionKey).then((regionResponse: any) => {
            if (regionResponse != null) {
                if (this.state.selectedRegion == null) {
                    this.setSelectedRegion(regionResponse);
                }
                getData(dataStoreWatershedKey).then((watershedResponse) => {
                    if (watershedResponse != null) {
                        if (this.state.selectedWatershed == null) {
                            this.setSelectedWatershed(watershedResponse);
                        }
                    }
                });
            }
        });
    }

    /**
     * picker data functions
     * @params val string | null
     */
    setSelectedRegion(val: string | null) {
        if(val == "no selection"){
            val = null;
        }
        return this.setState({ selectedRegion: val });
    }

    /**
     * @params val string | null
     */
    setSelectedWatershed(val: string | null) {
        if(val == "no selection"){
            val = null;
        }
        return this.setState({ selectedWatershed: val });
    }

    getRegionPickerItems() {
        let regionSource = getRegionSource(Waterdata.region);
        return this._getPickerItems(regionSource);
    }

    getWatershedPickerItems() {
        let regionSource = getWatershedSource(Waterdata.region, this.state.selectedRegion);
        return this._getPickerItems(regionSource);
    }

    _getPickerItems(source: any) {
        let items = source.map((sourceItem: { label: string; value: string; }, i: React.Key) => {
                return <Picker.Item label={sourceItem.label} value={sourceItem.value} key={i} color={styleConstants.fonts.bodyFontColor} />
        });
        return items;
    }

    setIsCollapsedHandler(val: boolean) {
        if (typeof val !== "boolean") {
            val = false;
        }
        this.setState({ isCollapsed: val });
    }

    toggleStatusIndicator(status = false) {
        switch (status) {
            case true:
                this.setState({ transactionInProgress: true });
                break;
            case false:
            default:
                this.setState({ transactionInProgress: false });
                break;
        }
    }

    saveSettings() {
        this.toggleStatusIndicator(true);
        let region = setData(dataStoreRegionKey, this.state.selectedRegion);
        region.then((res) => {
            if (res == true) {
                let watershed = setData(dataStoreWatershedKey, this.state.selectedWatershed);
                watershed.then((_res) => {
                    if (_res == true) {
                        setTimeout(() => {
                            this.toggleStatusIndicator(false);
                        }, 1000);
                    }
                });
            }
        });
    }

    resetSettings() {
        return this.saveSettings();
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
                <Spinner
                    visible={this.state.transactionInProgress}
                    textContent={'saving...'}
                    textStyle={styles.spinnerTextStyle}
                    overlayColor="rgba(0,0,0,0.67)"
                />
                <View style={styles.settingGroupHeader}>
                    <Text style={styles.settingGroupHeaderTitle}>Set your default location.</Text>
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
                    <Text style={styles.settingGroupHeaderNote}>Select State & Watershed to preload the app location, or leave the watershed blank to just select a State. Leave both blank to start with a clean slate each time you open the app. Update your settings & click the Save location Settings button below.</Text>
                    <View>
                        <Text style={styles.subtitle}>Set your default Home Region</Text>
                        <Text style={styles.settingGroupHeaderNote}>Selecting a default State will auto-select that region, when the app loads.</Text>
                        <Picker
                            selectedValue={this.state.selectedRegion}
                            style={{ height: 160 }}
                            itemStyle={{ height: 120 }}
                            onValueChange={(val, i) => {
                                this.setSelectedRegion(val);
                            }}
                        >
                            <Picker.Item label="-- select a region --" value={"no selection"} color={"white"} />
                            {this.getRegionPickerItems()}
                        </Picker>
                    </View>
                    <View>
                        <Text style={styles.subtitle}>Set your default Home Watershed</Text>
                        <Text style={styles.settingGroupHeaderNote}>Select a watershed to auto-load the app, or leave blank.  Leaving blank with a State set, will auto-load all state data.</Text>
                        <Picker
                            selectedValue={this.state.selectedWatershed}
                            style={{ height: 160 }}
                            itemStyle={{ height: 120 }}
                            onValueChange={(val, i) => {
                                this.setSelectedWatershed(val);
                            }}
                        >
                            <Picker.Item label="-- select a watershed --" value={"no selection"} color={"white"} />
                            {this.getWatershedPickerItems()}
                        </Picker>
                    </View>
                    <View>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                this.saveSettings();
                            }}
                        >
                            <Text style={styles.buttonText}>Save Location Settings</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity
                            style={styles.buttonDanger}
                            onPress={() => {
                                setData(dataStoreRegionKey, null);
                                setData(dataStoreWatershedKey, null);
                                this.setSelectedRegion(null);
                                this.setSelectedWatershed(null);
                            }}
                        >
                            <Text style={styles.buttonText}>Reset Location Settings</Text>
                        </TouchableOpacity>
                    </View>
                </Collapsible>
            </View>
        )
    }
}
export default LocationSettings;

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
        marginTop: 10,
        marginBottom: 20,
        fontStyle: "italic",
        lineHeight: 18,
        marginLeft: 10,
        marginRight: 10,
    },
    subtitle: {
        color: styleConstants.fonts.bodyFontColor,
        fontSize: 16,
        fontWeight: 'bold',
    },
    button: {
        width: "100%",
        alignSelf: 'stretch',
        marginTop: 10,
        marginBottom: 10,
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
        fontFamily: styleConstants.fonts.headerFontFamily,
        fontSize: 20
    },
    spinnerTextStyle: {
        color: '#FFF'
    }
});