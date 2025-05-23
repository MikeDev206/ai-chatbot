import React, { useRef, useEffect } from 'react';
import './ChatInterface.css';
import { ChatMessage } from '../services/api';
import PersonIcon from '@mui/icons-material/Person';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import { useMessageHandler } from '../hooks/useMessageHandler';

interface ChatInterfaceProps {
  onActivity?: () => void;
  maxMessageLength?: number;
  initialGreeting?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  onActivity = () => {},
  maxMessageLength = 1000,
  initialGreeting
}) => {
  const [messages, setMessages] = React.useState<ChatMessage[]>(() => {
    if (initialGreeting) {
      return [{
        id: 'greeting',
        text: initialGreeting,
        sender: 'bot',
        timestamp: new Date()
      }];
    }
    return [];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { inputMessage, isLoading, handleInputChange, handleSendMessage } = useMessageHandler({
    onActivity,
    maxMessageLength,
    setMessages
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      
      // Calculate new height while respecting min/max constraints
      const newHeight = Math.max(
        44, // min height
        Math.min(textarea.scrollHeight, 120) // max height
      );
      
      textarea.style.height = `${newHeight}px`;
    }
  }, [inputMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputMessage.trim()) {
        handleSendMessage(e as any);
      }
    }
  };

  return (
    <div className="chat-container" onClick={onActivity}>
      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <div className={`message-avatar ${message.sender === 'user' ? 'user-avatar' : 'bot-avatar'}`}>
              {message.sender === 'user' ? <PersonIcon /> : <SentimentSatisfiedAltIcon />}
            </div>
            <div className="message-bubble">
              <div className="message-content">{message.text}</div>
              <div className="message-timestamp">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message bot-message">
            <div className="message-avatar bot-avatar">
              <SentimentSatisfiedAltIcon />
            </div>
            <div className="message-bubble">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSendMessage} className="chat-input-form">
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
            {inputMessage.length}/{maxMessageLength}
          </div>
        )}
        <button type="submit" className="send-button" disabled={isLoading || !inputMessage.trim()}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatInterface; 