"use strict";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { nullDataValue } from "./Helper";

export const dataStoreRegionKey = "@settings.savedregion";
export const dataStoreWatershedKey = "@settings.savedwatershed";
export const dataStorePushNotificationsKey = "@settings.savedPushSettings";

/**
 * 
 * @param key {string}
 * @param data {string}
 */
export const setData = async (key:string, data:string|null) => {
    if (data == null || data == nullDataValue) {
        return removeItem(key);
    }
    try {
        await AsyncStorage.setItem(key, data);
        return true;
    } catch (error) {
        console.log("ERROR @AsyncHelper.storeData", error);
        throw `ERROR @AsyncHelper.storeData ${error}`;
    }
    return false;
};

/**
 * 
 * @param key {string}
 */
export const getData = async (key:string) => {
    try {
        const value = await AsyncStorage.getItem(key);
        // if (value != null) {
            return value;
        // }
    } catch (error) {
        console.log("ERROR @AsyncHelper.getData", error);
        throw `ERROR @AsyncHelper.storeData ${error}`
    }
    return nullDataValue;
};

/**
 * 
 * @param key {string}
 */
const removeItem = async (key:string) => {
    try {
        await AsyncStorage.removeItem(key);
        return true;
    } catch (error) {
        console.log("ERROR @AsyncHelper.removeItem",error);
        throw `ERROR @AsyncHelper.storeData ${error}`
    }
    return false;
};
