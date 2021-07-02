"use strict";

import { percentageChangeOver72, getStoragePercentage } from "./Helper";

export const parseDWR = (data) => {
    // console.log(typeof data.ResultList, data.ResultList.constructor.name);
    try {
        if (data.ResultList && data.ResultList.constructor.name == "Array") {
            const timeSeries = data.ResultList;
            let streamflowData = [
                { _0hr: timeSeries[timeSeries.length - 1] || 0 },
                { _24hr: timeSeries[timeSeries.length - 2] || 0 },
                { _48hr: timeSeries[timeSeries.length - 3] || 0 },
                { _72hr: timeSeries[timeSeries.length - 4] || 0 },
                { _96hr: timeSeries[timeSeries.length - 5] || 0 },
                { _120hr: timeSeries[timeSeries.length - 6] || 0 },
                { _144hr: timeSeries[timeSeries.length - 7] || 0 }
            ];
            let mapPoints = [],
                _72HrMapPoints = [];
            let parsedStreamflowData = streamflowData.map((streamflow) => {
                let parsedData = {};
                for (let [key, val] of Object.entries(streamflow)) {
                    if (typeof val != "object") {
                        throw `streamflowData[${key}] is not an object: ${data.value.timeSeries[0].sourceInfo.siteName}`;
                    }
                    // console.log(key, val);
                    let measurementValue = null,
                        measurementType = null,
                        measurementTime = null,
                        capacity = null,
                        percentageOfCapacity = null;
                    if (val.parameter && val.parameter === "STORAGE") {
                        measurementValue = (parseInt(val.measValue, 10) > 1) ? parseInt(val.measValue) : null,
                            measurementType = (val.measUnit = "ACFT" ? "acft" : val.measUnit) || null,
                            measurementTime = val.modified || null;
                        if (data.capacity != undefined) {
                            
                            if (measurementType == "acft") {
                                // console.log(measurementType)
                                capacity = undefined != data.capacity.acft ? data.capacity.acft : null;
                                percentageOfCapacity = capacity != undefined ? getStoragePercentage(measurementValue, capacity) : null;
                                // console.log(percentageOfCapacity)
                            }
                        }
                    } else {
                        measurementValue = (parseInt(val.value, 10) > 1) ? parseInt(val.value) : null,
                            measurementType = (val.measUnit = "cfs" ? "ft3/s" : val.measUnit) || null,
                            measurementTime = val.modified || null;
                    }

                    parsedData[key] = {
                        "measurementTime": measurementTime,
                        "measurementValue": measurementValue,
                        "measurementType": measurementType,
                        "capacity": capacity,
                        "percentageOfCapacity": percentageOfCapacity
                    };
                    // console.log(parsedData[key]);
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
                // console.log(parsedData);
                return parsedData;
            });
            // add map points for graph
            parsedStreamflowData.push({ "mapPoints": mapPoints });
            // build out rate change from @_72HrMapPoints and add to return
            parsedStreamflowData.push({ "_72HrPercentageChange": percentageChangeOver72(_72HrMapPoints) });
            return parsedStreamflowData;
        }
    } catch (e) {
        console.log("Exception @DWRHelper.parseDWR", e);
        return [];
    }
};
