"use strict";

import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform, Linking } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useSelector } from "react-redux";
import Collapsible from 'react-native-collapsible';
import styleConstants from "../../assets/style-constants";
import { Ionicons } from '@expo/vector-icons';
import { parseRequestParamsToString, parseWaterDataResponse } from "../../lib/helper/ApiHelper";
import { LineChart } from "react-native-chart-kit";


const WaterdataCard = (props) => {
    const requestWaterdata = useSelector(state => state.waterdata.requestWaterdata[props.inst]) || {};
    const [responseData, setResponseData] = useState({});

    const name = requestWaterdata.name || "",
        apiData = requestWaterdata.service || {};

    let collapsabelIconColor = styleConstants.colors.burntOrange;

    const navigation = useNavigation();

    const apiRequest = () => {
        const time = Date.now();
        if (Object.entries(responseData).length < 1) {
            if (apiData.method == "get") {
                let paramsString = parseRequestParamsToString(apiData.params);
                return fetch(`${apiData.url}${paramsString}`, {
                    method: `${apiData.method.toUpperCase()}`
                }).then((response) => {
                    response.json().then((j) => {
                        let parsedData = parseWaterDataResponse(apiData, j),
                            responseData = {
                                currentMeasurementValue: null,
                                currentMeasurementType: null,
                                mapPoints: {},
                                _72HrPercentageChange: null,
                                percentageOfCapacity: null,
                                capacity: null,
                                geoLocation: null
                            },
                            currentData = null;
                        if (typeof parsedData.map != "function") {
                            return setResponseData(responseData);
                        }
                        //console.log("parsedData",parsedData);
                        parsedData.map((d) => {
                            // get current timesSeries
                            if (Object.keys(d)[0] == "_0hr") {
                                currentData = (d[Object.keys(d)[0]]);
                                // console.log("currentData",currentData);
                                responseData.currentMeasurementValue = currentData.measurementValue;
                                responseData.currentMeasurementType = currentData.measurementType;
                                if (responseData.currentMeasurementType == "acft" || responseData.currentMeasurementType == "ac-ft") {
                                    responseData.capacity = currentData.capacity || null;
                                    responseData.percentageOfCapacity = currentData.percentageOfCapacity || null;
                                }
                                if(currentData.geoLocation != undefined){
                                    responseData.geoLocation = currentData.geoLocation;
                                }
                            }
                            if (Object.keys(d)[0] == "mapPoints") {
                                responseData.mapPoints = (d[Object.keys(d)[0]]);
                            }
                            if (Object.keys(d)[0] == "_72HrPercentageChange") {
                                responseData._72HrPercentageChange = (d[Object.keys(d)[0]]);
                            }
                        });
                        setResponseData(responseData);
                    }).catch((err) => {
                        setResponseData({ error: err, request: apiData });
                        console.log("ERROR1", err, apiData);
                    });
                }).catch((err) => {
                    setResponseData({ error: err, request: apiData });
                    console.log("ERROR2", err, apiData);
                });
            }
        }
    };
    apiRequest();

    const renderMeasurementData = () => {
        if (responseData.currentMeasurementValue != undefined) {
            if (typeof responseData.currentMeasurementValue == "string") {
                return <View><Text style={styles.currentMeasurementValue}>{responseData.currentMeasurementValue}</Text></View>
            } else if (typeof responseData.currentMeasurementValue == "number") {
                if (responseData.currentMeasurementValue > 9999) {
                    responseData.currentMeasurementValue = `${((responseData.currentMeasurementValue / 1000).toFixed(1))}`;
                }
                let measurementType = responseData.currentMeasurementType;
                if (measurementType == "acft") {
                    measurementType = "Kacft";
                }
                return <View style={styles.currentMeasurementContainer}>
                    <Text style={styles.currentMeasurementValue}>{responseData.currentMeasurementValue}</Text>
                    <Text style={styles.currentMeasurementType}>{measurementType}</Text>
                </View>
            }
        } else {
            return (
                <View style={styles.currentMeasurementContainer}>
                    <Text style={styles.currentMeasurementValue}>NR</Text>
                </View>
            );
        }
    };

    const renderChangeData = () => {
        if (!isNaN(responseData._72HrPercentageChange) && responseData._72HrPercentageChange !== null) {
            if ((responseData.currentMeasurementType == "acft" || responseData.currentMeasurementType == "ac-ft") && responseData.percentageOfCapacity != null) {
                let iconColor = getIconColor(responseData.percentageOfCapacity);
                return (
                    <View style={styles.percentChangeContainer}>
                        <View style={styles.percentTextContainer}><Text style={{ ...styles.percentIconText, ...{ color: iconColor } }}>+/-</Text><Text style={styles.percentText}>{responseData.percentageOfCapacity}%</Text></View>
                    </View>)
            } else {
                let iconColor = getIconColor(responseData._72HrPercentageChange);
                return (
                    <View style={styles.percentChangeContainer}>
                        <View style={styles.percentTextContainer}><Text style={{ ...styles.percentIconText, ...{ color: iconColor } }}>+/-</Text><Text style={styles.percentText}>{responseData._72HrPercentageChange}%72hrs.</Text></View>
                    </View>);
            }
        } else if (responseData.currentMeasurementValue == undefined) {
            return (
                <View style={styles.percentChangeContainer}>
                    <View style={styles.percentTextContainer}><Text style={{ ...styles.percentText, ...styles.noReadingText }}>no read</Text></View>
                </View>
            );
        } else if (responseData.currentMeasurementValue == "Ssn") {
            return (
                <View style={styles.percentChangeContainer}>
                    <View style={styles.percentTextContainer}><Text style={{ ...styles.percentText, ...styles.noReadingText }}>Seasonal</Text></View>
                </View>
            );
        } else if (responseData.currentMeasurementValue == "Bkw") {
            return (
                <View style={styles.percentChangeContainer}>
                    <View style={styles.percentTextContainer}><Text style={{ ...styles.percentText, ...styles.noReadingText }}>Backwater</Text></View>
                </View>
            );
        }
    };

    const getIconColor = (intVal) => {
        intVal = Math.abs(intVal);
        if (isStorageValue()) {
            if (intVal > 90) {
                return styleConstants.waterdataCards.colors.green;
            } else if (intVal <= 90 && intVal > 79) {
                return styleConstants.waterdataCards.colors.lightGreen;
            } else if (intVal <= 79 && intVal > 70) {
                return styleConstants.waterdataCards.colors.yellow;
            } else if (intVal <= 70 && intVal > 60) {
                return styleConstants.waterdataCards.colors.burntOrange;
            } else if (intVal <= 60) {
                return styleConstants.waterdataCards.colors.red;
            }
        } else {
            if (intVal < 10) {
                return styleConstants.waterdataCards.colors.green;
            } else if (intVal >= 10 && intVal < 20) {
                return styleConstants.waterdataCards.colors.lightGreen;
            } else if (intVal >= 20 && intVal < 30) {
                return styleConstants.waterdataCards.colors.yellow;
            } else if (intVal >= 40 && intVal < 50) {
                return styleConstants.waterdataCards.colors.burntOrange;
            } else if (intVal >= 50) {
                return styleConstants.waterdataCards.colors.red;
            }
        }
        return styleConstants.fonts.bodyFontColor;
    };

    /**
     * 
     */
    const [isCollapsed, setIsCollapsed] = useState(true);
    const setIsCollapsedHandler = (val) => {
        if (typeof val !== "boolean") {
            val = false;
        }
        setIsCollapsed(val);
    };

    /**
     * 
     */
    const isStorageValue = () => {
        if (responseData.currentMeasurementType == "acft" || responseData.currentMeasurementType == "ac-ft") {
            return true;
        }
        return false;
    }

    /**
     * 
     */
    const isValidStorageCapacityValue = () => {
        if (isStorageValue() == true) {
            if (responseData.capacity != null && responseData.percentageOfCapacity != null) {
                return true;
            }
        }
        return false;
    }

    /**
     * 
     */
    const renderCollapsableContent = () => {
        // console.log(responseData)
        let _styles = styles.bottomViewContainer;
        if (typeof responseData.mapPoints != "object" || responseData.mapPoints.constructor.name != "Array" || responseData.mapPoints.length <= 1) {
            _styles = { ..._styles, ...{ height: 100 } }
        }
        
        // geo data
        let lat = null;
        let lng = null
        if(responseData.geoLocation != null){
            let geo = responseData.geoLocation;
            if(geo.longitude != null && geo.latitude != null){
                lat = geo.latitude;
                lng = geo.longitude;
            }
        }

        // text blocks
        let subtext = `Values measured in ${responseData.currentMeasurementType}. Explanations for data terms can be found on the settings tab.`;
        if (responseData.currentMeasurementValue == "Ssn") {
            subtext = `This is a Seasonally operated station, and is currently in the off-season.`;
        }
        const getSpecialValues = () => {
            let specialValuesTxt = "";
            if (isStorageValue() == true) {
                //console.log(responseData);
                if (isValidStorageCapacityValue() == true) {
                    specialValuesTxt = `Current level is ${responseData.percentageOfCapacity}% of full pool at ${responseData.capacity}${responseData.currentMeasurementType}`
                }
            }
            return (
                <Text style={{ ...styles.collapsableContentText, ...{ fontSize: 14, fontStyle: "italic", marginTop: 0 } }}>{specialValuesTxt}</Text>
            );
        }
        return (
            <View style={_styles}>
                <Text style={{ ...styles.collapsableContentText, ...{ fontSize: 17 } }}>{name}</Text>
                {getMapLink(lat,lng)}
                {getGraph()}
                {getSpecialValues()}
                
                <Text style={styles.graphSubText}>{subtext}</Text>
            </View>
        );
    };

    const getMapLink = (lat = null, lng = null) => {
        
        if (null == lat && null == lng) {
            return;
        }
        console.log("@getMapLink()",lat, lng)
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${lat},${lng}`;
        const label = 'Custom Label';
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        console.log("@getMapLink()",url)
        return (
            <View>
                <TouchableOpacity
                    onPress={() => {
                        Linking.openURL(url); 
                    }}
                >
                    <Text style={{fontSize: 17,marginTop: 15, width: "90%", marginLeft: "5%", textAlign: "center", color: "rgb(209,129,51)", fontFamily: styleConstants.fonts.headerFontFamily }}>open in maps</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const getGraph = () => {
        if (typeof responseData.mapPoints == "object" && responseData.mapPoints.constructor.name == "Array" && responseData.mapPoints.length > 1) {
            const labels = new Array();
            const data = responseData.mapPoints.map((coords) => {
                let date = new Date(coords.date);
                labels.push(`${date.getMonth() + 1}/${date.getDate()}`);
                if (typeof coords.y == "number") {
                    return coords.y;
                } else {
                    return 0;
                }
            }).reverse();
            labels.reverse();
            // let maxOffset = (Math.round(Math.ceil(...data)/100)*100) + 200;
            // let minOffset = ((Math.round(Math.floor(...data)/100)*100) - 200) > 0 ? (Math.round(Math.min(...data)/100)*100) - 200 : 0;
            let graphWidth = ((Dimensions.get("window").width) - (20));
            return (<LineChart
                width={graphWidth}
                height={((graphWidth) * 0.4)}
                style={{ marginTop: 30, borderRadius: 1, paddingBottom: 10 }}
                withShadow={false}
                // withVerticalLabels={false} 
                // fromZero={true}
                // yAxisSuffix={` ${responseData.currentMeasurementType || null}`}
                bezier
                chartConfig={{
                    backgroundColor: "rgb(17,17,17)",
                    backgroundGradientFrom: "rgb(17,17,17)",
                    backgroundGradientTo: "rgb(17,17,17)",
                    decimalPlaces: 0,
                    color: (opacity = 0.4) => `rgba(25,255,255,${opacity})`,
                    labelColor: (opacity = 0.4) => `rgba(25,255,255,${opacity})`,
                    style: { borderRadius: 1 },
                    propsForDots: { r: 1, strokeWidth: 1, stroke: 'rgb(25,255,255)' },
                }}
                data={{
                    labels: labels,
                    datasets: [{ data: data }]
                }}

            />);
        }
    };

    const getCollapsibleLink = () => {
        if (responseData.currentMeasurementValue != undefined) {
            return (
                <Text style={{
                    color: collapsabelIconColor,
                    fontSize: 18,
                    fontFamily: styleConstants.fonts.bodyFontFamily
                }}>expand</Text>
            );
        }
    };

    if (typeof responseData == "object" && Object.entries(responseData).length > 0) {
        if (!isCollapsed) {
            collapsabelIconColor = "rgb(115,60,26)";
        }
        return (
            <View style={styles.mainContainer, { marginTop: 5 }}>
                <View style={styles.topViewContainer}>
                    <View style={styles.topLeftView}>
                        <View style={styles.topLeftViewTextContainer}>
                            <Text
                                style={styles.topLeftViewText}
                                ellipsizeMode="middle"
                                numberOfLines={2}
                            >{name.toUpperCase()}</Text>
                        </View>
                        <View style={styles.buttonViewContainer}>
                            <TouchableOpacity
                                onPress={() => {
                                    let _isCollapsed;
                                    if (isCollapsed === true) {
                                        _isCollapsed = false;
                                    } else {
                                        _isCollapsed = true;
                                    }
                                    setIsCollapsedHandler(_isCollapsed);
                                }}
                            >
                                {getCollapsibleLink()}
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.topRightView}>
                        {renderMeasurementData()}
                        {renderChangeData()}
                    </View>
                </View>
                <Collapsible collapsed={isCollapsed}>
                    {renderCollapsableContent()}
                    {/* <View>
                        <TouchableOpacity 
                        onPress={(ugh) => {
                            navigation.navigate("Logs", { data: responseData });
                        }}
                        ><Text style={styles.logsLink}>Log Data</Text></TouchableOpacity>
                    </View> */}
                </Collapsible>
                <View style={styles.borderView}></View>
            </View>
        );
    } else {
        return (
            <View style={styles.mainContainer, { marginTop: 5 }}>
                <View style={styles.topViewContainer}>
                    <View style={styles.topLeftView}>
                        <View style={styles.topLeftViewTextContainer}>
                            <Text
                                style={styles.topLeftViewText}
                                ellipsizeMode="middle"
                                numberOfLines={2}
                            >{name.toUpperCase()}</Text>
                        </View>
                        <View style={styles.buttonViewContainer}>
                            <Text style={{ color: "rgb(42,42,42)", fontSize: 16, fontFamily: styleConstants.fonts.bodyFontFamily }}>loading... </Text>
                        </View>
                    </View>
                    <View style={styles.topRightView}>
                        <Ionicons
                            style={{ flexDirection: "row", alignSelf: "flex-end", marginTop: "20%", marginRight: 20 }}
                            name="ios-hourglass"
                            size={32} color={"rgb(42,42,42)"}
                        />
                    </View>
                </View>
                <View style={styles.borderView}></View>
            </View>
        );
    }
}

const padding = 10;
const topViewHeight = 100;
const textViewHeight = 55;
const buttonViewHeight = topViewHeight - (padding * 2) - textViewHeight;
const bottomViewHeight = 300;

const styles = StyleSheet.create({
    mainContainer: {
        width: "100%",
        height: styleConstants.waterdataCards.cardHeight,
        flexDirection: "column"
    },
    topViewContainer: {
        width: "100%",
        height: topViewHeight,
        flexDirection: "row"
    },
    topLeftView: {
        width: "67%",
        height: "100%",
        paddingLeft: padding,
        paddingRight: (padding) * 2,
        justifyContent: "flex-start",
        paddingTop: padding,
        // backgroundColor: "rgb(50, 205, 50)",
    },
    topLeftViewText: {
        color: styleConstants.fonts.bodyFontColor,
        fontFamily: styleConstants.fonts.bodyFontFamily,
        fontSize: 21,
        textAlign: "left",
        justifyContent: "flex-start"
    },
    topLeftViewTextContainer: {
        height: textViewHeight,
        width: "100%",
    },
    buttonViewContainer: {
        width: "100%",
        height: buttonViewHeight,
        flexDirection: "column",
        justifyContent: "center",
    },
    topRightView: {
        width: "33%",
        height: "100%",
        paddingRight: padding,
        // backgroundColor: "rgb(160, 4, 152)"
    },
    currentMeasurementContainer: {
        height: "50%",
        flexDirection: "row",
        justifyContent: "flex-end",
        // backgroundColor: "rgb(50, 205, 50)",
    },
    currentMeasurementValue: {
        alignSelf: "flex-end",
        color: styleConstants.fonts.bodyFontColor,
        fontFamily: styleConstants.fonts.headerFontFamily,
        fontSize: 40,
        textAlign: "right",
        // backgroundColor: "rgb(255,110,199)"
    },
    currentMeasurementType: {
        alignSelf: "flex-end",
        paddingBottom: 5,
        color: styleConstants.fonts.bodyFontColor,
        fontFamily: styleConstants.fonts.bodyFontFamily,
        fontSize: 10,
        // backgroundColor: "rgb(160, 4, 152)",
    },
    percentChangeContainer: {
        height: "50%",
        // backgroundColor: "rgb(160, 4, 152)"
    },
    percentTextContainer: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 2,
        // backgroundColor: "rgb(160, 4, 152)"
    },
    percentIconText: {
        color: styleConstants.fonts.bodyFontColor,
        fontFamily: styleConstants.fonts.headerFontFamily,
        fontSize: 28,
        textAlign: "left",
        paddingRight: 2
    },
    percentText: {
        color: styleConstants.fonts.bodyFontColor,
        fontFamily: styleConstants.fonts.bodyFontFamily,
        fontSize: 12,
        lineHeight: 36
    },
    noReadingText: {
        fontStyle: "italic",
        color: styleConstants.colors.lightGrey
    },
    bottomViewContainer: {
        width: "100%",
        // height: bottomViewHeight,
        paddingTop: 20,
        // paddingBottom: (padding),
        flexDirection: "column",
        // backgroundColor: "rgb(90,50,40)"
    },
    borderView: {
        width: "100%",
        height: styleConstants.borders.borderWidth,
        borderTopColor: styleConstants.borders.borderColor,
        borderTopWidth: styleConstants.borders.borderWidth
    },
    collapsableContentText: {
        paddingLeft: padding,
        paddingRight: padding,
        marginTop: 10,
        marginBottom: 0,
        fontSize: 16,
        color: "rgba(25,255,255,0.6)",
        textAlign: "center"
    },
    graphSubText: {
        paddingLeft: padding,
        paddingRight: padding,
        marginBottom: 40,
        fontSize: 11,
        color: "rgba(25,255,255,0.6)",
        textAlign: "center"
    },
    logsLink: {
        color: "white",
        paddingLeft: padding,
        paddingRight: padding * 2,
        paddingBottom: padding * 2,
        fontSize: 18,
        textAlign: "center"
    }
});

export default WaterdataCard;
