import React, {useState, useEffect, useRef} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {MessageSquare} from 'lucide-react';
import {Container, MainContent} from '../MainScreen/Layout';
import Header from '../MainScreen/Header';
import ConversationSidebar from './ConversationSidebar';
import ActiveChat from './ActiveChat';
import {ChatContainer, ChatArea} from './Layout';
import useWebSocket from './hooks/useWebSocket';
import useConversations from './hooks/useConversations';
import useMessages from './hooks/useMessages';

const ChatScreen = () => {
    const token = localStorage.getItem('access_token');
    const {conversationId: activeConversationIdFromParam} = useParams();
    const navigate = useNavigate();

    const [showMobileList, setShowMobileList] = useState(!activeConversationIdFromParam);
    const [activeConversation, setActiveConversation] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const activeConversationRef = useRef(null);

    useEffect(() => {
        activeConversationRef.current = activeConversation;
    }, [activeConversation]);

    const {conversations, isLoadingConversations, setConversations} =
        useConversations(token, activeConversationIdFromParam, setActiveConversation, setShowMobileList);

    const {messages, isLoadingMessages, fetchMessages, setMessages} =
        useMessages(token, activeConversation, activeConversationRef);

    const {socket, typingUsers} =
        useWebSocket(token, activeConversationRef, setMessages, setConversations, fetchMessages);

    const handleSelectConversation = (conversation) => {
        if (!conversation || conversation.id === activeConversation?.id) return;

        setActiveConversation(conversation);
        setShowMobileList(false);
        navigate(`/chat/${conversation.id}`);
    };

    useEffect(() => {
        setShowMobileList(!activeConversationIdFromParam);

        if (activeConversationIdFromParam && conversations.length > 0) {
            const convFromParam = conversations.find(
                c => String(c.id) === String(activeConversationIdFromParam)
            );

            if (convFromParam) {
                if (!activeConversation || String(activeConversation.id) !== String(convFromParam.id)) {
                    setActiveConversation(convFromParam);
                }
            } else {
                console.warn(`Conversation ID ${activeConversationIdFromParam} not found.`);
            }
        } else if (!activeConversationIdFromParam) {
            setActiveConversation(null);
        }
    }, [activeConversationIdFromParam, conversations, activeConversation]);

    const handleSubmitMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversation || !activeConversation.id || !socket || socket.readyState !== WebSocket.OPEN) return;

        console.log('Sending new message to conversation:', activeConversation.id);

        const currentNewMessage = newMessage;
        setNewMessage('');

        try {
            const messageData = {
                type: 'message',
                match_id: activeConversation.id,
                message_text: currentNewMessage
            };

            console.log('Sending WebSocket message:', messageData);
            socket.send(JSON.stringify(messageData));

        } catch (error) {
            console.error('Error sending message via WebSocket:', error);
            setNewMessage(currentNewMessage);
            alert("Failed to send message. Please try again.");
        }
    };

    const handleBackClick = () => {
        setShowMobileList(true);
        navigate('/chat');
    };

    return (
        <Container>
            <MainContent>
                <Header/>
                <ChatContainer>
                    <ConversationSidebar
                        conversations={conversations}
                        isLoading={isLoadingConversations}
                        activeConversationId={activeConversation?.id}
                        onSelectConversation={handleSelectConversation}
                        showOnMobile={showMobileList}
                        token={token}
                    />

                    {!showMobileList ? (
                        <ActiveChat
                            activeConversation={activeConversation}
                            messages={messages}
                            isLoadingMessages={isLoadingMessages}
                            newMessage={newMessage}
                            setNewMessage={setNewMessage}
                            handleSubmitMessage={handleSubmitMessage}
                            handleBackClick={handleBackClick}
                            socket={socket}
                            typingUser={activeConversation ? typingUsers[activeConversation.id] : null}
                        />
                    ) : (
                        <EmptyChatPlaceholder/>
                    )}
                </ChatContainer>
            </MainContent>
        </Container>
    );
};

const EmptyChatPlaceholder = () => (
    <ChatArea style={{
        display: 'none',
        '@media (min-width: 768px)': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }
    }}>
        <div style={{textAlign: 'center', color: '#9ca3af'}}>
            <MessageSquare size={48} style={{margin: '0 auto 1rem'}}/>
            <p>Select a conversation to start chatting</p>
        </div>
    </ChatArea>
);

export default ChatScreen;