import styled from 'styled-components';

export const ChatContainer = styled.div`
    display: flex;
    height: calc(100vh - 100px);
    background-color: #111827;
    border-radius: 0.75rem;
    overflow: hidden;
`;

export const ConversationsList = styled.div`
    width: 300px;
    background-color: #1f2937;
    border-right: 1px solid #374151;
    overflow-y: auto;
    display: ${props => (props.$showOnMobile ? 'block' : 'none')};

    @media (min-width: 768px) {
        display: block;
    }
`;

export const ConversationHeader = styled.div`
    padding: 1rem;
    border-bottom: 1px solid #374151;
    font-size: 1.25rem;
    font-weight: 600;
    color: #f9fafb;
`;

export const ConversationItem = styled.div`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    cursor: pointer;
    border-bottom: 1px solid #374151;
    transition: background-color 0.2s;
    background-color: ${props => props.$active ? '#2d3748' : 'transparent'};

    &:hover {
        background-color: #2d3748;
    }
`;

export const Avatar = styled.div`
    width: 3rem;
    height: 3rem;
    background-color: #374151;
    border-radius: 50%;
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

export const ConversationInfo = styled.div`
    flex: 1;
    min-width: 0;

    h3 {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
        color: #f9fafb;
        margin-bottom: 0.25rem;
    }

    p {
        margin: 0;
        font-size: 0.875rem;
        color: #9ca3af;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

export const UnreadIndicator = styled.div`
    width: 0.5rem;
    height: 0.5rem;
    background-color: #10b981;
    border-radius: 50%;
`;

export const ChatArea = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
`;

export const ChatHeader = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-bottom: 1px solid #374151;
    background-color: #1f2937;
`;

export const BackButton = styled.button`
    background: none;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0.5rem;

    @media (min-width: 768px) {
        display: none;
    }
`;

export const MessageList = styled.div`
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

export const MessageWrapper = styled.div`
    display: flex;
    flex-direction: ${props => props.$sent ? 'row-reverse' : 'row'};
    align-items: flex-start;
    gap: 0.75rem;
    max-width: 80%;
    align-self: ${props => props.$sent ? 'flex-end' : 'flex-start'};
`;

export const MessageBubble = styled.div`
    padding: 0.75rem 1rem;
    border-radius: 1rem;
    background-color: ${props => props.$sent ? '#10b981' : '#374151'};
    color: ${props => props.$sent ? '#f9fafb' : '#e5e7eb'};
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

export const MessageTime = styled.div`
    font-size: 0.75rem;
    color: #9ca3af;
    margin-top: 0.25rem;
    text-align: ${props => props.$sent ? 'right' : 'left'};
`;

export const InputArea = styled.div`
    padding: 1rem;
    background-color: #1f2937;
    border-top: 1px solid #374151;
`;

export const InputForm = styled.form`
    display: flex;
    align-items: center;
    gap: 0.75rem;
`;

export const MessageInput = styled.input`
    flex: 1;
    padding: 0.75rem 1rem;
    background-color: #374151;
    border: 1px solid #4b5563;
    border-radius: 2rem;
    color: #f9fafb;
    font-size: 1rem;

    &:focus {
        outline: none;
        border-color: #10b981;
    }
`;

export const SendButton = styled.button`
    width: 2.5rem;
    height: 2.5rem;
    background-color: #10b981;
    color: white;
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
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

export const StatusIndicator = styled.div`
    font-size: 0.75rem;
    color: ${props => props.$isOnline ? '#10b981' : '#9ca3af'};
    margin-left: 0.5rem;
`;