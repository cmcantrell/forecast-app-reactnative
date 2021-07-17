"use strict";

import { percentageChangeOver72, getStoragePercentage } from "./Helper";

export const parseUSGS = (data) => {
    try {
        const unitType = data.value.timeSeries[0].variable.unit.unitCode || null;
        if (data.value.timeSeries[0].values[0].value.constructor.name == "Array") {

            let geoLocation = {longitude: null, latitude: null}
            if(data.value.timeSeries[0].sourceInfo != undefined){
                if(data.value.timeSeries[0].sourceInfo.geoLocation != undefined){
                    if(data.value.timeSeries[0].sourceInfo.geoLocation.geogLocation){
                        if(data.value.timeSeries[0].sourceInfo.geoLocation.geogLocation.latitude != undefined && 
                            data.value.timeSeries[0].sourceInfo.geoLocation.geogLocation.longitude != undefined){
                            geoLocation = {
                                latitude : data.value.timeSeries[0].sourceInfo.geoLocation.geogLocation.latitude,
                                longitude : data.value.timeSeries[0].sourceInfo.geoLocation.geogLocation.longitude
                            }
                        }
                    }
                }
            }

            const timeSeries = data.value.timeSeries[0].values[0].value;
            let streamflowData = [
                { _0hr: timeSeries[(timeSeries.length - 1)] || 0 },
                { _24hr: timeSeries[timeSeries.length - (96 + 1)] || 0 },
                { _48hr: timeSeries[timeSeries.length - ((96 * 2) + 1)] || 0 },
                { _72hr: timeSeries[timeSeries.length - (96 * 3) + 1] || 0 },
                { _96hr: timeSeries[timeSeries.length - (96 * 4) + 1] || 0 },
                { _120hr: timeSeries[timeSeries.length - (96 * 5) + 1] || 0 },
                { _144hr: timeSeries[timeSeries.length - (96 * 6) + 1] || 0 }
            ];
            let mapPoints = [],
                _72HrMapPoints = [];
            let parsedStreamflowData = streamflowData.map((streamflow) => {
                let parsedData = {},
                    paramExceptions = ["--", "Bkw", "Dry", "Eqp", "Ice", "Rat", "Ssn"];
                for (let [key, val] of Object.entries(streamflow)) {
                    if (typeof val != "object") {
                        continue;
                        // throw `streamflowData[${key}] is not an object: ${data.value.timeSeries[0].sourceInfo.siteName}`;
                    }
                    let measurementValue = null,
                        measurementType = unitType,
                        measurementTime = val.dateTime || null,
                        capacity = null,
                        percentageOfCapacity = null;
                    val.qualifiers.map((q) => {
                        if (paramExceptions.indexOf(q) >= 0) {
                            measurementValue = q;
                        } else {
                            measurementValue = parseInt(val.value, 10);
                        }
                    });
                    if (measurementType == "ac-ft" || measurementType == "acft") {
                        if (data.capacity != undefined && data.capacity.acft != undefined) {
                            capacity = data.capacity;
                            percentageOfCapacity = getStoragePercentage(measurementValue, data.capacity.acft);
                        }
                    }
                    parsedData[key] = {
                        "measurementTime": measurementTime,
                        "measurementValue": measurementValue,
                        "measurementType": measurementType,
                        "capacity": capacity,
                        "percentageOfCapacity": percentageOfCapacity,
                        "geoLocation": geoLocation
                    };

                    /**
                     * @mapPoints
                     * build add map points for graph
                     */
                    mapPoints.push({ x: mapPoints.length, y: measurementValue, date: measurementTime });
                    /**
                     * @_72HrMapPoints
                     * build out 72 hour map points to find rate change
                     */
                    if (_72HrMapPoints.length < 4) {
                        _72HrMapPoints.push({ x: _72HrMapPoints.length, y: measurementValue });
                    }
                }
                return parsedData;
            });
            // add map points for graph
            parsedStreamflowData.push({ "mapPoints": mapPoints });
            // build out rate change from @_72HrMapPoints and add to return
            parsedStreamflowData.push({ "_72HrPercentageChange": percentageChangeOver72(_72HrMapPoints) });
            return parsedStreamflowData;
        }
    }
    catch (e) {
        console.log("Exception @USGSHelper.parseUSGS", e);
        return [];
    }
};

/*
(1 * 24 * 4) = 96 * 3 = 216
*/