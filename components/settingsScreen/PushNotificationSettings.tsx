import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Collapsible from 'react-native-collapsible';
import { Ionicons } from '@expo/vector-icons';
import Spinner from 'react-native-loading-spinner-overlay';

import styleConstants from "../../assets/style-constants";

class PushNotificationSettings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isCollapsed: true,
            transactionInProgress: false
        }
        this._componentWillMount();
    }

    _componentWillMount() {

    }

    toggleStatuesIndicator(status = false) {

        switch (status) {
            case true:
                console.log("muthafuckas on")
                this.setState({ transactionInProgress: true });
                break;
            case false:
            default:
                console.log("muthafuckas off")
                this.setState({ transactionInProgress: false });
                break;
        }


    }

    setIsCollapsedHandler(val) {
        if (typeof val !== "boolean") {
            val = false;
        }
        this.setState({ isCollapsed: val });
    }

    addInst(){
        console.log("the conjoined inst bitch");
        let inst = {
            region : null,
            watershed : null,
            condition : null,
            variable : null
        };
        return(<View><Text style={{color:"#fff"}}>This is a new inst</Text></View>);
    }

    getAllInsts(){
        return (
            <View><Text style={{color:"#fff"}}>This is all insts</Text></View>
        );
    }

    getInst(){
        return(
            <View><Text style={{color:"#fff"}}>This is an inst</Text></View>
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