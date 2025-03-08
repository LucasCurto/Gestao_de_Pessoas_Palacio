import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import DashboardGrid from "@/components/dashboard/DashboardGrid";
import DashboardCustomizer from "@/components/dashboard/DashboardCustomizer";
import WidgetEditor from "@/components/dashboard/WidgetEditor";
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";

const DashboardsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isWidgetEditorOpen, setIsWidgetEditorOpen] = useState(false);
  const [currentWidget, setCurrentWidget] = useState(null);
  const [dashboardConfig, setDashboardConfig] = useState(() => {
    // Carregar configurações salvas do localStorage
    const savedConfig = localStorage.getItem("dashboardConfig");
    if (savedConfig) {
      try {
        return JSON.parse(savedConfig);
      } catch (e) {
        console.error("Erro ao carregar configurações do dashboard:", e);
      }
    }

    // Configuração padrão
    return {
      layout: "grid",
      theme: "default",
      density: "comfortable",
      refreshInterval: "0",
    };
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleOpenCustomizer = () => {
    setIsCustomizerOpen(true);
  };

  const handleSaveCustomizer = (config) => {
    setDashboardConfig(config);
    setIsCustomizerOpen(false);
  };

  const handleOpenWidgetEditor = (widget = null) => {
    setCurrentWidget(widget);
    setIsWidgetEditorOpen(true);
  };

  const handleSaveWidget = (widget) => {
    console.log("Widget saved:", widget);
    setIsWidgetEditorOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar className={`${isSidebarOpen ? "block" : "hidden"} md:block`} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header title="Dashboards" onMenuToggle={toggleSidebar} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Dashboard</h2>
                <p className="text-gray-500">
                  Visualize e personalize seus indicadores de desempenho
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = "/settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </Button>
              </div>
            </div>

            <DashboardGrid
              config={dashboardConfig}
              onCustomize={handleOpenCustomizer}
              onAddWidget={() => handleOpenWidgetEditor()}
              onEditWidget={handleOpenWidgetEditor}
            />

            {/* Customizer Dialog */}
            <DashboardCustomizer
              isOpen={isCustomizerOpen}
              onClose={() => setIsCustomizerOpen(false)}
              onSave={handleSaveCustomizer}
              initialConfig={dashboardConfig}
            />

            {/* Widget Editor Dialog */}
            <WidgetEditor
              isOpen={isWidgetEditorOpen}
              onClose={() => setIsWidgetEditorOpen(false)}
              onSave={handleSaveWidget}
              widget={currentWidget}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardsPage;
