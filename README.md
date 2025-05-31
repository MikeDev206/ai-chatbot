# AI Chatbot with Disney-Inspired UI

A modern, responsive chatbot interface featuring Disney's magical design aesthetics and glass morphism effects.

## Features

### Visual Design
- **Disney 70th Anniversary-Inspired Theme**
  - Vibrant color palette with magical gradients
  - Glass morphism effects throughout the interface
  - Responsive design that adapts to all screen sizes
  - Consistent Disney branding with the "D" logo
  - Smooth loading animations with gooey effect

### Chat Interface Elements

#### Message Bubbles
- **User Messages**
  - Deep blue-purple gradient background
  - Glass morphism effect with blur and transparency
  - Top-right sharp corner design
  - Subtle white border for depth
  - Centered bubble tip alignment with avatar
  - Profile picture upload functionality

- **Bot Messages**
  - Luminescent gold gradient (85% opacity)
  - Disney "D" logo as avatar
  - Glass morphism effect with backdrop blur
  - Top-left sharp corner design
  - Response time display
  - Ride availability formatting support

#### Loading Indicator
- Clean, minimalist design with three dots
- Maintains Disney "D" logo during loading
- Smooth gooey animation effect
- Consistent with bot message styling

### Responsive Design
- **Mobile-First Breakpoints**:
  - Extra Small (≤ 380px): Full-width layout
  - Small (381px - 576px): 100% width with padding
  - Medium (577px - 768px): 85% width
  - Large (769px - 992px): 75% width
  - Extra Large (993px - 1200px): 65% width
  - XXL (≥ 1201px): 50% width

- **Height-Based Responsiveness**:
  - Tall screens (≥ 1024px)
  - Standard height (768px - 1023px)
  - Short screens (601px - 767px)
  - Very short screens (≤ 600px)
  - Landscape mode optimizations

- **Device-Specific Support**:
  - iOS Safari optimizations
  - Notch handling
  - Foldable devices
  - High pixel density screens
  - Touch devices
  - Dark mode

### Accessibility
- High contrast mode support
- Reduced motion preferences
- Screen reader compatibility
- Keyboard navigation
- Print styles

## Backend Integration Points

### API Service (`src/services/api.ts`)
The chatbot interface expects the following endpoints and data structures:

#### Message Structure
```typescript
interface ChatMessage {
  id: string;          // Unique message identifier
  text: string;        // Message content
  sender: 'user' | 'bot'; // Message sender
  timestamp: Date;     // Message timestamp
  responseTime?: number; // Time taken to generate response (for bot messages)
}
```

#### Ride Availability Format
For ride availability responses, use this JSON structure:
```json
{
  "_id": "RideName",
  "totalAvailability": 123
}
```
Example response text:
```
{"_id":"Space Mountain","totalAvailability":50} {"_id":"Pirates","totalAvailability":30} 14:30 hrs We took 1.2s to answer
```

#### Required Endpoints
1. **Send Message**
   - Endpoint: Configurable in environment
   - Method: POST
   - Headers:
     - `X-Disney-Internal-conversationId`: Conversation tracking
   - Request Body:
     ```typescript
     {
       message: string;
       userId?: string;
     }
     ```
   - Response:
     ```typescript
     {
       message: ChatMessage;
       conversationId: string;
     }
     ```

2. **User Management** (Placeholders available)
   - Profile picture storage
   - User identification
   - Session management

### Environment Variables
```env
REACT_APP_API_BASE_URL=your_backend_url
REACT_APP_API_VERSION=v1
REACT_APP_WEBSOCKET_URL=optional_websocket_url
```

## Recent Updates
1. **Loading State Enhancement**
   - Fixed avatar persistence during loading
   - Added gooey loading animation
   - Maintained consistent Disney branding

2. **Responsive Design Improvements**
   - Added comprehensive breakpoints
   - Implemented height-based responsiveness
   - Added device-specific optimizations

3. **User Experience**
   - Added profile picture upload
   - Improved message formatting
   - Enhanced accessibility

## Development

### Prerequisites
- Node.js
- Modern web browser
- Text editor with CSS support

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables
4. Start development server: `npm start`

### Building for Production
```bash
npm run build
```

### Contributing
Contributions are welcome! Please read our contributing guidelines and submit pull requests.

## License
[Add your license here]

## Acknowledgments
- Inspired by Disney's 70th Anniversary design language
- Glass morphism effects inspired by modern UI trends
- Special thanks to the Disney design team for inspiration
