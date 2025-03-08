import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EnhancedDateRangePicker } from "@/components/calendar/EnhancedDateRangePicker";
import { DateRange } from "react-day-picker";
import { addMonths } from "date-fns";
import {
  BarChart,
  PieChart,
  LineChart,
  Download,
  FileText,
  Users,
  CreditCard,
  Clock,
} from "lucide-react";
import {
  exportToExcel,
  exportToPDF,
  formatPaymentsForExport,
  formatActivitiesForExport,
} from "../reports/ExportUtils";
import PaymentMethodsOverview from "./PaymentMethodsOverview";

const ReportsDashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addMonths(new Date(), -3),
    to: new Date(),
  });
  const [paymentData, setPaymentData] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);
  const [employeeData, setEmployeeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar dados do localStorage
  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      try {
        // Carregar pagamentos
        const storedPayments = localStorage.getItem("employeePayments");
        if (storedPayments) {
          const payments = JSON.parse(storedPayments);
          setPaymentData(payments);
        }

        // Carregar atividades
        const storedTasks = localStorage.getItem("employeeTasks");
        if (storedTasks) {
          const tasks = JSON.parse(storedTasks);
          setActivityData(tasks);
        }

        // Simular dados de funcionários
        setEmployeeData([
          {
            id: "1",
            name: "Ana Silva",
            department: "RH",
            baseSalary: 2500,
            status: "active",
          },
          {
            id: "2",
            name: "João Santos",
            department: "TI",
            baseSalary: 2800,
            status: "active",
          },
          {
            id: "3",
            name: "Maria Oliveira",
            department: "Marketing",
            baseSalary: 2300,
            status: "active",
          },
          {
            id: "4",
            name: "Pedro Costa",
            department: "Vendas",
            baseSalary: 2600,
            status: "inactive",
          },
        ]);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtrar dados pelo período selecionado
  const getFilteredData = () => {
    if (!dateRange?.from || !dateRange?.to)
      return { payments: paymentData, activities: activityData };

    const filteredPayments = paymentData.filter((payment) => {
      const paymentDate = new Date(payment.date);
      return paymentDate >= dateRange.from && paymentDate <= dateRange.to;
    });

    const filteredActivities = activityData.filter((activity) => {
      const activityDate = new Date(activity.date);
      return activityDate >= dateRange.from && activityDate <= dateRange.to;
    });

    return { payments: filteredPayments, activities: filteredActivities };
  };

  const { payments, activities } = getFilteredData();

  // Recalcular quando o período mudar
  useEffect(() => {
    const { payments: filteredPayments, activities: filteredActivities } =
      getFilteredData();
    // Atualizar os dados filtrados
  }, [dateRange]);

  // Calcular métricas
  const totalPayments = payments.length;
  const totalPaymentAmount = payments.reduce(
    (sum, payment) => sum + payment.total,
    0,
  );
  const totalActivities = activities.length;
  const totalActivityAmount = activities.reduce(
    (sum, activity) => sum + activity.hours * activity.rate,
    0,
  );
  const averagePayment =
    totalPayments > 0 ? totalPaymentAmount / totalPayments : 0;

  // Exportar dados
  const handleExportPayments = (format: "excel" | "pdf") => {
    const formattedData = formatPaymentsForExport(payments);

    if (format === "excel") {
      exportToExcel(formattedData, "Pagamentos");
    } else {
      const columns = [
        "Data",
        "Mês",
        "Funcionário",
        "Salário Base",
        "Total",
        "Status",
        "Método de Pagamento",
      ];
      exportToPDF(
        formattedData,
        columns,
        "Pagamentos",
        "Relatório de Pagamentos",
      );
    }
  };

  const handleExportActivities = (format: "excel" | "pdf") => {
    const formattedData = formatActivitiesForExport(activities);

    if (format === "excel") {
      exportToExcel(formattedData, "Atividades");
    } else {
      const columns = [
        "Data",
        "Tipo",
        "Descrição",
        "Funcionário",
        "Horas",
        "Taxa (€/h)",
        "Valor",
        "Status",
      ];
      exportToPDF(
        formattedData,
        columns,
        "Atividades",
        "Relatório de Atividades",
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard de Relatórios</h2>
        <EnhancedDateRangePicker
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          showCompactPresets
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          {/* Métricas principais */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-5 w-5 text-blue-700" />
                  <div className="text-sm font-medium text-blue-700">
                    Total de Pagamentos
                  </div>
                </div>
                <div className="text-3xl font-bold text-blue-800 mt-2">
                  {totalPayments}
                </div>
                <div className="text-sm text-blue-600 mt-1">
                  {totalPaymentAmount.toFixed(2)}€
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-green-700" />
                  <div className="text-sm font-medium text-green-700">
                    Total de Atividades
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-800 mt-2">
                  {totalActivities}
                </div>
                <div className="text-sm text-green-600 mt-1">
                  {totalActivityAmount.toFixed(2)}€
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-purple-700" />
                  <div className="text-sm font-medium text-purple-700">
                    Média por Pagamento
                  </div>
                </div>
                <div className="text-3xl font-bold text-purple-800 mt-2">
                  {averagePayment.toFixed(2)}€
                </div>
                <div className="text-sm text-purple-600 mt-1">
                  Por transação
                </div>
              </CardContent>
            </Card>

            <Card className="bg-amber-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-amber-700" />
                  <div className="text-sm font-medium text-amber-700">
                    Funcionários Ativos
                  </div>
                </div>
                <div className="text-3xl font-bold text-amber-800 mt-2">
                  {employeeData.filter((emp) => emp.status === "active").length}
                </div>
                <div className="text-sm text-amber-600 mt-1">
                  De {employeeData.length} total
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Visão geral por método de pagamento e tipo de atividade */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">
              Visão por Método de Pagamento e Tipo de Atividade
            </h3>
            <PaymentMethodsOverview dateRange={dateRange} />
          </div>

          {/* Botões de exportação */}
          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportPayments("excel")}
            >
              <FileText className="h-4 w-4 mr-2" /> Exportar Pagamentos
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportActivities("excel")}
            >
              <Download className="h-4 w-4 mr-2" /> Exportar Atividades
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportsDashboard;
