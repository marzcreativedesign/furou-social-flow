
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

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

const root = createRoot(rootElement);
root.render(<App />);
