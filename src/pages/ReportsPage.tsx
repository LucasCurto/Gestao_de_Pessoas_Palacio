import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Download, FileText, BarChart, Calendar } from "lucide-react";
import ReportBuilder from "@/components/reports/ReportBuilder";
import PaymentReport from "@/components/employees/PaymentReport";
import ActivityReport from "@/components/reports/ActivityReport";
import EmployeeReport from "@/components/reports/EmployeeReport";
import ReportsDashboard from "@/components/dashboard/ReportsDashboard";
import { DateRange } from "react-day-picker";
import { addMonths } from "date-fns";

const ReportsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addMonths(new Date(), -1),
    to: new Date(),
  });

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
        <Header title="Sistema de Relatórios" onMenuToggle={toggleSidebar} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold">Relatórios</h1>
                <p className="text-gray-500">
                  Gere e visualize relatórios detalhados
                </p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Relatório
              </Button>
            </div>

            <Tabs defaultValue="dashboard" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="payment">Pagamentos</TabsTrigger>
                <TabsTrigger value="activity">Atividades</TabsTrigger>
                <TabsTrigger value="employee">Funcionários</TabsTrigger>
                <TabsTrigger value="custom">Personalizado</TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard">
                <ReportsDashboard />
              </TabsContent>

              <TabsContent value="payment">
                <PaymentReport />
              </TabsContent>

              <TabsContent value="activity">
                <ActivityReport />
              </TabsContent>

              <TabsContent value="employee">
                <EmployeeReport />
              </TabsContent>

              <TabsContent value="custom">
                <ReportBuilder />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportsPage;
