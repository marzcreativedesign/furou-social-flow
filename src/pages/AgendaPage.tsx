
import React from "react";
import MainLayout from "../components/MainLayout";

const AgendaPage = () => {
  return (
    <MainLayout title="Agenda">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Sua Agenda</h2>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-center py-10">
            <p className="text-muted-foreground">
              Conteúdo da agenda será implementado em breve.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AgendaPage;
