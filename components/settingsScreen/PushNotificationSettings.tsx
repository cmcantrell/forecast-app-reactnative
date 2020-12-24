"use strict";

import React, { Component } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import Collapsible from 'react-native-collapsible';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import Spinner from 'react-native-loading-spinner-overlay';
import { getRegionSource, getWatershedSource, getSitesSource } from "../../lib/helper/Helper";
import { dataStorePushNotificationsKey, setData, getData } from "../../lib/helper/AsyncHelper";
import Waterdata from "../../lib/datasource/waterdata";
import styleConstants from "../../assets/style-constants";

class PushNotificationSettings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isCollapsed: true,
            transactionInProgress: false,
            pushNotifications: []
        }
        this._componentWillMount();
    }

    _componentWillMount() {
        getData(dataStorePushNotificationsKey).then((response) => {
            if (response != null) {
                let pushNotifications = JSON.parse(response);
                if (pushNotifications != false && pushNotifications.constructor.name == "Array") {
                    // console.log("@_componentWillmount.pushNotificatons: ", pushNotifications);
                    this.setState({ pushNotifications: pushNotifications });
                }
            }
        });
    }

    toggleStatuesIndicator(status = false) {
        // console.log("@toggleStateusIndicator");
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

    getRegionPickerItems() {
        let regionSource = getRegionSource(Waterdata.region);
        return this._getPickerItems(regionSource);
    }

    getWatershedPickerItems(region = null) {
        if (region == null) {
            return;
        }
        let regionSource = getWatershedSource(Waterdata.region, region);
        return this._getPickerItems(regionSource);
    }

    getSitesSourceItems(region, watershed = null) {
        if (region == null || watershed == null) {
            return;
        }
        let sitesSource = getSitesSource(Waterdata.region[region], watershed);
        return this._getPickerItems(sitesSource);
    }

    _getPickerItems(source) {
        let items = source.map((sourceItem, i) => {
            return <Picker.Item label={sourceItem.label} value={sourceItem.value} key={i} color={styleConstants.fonts.bodyFontColor} />
        });
        return items;
    }

    setIsCollapsedHandler(val) {
        // console.log("@setIsCollapsedHandler");
        if (typeof val !== "boolean") {
            val = false;
        }
        this.setState({ isCollapsed: val });
    }

    addInst() {
        // console.log("@addInst");
        if (this.state.pushNotifications.constructor.name == "Array") {
            this.toggleStatuesIndicator(true);
            let notificationsData = this.state.pushNotifications;
            let currentKeys = notificationsData.map((inst) => {
                return inst.key;
            });
            let newKey = 0;
            if(currentKeys.length > 0){
                newKey = (Math.max(...currentKeys) + 1);
            }
            let newNotification = {
                key: newKey,
                region: null,
                watershed: null,
                site: null,
                condition: null,
                value: null,
                repeat: null,
                limit: null,
                lastSent: null
            }
            notificationsData.push(newNotification);
            setTimeout(() => {
                this.toggleStatuesIndicator(false);
                this.setState({ pushNotifications: notificationsData });
            }, 1000);
        }
    }

    getAllInsts() {
        // console.log("@getAllInsts");
        if (this.state.pushNotifications.constructor.name == "Array") {
            let notificationsData = this.state.pushNotifications;
            let rows = notificationsData.map((inst, i) => {
                return this.getInst(inst, inst.key);
            });
            return rows;
        }
    }

    updateInst(data, changedData) {
        // console.log("@updateInst.notifications^", this.state.pushNotifications);
        let allNotifications = this.state.pushNotifications,
            key = data.key,
            notification = allNotifications.find((inst) => {
                return inst.key == key;
            });
        if (typeof changedData == "object") {
            for (let prop in changedData) {
                if (changedData.hasOwnProperty(prop)) {
                    if (notification.hasOwnProperty(prop)) {
                        notification[prop] = changedData[prop];
                    }
                }
            }
        }
        allNotifications.splice(allNotifications.indexOf(notification),1,notification);
        this.setState({ pushNotifications: allNotifications });
    }

    saveInsts(data = null) {
        // console.log("@saveInst");
        let pushNotifications = this.state.pushNotifications;
        if (data != null && data.constructor.name == "array") {
            pushNotifications = data;
        }
        this.toggleStatuesIndicator(true);
        setData(dataStorePushNotificationsKey, JSON.stringify(pushNotifications)).then((response) => {
            setTimeout(() => {
                this.toggleStatuesIndicator(false);
                this.setState({ pushNotifications: pushNotifications });
            }, 1000);
        });
    }

    deleteInst(key) {
        // console.log("@deleteInst",key);
        Alert.alert(
            "Are You Sure?",
            "You about to remove this notification, remove?",
            [{
                text: "No",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
            }, {
                text: "Remove", onPress: () => {
                    let pushNotifications = this.state.pushNotifications;
                    let notification = pushNotifications.find((_notification)=>{
                        return _notification.key == key;
                    });
                    let index = pushNotifications.indexOf(notification);
                    if (pushNotifications[index] != undefined) {
                        this.toggleStatuesIndicator(true);
                        pushNotifications.splice(index, 1);
                        this.saveInsts(pushNotifications);
                    }
                }
            }],
            { cancelable: false }
        );


    }

    getInst(data, key) {
        // console.log("@getInst");
        let inStateInst = this.state.pushNotifications.find((inst) => {
            return inst.key == key;
        });
        if (typeof inStateInst != "object") {
            return;
        }
        return (
            <View className="pushnotification-inst-container" key={key}>
                <Text style={{ color: "#fff" }}>This is an inst {data.key}</Text>

                <Picker
                    selectedValue={inStateInst.region || null}
                    style={{ height: 120 }}
                    itemStyle={{ height: 120 }}
                    onValueChange={(val, i) => {
                        this.updateInst(data, { region: val });
                    }}
                >
                    <Picker.Item label="-- select a region --" value={null} color={"white"} />
                    {this.getRegionPickerItems()}
                </Picker>

                <Picker
                    selectedValue={inStateInst.watershed || null}
                    style={{ height: 120 }}
                    itemStyle={{ height: 120 }}
                    onValueChange={(val, i) => {
                        this.updateInst(data, { watershed: val });
                    }}
                >
                    <Picker.Item label="-- select a watershed --" value={null} color={"white"} />
                    {this.getWatershedPickerItems(inStateInst.region)}
                </Picker>

                <Picker
                    selectedValue={inStateInst.site || null}
                    style={{ height: 120 }}
                    itemStyle={{ height: 120 }}
                    onValueChange={(val, i) => {
                        this.updateInst(data, { site: val });
                    }}
                >
                    <Picker.Item label="-- select a site --" value={null} color={"#fff"} />
                    {this.getSitesSourceItems(inStateInst.region, inStateInst.watershed)}
                </Picker>

                <Picker
                    selectedValue={inStateInst.condition || null}
                    style={{ height: 120 }}
                    itemStyle={{ height: 120 }}
                    onValueChange={(val, i) => {
                        this.updateInst(data, { condition: val });
                    }}
                >
                    <Picker.Item label="-- select a condition --" value={null} color={"#fff"} />
                    <Picker.Item label="equal to" value={"="} color={"#fff"} />
                    <Picker.Item label="greater than" value={">"} color={"#fff"} />
                    <Picker.Item label="less than" value={"<"} color={"#fff"} />
                </Picker>

                <TextInput
                    style={{
                        height: 42,
                        borderColor: styleConstants.colors.medGrey,
                        borderWidth: 1,
                        color: "#fff",
                        textAlign: "center"
                    }}
                    onChangeText={
                        (val) => {
                            this.updateInst(data, { value: val });
                        }
                    }
                    value={inStateInst.value}
                ></TextInput>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        this.saveInsts();
                    }}
                    underlayColor={styleConstants.colors.burntOrange} >
                    <Text style={styles.buttonText}>Save Notification</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttonDanger}
                    onPress={() => {
                        this.deleteInst(data.key);
                    }}
                    underlayColor={styleConstants.colors.dangerRed} >
                    <Text style={styles.buttonText}>Delete Notification</Text>
                </TouchableOpacity>
            </View>
        );
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
                    <Text style={styles.settingGroupHeaderTitle}>Push Notifications</Text>
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
                    <Text style={styles.settingGroupHeaderNote}>Set variable based push notifications{"\n"}</Text>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={styles.addInstText}
                            onPress={() => {
                                this.addInst();
                            }}
                        >Add a notifcation</Text>
                        <Ionicons
                            style={{ width: "10%", marginTop: -1 }}
                            name="add"
                            size={26}
                            color="#fff"
                            onPress={() => {
                                this.addInst();
                            }}
                        />
                    </View>
                    <View>
                        {this.getAllInsts()}
                    </View>
                </Collapsible>
            </View>
        );
    }

}
export default PushNotificationSettings;

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
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
    addInstText: {
        fontSize: 21,
        color: "#FFF"
    }
});