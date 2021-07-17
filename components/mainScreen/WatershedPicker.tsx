"use strict";

import React from "react";
import { Picker } from  '@react-native-picker/picker';

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../lib/store/reducers/rootReducer";
import { setWatershed } from "../../lib/store/actions/waterdata";
import { getWatershedSource } from "../../lib/helper/Helper";

const RegionPicker = (props:{selectedValue:string|null}) => {

    let pickerStyle = {height: 200, width: "100%", marginTop: 80, marginBottom:40};
    // if(props.style != undefined){
    //     pickerStyle = props.style;
    // }
    let itemColor = "default";
    // if(props.itemStyle != undefined && props.itemStyle.color != undefined){
    //     itemColor = props.itemStyle.color;
    // }

    const dispatch = useDispatch();

    let region = useSelector((state: RootState) => state.waterdata.region),
        watershed = useSelector((state: RootState) => state.waterdata.watershed),
        data = useSelector((state: RootState) => state.waterdata.source);

    /**
     * 
     * 
     */
    const getPickerItems = () => {
        let regionSource = getWatershedSource(data.region, region),
            items = regionSource.map((source,i) => {
                return <Picker.Item label={source.label as string} value={source.value as string} key={i} color={itemColor}/>
            });
        return items;
    }

    const getPickerWatershedValue = () => {
        if(watershed != null){
            return watershed;
        }
        return undefined;
    }

    /**
     * 
     * @return object
     */
    return (
        <Picker
            selectedValue={getPickerWatershedValue()}
            style={{ height: 120, width: "100%" }}
            itemStyle={{height:120}} 
            onValueChange={(val, i) => {
                dispatch(setWatershed(val));
            }}
        >
            <Picker.Item label="-- select a watershed --" value={getPickerWatershedValue()} color={itemColor} />
            {getPickerItems()}
        </Picker>
    );
}

export default RegionPicker;