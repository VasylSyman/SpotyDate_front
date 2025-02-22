import React, { useState } from 'react';
import {AuthTitle, AuthCard, Form, Input, Button, AuthContainer} from './AuthLayout';
import styled from 'styled-components';

const DateInput = styled(Input).attrs({ type: 'date' })`
  color-scheme: dark;
`;

const ErrorText = styled.p`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: -0.5rem;
`;

const ProfileForm = ({ onComplete }) => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        birthdate: ''
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        setError('Failed to complete profile. Please try again.');
        setLoading(false);
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