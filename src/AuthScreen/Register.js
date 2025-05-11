import React, {useState} from 'react';
import {AuthContainer, AuthCard, AuthTitle, Form, Input, Button, SwitchText} from './AuthLayout';
import {Link} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';
import {BASE_URL} from "../config";

const Register = ({onSwitchToLogin}) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const {name, value} = e.target;
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

    const checkEmailUnique = async (email) => {
        try {
            const response = await fetch(`${BASE_URL}/unique_email`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email}),
            });
            const data = await response.json();
            return data;
        } catch (err) {
            console.error('Email check error:', err);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            const isUnique = await checkEmailUnique(formData.email);
            if (!isUnique) {
                setError('Email is already in use.');
                setLoading(false);
                return;
            }

            navigate('/register/profile', {state: {email: formData.email, password: formData.password}});
        } catch (error) {
            console.error('Registration error:', error);
            setError('An error occurred. Please try again.');
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
                        <p style={{color: '#ef4444', fontSize: '0.875rem', marginTop: '-0.5rem'}}>
                            {error}
                        </p>
                    )}
                    {/*<Button type="submit" disabled={loading}>*/}
                    {/*    {loading ? 'Creating account...' : 'Create Account'}*/}
                    {/*</Button>*/}
                    <Button onSubmit={handleSubmit}>
                        Next
                    </Button>
                </Form>
                <SwitchText>
                    Already have an account?
                    <Link to="/login" onClick={onSwitchToLogin}>Sign In</Link>
                </SwitchText>
            </AuthCard>
        </AuthContainer>
    );
};

export default Register;