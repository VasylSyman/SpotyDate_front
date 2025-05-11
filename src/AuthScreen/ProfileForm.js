import React, {useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {AuthTitle, AuthCard, Form, Input, Button, AuthContainer} from './AuthLayout';
import styled from 'styled-components';
import {BASE_URL} from "../config";

const DateInput = styled(Input).attrs({type: 'date'})`
    color-scheme: dark;
`;

const ErrorText = styled.p`
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: -0.5rem;
`;

const ProfileForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {email, password} = location.state || {};

    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        birthdate: ''
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/register`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    email,
                    password,
                    name: formData.name,
                    surname: formData.surname,
                    date_of_birth: formData.birthdate,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'Registration failed.');
            }

            localStorage.setItem("access_token", data.access_token);

            const response_spotify = await fetch(`${BASE_URL}/auth/spotify`, {
                headers: {
                    'Authorization': `Bearer ${data.access_token}`
                }
            });

            if (response_spotify.ok) {
                const data = await response_spotify.json();
                window.location.href = data.url;
            } else {
                console.error('Failed to initiate Spotify auth:', response_spotify.status, response_spotify.statusText);
            }
        } catch (error) {
            console.error('Profile completion error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContainer>
            <AuthCard>
                <AuthTitle>Provide some additional information</AuthTitle>
                <Form onSubmit={handleSubmit}>
                    <Input
                        type="text"
                        name="name"
                        placeholder="First Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        type="text"
                        name="surname"
                        placeholder="Last Name"
                        value={formData.surname}
                        onChange={handleChange}
                        required
                    />
                    <DateInput
                        name="birthdate"
                        value={formData.birthdate}
                        onChange={handleChange}
                        required
                    />
                    {error && <ErrorText>{error}</ErrorText>}
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Completing Profile...' : 'Complete Profile'}
                    </Button>
                </Form>
            </AuthCard>
        </AuthContainer>

    );
};

export default ProfileForm;