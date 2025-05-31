import { useState, useCallback, useRef } from 'react';
import { sendMessage, ChatMessage } from '../services/api';

// Simple debounce implementation
const createDebounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): T => {
  let timeout: NodeJS.Timeout | undefined;
  
  return ((...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  }) as T;
};

interface UseMessageHandlerProps {
  onActivity: () => void;
  maxMessageLength: number;
  setMessages: (messages: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void;
}

export const useMessageHandler = ({ 
  onActivity, 
  maxMessageLength,
  setMessages 
}: UseMessageHandlerProps) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fallbackCache = useRef<any>(null);

  // Debounced activity handler
  const debouncedActivity = useCallback(
    createDebounce(() => {
      onActivity();
    }, 1000),
    [onActivity]
  );

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxMessageLength) {
      setInputMessage(value);
      debouncedActivity();
    }
  }, [maxMessageLength, debouncedActivity]);

  const getFallbackData = async () => {
    if (!fallbackCache.current) {
      try {
        const response = await fetch('./assets/availability-fallback.json');
        fallbackCache.current = await response.json();
      } catch (error) {
        console.error('Error loading fallback data:', error);
        return null;
      }
    }
    return fallbackCache.current;
  };

  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const startTime = Date.now();
      const response = await sendMessage(inputMessage);
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      if (response.message) {
        setMessages(prev => [
          ...prev,
          {
            ...response.message,
            responseTime
          }
        ]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: 'Sorry, I encountered an error. Please try again later.',
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, isLoading, setMessages]);

  return {
    inputMessage,
    isLoading,
    handleInputChange,
    handleSendMessage
  };
}; 