import { combineReducers, configureStore } from "@reduxjs/toolkit";
import alertsReducer from './reducers/alertsSlice';
import userInfoReducer from "./reducers/userInfoSlice";

const rootReducer = combineReducers({
    alertsReducer,
    userInfoReducer
});

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer
    })
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];




