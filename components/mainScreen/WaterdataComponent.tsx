"use strict";

import React from "react";
import { ScrollView } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import WaterdataCard from "./WaterdataCard";
import { setRequestWaterdata } from "../../lib/store/actions/waterdata";

const WaterdataComponent = () => {

    const dispatch = useDispatch();
    const region = useSelector(state => state.waterdata.region);
    const watershed = useSelector(state => state.waterdata.watershed);
    const source = useSelector(state => state.waterdata.source);

    /**
     * 
     * 
     */
    const getWatershedData = () => {
        let data = source.region[region].watershed || {};
        let _watershedData = {};
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                if (data[key].name === watershed && typeof data[key].sites === "object") {
                    _watershedData = data[key].sites;
                }
            }
        }
        return _watershedData;
    };

    /**
     * 
     * 
     */
    const getWaterdataInsts = () => {
        const watershedData = getWatershedData();
        let _content = [],
            i = 0;
        for (let key in watershedData) {
            if (watershedData.hasOwnProperty(key)) {
                _content.push(<WaterdataCard key={i} inst={i} />);
                i++;
                dispatch(setRequestWaterdata(watershedData));
            }
        };
        return _content;
    };

    return (
        <ScrollView>{getWaterdataInsts()}</ScrollView>
    );
}
export default WaterdataComponent;
