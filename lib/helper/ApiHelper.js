"use strict";

import { parseUSGS } from "./USGSHelper";
import { parseDWR } from "./DWRHelper";

// export const waterDataRequest = (requestData, responseData) => {
//     console.log("@apiRequest", typeof responseData, Object.entries(responseData).length < 1);
//     const time = Date.now();
//     if (typeof responseData == "object" && Object.entries(responseData).length < 1) {
//         if (requestData.method == "get") {
//             let paramsString = parseRequestParamsToString(requestData.params);
//             return fetch(`${requestData.url}${paramsString}`, {
//                 method: `${requestData.method.toUpperCase()}`
//             });
//         } else {
//             console.log("we never have post requests");
//         }
//     } else {
//         console.log(`ERROR @ApiHelper.waterDataRequest: typeof response data (${typeof responseData}) is not an object or is not countable`);
//     }
// };

export const parseRequestParamsToString = (params) => {
    let paramsString = "",
        i = 0;
    for (let [key, value] of Object.entries(params)) {
        if (i == 0) {
            paramsString += "?";
        }
        if (key == "max-measDate" || key == "min-measDate") {
            let now = new Date();
            switch (key) {
                case "max-measDate":
                    let month = ("0" + (now.getMonth() + 1)).slice(-2),
                        day = ("0" + now.getDate()).slice(-2),
                        year = now.getFullYear(),
                        hour = now.getHours(),
                        // minute = now.getMinutes();
                        minute = "00";
                    let timeFormat = `${month}/${day}/${year}_${hour}:${minute}`;
                    paramsString += `${key}=${encodeURIComponent(timeFormat)}`;
                    break;
                case "min-measDate":
                    let _7out = new Date(now.setDate(now.getDate() - 8)),
                        _7outMonth = ("0" + (_7out.getMonth() + 1)).slice(-2),
                        _7outDay = ("0" + _7out.getDate()).slice(-2),
                        _7outYear = _7out.getFullYear(),
                        _7outHour = ("0" + _7out.getHours()).slice(-2),
                        // _7outminute = ("0" + _7out.getMinutes()).slice(-2);
                        _7outminute = "00";
                    let _7outTimeFormat = `${_7outMonth}/${_7outDay}/${_7outYear}_${_7outHour}:${_7outminute}`;
                    paramsString += `${key}=${encodeURIComponent(_7outTimeFormat)}`;
                    break;
                default:
                    break;
            }
        } else if (key == "capacity") {
            continue;
        } else {
            paramsString += `${key}=${encodeURI(value)}`;
        }

        if (i >= 0 && i < (Object.entries(params).length - 1)) {
            paramsString += "&";
        }
        i++;
    }
    return paramsString;
};

export const parseWaterDataResponse = (request, response) => {
    let parsed = [];
    if (request.params.capacity != undefined && typeof request.params.capacity == "object") {
        response.capacity = request.params.capacity;
    }
    switch (request.url) {
        case "https://waterservices.usgs.gov/nwis/iv/":
            parsed = parseUSGS(response);
            break;
        case "https://dwr.state.co.us/Rest/GET/api/v2/surfacewater/surfacewatertsday/":
        case "https://dwr.state.co.us/Rest/GET/api/v2/telemetrystations/telemetrytimeseriesday/":
            parsed = parseDWR(response);
            break;
        default:
            break;
    }
    return parsed;
};
