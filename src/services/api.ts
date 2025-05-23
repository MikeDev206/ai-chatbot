export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatResponse {
  message: ChatMessage;
  error?: string;
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const API_KEY = process.env.REACT_APP_API_KEY;

export async function sendMessage(message: string): Promise<ChatResponse> {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(API_KEY && { 'Authorization': `Bearer ${API_KEY}` })
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const data = await response.json();
    return {
      message: {
        id: Date.now().toString(),
        text: data.response,
        sender: 'bot',
        timestamp: new Date(),
      },
    };
  } catch (error) {
    console.error('Error sending message:', error);
    return {
      message: {
        id: Date.now().toString(),
        text: 'Sorry, I encountered an error. Please try again later.',
        sender: 'bot',
        timestamp: new Date(),
      },
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
} 