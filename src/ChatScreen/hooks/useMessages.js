import {useState, useEffect, useRef} from 'react';
import {BASE_URL} from "../../config";

const useMessages = (token, activeConversation, activeConversationRef) => {
    const [messages, setMessages] = useState([]);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const prevActiveConversationIdRef = useRef(null);

    const fetchMessages = async (conversationId) => {
        if (!conversationId || !token) {
            setIsLoadingMessages(false);
            return;
        }

        setIsLoadingMessages(true);
        setMessages([]);

        try {
            const response = await fetch(`${BASE_URL}/chat/matches/${conversationId}/messages`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error fetching messages: ${response.status} ${response.statusText}`);
            }

            const messagesData = await response.json();

            const formattedMessages = messagesData.map(apiMsg => ({
                id: apiMsg.message_id,
                text: apiMsg.message_text,
                sent: apiMsg.sender_id !== activeConversationRef.current?.other_user.user_id,
                timestamp: apiMsg.sent_at,
                read_at: apiMsg.read_at || null
            }));

            formattedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            setMessages(formattedMessages);
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        } finally {
            setIsLoadingMessages(false);
        }
    };

    useEffect(() => {
        if (prevActiveConversationIdRef.current === activeConversation?.id) {
            return;
        }

        prevActiveConversationIdRef.current = activeConversation?.id;

        if (activeConversation?.id) {
            fetchMessages(activeConversation.id);
        }
    }, [activeConversation, token, activeConversationRef]);

    return {
        messages,
        isLoadingMessages,
        fetchMessages,
        setMessages
    };
};

export default useMessages;