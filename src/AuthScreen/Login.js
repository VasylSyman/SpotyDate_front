import React, {useState} from 'react';
import {AuthContainer, AuthCard, AuthTitle, Form, Input, Button, SwitchText} from './AuthLayout';
import {Link, useNavigate} from 'react-router-dom';
import {BASE_URL} from "../config";

const Login = ({onSwitchToRegister}) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Login failed");
            }

            localStorage.setItem("access_token", data.access_token);

            console.log("Login successful:", data);

            navigate('/');
        } catch (error) {
            console.error("Login error:", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContainer>
            <AuthCard>
                <AuthTitle>Welcome back to MusicMatch</AuthTitle>
                <Form onSubmit={handleSubmit}>
                    <Input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </Form>
                <SwitchText>
                    Don't have an account?
                    <Link to="/register" onClick={onSwitchToRegister}>Sign Up</Link>
                </SwitchText>
            </AuthCard>
        </AuthContainer>
    );
};

export default Login;