import React, { useRef, useEffect, useCallback } from 'react';
import './ChatInterface.css';
import { ChatMessage } from '../../services/api';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useMessageHandler } from '../../hooks/useMessageHandler';
import CapitalLetters from '../CapitalLetters';
import WindowedMessageList from './WindowedMessageList';

const MAX_MESSAGES = 100; // Maximum number of messages to keep in memory

interface ChatInterfaceProps {
  onActivity?: () => void;
  maxMessageLength?: number;
  initialGreeting?: string;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  onActivity = () => {},
  maxMessageLength = 1000,
  initialGreeting,
  messages,
  setMessages
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { 
    inputMessage, 
    isLoading, 
    handleInputChange, 
    handleSendMessage 
  } = useMessageHandler({
    onActivity,
    maxMessageLength,
    setMessages: useCallback((messagesOrUpdater: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => {
      setMessages((prev) => {
        const newMessages = typeof messagesOrUpdater === 'function' 
          ? messagesOrUpdater(prev)
          : messagesOrUpdater;
        
        // Limit the number of messages
        if (newMessages.length > MAX_MESSAGES) {
          return newMessages.slice(-MAX_MESSAGES);
        }
        return newMessages;
      });
    }, [setMessages])
  });

  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const newHeight = Math.max(
      44, // min height
      Math.min(textarea.scrollHeight, 120) // max height
    );
    textarea.style.height = `${newHeight}px`;
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputMessage, adjustTextareaHeight]);

  useEffect(() => {
    if (initialGreeting && messages.length === 0) {
      setMessages([{
        id: 'greeting',
        text: initialGreeting,
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
  }, [initialGreeting, messages.length, setMessages]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputMessage.trim()) {
        handleSendMessage(e as any);
      }
    }
  };

  const handleClearConversation = () => {
    setMessages([]);
  };

  const shouldShowClearButton = messages.length >= 2;

  return (
    <div className="chat-container" onClick={onActivity}>
      <WindowedMessageList 
        messages={messages}
        isLoading={isLoading}
      />
      
      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <div className="chat-input-wrapper">
          <textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="chat-input"
            disabled={isLoading}
            maxLength={maxMessageLength}
            rows={1}
          />
          {inputMessage.length > 0 && (
            <div className="character-count">
              <CapitalLetters text={`${inputMessage.length}/${maxMessageLength}`} />
            </div>
          )}
        </div>
        <div className="chat-buttons">
          {shouldShowClearButton && (
            <button 
              type="button" 
              className="clear-button" 
              onClick={handleClearConversation}
              title="Clear conversation"
            >
              <DeleteOutlineIcon />
            </button>
          )}
          <button 
            type="submit" 
            className="send-button" 
            disabled={isLoading || !inputMessage.trim()}
          >
            <CapitalLetters text={isLoading ? 'Sending...' : 'Send'} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface; 