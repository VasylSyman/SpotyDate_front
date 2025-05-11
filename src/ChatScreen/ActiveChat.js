import React, {useRef, useEffect} from 'react';
import {User, ArrowLeft, Send, MessageSquare} from 'lucide-react';
import {
    ChatArea,
    ChatHeader,
    Avatar,
    ConversationInfo,
    StatusIndicator,
    BackButton,
    MessageList,
    InputArea,
    InputForm,
    MessageInput,
    SendButton
} from './Layout';
import MessageItem from './MessageItem';

const ActiveChat = ({
                        activeConversation,
                        messages,
                        isLoadingMessages,
                        newMessage,
                        setNewMessage,
                        handleSubmitMessage,
                        handleBackClick,
                        socket
                    }) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current && messages.length > 0) {
            messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
        }
    }, [messages]);

    if (!activeConversation) {
        return (
            <ChatArea>
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
            </ChatArea>
        );
    }

    return (
        <ChatArea>
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
                                <MessageItem
                                    key={msg.id}
                                    message={msg}
                                    activeConversation={activeConversation}
                                />
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
                        onChange={(e) => setNewMessage(e.target.value)}
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
        </ChatArea>
    );
};

export default ActiveChat;