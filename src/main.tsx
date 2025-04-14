
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize all user preferences from localStorage
const initUserPreferences = () => {
  // Dark mode
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // High contrast mode
  const isHighContrast = localStorage.getItem('highContrast') === 'true';
  if (isHighContrast) {
    document.documentElement.classList.add('high-contrast');
  }
  
  // Reduced motion
  const isReducedMotion = localStorage.getItem('reducedMotion') === 'true';
  if (isReducedMotion) {
    document.documentElement.classList.add('reduce-motion');
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
    
    switch (fontFamily) {
      case 'serif':
        document.documentElement.classList.add('font-serif');
        break;
      case 'mono':
        document.documentElement.classList.add('font-mono');
        break;
      case 'dyslexic':
        document.documentElement.classList.add('font-dyslexic');
        break;
      default:
        document.documentElement.classList.add('font-sans');
    }
  }
};

// Initialize user preferences before rendering
initUserPreferences();

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

const root = createRoot(rootElement);
root.render(<App />);
