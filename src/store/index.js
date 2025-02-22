import {configureStore, createSlice, createStore} from "@reduxjs/toolkit";

const state = "state";

const initialState = {
};

const appState = createSlice({
    name: "state",
    initialState,
    reducers: {}
})

const store = configureStore({
    reducer: appState.reducer,
});

export const stateActions = appState.actions;
export default store;