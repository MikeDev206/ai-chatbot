import { useState, useCallback, useEffect, useRef } from 'react';
import { getTimeBasedGreeting } from '../utils/greetings';
import { ChatMessage } from '../services/api';
import debounce from 'lodash/debounce';

interface UseChatStateProps {
  inactivityTimeout: number;
  initialMessage?: string;
  skipInitialGreeting?: boolean;
}

export const useChatState = ({
  inactivityTimeout,
  initialMessage,
  skipInitialGreeting = false
}: UseChatStateProps) => {
  const [isOpen] = useState(true); // Always open in maximized mode
  const [isMaximized, setIsMaximized] = useState(true); // Always maximized
  const [sessionActive, setSessionActive] = useState(false);
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);
  const [greeting, setGreeting] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastActivityRef = useRef<number>(Date.now());

  // Debounced activity handler to prevent excessive state updates
  const debouncedSetActivity = useCallback(
    debounce(() => {
      lastActivityRef.current = Date.now();
      setShowTimeoutMessage(false);
    }, 1000),
    []
  );

  const handleActivity = useCallback(() => {
    debouncedSetActivity();
  }, [debouncedSetActivity]);

  // Initialize the chat session with greeting
  const initializeSession = useCallback(() => {
    if (!sessionActive) {
      setSessionActive(true);
      handleActivity();
      const initialGreeting = initialMessage || getTimeBasedGreeting();
      setGreeting(initialGreeting);
      
      // Only add greeting message if not skipped
      if (!skipInitialGreeting) {
        setMessages([{
          id: 'greeting',
          text: initialGreeting,
          sender: 'bot',
          timestamp: new Date()
        }]);
      }
    }
  }, [sessionActive, handleActivity, initialMessage, skipInitialGreeting]);

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

  // Efficient inactivity check
  useEffect(() => {
    const checkInactivity = () => {
      const timeSinceLastActivity = Date.now() - lastActivityRef.current;
      
      if (timeSinceLastActivity >= inactivityTimeout) {
        resetSession();
        console.log('Chat session closed due to inactivity:', new Date().toISOString());
      }
    };

    if (sessionActive) {
      timeoutRef.current = setInterval(checkInactivity, Math.min(inactivityTimeout, 60000));
    }

    return () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }
    };
  }, [sessionActive, inactivityTimeout, resetSession]);

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