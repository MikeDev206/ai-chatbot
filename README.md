# React Floating Chat Widget

A modern, customizable floating chat widget built with React and TypeScript. This widget provides a seamless chat experience with session management, automatic timeout features, and cruise availability integration.

![Chat Widget Demo](demo.gif)

## Features

- 🎯 Floating chat button that can be placed anywhere on the page
- 🔄 Smooth animations for opening/closing the chat window
- ⏱️ Session management with 3-minute inactivity timeout
- 💾 Conversation state preservation during active sessions
- 📱 Responsive design that works on all devices
- ⌨️ Real-time typing indicators
- 🎨 Customizable themes and styles
- ♿ Accessibility-friendly with ARIA labels
- 🚢 Cruise availability integration with fallback responses

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-chatbot.git
cd ai-chatbot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
# API Configuration
REACT_APP_API_URL=http://localhost:3001
REACT_APP_API_KEY=your_api_key_here

# Chat Widget Configuration
REACT_APP_CHAT_TITLE="Chat with us"
REACT_APP_INITIAL_GREETING="Hello! How can I help you today?"
REACT_APP_INACTIVITY_TIMEOUT=180000
REACT_APP_MAX_MESSAGE_LENGTH=1000
```

4. Create an `assets` folder in the `public` directory and add your `availability-fallback.json` file for offline/error fallback responses.

5. Start the development server:
```bash
npm start
```

## Usage

### Basic Implementation

```tsx
import ChatWidget from './components/chatwidget/ChatWidget';

function App() {
  return (
    <div className="App">
      <ChatWidget />
    </div>
  );
}
```

### Component Structure

The widget consists of three main components:

1. `ChatWidget`: The main container component that handles the widget's state and session management
2. `ChatInterface`: The chat interface component that handles messages and user input
3. `API Service`: Handles communication with the cruise availability backend

## Cruise Availability Integration

The widget integrates with a cruise availability API:

### API Endpoint

The chat widget communicates with the cruise availability endpoint:
```typescript
${API_URL}/cruise-availability-details/genai/availability
```

### Authentication

API requests include:
- Bearer token authentication (when API_KEY is provided)
- CORS headers
- JSON content type

### Error Handling

The widget implements a robust error handling system:
1. Attempts to call the cruise availability API
2. On failure, falls back to local availability data
3. Uses a fallback JSON response from `public/assets/availability-fallback.json`

### Message Format

```typescript
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
```

## Session Management

The widget implements an intelligent session management system:

- Sessions remain active for 3 minutes after the last user interaction
- User interactions that reset the timeout include:
  - Typing messages
  - Sending messages
  - Clicking anywhere in the chat interface
  - Opening/closing the chat window
- After 3 minutes of inactivity:
  - The session is terminated
  - A timeout message is displayed
  - The chat window closes automatically
  - The conversation state is cleared

## Styling and Customization

### Chat Button

The floating chat button can be customized by modifying the CSS variables in `ChatWidget.css`:

```css
.chat-toggle-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #007bff; /* Primary color */
}
```

### Chat Window

The chat window's appearance can be modified through `ChatWidget.css`:

```css
.chat-popup {
  width: 350px;
  height: 500px;
  border-radius: 12px;
}
```

### Animations

The widget includes smooth animations for:
- Opening/closing the chat window
- Displaying timeout messages
- Hover effects on buttons

Animations can be customized in the CSS files:
```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

## Backend Integration

To connect the chat widget to your backend:

1. Update the API endpoint in `src/services/api.ts`:
```typescript
const API_URL = 'YOUR_BACKEND_API_URL';
```

2. Customize the message format in the API service:
```typescript
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}
```

## Configuration Options

You can modify the following constants in `ChatWidget.tsx`:

```typescript
// Inactivity timeout duration (in milliseconds)
const INACTIVITY_TIMEOUT = 3 * 60 * 1000; // 3 minutes

// Additional configuration options can be added here
```

## Browser Support

The widget is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with React and TypeScript
- Uses Material-UI icons for the chat button
- Implements modern React patterns and hooks
- Follows accessibility best practices
