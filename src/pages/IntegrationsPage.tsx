import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import IntegrationsList from "@/components/integrations/IntegrationsList";

const IntegrationsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar className={`${isSidebarOpen ? "block" : "hidden"} md:block`} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header title="Importação de Dados" onMenuToggle={toggleSidebar} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <IntegrationsList />
          </div>
        </main>
      </div>
    </div>
  );
};

export default IntegrationsPage;
