
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Inicializa apenas o modo escuro, sem as outras configurações de acessibilidade
const initUserPreferences = () => {
  // Dark mode
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  
  // Limpar qualquer classe de acessibilidade que possa ter sido aplicada
  document.documentElement.classList.remove('high-contrast', 'reduce-motion');
  document.documentElement.style.fontSize = '100%';
};

// Inicializa as preferências do usuário antes de renderizar
initUserPreferences();

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

const root = createRoot(rootElement);
root.render(<App />);
