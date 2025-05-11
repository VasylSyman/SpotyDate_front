import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {BASE_URL} from "../config";

const AuthCheck = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem("access_token");
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await fetch(`${BASE_URL}/verify_token`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    localStorage.removeItem("access_token");
                    navigate("/login");
                } else {
                    navigate("/");
                }
            } catch (error) {
                console.error("Token verification failed:", error);
                localStorage.removeItem("access_token");
                navigate("/login");
            }
        };

        checkToken();
    }, [navigate]);

    return null;
};

export default AuthCheck;
