
import {
  Home, Calendar, Bell, Settings, 
  Calculator, ScrollText, Globe, User, 
  Users, FileText, HelpCircle
} from "lucide-react";

export const menuCategories = [
  {
    title: 'main',
    items: [
      { title: 'Início', icon: <Home size={18} />, href: '/' }
    ]
  },
  {
    title: 'Eventos',
    items: [
      { title: 'Meus Eventos', icon: <Calendar size={18} />, href: '/eventos' },
      { title: 'Agenda', icon: <ScrollText size={18} />, href: '/agenda' },
      { title: 'Explorar', icon: <Globe size={18} />, href: '/explorar' }
    ]
  },
  {
    title: 'Grupos',
    items: [
      { title: 'Meus Grupos', icon: <Users size={18} />, href: '/grupos' }
    ]
  },
  {
    title: 'Notificações',
    items: [
      { title: 'Notificações', icon: <Bell size={18} />, href: '/notificacoes' }
    ]
  },
  {
    title: 'Conta',
    items: [
      { title: 'Meu Perfil', icon: <User size={18} />, href: '/perfil' },
      { title: 'Calculadora de Rateio', icon: <Calculator size={18} />, href: '/calculadora' },
      { title: 'Acessibilidade', icon: <Settings size={18} />, href: '/acessibilidade' }
    ]
  },
  {
    title: 'Outros',
    items: [
      { title: 'Documentação', icon: <FileText size={18} />, href: '/documentacao' },
      { title: 'Suporte', icon: <HelpCircle size={18} />, href: '/suporte' }
    ]
  }
];
