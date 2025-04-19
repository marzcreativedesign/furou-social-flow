
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Inicializa as preferências do usuário antes de renderizar
const initUserPreferences = () => {
  // Dark mode
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  }
  
  // Font size
  const fontSize = localStorage.getItem('fontSize');
  if (fontSize) {
    document.documentElement.style.fontSize = `${fontSize}%`;
  }
  
  // Font family
  const fontFamily = localStorage.getItem('fontFamily');
  if (fontFamily) {
    document.documentElement.classList.remove('font-sans', 'font-serif', 'font-mono', 'font-dyslexic');
    document.documentElement.classList.add(`font-${fontFamily}`);
  }
  
  // High contrast
  const highContrast = localStorage.getItem('highContrast') === 'true';
  if (highContrast) {
    document.documentElement.classList.add('high-contrast');
  }
  
  // Reduced motion
  const reducedMotion = localStorage.getItem('reducedMotion') === 'true';
  if (reducedMotion) {
    document.documentElement.classList.add('reduce-motion');
  }
};

// Carrega preferências do usuário antes de renderizar para evitar layout shifts
document.addEventListener('DOMContentLoaded', () => {
  initUserPreferences();
});

// Executa uma vez imediatamente para evitar mudança de layout (CLS)
initUserPreferences();

// Register service worker for offline support and caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}

// Adiciona listener para conexão offline/online
window.addEventListener('online', () => {
  document.documentElement.classList.remove('offline-mode');
  console.log('App is online');
});

window.addEventListener('offline', () => {
  document.documentElement.classList.add('offline-mode');
  console.log('App is offline');
});

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

const root = createRoot(rootElement);
root.render(<React.StrictMode><App /></React.StrictMode>);
