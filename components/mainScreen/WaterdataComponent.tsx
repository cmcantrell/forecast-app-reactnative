"use strict";

import React from "react";
import { ScrollView, Text } from "react-native";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../lib/store/reducers/rootReducer";
import { setRequestWaterdata } from "../../lib/store/actions/waterdata";

import Collapsible from 'react-native-collapsible';

import WaterdataCard from "./WaterdataCard";

export default function WaterdataComponent(){

    const dispatch = useDispatch();
    const region = useSelector((state: RootState) => state.waterdata.region);
    const watershed = useSelector((state: RootState) => state.waterdata.watershed);
    const source = useSelector((state: RootState) => state.waterdata.source);

     /**
     * 
     * 
     */
      const getWatershedData = () => {
        if(region == null){
            return [];
        }
        let _watershedData = [];
        let data = source.region[region].watershed || [];
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
        <ScrollView>
            {getWaterdataInsts()}
        </ScrollView>
    );
}
