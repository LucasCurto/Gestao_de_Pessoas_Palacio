import React, { useEffect, useState } from "react";
import { useCompany } from "@/context/CompanyContext";
import { useDateRange } from "@/context/DateRangeContext";
import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";
import FinancialOverview from "./dashboard/FinancialOverview";
import PaymentAlerts from "./dashboard/PaymentAlerts";
import HRMetrics from "./dashboard/HRMetrics";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

const Home = () => {
  const { currentCompany } = useCompany();
  const { dateRange } = useDateRange();
  const [companyName, setCompanyName] = useState("");
  const [dashboardData, setDashboardData] = useState({
    financialData: null,
    alertsData: null,
    metricsData: null,
  });

  useEffect(() => {
    setCompanyName(currentCompany.name);
    // Aqui você poderia carregar dados específicos da empresa
    console.log(
      `Carregando dados para a empresa: ${currentCompany.name} (ID: ${currentCompany.id})`,
    );
  }, [currentCompany]);

  // Efeito para carregar dados com base no período selecionado
  useEffect(() => {
    if (!dateRange?.from || !dateRange?.to) return;

    const fromDate = format(dateRange.from, "yyyy-MM-dd");
    const toDate = format(dateRange.to, "yyyy-MM-dd");

    console.log(`Carregando dados para o período: ${fromDate} até ${toDate}`);

    // Simulação de carregamento de dados com base no período
    // Em uma implementação real, você faria chamadas à API aqui
    const loadDashboardData = async () => {
      // Simulação de delay de carregamento
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Dados simulados que mudam com base no período selecionado
      // Aqui você pode implementar lógica para gerar dados diferentes com base no período
      const monthDiff =
        dateRange.to.getMonth() -
        dateRange.from.getMonth() +
        12 * (dateRange.to.getFullYear() - dateRange.from.getFullYear());

      // Quanto maior o período, maiores os valores (apenas para simulação)
      const multiplier = 1 + monthDiff * 0.1;

      setDashboardData({
        financialData: {
          totalPayroll: Math.round(125000 * multiplier),
          previousMonthPayroll: Math.round(120000 * multiplier * 0.95),
          averageSalary: Math.round(2500 * multiplier),
          employeeCount: Math.round(50 * (1 + monthDiff * 0.05)),
        },
        alertsData: null, // Você pode personalizar alertas com base no período também
        metricsData: {
          turnoverRate: 12.5 - monthDiff * 0.5,
          averageCost: Math.round(2850 * multiplier),
          employeeGrowth: 8.3 + monthDiff * 0.7,
        },
      });
    };

    loadDashboardData();
  }, [dateRange, currentCompany.id]);

  // Formatar o período para exibição no título
  const formattedDateRange =
    dateRange?.from && dateRange?.to
      ? `${format(dateRange.from, "dd/MM/yyyy", { locale: pt })} - ${format(dateRange.to, "dd/MM/yyyy", { locale: pt })}`
      : "";

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
            {/* Period Display */}
            {formattedDateRange && (
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h2 className="text-lg font-medium">
                  Dados do período:{" "}
                  <span className="text-blue-600">{formattedDateRange}</span>
                </h2>
                <p className="text-sm text-gray-500">
                  Os dados abaixo refletem as informações deste período
                  selecionado.
                </p>
              </div>
            )}

            {/* Financial Overview */}
            <FinancialOverview
              totalPayroll={dashboardData.financialData?.totalPayroll}
              previousMonthPayroll={
                dashboardData.financialData?.previousMonthPayroll
              }
              averageSalary={dashboardData.financialData?.averageSalary}
              employeeCount={dashboardData.financialData?.employeeCount}
            />

            {/* Alerts and Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PaymentAlerts />
              <HRMetrics
                metrics={{
                  turnoverRate: dashboardData.metricsData?.turnoverRate || 12.5,
                  averageCost: dashboardData.metricsData?.averageCost || 2850,
                  employeeGrowth:
                    dashboardData.metricsData?.employeeGrowth || 8.3,
                  salaryDistribution: [
                    { category: "Administração", percentage: 35, count: 12 },
                    { category: "Operações", percentage: 25, count: 8 },
                    { category: "Vendas", percentage: 20, count: 7 },
                    { category: "TI", percentage: 15, count: 5 },
                    { category: "Outros", percentage: 5, count: 2 },
                  ],
                }}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
