import { combineReducers } from "redux";
import waterdataReducer from "./waterdata";

export const rootReducer = combineReducers({
    waterdata: waterdataReducer
});
export type RootState = ReturnType<typeof rootReducer>
export default rootReducer;