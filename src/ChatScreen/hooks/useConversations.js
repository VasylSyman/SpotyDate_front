import {useState, useEffect} from 'react';
import {BASE_URL} from "../../config";

const useConversations = (token, activeConversationIdFromParam, setActiveConversation, setShowMobileList) => {
    const [conversations, setConversations] = useState([]);
    const [isLoadingConversations, setIsLoadingConversations] = useState(true);

    useEffect(() => {
        const fetchConversations = async () => {
            if (!token) {
                setIsLoadingConversations(false);
                return;
            }

            try {
                setIsLoadingConversations(true);
                const response = await fetch(`${BASE_URL}/chat/conversations`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) throw new Error(`Error fetching conversations: ${response.status}`);

                const data = await response.json();
                const conversationsWithDetails = data.map(conv => ({
                    ...conv,
                    id: conv.match_id,
                    name: conv.other_user.name,
                    profilePic: conv.other_user.profile_picture_url,
                    lastMessageText: conv.last_message?.text || null,
                    timestamp: conv.last_message?.sent_at || null,
                }));

                setConversations(conversationsWithDetails);

                if (activeConversationIdFromParam && conversationsWithDetails.length > 0) {
                    const convFromParam = conversationsWithDetails.find(
                        c => String(c.id) === String(activeConversationIdFromParam)
                    );

                    if (convFromParam) {
                        setActiveConversation(convFromParam);
                        setShowMobileList(false);
                    }
                }
            } catch (err) {
                console.error('Error fetching conversations:', err);
            } finally {
                setIsLoadingConversations(false);
            }
        };

        fetchConversations();
    }, [token, activeConversationIdFromParam, setActiveConversation, setShowMobileList]);

    return {
        conversations,
        isLoadingConversations,
        setConversations
    };
};

export default useConversations;