
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface EventIdSearchProps {
  onSearch?: (eventId: string) => void;
  className?: string;
}

const EventIdSearch = ({ onSearch, className = '' }: EventIdSearchProps) => {
  const [eventId, setEventId] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventId.trim()) {
      toast({
        title: "ID necessário",
        description: "Por favor, digite o ID do evento",
        variant: "destructive"
      });
      return;
    }

    // Se onSearch foi fornecido, use-o
    if (onSearch) {
      onSearch(eventId.trim());
    } else {
      // Caso contrário, navegue diretamente para a página do evento
      navigate(`/evento/${eventId.trim()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex items-center gap-2 ${className}`}>
      <div className="relative flex-1">
        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
        <Input
          type="text"
          placeholder="Buscar evento por ID..."
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          className="pl-10 py-2 rounded-lg border-input bg-background focus:border-[#FF8A1E] dark:bg-[#262626] dark:border-[#2C2C2C]"
        />
      </div>
      <Button 
        type="submit" 
        size="sm"
        variant="secondary"
        className="bg-[#FF8A1E] hover:bg-[#FF7A00] text-white"
      >
        <Search size={18} />
      </Button>
    </form>
  );
};

export default EventIdSearch;
