"use strict";

import React from "react";
import { Picker } from '@react-native-picker/picker';
import { useSelector, useDispatch } from "react-redux";
import { setRegion } from "../../lib/store/actions/waterdata";
import { getRegionSource } from "../../lib/helper/Helper";

const RegionPicker = (props) => {

    let pickerStyle = { height: 120, width: "100%", marginBottom:40 };
    if (props.style != undefined) {
        pickerStyle = props.style;
    }

    const dispatch = useDispatch();

    let region = useSelector(state => state.waterdata.region),
        data = useSelector(state => state.waterdata.source);

    if (props.selectedValue != undefined) {
        region = props.selectedValue;
    }

    /**
     * 
     */
    const getPickerItems = () => {
        let regionSource = getRegionSource(data.region),
            items = regionSource.map((source, i) => {
                return <Picker.Item label={source.label} value={source.value} key={i} color={"default"} />
            });
        return items;
    }

    return (
        <Picker
            selectedValue={region}
            style={pickerStyle}
            itemStyle={{height:120}} 
            onValueChange={(val, i) => {
                if(val != false){
                    dispatch(setRegion(val));
                }
            }}
        >
            <Picker.Item label="-- select a region --" value={null} color={"default"} />
            {getPickerItems()}
        </Picker>
    );
}

export default RegionPicker;
