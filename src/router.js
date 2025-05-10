import {createBrowserRouter} from "react-router-dom";
import MainScreen from "./MainScreen/MainScreen";
import Login from "./AuthScreen/Login";
import Register from "./AuthScreen/Register";
import ProfileForm from "./AuthScreen/ProfileForm";
import AuthCheck from "./AuthScreen/AuthCheck";
import Profile from "./ProfileScreen/Profile";
import SpotifyCallback from "./SpotifyCallback";
import ChatScreen from "./ChatScreen/ChatScreen";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <>
            <AuthCheck/>
            <MainScreen/>
        </>
    },
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/register",
        element: <Register/>
    },
    {
        path: '/register/profile',
        element: <ProfileForm/>
    },
    {
        path: "/profile",
        element: <Profile/>
    },
    {
        path: "/profile/edit",
        element: <Profile/>
    },
    {
        path: "/spotify/callback",
        element: <SpotifyCallback/>
    },
    {
        path: "/chat",
        element: <ChatScreen/>
    },
    {
        path: "/chat/:conversationId",
        element: <ChatScreen/>,
    },
])