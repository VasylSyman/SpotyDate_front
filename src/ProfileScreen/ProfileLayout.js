import styled from "styled-components"


export const Container = styled.div`
    min-height: 100vh;
    background-color: black;
    color: white;
    padding: 2rem;
`;

export const ProfileCard = styled.div`
    max-width: 800px;
    margin: 0 auto;
    background-color: #1f2937;
    border-radius: 1rem;
    padding: 2rem;
`;

export const Title = styled.h1`
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 2rem;
`;

export const Section = styled.div`
    margin-bottom: 2rem;
`;

export const SectionTitle = styled.h2`
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #10b981;
`;

export const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 1rem;

    @media (max-width: 640px) {
        grid-template-columns: 1fr;
    }
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

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;

export const Select = styled.select`
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
`;

export const TextArea = styled.textarea`
    box-sizing: border-box;
    width: 100%;
    padding: 0.75rem;
    background-color: #374151;
    border: 1px solid #4b5563;
    border-radius: 0.5rem;
    color: white;
    font-size: 1rem;
    min-height: 100px;
    resize: vertical;

    &:focus {
        outline: none;
        border-color: #10b981;
    }
`;

export const ImageUploadSection = styled.div`
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
`;

export const ImagePreview = styled.div`
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: #374151;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;

export const UploadButton = styled.button`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background-color: #374151;
    border: 1px solid #4b5563;
    border-radius: 0.5rem;
    color: white;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background-color: #4b5563;
    }
`;

export const ActionButton = styled.button`
    padding: 0.75rem 1.5rem;
    background-color: #10b981;
    color: white;
    border: none;
    border-radius: 0.5rem;
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

export const ButtonContainer = styled.div`
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
`;

export const EditButton = styled(ActionButton)`
    background-color: #3b82f6;

    &:hover {
        background-color: #2563eb;
    }
`;

export const LogoutButton = styled(ActionButton)`
    background-color: #ef4444;

    &:hover {
        background-color: #dc2626;
    }
`;
