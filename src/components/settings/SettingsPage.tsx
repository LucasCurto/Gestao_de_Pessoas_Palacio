import React, { useState } from "react";
import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompanySettings from "./CompanySettings";
import UserSettings from "./UserSettings";
import IntegrationSettings from "./IntegrationSettings";
import PaymentSettings from "./PaymentSettings";

const SettingsPage = () => {
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
        <Header title="Configurações" onMenuToggle={toggleSidebar} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="company" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
                <TabsTrigger value="company">Empresa</TabsTrigger>
                <TabsTrigger value="users">Utilizadores</TabsTrigger>
                <TabsTrigger value="payment">Pagamentos</TabsTrigger>
                <TabsTrigger value="integrations">Integrações</TabsTrigger>
              </TabsList>

              <TabsContent value="company">
                <CompanySettings />
              </TabsContent>

              <TabsContent value="users">
                <UserSettings />
              </TabsContent>

              <TabsContent value="payment">
                <PaymentSettings />
              </TabsContent>

              <TabsContent value="integrations">
                <IntegrationSettings />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
