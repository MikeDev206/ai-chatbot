import React from 'react';
import ChatInterface from '../chatinterface/ChatInterface';
import { useChatState } from '../../hooks/useChatState';
import './ChatWidget.css';
import CapitalLetters from '../CapitalLetters';

const INACTIVITY_TIMEOUT = parseInt(process.env.REACT_APP_INACTIVITY_TIMEOUT || '180000', 10);
const CHAT_TITLE = process.env.REACT_APP_CHAT_TITLE || 'Chat with us';
const MAX_MESSAGE_LENGTH = 5000;

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
    initialMessage,
    skipInitialGreeting: true
  });

  return (
    <>
      <div className="backdrop visible" />
      <div className={`chat-popup maximized ${messages.length > 0 ? 'has-messages' : ''}`}>
        <div className="chat-popup-header">
          <h3><CapitalLetters text={CHAT_TITLE} /></h3>
        </div>
        <div className="welcome-container">
          <h1 className="welcome-title">
            <CapitalLetters text={`Welcome to ${CHAT_TITLE}`} />
          </h1>
          <p className="welcome-subtitle">
            <CapitalLetters text={greeting} />
          </p>
        </div>
        <ChatInterface 
          onActivity={handleActivity}
          maxMessageLength={MAX_MESSAGE_LENGTH}
          messages={messages}
          setMessages={setMessages}
        />
      </div>
    </>
  );
};

export default ChatWidget; 