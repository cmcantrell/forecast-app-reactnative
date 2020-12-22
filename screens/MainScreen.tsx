import * as React from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../components/Themed';
import Header from "../components/mainScreen/Header";
import MainLoadingScreen from "../components/mainScreen/MainLoadingScreen";
import MainModal from "../components/mainScreen/MainModal";
import WaterdataComponent from "../components/mainScreen/WaterdataComponent";
import { useSelector, useDispatch } from "react-redux";
import styleConstants from "../assets/style-constants";
import { setWaterdataSource } from "../lib/store/actions/waterdata";

export default function MainScreen() {

    let region = useSelector(state => state.waterdata.region),
        watershed = useSelector(state => state.waterdata.watershed),
        dataRequestSubmitted = useSelector(state => state.waterdata.validWaterdataRequestSubmitted);
        
    /**
     * @returns bool
     */
    const dataRequestIsValid = () => {
        if (region === null || watershed === null || dataRequestSubmitted !== true) {
            return false;
        }
        return true;
    };

    let content = <MainLoadingScreen text="Select Your Location" />
    if (dataRequestIsValid() === false) {
        content = <MainModal />
    } else if (dataRequestIsValid() === true) {
        content = <WaterdataComponent />
    }

    return (
        <View style={styles.container}>
            <Header />
            {content}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        flexDirection: "column",
        backgroundColor: styleConstants.colors.darkGrey
    }
});