"use strict";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const dataStoreRegionKey = "@settings.savedregion";
export const dataStoreWatershedKey = "@settings.savedwatershed";
export const dataStorePushNotificationsKey = "@settings.savedPushSettings";

/**
 * 
 * @param key {string}
 * @param data {string}
 */
export const setData = async (key, data) => {
    console.log("@AsyncHelper.setData",key,data);
    if (data == null || data == false) {
        return removeItem(key);
    }
    try {
        await AsyncStorage.setItem(key, data);
        return true;
    } catch (error) {
        console.log("@AsyncHelper.storeData", error);
    }
    return false;
};

/**
 * 
 * @param key {string}
 */
export const getData = async (key) => {
    console.log("@AsyncHelper.getData",key);
    try {
        const value = await AsyncStorage.getItem(key);
        if (value != null) {
            return value;
        }
    } catch (error) {
        console.log("@AsyncHelper.getData", error);
    }
    return null;
};

const removeItem = async (key) => {
    console.log("@AsyncHelper.removeItem",key);
    try {
        await AsyncStorage.removeItem(key);
        return true;
    } catch (error) {
        console.log("@AsyncHelper.removeItem",error);
    }
    return false;
};
