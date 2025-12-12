
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHomeData, FilterType } from "@/hooks/home/useHomeData";
import MainLayout from "@/components/MainLayout";
import { BentoGrid, type BentoItem } from "@/components/ui/bento-grid";
import {
    CheckCircle,
    TrendingUp,
    Video,
    Globe,
} from "lucide-react";
import { Event } from "@/types/event";

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  
  const {
    loading,
    filteredEvents,
    publicEvents,
    pendingActions,
    pendingInvites,
    handlePendingActionComplete,
    handleInviteStatusUpdate
  } = useHomeData(searchQuery, activeFilter);

  const homeItems: BentoItem[] = [
    {
        title: "Seus Eventos",
        meta: `${filteredEvents.length} eventos`,
        description:
            "Gerencie seus eventos pessoais e de grupo. Crie, edite e acompanhe a participação.",
        icon: <TrendingUp className="w-4 h-4 text-primary" />,
        status: "Ativo",
        tags: ["Eventos", "Pessoal", "Grupos"],
        colSpan: 2,
        hasPersistentHover: true,
        href: "/eventos",
        cta: "Ver Eventos"
    },
    {
        title: "Eventos Públicos",
        meta: `${publicEvents.length} disponíveis`,
        description: "Descubra eventos públicos e participe da comunidade.",
        icon: <Globe className="w-4 h-4 text-emerald-500" />,
        status: "Aberto",
        tags: ["Público", "Comunidade"],
        href: "/explorar",
        cta: "Explorar"
    },
    {
        title: "Mídia e Galeria",
        meta: "Memórias",
        description: "Acesse e compartilhe fotos e vídeos dos seus eventos.",
        icon: <Video className="w-4 h-4 text-purple-500" />,
        tags: ["Fotos", "Vídeos"],
        colSpan: 2,
        href: "/eventos",
        cta: "Ver Galeria"
    },
    {
        title: "Convites Pendentes",
        meta: `${pendingInvites.length} convites`,
        description: "Responda a convites de eventos e mantenha-se organizado.",
        icon: <CheckCircle className="w-4 h-4 text-sky-500" />,
        status: pendingInvites.length > 0 ? "Pendente" : "Atualizado",
        tags: ["Convites", "Agenda"],
        href: "/notificacoes",
        cta: "Responder"
    }
  ];

  return (
    <MainLayout title="Início">
      <div className="p-4 max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Bem-vindo ao Furou?!
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Organize seus eventos, conecte-se com amigos e nunca mais perca um encontro.
            Gerencie tudo em um só lugar.
          </p>
        </div>

        <BentoGrid items={homeItems} />
      </div>
    </MainLayout>
  );
};

export default HomePage;
