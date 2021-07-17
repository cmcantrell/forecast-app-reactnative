export const SET_REGION = "SET_REGION";
export const SET_WATERSHED = "SET_WATERSHED";
export const SET_REQUESTWATERDATA = "SET_REQUESTWATERDATA";
export const SET_VALIDWATERDATAREQUESTSUBMITTED = "SET_VALIDWATERDATAREQUESTSUBMITTED";
export const SET_LOCATIONSETTINGSLOADED = "SET_LOCATIONSETTINGSLOADED";
export const SET_WATERDATASOURCE = "SET_WATERDATASOURCE";

export const setRegion = (region:string|null) => {
    return ({ 
        type: SET_REGION, 
        region: region 
    });
};

export const setWatershed = (watershed:string|null) => {
    return ({
        type: SET_WATERSHED,
        watershed: watershed
    });
};

export const setValidWaterdataRequestSubmitted = (val:boolean) => {
    return ({
        type: SET_VALIDWATERDATAREQUESTSUBMITTED,
        validWaterdataRequestSubmitted: val
    });
};

export const setRequestWaterdata = (waterdata:[]) => {
    return ({
        type: SET_REQUESTWATERDATA,
        requestWaterdata: waterdata
    });
};

export const setLocationSettingsLoaded = (val:boolean) => {
    return ({
        type: SET_LOCATIONSETTINGSLOADED,
        locationSettingsLoaded: val
    });
};

export const setWaterdataSource = (source:{}) => {
    return({
        type: SET_WATERDATASOURCE,
        waterdataSource: source
    });
};
