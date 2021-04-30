import { combineReducers } from "redux";
import alertReducer from "./alertReducer";
import auth from "./auth";
import profile from "./profile";
import post from "./post";


export default combineReducers({
    alert:alertReducer,
    auth,
    profile,
    post 
});