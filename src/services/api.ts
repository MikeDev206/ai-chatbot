export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  responseTime?: number; // Time in milliseconds it took to get response
  // User identification placeholders for backend integration
  userId?: string;
  userName?: string;
  userProfile?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    preferences?: Record<string, any>;
  };
}

export interface ChatResponse {
  message: ChatMessage;
  error?: string;
}

// Add conversation ID storage at module level
let conversationId: string | null = null;

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const API_KEY = process.env.REACT_APP_API_KEY;

export async function sendMessage(message: string): Promise<ChatResponse> {
  try {
    // Prepare headers with optional conversation ID
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      "access-control-allow-origin": "*",
      ...(API_KEY && { 'Authorization': `Bearer ${API_KEY}` }),
      ...(conversationId && { 'X-Disney-Internal-conversationId': conversationId })
    };

    const response = await fetch(`${API_URL}/cruise-availability-details/genai/availability`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: message }),
    });

    // Store new conversation ID if present
    const newConversationId = response.headers.get('X-Disney-Internal-conversationId');
    if (newConversationId) {
      conversationId = newConversationId;
    }

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const data = await response.json();
    return {
      message: {
        id: Date.now().toString(),
        text: data.message ?? JSON.stringify(data.results),
        sender: 'bot',
        timestamp: new Date(),
      },
    };
  } catch (error) {
    console.error('Error sending message:', error);
    const fallbackResponse = await fetch('./assets/availability-fallback.json');
    const data = await fallbackResponse.json();

    return {
      message: {
        id: Date.now().toString(),
        text: data.message ?? JSON.stringify(data.results),
        sender: 'bot',
        timestamp: new Date(),
      },
    };
  
    // return {
    //   message: {
    //     id: Date.now().toString(),
    //     text: 'Sorry, I encountered an error. Please try again later.',
    //     sender: 'bot',
    //     timestamp: new Date(),
    //   },
    //   error: error instanceof Error ? error.message : 'Unknown error',
    // };
  }
} 