import React, { useState, useEffect } from "react";
import { useDateRange } from "@/context/DateRangeContext";
import { useCompany } from "@/context/CompanyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutGrid,
  Plus,
  MoreVertical,
  Trash2,
  Settings,
  MoveHorizontal,
  MoveVertical,
  Maximize2,
  Minimize2,
  BarChart,
  PieChart,
  LineChart,
  Table,
  FileText,
  Download,
  Save,
} from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import DashboardWidget from "./DashboardWidget";

const DashboardGrid = () => {
  const { dateRange } = useDateRange();
  const { currentCompany } = useCompany();
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Efeito para carregar dados com base no período selecionado
  useEffect(() => {
    if (!dateRange?.from || !dateRange?.to) return;

    const fromDate = format(dateRange.from, "yyyy-MM-dd");
    const toDate = format(dateRange.to, "yyyy-MM-dd");

    console.log(`Carregando dados para o período: ${fromDate} até ${toDate}`);
    setIsLoading(true);

    // Simulação de carregamento de dados com base no período
    setTimeout(() => {
      // Simulação de dados que mudam com base no período selecionado
      const monthDiff =
        dateRange.to.getMonth() -
        dateRange.from.getMonth() +
        12 * (dateRange.to.getFullYear() - dateRange.from.getFullYear());

      // Quanto maior o período, maiores os valores (apenas para simulação)
      const multiplier = 1 + monthDiff * 0.1;

      setDashboardData({
        salesData: {
          labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
          datasets: [
            {
              label: "Vendas",
              data: [65, 59, 80, 81, 56, 55].map((val) =>
                Math.round(val * multiplier),
              ),
            },
          ],
        },
        revenueData: {
          labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
          datasets: [
            {
              label: "Receita",
              data: [28, 48, 40, 19, 86, 27].map((val) =>
                Math.round(val * multiplier),
              ),
            },
          ],
        },
        expenseData: {
          labels: ["Salários", "Marketing", "Operações"],
          datasets: [
            {
              data: [300, 50, 100].map((val) => Math.round(val * multiplier)),
            },
          ],
        },
        employeeData: {
          headers: ["Nome", "Departamento", "Status"],
          rows: [
            ["Ana Silva", "RH", "Ativo"],
            ["João Santos", "Financeiro", "Ativo"],
            ["Maria Costa", "TI", "Ativo"],
            ["Pedro Oliveira", "Vendas", "Inativo"],
          ],
        },
        metrics: {
          totalRevenue: Math.round(12500 * multiplier),
          growth: 5.2 + monthDiff * 0.3,
          customers: Math.round(150 * (1 + monthDiff * 0.05)),
          averageOrder: Math.round(85 * multiplier),
        },
      });
      setIsLoading(false);
    }, 1000);
  }, [dateRange, currentCompany.id]);

  // Formatar o período para exibição
  const formattedDateRange =
    dateRange?.from && dateRange?.to
      ? `${format(dateRange.from, "dd/MM/yyyy", { locale: pt })} - ${format(dateRange.to, "dd/MM/yyyy", { locale: pt })}`
      : "";

  return (
    <div className="space-y-6">
      {/* Period Display */}
      {formattedDateRange && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium">
            Dados do período:{" "}
            <span className="text-blue-600">{formattedDateRange}</span>
          </h2>
          <p className="text-sm text-gray-500">
            Os widgets abaixo refletem as informações deste período selecionado.
          </p>
        </div>
      )}

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <DashboardWidget
          id="sales-chart"
          title="Vendas Mensais"
          type="chart"
          chartType="bar"
          dataSource="Sistema de Vendas"
          className="col-span-1 md:col-span-2"
          isLoading={isLoading}
          customData={dashboardData?.salesData}
        />

        {/* Revenue Metric */}
        <DashboardWidget
          id="revenue-metric"
          title="Receita Total"
          type="metric"
          dataSource="Sistema Financeiro"
          isLoading={isLoading}
          customData={
            dashboardData?.metrics
              ? {
                  value: dashboardData.metrics.totalRevenue,
                  unit: "€",
                  change: dashboardData.metrics.growth,
                  trend: "up",
                }
              : null
          }
        />

        {/* Expense Distribution */}
        <DashboardWidget
          id="expense-chart"
          title="Distribuição de Despesas"
          type="chart"
          chartType="pie"
          dataSource="Sistema Financeiro"
          isLoading={isLoading}
          customData={dashboardData?.expenseData}
        />

        {/* Revenue Trend */}
        <DashboardWidget
          id="revenue-trend"
          title="Tendência de Receita"
          type="chart"
          chartType="line"
          dataSource="Sistema Financeiro"
          isLoading={isLoading}
          customData={dashboardData?.revenueData}
        />

        {/* Customer Metric */}
        <DashboardWidget
          id="customer-metric"
          title="Total de Clientes"
          type="metric"
          dataSource="CRM"
          isLoading={isLoading}
          customData={
            dashboardData?.metrics
              ? {
                  value: dashboardData.metrics.customers,
                  unit: "",
                  change: dashboardData.metrics.growth - 1.2,
                  trend: "up",
                }
              : null
          }
        />

        {/* Employee Table */}
        <DashboardWidget
          id="employee-table"
          title="Funcionários Ativos"
          type="table"
          dataSource="Sistema de RH"
          className="col-span-1 md:col-span-2"
          isLoading={isLoading}
          customData={dashboardData?.employeeData}
        />
      </div>
    </div>
  );
};

export default DashboardGrid;
