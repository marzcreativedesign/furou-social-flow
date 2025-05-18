
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Inicializa as preferências do usuário antes de renderizar
const initUserPreferences = () => {
  try {
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
  } catch (err) {
    console.error('Erro ao inicializar preferências:', err);
  }
};

// Carrega preferências do usuário antes de renderizar para evitar layout shifts
document.addEventListener('DOMContentLoaded', () => {
  initUserPreferences();
});

// Executa uma vez imediatamente para evitar mudança de layout (CLS)
try {
  initUserPreferences();
} catch (e) {
  console.error('Falha ao inicializar preferências:', e);
}

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

// Função para indicar que o app foi carregado com sucesso
const markAppAsLoaded = () => {
  window.appLoaded = true;
  const fallback = document.getElementById('loading-fallback');
  if (fallback) fallback.style.display = 'none';
  console.log('App carregado com sucesso!');
};

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Elemento root não encontrado!");
  // Se não encontrar o root, mostra o fallback
  const fallback = document.getElementById('loading-fallback');
  if (fallback) {
    fallback.style.display = 'flex';
    const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
      errorContainer.style.display = 'block';
      errorContainer.textContent = 'Não foi possível encontrar o elemento root para renderizar o aplicativo.';
    }
  }
  throw new Error("Root element not found");
}

try {
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <React.Suspense fallback={<div>Carregando...</div>}>
        <App />
      </React.Suspense>
    </React.StrictMode>
  );
  // Marcar app como carregado após renderização bem-sucedida
  setTimeout(markAppAsLoaded, 500);
} catch (error) {
  console.error("Erro ao renderizar a aplicação:", error);
  // Mostrar mensagem de erro
  const fallback = document.getElementById('loading-fallback');
  const errorContainer = document.getElementById('error-container');
  if (fallback) fallback.style.display = 'flex';
  if (errorContainer) {
    errorContainer.style.display = 'block';
    errorContainer.textContent = `Erro ao carregar o aplicativo: ${error.message}`;
  }
}
