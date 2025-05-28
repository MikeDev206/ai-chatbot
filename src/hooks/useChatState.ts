import { useState, useCallback, useEffect } from 'react';
import { getTimeBasedGreeting } from '../utils/greetings';
import { ChatMessage } from '../services/api';

interface UseChatStateProps {
  inactivityTimeout: number;
  initialMessage?: string;
}

export const useChatState = ({ inactivityTimeout, initialMessage }: UseChatStateProps) => {
  const [isOpen] = useState(true); // Always open in maximized mode
  const [isMaximized, setIsMaximized] = useState(true); // Always maximized
  const [sessionActive, setSessionActive] = useState(false);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  const [greeting, setGreeting] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleActivity = useCallback(() => {
    setLastActivity(Date.now());
    setShowTimeoutMessage(false);
  }, []);

  // Initialize the chat session with greeting
  const initializeSession = useCallback(() => {
    if (!sessionActive) {
      setSessionActive(true);
      handleActivity();
      const initialGreeting = initialMessage || getTimeBasedGreeting();
      setGreeting(initialGreeting);
      setMessages([{
        id: 'greeting',
        text: initialGreeting,
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
  }, [sessionActive, handleActivity, initialMessage]);

  // Initialize session on component mount
  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  const toggleMaximize = useCallback(() => {
    setIsMaximized((prev) => !prev);
    handleActivity();
  }, [handleActivity]);

  const resetSession = useCallback(() => {
    setSessionActive(false);
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
    toggleMaximize,
    setMessages,
    setGreeting
  };
}; 