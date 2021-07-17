"use strict";

export const nullDataValue = "no selection";

export const ucFirst = (str: string) => {
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

export const percentageChangeOver72 = (timeSeries: any) => {
    let point1 = timeSeries[0],
        point2 = timeSeries[1],
        point3 = timeSeries[2];
    if (point1 != undefined && point2 != undefined && point3 != undefined) {
        if (!isNaN(point1.y && !isNaN(point2.y)) && !isNaN(point3.y)) {
            return(  (Math.round((point1.y/point3.y) * 100) - 100) );
        }

    }
    return NaN;
};

export const getStoragePercentage = (value: number, capacity: number) => {
    if (Number.isInteger(value) && Number.isInteger(capacity)) {
        return Math.round((value / capacity) * 100);
    }
    return NaN;
}

export const getRegionSource = (data: {}) => {
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

export const getWatershedSource = (data: any, region: string | null) => {
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

export const getSitesSource = (data: any, watershed: string | null) => {
    let sites = [];
    if (watershed != null) {
        for (let _watershed in data.watershed) {
            if (data.watershed.hasOwnProperty(_watershed)) {
                if (data.watershed[_watershed].name == watershed) {
                    let _sitesData = data.watershed[_watershed].sites;
                    for (let _site in _sitesData) {
                        if (_sitesData.hasOwnProperty(_site)) {
                            sites.push({
                                label: _sitesData[_site].name,
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
