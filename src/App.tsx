import React, { Suspense } from 'react';
import './App.css';
// Import font files
import './assets/fonts/waltograph42.otf';
import './assets/fonts/waltographUI.ttf';

// Lazy load the ChatWidget
const ChatWidget = React.lazy(() => import('./components/chatwidget/ChatWidget'));

function App() {
  return (
    <div className="App">
      <Suspense fallback={<div className="loading-fallback">Loading...</div>}>
        <ChatWidget />
      </Suspense>
    </div>
  );
}

export default App;
