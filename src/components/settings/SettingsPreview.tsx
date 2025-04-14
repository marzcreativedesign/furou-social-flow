
const SettingsPreview = () => {
  return (
    <div className="mt-8 space-y-4 border border-border rounded-xl p-4">
      <h3 className="text-lg font-medium">Visualização das configurações</h3>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-sm font-medium">Botões</p>
          <div className="flex flex-wrap gap-2">
            <button className="btn-primary">Primário</button>
            <button className="btn-secondary">Secundário</button>
            <button className="btn-outline">Contorno</button>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Cards</p>
          <div className="event-card p-4">
            <p className="font-medium">Card de Evento</p>
            <p className="text-sm text-muted-foreground">Exemplo de card</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Feedback</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-success text-success-foreground text-sm">Sucesso</span>
            <span className="px-3 py-1 rounded-full bg-destructive text-destructive-foreground text-sm">Erro</span>
            <span className="px-3 py-1 rounded-full bg-warning text-warning-foreground text-sm">Aviso</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm font-medium">Textos</p>
          <div className="space-y-1">
            <p className="text-lg font-bold">Título</p>
            <p className="text-base">Texto normal</p>
            <p className="text-sm text-muted-foreground">Texto secundário</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPreview;
