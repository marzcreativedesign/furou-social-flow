
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize user preferences
const initUserPreferences = () => {
  try {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
    
    const fontSize = localStorage.getItem('fontSize');
    if (fontSize) {
      document.documentElement.style.fontSize = `${fontSize}%`;
    }
    
    const fontFamily = localStorage.getItem('fontFamily');
    if (fontFamily) {
      document.documentElement.classList.remove('font-sans', 'font-serif', 'font-mono', 'font-dyslexic');
      document.documentElement.classList.add(`font-${fontFamily}`);
    }
    
    const highContrast = localStorage.getItem('highContrast') === 'true';
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    }
    
    const reducedMotion = localStorage.getItem('reducedMotion') === 'true';
    if (reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    }
  } catch (err) {
    console.error('Error initializing preferences:', err);
  }
};

// Service Worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registered:', registration.scope);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed:', error);
      });
  });
}

// Online/offline listeners
window.addEventListener('online', () => {
  document.documentElement.classList.remove('offline-mode');
});

window.addEventListener('offline', () => {
  document.documentElement.classList.add('offline-mode');
});

// Mark app as loaded
const markAppAsLoaded = () => {
  (window as any).appLoaded = true;
  const fallback = document.getElementById('loading-fallback');
  if (fallback) fallback.style.display = 'none';
};

// Initialize preferences and render app
try {
  initUserPreferences();
  
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }

  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <React.Suspense fallback={<div>Carregando...</div>}>
        <App />
      </React.Suspense>
    </React.StrictMode>
  );
  
  setTimeout(markAppAsLoaded, 500);
} catch (error) {
  console.error("Error rendering app:", error);
  const fallback = document.getElementById('loading-fallback');
  const errorContainer = document.getElementById('error-container');
  if (fallback) fallback.style.display = 'flex';
  if (errorContainer) {
    errorContainer.style.display = 'block';
    errorContainer.textContent = `Erro: ${error.message}`;
  }
}
