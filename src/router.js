import {createBrowserRouter} from "react-router-dom";
import MainScreen from "./MainScreen/MainScreen";
import Login from "./AuthScreen/Login";
import Register from "./AuthScreen/Register";
import ProfileForm from "./AuthScreen/ProfileForm";
import AuthCheck from "./AuthScreen/AuthCheck";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <>
            <AuthCheck />
            <MainScreen />
        </>
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: '/register/profile',
        element: <ProfileForm />
    }
])