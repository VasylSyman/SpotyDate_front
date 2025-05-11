import {useState, useEffect, useRef, useCallback} from 'react';
import {WS_URL} from "../../config";

const useWebSocket = (token, activeConversationRef, setMessages, setConversations, fetchMessages) => {
    const [socket, setSocket] = useState(null);
    const [typingUsers, setTypingUsers] = useState({});
    const isManuallyClosingRef = useRef(false);
    const reconnectTimeoutRef = useRef(null);

    useEffect(() => {
        if (!token || socket?.readyState === WebSocket.OPEN || isManuallyClosingRef.current) return;

        const connectWebSocket = () => {
            console.log('Attempting to connect WebSocket...');
            const ws = new WebSocket(`ws://${WS_URL}/ws/${token}`);

            ws.onopen = () => {
                console.log('WebSocket connection established');
                setSocket(ws);
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                    reconnectTimeoutRef.current = null;
                }
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
                    const isForActiveConversation = currentConversationId && receivedMatchId &&
                        String(currentConversationId) === String(receivedMatchId);

                    console.log(`Received message for match ID: ${receivedMatchId}, Active conversation ID: ${currentConversationId}, Is for active conversation? ${isForActiveConversation}`);

                    if (data.message_id) {
                        console.log('INCOMING CHAT MESSAGE - FORWARDING TO HANDLER');
                        handleNewMessage(data, isForActiveConversation);
                    } else if (data.type === 'read_receipt') {
                        handleReadReceipt(data, isForActiveConversation);
                    } else if (data.type === 'typing') {
                        handleTypingIndicator(data);
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
                        connectWebSocket();
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
    }, [token, socket, activeConversationRef, fetchMessages]);

    const handleNewMessage = useCallback((data, isForActiveConversation) => {
        console.log('WebSocket received message:', data);
        console.log('Is for active conversation:', isForActiveConversation);

        if (!activeConversationRef.current) {
            console.warn('Active conversation is null, skipping message processing');
            return;
        }

        const isMessageFromCurrentUser = activeConversationRef.current.other_user ?
            data.sender_id !== activeConversationRef.current.other_user.user_id :
            data.is_sender_current_user;

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
    }, [socket, activeConversationRef, setMessages, setConversations]);

    const handleReadReceipt = useCallback((data, isForActiveConversation) => {
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
    }, [setConversations, setMessages]);

    const handleTypingIndicator = useCallback((data) => {
        console.log('Processing typing indicator for match:', data.match_id);
        setTypingUsers(prev => ({
            ...prev,
            [data.match_id]: {isTyping: data.is_typing, userId: data.user_id, timestamp: new Date()}
        }));
    }, []);

    return {socket, typingUsers};
};

export default useWebSocket;