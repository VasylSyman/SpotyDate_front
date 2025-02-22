import React, { useState } from 'react';
import { AuthContainer, AuthCard, AuthTitle, Form, Input, Button, SwitchText } from './AuthLayout';

const Login = ({ onSwitchToRegister }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Add your login logic here
            console.log('Logging in with:', formData);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
        } catch (error) {
            console.error('Login error:', error);
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
                    <a href="#" onClick={onSwitchToRegister}>Sign Up</a>
                </SwitchText>
            </AuthCard>
        </AuthContainer>
    );
};

export default Login;