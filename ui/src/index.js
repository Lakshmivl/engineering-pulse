import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';

// Handle redirect from error.html for direct URL access
const handleRedirect = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const redirectPath = urlParams.get('redirect');
  
  if (redirectPath) {
    // Clear the redirect parameter from URL
    window.history.replaceState({}, document.title, redirectPath);
  }
};

// Execute redirect handling before rendering
handleRedirect();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
