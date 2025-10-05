import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { QueryProvider } from './providers/QueryProvider';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { registerServiceWorker } from './utils/serviceWorker';

// Register Service Worker for offline-first caching
registerServiceWorker().then((registration) => {
  if (registration) {
    console.log('🚀 Service Worker active - Images will load instantly from cache!');
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <App />
      </QueryProvider>
    </BrowserRouter>
  </React.StrictMode>
);
