import React from 'react';
import ChatInterface from './ChatInterface';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import { useChatState } from '../hooks/useChatState';
import './ChatWidget.css';

const INACTIVITY_TIMEOUT = parseInt(process.env.REACT_APP_INACTIVITY_TIMEOUT || '180000', 10);
const CHAT_TITLE = process.env.REACT_APP_CHAT_TITLE || 'Chat with us';
const MAX_MESSAGE_LENGTH = parseInt(process.env.REACT_APP_MAX_MESSAGE_LENGTH || '1000', 10);

const ChatWidget: React.FC = () => {
  const {
    isOpen,
    isMaximized,
    showTimeoutMessage,
    greeting,
    handleActivity,
    toggleChat,
    toggleMaximize
  } = useChatState({
    inactivityTimeout: INACTIVITY_TIMEOUT
  });

  return (
    <>
      <div className={`backdrop ${isMaximized && isOpen ? 'visible' : ''}`} />
      <div className="chat-widget-container">
        {isOpen && (
          <div className={`chat-popup ${isMaximized ? 'maximized' : ''}`}>
            <div className="chat-popup-header">
              <h3>{CHAT_TITLE}</h3>
              <div className="chat-header-buttons">
                <button 
                  className="header-button maximize-button" 
                  onClick={toggleMaximize}
                  aria-label={isMaximized ? "Minimize chat" : "Maximize chat"}
                >
                  {isMaximized ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
                </button>
                <button 
                  className="header-button close-button" 
                  onClick={toggleChat}
                  aria-label="Close chat"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>
            <ChatInterface 
              onActivity={handleActivity}
              maxMessageLength={MAX_MESSAGE_LENGTH}
              initialGreeting={greeting}
            />
          </div>
        )}
        
        {showTimeoutMessage && !isOpen && (
          <div className="timeout-message">
            Chat closed due to inactivity
          </div>
        )}

        <button
          className={`chat-toggle-button ${isOpen ? 'open' : ''}`}
          onClick={toggleChat}
          aria-label="Toggle chat"
        >
          {isOpen ? <CloseIcon /> : <ChatIcon />}
        </button>
      </div>
    </>
  );
};

export default ChatWidget; 