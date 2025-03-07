import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompanySettings from "./CompanySettings";
import CompanyList from "../company/CompanyList";

const CompanyManagement = () => {
  const [activeTab, setActiveTab] = useState<"list" | "settings">("list");

  return (
    <div className="space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "list" | "settings")}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="list">Empresas</TabsTrigger>
          <TabsTrigger value="settings">
            Configurações da Empresa Atual
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <CompanyList />
        </TabsContent>

        <TabsContent value="settings">
          <CompanySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyManagement;
