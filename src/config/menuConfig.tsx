
import {
  Home, Calendar, Bell, Settings,
  Calculator, ScrollText, Globe, User, Users
} from "lucide-react";

export const menuCategories = [
  {
    title: 'main',
    items: [
      { title: 'Início', icon: <Home size={20} />, href: '/' }
    ]
  },
  {
    title: 'Eventos',
    items: [
      { title: 'Meus Eventos', icon: <Calendar size={20} />, href: '/eventos' },
      { title: 'Agenda', icon: <ScrollText size={20} />, href: '/agenda' },
      { title: 'Explorar', icon: <Globe size={20} />, href: '/explorar' }
    ]
  },
  {
    title: 'Grupos',
    items: [
      { title: 'Meus Grupos', icon: <Users size={20} />, href: '/grupos' }
    ]
  },
  {
    title: 'Notificações',
    items: [
      { title: 'Notificações', icon: <Bell size={20} />, href: '/notificacoes' }
    ]
  },
  {
    title: 'Conta',
    items: [
      { title: 'Meu Perfil', icon: <User size={20} />, href: '/perfil' },
      { title: 'Calculadora de Rateio', icon: <Calculator size={20} />, href: '/calculadora' },
      { title: 'Acessibilidade', icon: <Settings size={20} />, href: '/acessibilidade' }
    ]
  }
];

