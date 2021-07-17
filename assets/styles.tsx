import { StyleSheet } from "react-native";
import styleConstants from "../assets/style-constants.json";

const forestGreen = styleConstants.colors.forestGreen;
const burntOrange = styleConstants.colors.burntOrange;
const dangerRed = styleConstants.colors.dangerRed;

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