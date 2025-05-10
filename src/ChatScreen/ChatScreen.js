import React, {useState, useEffect, useRef, useCallback} from 'react';
import {Container, MainContent} from '../MainScreen/Layout';
import Header from '../MainScreen/Header';
import {User, Send, ArrowLeft, MessageSquare} from 'lucide-react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    ChatContainer,
    ConversationsList,
    ConversationHeader,
    ConversationItem,
    ChatArea,
    Avatar,
    ConversationInfo,
    ChatHeader,
    InputArea,
    InputForm,
    MessageInput,
    MessageList,
    MessageBubble,
    MessageTime,
    MessageWrapper,
    SendButton,
    BackButton,
    UnreadIndicator,
    StatusIndicator
} from './Layout'

const formatTime = (dateStringOrDate) => {
    const date = typeof dateStringOrDate === 'string' ? new Date(dateStringOrDate) : dateStringOrDate;
    if (isNaN(date.getTime())) {
        return 'Invalid Date';
    }
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    return `${hours}:${minutes} ${ampm}`;
};

const ChatScreen = () => {
    const token = localStorage.getItem('access_token');
    const {conversationId: activeConversationIdFromParam} = useParams();
    const navigate = useNavigate();

    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [showMobileList, setShowMobileList] = useState(!activeConversationIdFromParam);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isLoadingConversations, setIsLoadingConversations] = useState(true);
    const [socket, setSocket] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [typingUsers, setTypingUsers] = useState({});
    const isManuallyClosingRef = useRef(false);
    const reconnectTimeoutRef = useRef(null);

    const messagesEndRef = useRef(null);
    const prevActiveConversationIdRef = useRef(null);
    const activeConversationRef = useRef(null);

    console.log(activeConversation)

    // Update activeConversationRef whenever activeConversation changes
    useEffect(() => {
        activeConversationRef.current = activeConversation;
    }, [activeConversation]);

    const fetchMessages = async (conversationId) => {
        // Clear validation first
        if (!conversationId || !token) {
            setIsLoadingMessages(false);
            return;
        }

        // Start loading and clear messages
        setIsLoadingMessages(true);
        setMessages([]);

        try {
            const response = await fetch(`http://0.0.0.0:8000/chat/matches/${conversationId}/messages`, {
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

            // Better handling of message sender status
            const formattedMessages = messagesData.map(apiMsg => ({
                id: apiMsg.message_id,
                text: apiMsg.message_text,
                sent: apiMsg.sender_id !== activeConversationRef.current?.other_user.user_id,
                timestamp: apiMsg.sent_at,
                read_at: apiMsg.read_at || null
            }));

            formattedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            setMessages(formattedMessages);

            // Mark conversation as read if it was unread
            if (socket && socket.readyState === WebSocket.OPEN &&
                activeConversationRef.current?.is_unread) {
                socket.send(JSON.stringify({
                    type: 'read',
                    match_id: conversationId
                }));
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        } finally {
            setIsLoadingMessages(false);
        }
    };

    // WebSocket Connection
    useEffect(() => {
        if (!token || socket?.readyState === WebSocket.OPEN || isManuallyClosingRef.current) return;

        const connectWebSocket = () => {
            console.log('Attempting to connect WebSocket...');
            const ws = new WebSocket(`ws://0.0.0.0:8000/ws/${token}`);

            ws.onopen = () => {
                console.log('WebSocket connection established');
                setSocket(ws);
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                    reconnectTimeoutRef.current = null;
                }
                // Re-fetch messages for the active conversation on reconnection
                if (activeConversationRef.current?.id) {
                    fetchMessages(activeConversationRef.current.id);
                }
            };

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('WebSocket message received:', data);

                    const receivedMatchId = data.match_id;
                    const currentConversationId = activeConversationRef.current?.id;
                    const isForActiveConversation = currentConversationId && receivedMatchId && String(currentConversationId) === String(receivedMatchId);

                    console.log(`Received message for match ID: ${receivedMatchId}, Active conversation ID: ${currentConversationId}, Is for active conversation? ${isForActiveConversation}`);

                    if (data.message_id) {
                        console.log('INCOMING CHAT MESSAGE - FORWARDING TO HANDLER');
                        // Directly call handleNewMessage without setTimeout
                        handleNewMessage(data, isForActiveConversation);
                    } else if (data.type === 'read_receipt') {
                        console.log('Processing read receipt for match:', data.match_id);

                        setConversations(prevConvs =>
                            prevConvs.map(conv =>
                                String(conv.id) === String(data.match_id) ? {...conv, is_unread: false} : conv
                            )
                        );

                        if (isForActiveConversation) {
                            setMessages(prevMsgs =>
                                prevMsgs.map(msg =>
                                    !msg.read_at && !msg.sent ? {...msg, read_at: data.read_at} : msg
                                )
                            );
                        }
                    } else if (data.type === 'typing') {
                        console.log('Processing typing indicator for match:', data.match_id);
                        setTypingUsers(prev => ({
                            ...prev,
                            [data.match_id]: {isTyping: data.is_typing, userId: data.user_id, timestamp: new Date()}
                        }));
                    } else {
                        console.log('Unknown message type received:', data);
                    }
                } catch (error) {
                    console.error('Error processing WebSocket message:', error, event.data);
                }
            };

            ws.onclose = (event) => {
                console.log('WebSocket connection closed', event.code, event.reason);
                setSocket(null);

                if (!isManuallyClosingRef.current && event.code !== 1000) {
                    reconnectTimeoutRef.current = setTimeout(() => {
                        connectWebSocket(); // Re-attempt connection
                    }, 3000);
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                ws.close();
            };
        };

        connectWebSocket();

        return () => {
            isManuallyClosingRef.current = true;
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.close(1000, "Component unmounted");
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [token, socket]);


    // Handle incoming messages - complete rewrite to fix the message display issue
    const handleNewMessage = useCallback((data, isForActiveConversation) => {
        console.log('WebSocket received message:', data);
        console.log('Is for active conversation:', isForActiveConversation);

        // Add null check for activeConversationRef.current
        if (!activeConversationRef.current) {
            console.warn('Active conversation is null, skipping message processing');
            return;
        }

        const isMessageFromCurrentUser = activeConversationRef.current.other_user ? data.sender_id !== activeConversationRef.current.other_user.user_id : data.is_sender_current_user;

        const messageData = {
            id: data.message_id,
            text: data.message_text,
            sent: isMessageFromCurrentUser,
            timestamp: data.sent_at || new Date().toISOString()
        };

        console.log('Processed message data:', messageData);

        if (isForActiveConversation) {
            console.log('Adding message to active conversation:', activeConversationRef.current.id);
            setMessages(prevMessages => {
                // Check if the message already exists in the state
                if (prevMessages.some(msg => msg.id === messageData.id)) {
                    console.log('Message already exists, not adding duplicate');
                    return prevMessages;
                }
                console.log('Adding new message to state');
                return [...prevMessages, messageData];
            });

            if (!isMessageFromCurrentUser && socket?.readyState === WebSocket.OPEN) {
                console.log('Sending read receipt for message');
                socket.send(JSON.stringify({type: 'read', match_id: data.match_id}));
            }
        } else {
            console.log('Message is for inactive conversation:', data.match_id);
        }

        setConversations(prevConvs =>
            prevConvs.map(conv =>
                String(conv.id) === String(data.match_id) ? {
                    ...conv,
                    lastMessageText: data.message_text,
                    timestamp: data.sent_at,
                    is_unread: !isForActiveConversation && !isMessageFromCurrentUser,
                    last_message: {
                        text: data.message_text,
                        sent_at: data.sent_at,
                        is_sender_current_user: isMessageFromCurrentUser
                    }
                } : conv
            )
        );
    }, [socket]);


    // Fetch conversations only once on component mount
    useEffect(() => {
        const fetchConversations = async () => {
            if (!token) {
                setIsLoadingConversations(false);
                return;
            }

            try {
                setIsLoadingConversations(true);
                const response = await fetch('http://0.0.0.0:8000/chat/conversations', {
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

                // If we have an active conversation ID from URL params, select it after loading conversations
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
    }, [token]); // Only run on component mount and token changes

    // Handle conversation selection
    const handleSelectConversation = useCallback((conversation) => {
        if (!conversation || conversation.id === activeConversation?.id) return;

        setActiveConversation(conversation);
        setShowMobileList(false);
        navigate(`/chat/${conversation.id}`);
    }, [navigate, activeConversation]);

    // Handle back button and URL-based navigation
    useEffect(() => {
        // Handle mobile view state based on URL
        setShowMobileList(!activeConversationIdFromParam);

        // Only try to match conversation if we have an ID in the URL and conversations are loaded
        if (activeConversationIdFromParam && conversations.length > 0) {
            const convFromParam = conversations.find(
                c => String(c.id) === String(activeConversationIdFromParam)
            );

            if (convFromParam) {
                // Only update active conversation if it's different
                if (!activeConversation || String(activeConversation.id) !== String(convFromParam.id)) {
                    setActiveConversation(convFromParam);
                }
            } else {
                console.warn(`Conversation ID ${activeConversationIdFromParam} not found.`);
            }
        } else if (!activeConversationIdFromParam) {
            // Clear active conversation if we're at /chat with no ID
            setActiveConversation(null);
        }
    }, [activeConversationIdFromParam, conversations]);


    // Fetch messages only when active conversation changes
    useEffect(() => {
        // Skip if conversation hasn't changed
        if (prevActiveConversationIdRef.current === activeConversation?.id) {
            return;
        }

        prevActiveConversationIdRef.current = activeConversation?.id;

        // Only fetch if we have an active conversation
        if (activeConversation?.id) {
            fetchMessages(activeConversation.id);
        }
    }, [activeConversation, fetchMessages]);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current && messages.length > 0) {
            messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
        }
    }, [messages]);

    const handleSubmitMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversation || !activeConversation.id || !socket || socket.readyState !== WebSocket.OPEN) return;

        console.log('Sending new message to conversation:', activeConversation.id);

        const currentNewMessage = newMessage;
        setNewMessage('');

        // Send message through WebSocket
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
            setNewMessage(currentNewMessage); // Restore the message input
            alert("Failed to send message. Please try again.");
        }
    };

    const handleBackClick = () => {
        setShowMobileList(true);
        navigate('/chat');
    };


    // Render the component with proper loading states
    return (
        <Container>
            <MainContent>
                <Header/>
                <ChatContainer>
                    <ConversationsList $showOnMobile={showMobileList}>
                        <ConversationHeader>Messages</ConversationHeader>

                        {isLoadingConversations ? (
                            <p style={{padding: '1rem', color: '#9ca3af'}}>Loading conversations...</p>
                        ) : (
                            <>
                                {conversations.length > 0 ? (
                                    conversations.map(conv => (
                                        <ConversationItem
                                            key={conv.id}
                                            $active={activeConversation?.id === conv.id}
                                            onClick={() => handleSelectConversation(conv)}
                                        >
                                            <Avatar>
                                                {conv.profilePic ? (
                                                    <img src={conv.profilePic} alt={`${conv.name}'s avatar`}/>
                                                ) : (
                                                    <User size={24} color="#9ca3af"/>
                                                )}
                                            </Avatar>
                                            <ConversationInfo>
                                                <h3>{conv.name}</h3>
                                                {conv.lastMessageText && (
                                                    <p>{conv.lastMessageText}</p>
                                                )}
                                            </ConversationInfo>
                                            {conv.is_unread && <UnreadIndicator/>}
                                        </ConversationItem>
                                    ))
                                ) : (
                                    <p style={{padding: '1rem', color: '#9ca3af'}}>No conversations yet.</p>
                                )}

                                {!token && (
                                    <p style={{padding: '1rem', color: '#9ca3af'}}>Please log in to see
                                        conversations.</p>
                                )}
                            </>
                        )}
                    </ConversationsList>

                    {!showMobileList ? (
                        <ChatArea>
                            {activeConversation ? (
                                <>
                                    <ChatHeader>
                                        <BackButton onClick={handleBackClick}>
                                            <ArrowLeft size={20}/>
                                        </BackButton>
                                        <Avatar>
                                            {activeConversation.profilePic ? (
                                                <img
                                                    src={activeConversation.profilePic}
                                                    alt={`${activeConversation.name}'s avatar`}
                                                />
                                            ) : (
                                                <User size={24} color="#9ca3af"/>
                                            )}
                                        </Avatar>
                                        <ConversationInfo>
                                            <h3>{activeConversation.name}</h3>
                                            {socket?.readyState === WebSocket.OPEN ? (
                                                <StatusIndicator $online>Online</StatusIndicator>
                                            ) : (
                                                <StatusIndicator>Connecting...</StatusIndicator>
                                            )}
                                        </ConversationInfo>
                                    </ChatHeader>

                                    <MessageList>
                                        {isLoadingMessages ? (
                                            <p style={{textAlign: 'center', color: '#9ca3af'}}>Loading messages...</p>
                                        ) : (
                                            <>
                                                {messages.length > 0 ? (
                                                    messages.map(msg => (
                                                        <MessageWrapper key={msg.id} $sent={msg.sent}>
                                                            {!msg.sent && (
                                                                <Avatar style={{width: '2rem', height: '2rem'}}>
                                                                    {activeConversation.profilePic ? (
                                                                        <img
                                                                            src={activeConversation.profilePic}
                                                                            alt={`${activeConversation.name}'s avatar`}
                                                                        />
                                                                    ) : (
                                                                        <User size={16} color="#9ca3af"/>
                                                                    )}
                                                                </Avatar>
                                                            )}
                                                            <div>
                                                                <MessageBubble $sent={msg.sent}>
                                                                    {msg.text}
                                                                </MessageBubble>
                                                                <MessageTime $sent={msg.sent}>
                                                                    {formatTime(new Date(msg.timestamp))}
                                                                    {msg.sent && msg.read_at && " • Read"}
                                                                </MessageTime>
                                                            </div>
                                                        </MessageWrapper>
                                                    ))
                                                ) : (
                                                    <p style={{textAlign: 'center', color: '#9ca3af'}}>
                                                        No messages yet. Be the first to send one!
                                                    </p>
                                                )}
                                            </>
                                        )}
                                        <div ref={messagesEndRef}/>
                                    </MessageList>

                                    <InputArea>
                                        <InputForm onSubmit={handleSubmitMessage}>
                                            <MessageInput
                                                type="text"
                                                placeholder="Type a message..."
                                                value={newMessage}
                                                onChange={(e) => {
                                                    setNewMessage(e.target.value);
                                                }}
                                                disabled={isLoadingMessages || !socket || socket.readyState !== WebSocket.OPEN}
                                            />
                                            <SendButton
                                                type="submit"
                                                disabled={!newMessage.trim() || isLoadingMessages || !socket || socket.readyState !== WebSocket.OPEN}
                                            >
                                                <Send size={18}/>
                                            </SendButton>
                                        </InputForm>
                                    </InputArea>
                                </>
                            ) : (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: '100%'
                                }}>
                                    <div style={{textAlign: 'center', color: '#9ca3af'}}>
                                        <MessageSquare size={48} style={{margin: '0 auto 1rem'}}/>
                                        <p>Select a conversation to start chatting</p>
                                    </div>
                                </div>
                            )}
                        </ChatArea>
                    ) : (
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
                    )}
                </ChatContainer>
            </MainContent>
        </Container>
    );
};

export default ChatScreen;