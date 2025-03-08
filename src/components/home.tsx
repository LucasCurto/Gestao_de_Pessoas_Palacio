import React, { useEffect, useState } from "react";
import { useCompany } from "@/context/CompanyContext";
import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";
import FinancialOverview from "./dashboard/FinancialOverview";
import PaymentAlerts from "./dashboard/PaymentAlerts";
import HRMetrics from "./dashboard/HRMetrics";

const Home = () => {
  const { currentCompany } = useCompany();
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    setCompanyName(currentCompany.name);
    // Aqui você poderia carregar dados específicos da empresa
    console.log(
      `Carregando dados para a empresa: ${currentCompany.name} (ID: ${currentCompany.id})`,
    );
  }, [currentCompany]);
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar className="hidden md:block" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header title={`Dashboard - ${companyName}`} />

        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Financial Overview */}
            <FinancialOverview />

            {/* Alerts and Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PaymentAlerts />
              <HRMetrics />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
