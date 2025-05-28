import React from 'react';
import ChatInterface from '../chatinterface/ChatInterface';
import { useChatState } from '../../hooks/useChatState';
import './ChatWidget.css';

const INACTIVITY_TIMEOUT = parseInt(process.env.REACT_APP_INACTIVITY_TIMEOUT || '180000', 10);
const CHAT_TITLE = process.env.REACT_APP_CHAT_TITLE || 'Chat with us';
const MAX_MESSAGE_LENGTH = parseInt(process.env.REACT_APP_MAX_MESSAGE_LENGTH || '1000', 10);

interface ChatWidgetProps {
  initialMessage?: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ initialMessage }) => {
  const {
    greeting,
    handleActivity,
    messages,
    setMessages
  } = useChatState({
    inactivityTimeout: INACTIVITY_TIMEOUT,
    initialMessage
  });

  return (
    <>
      <div className="backdrop visible" />
      <div className="chat-popup maximized">
        <div className="chat-popup-header">
          <h3>{CHAT_TITLE}</h3>
        </div>
        <ChatInterface 
          onActivity={handleActivity}
          maxMessageLength={MAX_MESSAGE_LENGTH}
          initialGreeting={greeting}
          messages={messages}
          setMessages={setMessages}
        />
      </div>
    </>
  );
};

export default ChatWidget; 