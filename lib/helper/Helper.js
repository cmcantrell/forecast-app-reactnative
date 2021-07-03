"use strict";

export const ucFirst = (str) => {
    if (typeof str !== "string") {
        return false;
    }
    let parts = str.split(" "),
        ucParts = parts.map((part) => {
            if (part.length > 2) {
                part = part.toLowerCase();
                return part.charAt(0).toUpperCase() + part.slice(1);
            } else {
                return part;
            }

        });
    return ucParts.join(" ");
};

export const percentageChangeOver72 = (timeSeries) => {
    let point1 = timeSeries[0],
        // point2 = timeSeries[timeSeries.length - 1];
        point2 = timeSeries[2];
    if (point1 != undefined && point2 != undefined){ 
        if(!isNaN(point1.y && !isNaN(point2.y))) {
            // what percent of point1.y is point2.y
            return (((parseInt(((point2.y / point1.y) * 100), 10)) - 100) * (-1));
        }
    }
    return NaN;
};

export const getStoragePercentage = (value,capacity) => {
    if(Number.isInteger(value) && Number.isInteger(capacity) ){
        return (parseInt(((value / capacity) * 100), 10));
    }
    return NaN;
}

export const getRegionSource = (data) => {
    let _regionData = [];
    if (typeof data === "object") {
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                let _inst = {
                    label: ucFirst(key),
                    value: key
                }
                _regionData.push(_inst);
            }
        }
    }
    return _regionData;
};

export const getWatershedSource = (data,region=null) => {
    let _watershedData = [];
    if (region !== null) {
        if (typeof data[region] === "object") {
            if (typeof data[region].watershed === "object") {
                let regionData = data[region].watershed;
                for (let key in regionData) {
                    if (regionData.hasOwnProperty(key)) {
                        let _inst = {
                            label: ucFirst(regionData[key]["name"]),
                            value: regionData[key]["name"]
                        };
                        _watershedData.push(_inst);
                    }
                }
            }
        }
    }
    return _watershedData;
};

export const getSitesSource = (data, watershed=null) => {
    let sites = [];
    if(watershed != null){
        for(let _watershed in data.watershed){
            if(data.watershed.hasOwnProperty(_watershed)){
                if(data.watershed[_watershed].name == watershed){
                    let _sitesData = data.watershed[_watershed].sites;
                    for(let _site in _sitesData){
                        if(_sitesData.hasOwnProperty(_site)){
                            sites.push({
                               label:  _sitesData[_site].name,
                               value: _sitesData[_site].name
                            });
                       }
                    }
                }
            }
        }
    }
    return sites;
}
