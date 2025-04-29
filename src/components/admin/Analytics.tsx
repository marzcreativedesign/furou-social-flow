
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Analytics = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Análise de Dados</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas da Plataforma</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Esta seção será implementada em breve. Aqui você verá estatísticas gerais da plataforma.
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Tendências de Eventos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Esta seção será implementada em breve. Aqui você verá tendências relacionadas aos eventos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
