"use strict";

import React from "react";
import { Picker } from '@react-native-picker/picker';

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../lib/store/reducers/rootReducer";
import { setRegion } from "../../lib/store/actions/waterdata";
import { getRegionSource } from "../../lib/helper/Helper";

const RegionPicker = (props:{selectedValue:string|null}) => {

    let pickerStyle = { height: 120, width: "100%", marginBottom:40 };
    // if (props.style != undefined) {
    //     pickerStyle = props.style;
    // }

    const dispatch = useDispatch();

    let region = useSelector((state: RootState) => state.waterdata.region),
        data = useSelector((state: RootState) => state.waterdata.source);

    if (props.selectedValue != null) {
        region = props.selectedValue;
    }

    /**
     * 
     */
    const getPickerItems = () => {
        let regionSource = getRegionSource(data.region),
            items = regionSource.map((source, i: React.Key) => {
                return <Picker.Item label={source.label as string} value={source.value as string} key={i} color={"default"} />
            });
        return items;
    }

    const getPickerRegionValue = () => {
        if(region != null){
            return region;
        }
        return undefined;
    }

    return (

        <Picker
            selectedValue={getPickerRegionValue()}
            style={pickerStyle}
            itemStyle={{height:120}} 
            onValueChange={(val:string, i) => {
                if(val != null){
                    dispatch(setRegion(val));
                }
            }}
        >
            <Picker.Item label="-- select a region --" value={getPickerRegionValue()} color={"default"} />
            {getPickerItems()}
        </Picker>
    );
}

export default RegionPicker;
