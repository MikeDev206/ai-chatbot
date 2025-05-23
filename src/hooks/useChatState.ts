import { useState, useCallback, useEffect } from 'react';
import { getTimeBasedGreeting } from '../utils/greetings';
import { ChatMessage } from '../services/api';

interface UseChatStateProps {
  inactivityTimeout: number;
}

export const useChatState = ({ inactivityTimeout }: UseChatStateProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  const [greeting, setGreeting] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleActivity = useCallback(() => {
    setLastActivity(Date.now());
    setShowTimeoutMessage(false);
  }, []);

  const toggleChat = useCallback(() => {
    if (!isOpen && !sessionActive) {
      setSessionActive(true);
      handleActivity();
      setGreeting(getTimeBasedGreeting());
      setMessages([{
        id: 'greeting',
        text: getTimeBasedGreeting(),
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
    setIsOpen((prev) => !prev);
    // Reset maximized state when closing
    if (isOpen) {
      setIsMaximized(false);
    }
  }, [isOpen, sessionActive, handleActivity]);

  const toggleMaximize = useCallback(() => {
    setIsMaximized((prev) => !prev);
    handleActivity();
  }, [handleActivity]);

  const resetSession = useCallback(() => {
    setSessionActive(false);
    setIsOpen(false);
    setIsMaximized(false);
    setShowTimeoutMessage(true);
    setGreeting('');
    setMessages([]);
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (sessionActive) {
      timeoutId = setTimeout(() => {
        const timeSinceLastActivity = Date.now() - lastActivity;
        
        if (timeSinceLastActivity >= inactivityTimeout) {
          resetSession();
          console.log('Chat session closed due to inactivity:', new Date().toISOString());
        }
      }, inactivityTimeout);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [lastActivity, sessionActive, inactivityTimeout, resetSession]);

  return {
    isOpen,
    isMaximized,
    sessionActive,
    showTimeoutMessage,
    greeting,
    messages,
    handleActivity,
    toggleChat,
    toggleMaximize,
    setMessages
  };
}; 