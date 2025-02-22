import React, { useState } from 'react';
import { AuthContainer, AuthCard, AuthTitle, Form, Input, Button, SwitchText } from './AuthLayout';

const Register = ({ onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const validateForm = () => {
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            // Add your registration logic here
            console.log('Registering with:', formData);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
        } catch (error) {
            console.error('Registration error:', error);
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContainer>
            <AuthCard>
                <AuthTitle>Create your account</AuthTitle>
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
                    <Input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    {error && (
                        <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '-0.5rem' }}>
                            {error}
                        </p>
                    )}
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </Button>
                </Form>
                <SwitchText>
                    Already have an account?
                    <a href="#" onClick={onSwitchToLogin}>Sign In</a>
                </SwitchText>
            </AuthCard>
        </AuthContainer>
    );
};

export default Register;