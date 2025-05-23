import { useState, useCallback } from 'react';
import { sendMessage, ChatMessage } from '../services/api';

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

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxMessageLength) {
      setInputMessage(value);
      onActivity();
    }
  }, [maxMessageLength, onActivity]);

  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    onActivity();

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendMessage(inputMessage.trim());
      setMessages((prev) => [...prev, response.message]);
      onActivity();
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        text: 'Sorry, something went wrong. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, isLoading, onActivity, setMessages]);

  return {
    inputMessage,
    isLoading,
    handleInputChange,
    handleSendMessage
  };
}; 