
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const GroupsComingSoon = () => {
  return (
    <Card className="my-4">
      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
        <AlertCircle className="h-12 w-12 text-primary mb-4" />
        <h2 className="text-xl font-bold mb-2">Disponível em breve</h2>
        <p className="text-muted-foreground">
          A função de grupos ainda está em desenvolvimento e será disponibilizada em breve.
        </p>
      </CardContent>
    </Card>
  );
};

export default GroupsComingSoon;
