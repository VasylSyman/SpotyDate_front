import {createBrowserRouter} from "react-router-dom";
import MainScreen from "./MainScreen/MainScreen";
import AuthScreen from "./AuthScreen/AuthScreen";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainScreen />
    },
    {
        path: "/login",
        element: <AuthScreen />
    }
])