import React from 'react';
import {User} from 'lucide-react';
import {
    MessageWrapper,
    Avatar,
    MessageBubble,
    MessageTime
} from './Layout';

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

const MessageItem = ({message, activeConversation}) => {
    return (
        <MessageWrapper $sent={message.sent}>
            {!message.sent && (
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
                <MessageBubble $sent={message.sent}>
                    {message.text}
                </MessageBubble>
                <MessageTime $sent={message.sent}>
                    {formatTime(new Date(message.timestamp))}
                    {message.sent && message.read_at && " • Read"}
                </MessageTime>
            </div>
        </MessageWrapper>
    );
};

export default MessageItem;