import { StyleSheet } from "react-native";
import styleConstants from "../assets/style-constants";

const forestGreen = styleConstants.forestGreen;
const burntOrange = styleConstants.burntOrange;
const dangerRed = styleConstants.dangerRed;

export default StyleSheet.create({
    button : {
        backgroundColor : forestGreen
    },
    buttonBright : {
        backgroundColor : burntOrange
    },
    buttonDisabled : {
        backgroundColor : forestGreen,
        opacity : 0.6
    }
});