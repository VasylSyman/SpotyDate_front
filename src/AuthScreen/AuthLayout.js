import styled from 'styled-components';

export const AuthContainer = styled.div`
    min-height: 100vh;
    background-color: black;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
`;

export const AuthCard = styled.div`
    background-color: #1f2937;
    border-radius: 0.75rem;
    padding: 2rem;
    width: 100%;
    max-width: 400px;
`;

export const AuthTitle = styled.h1`
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    text-align: center;
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

export const Input = styled.input`
    box-sizing: border-box;
    width: 100%;
    padding: 0.75rem;
    background-color: #374151;
    border: 1px solid #4b5563;
    border-radius: 0.5rem;
    color: white;
    font-size: 1rem;

    &:focus {
        outline: none;
        border-color: #10b981;
    }

    &::placeholder {
        color: #9ca3af;
    }
`;

export const Button = styled.button`
    box-sizing: border-box;
    width: 100%;
    padding: 0.75rem;
    background-color: #10b981;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #059669;
    }

    &:disabled {
        background-color: #6b7280;
        cursor: not-allowed;
    }
`;

export const SwitchText = styled.p`
    text-align: center;
    margin-top: 1rem;
    color: #9ca3af;
    font-size: 0.875rem;

    a {
        color: #10b981;
        text-decoration: none;
        font-weight: 600;
        margin-left: 0.25rem;

        &:hover {
            text-decoration: underline;
        }
    }
`;