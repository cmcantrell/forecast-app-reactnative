import Waterdata from "../../datasource/waterdata.json";
import { 
    SET_WATERDATASOURCE,
    SET_REGION, 
    SET_WATERSHED, 
    SET_REQUESTWATERDATA, 
    SET_VALIDWATERDATAREQUESTSUBMITTED, 
    SET_LOCATIONSETTINGSLOADED
    } from "../actions/waterdata";

let initialState = {
    region: null,
    watershed: null,
    validWaterdataRequestSubmitted: false,
    requestWaterdata: [],
    source: Waterdata,
    locationSettingsLoaded: false
};

const regionReducer = (state : {region:string|null,watershed:string|null,validWaterdataRequestSubmitted:boolean,requestWaterdata:any,source:{region:any},locationSettingsLoaded:boolean}=initialState, action:{type:string,source:{region:string},region:string,watershed:string,validWaterdataRequestSubmitted:boolean,requestWaterdata:[],locationSettingsLoaded:boolean}) => {
    switch (action.type) {
        case SET_WATERDATASOURCE:
            state.source = action.source;
            break;
        case SET_REGION:
            if(state.watershed != null){
                state.watershed = null;
            }
            state.region = action.region;
            break;
        case SET_WATERSHED:
            state.watershed = action.watershed;
            break;
        case SET_VALIDWATERDATAREQUESTSUBMITTED:
            state.validWaterdataRequestSubmitted = action.validWaterdataRequestSubmitted;
            if (state.validWaterdataRequestSubmitted === false) {
                //state.region = null;
                state.watershed = null;
            }
            break;
        case SET_REQUESTWATERDATA:
            state.requestWaterdata = action.requestWaterdata;
            break;
        case SET_LOCATIONSETTINGSLOADED:
            state.locationSettingsLoaded = action.locationSettingsLoaded;
            break;
        default:
            return state;
    }
    return state;

};

export default regionReducer;