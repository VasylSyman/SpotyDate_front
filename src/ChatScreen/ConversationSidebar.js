import React from 'react';
import {User} from 'lucide-react';
import {
    ConversationsList,
    ConversationHeader,
    ConversationItem,
    Avatar,
    ConversationInfo,
    UnreadIndicator
} from './Layout';

const ConversationSidebar = ({
                                 conversations,
                                 isLoading,
                                 activeConversationId,
                                 onSelectConversation,
                                 showOnMobile,
                                 token
                             }) => {
    return (
        <ConversationsList $showOnMobile={showOnMobile}>
            <ConversationHeader>Messages</ConversationHeader>

            {isLoading ? (
                <p style={{padding: '1rem', color: '#9ca3af'}}>Loading conversations...</p>
            ) : (
                <>
                    {conversations.length > 0 ? (
                        conversations.map(conv => (
                            <ConversationItem
                                key={conv.id}
                                $active={activeConversationId === conv.id}
                                onClick={() => onSelectConversation(conv)}
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
                        <p style={{padding: '1rem', color: '#9ca3af'}}>Please log in to see conversations.</p>
                    )}
                </>
            )}
        </ConversationsList>
    );
};

export default ConversationSidebar;