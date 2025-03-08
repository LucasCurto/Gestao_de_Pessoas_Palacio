import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  FileText,
  Clock,
  CheckCircle,
  Download,
} from "lucide-react";
import {
  exportToExcel,
  formatPaymentMethodsForExport,
  formatActivityTypesForExport,
} from "../reports/ExportUtils";

interface PaymentMethod {
  id: string;
  name: string;
  isActive: boolean;
}

interface ActivityType {
  id: string;
  name: string;
}

interface Transaction {
  id: string;
  amount: number;
  date: Date;
  paymentMethodId: string;
  activityTypeId?: string;
  status: "pending" | "approved" | "paid";
}

interface PaymentMethodsOverviewProps {
  dateRange?: {
    from: Date;
    to: Date;
  };
}

const PaymentMethodsOverview: React.FC<PaymentMethodsOverviewProps> = ({
  dateRange,
}) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<"methods" | "activities">(
    "methods",
  );

  // Carregar métodos de pagamento do localStorage
  useEffect(() => {
    const loadPaymentMethods = () => {
      try {
        const storedMethods = localStorage.getItem("paymentMethods");
        if (storedMethods) {
          const methods = JSON.parse(storedMethods);
          setPaymentMethods(methods.filter((m: PaymentMethod) => m.isActive));
        } else {
          // Métodos padrão caso não haja configurações
          setPaymentMethods([
            {
              id: "bank_transfer",
              name: "Transferência Bancária",
              isActive: true,
            },
            { id: "multibanco", name: "Multibanco", isActive: true },
            { id: "mbway", name: "MBWay", isActive: true },
          ]);
        }
      } catch (error) {
        console.error("Erro ao carregar métodos de pagamento:", error);
        // Fallback para métodos padrão
        setPaymentMethods([
          {
            id: "bank_transfer",
            name: "Transferência Bancária",
            isActive: true,
          },
          { id: "multibanco", name: "Multibanco", isActive: true },
          { id: "mbway", name: "MBWay", isActive: true },
        ]);
      }
    };

    loadPaymentMethods();
  }, []);

  // Carregar tipos de atividades do localStorage
  useEffect(() => {
    const loadActivityTypes = () => {
      try {
        const storedTypes = localStorage.getItem("activityTypes");
        if (storedTypes) {
          const types = JSON.parse(storedTypes);
          setActivityTypes(types);
        } else {
          // Tipos padrão caso não haja configurações
          setActivityTypes([
            { id: "overtime", name: "Horas Extras" },
            { id: "weekend", name: "Trabalho Fim de Semana" },
            { id: "holiday", name: "Trabalho em Feriado" },
            { id: "training", name: "Formação" },
            { id: "travel", name: "Deslocação" },
          ]);
        }
      } catch (error) {
        console.error("Erro ao carregar tipos de atividades:", error);
        // Fallback para tipos padrão
        setActivityTypes([
          { id: "overtime", name: "Horas Extras" },
          { id: "weekend", name: "Trabalho Fim de Semana" },
          { id: "holiday", name: "Trabalho em Feriado" },
          { id: "training", name: "Formação" },
          { id: "travel", name: "Deslocação" },
        ]);
      }
    };

    loadActivityTypes();
  }, []);

  // Carregar transações do localStorage
  useEffect(() => {
    const loadTransactions = () => {
      try {
        // Carregar pagamentos
        const storedPayments = localStorage.getItem("employeePayments");
        let payments: Transaction[] = [];

        if (storedPayments) {
          const parsedPayments = JSON.parse(storedPayments);
          payments = parsedPayments.map((payment: any) => ({
            id: payment.id,
            amount: payment.total,
            date: new Date(payment.date),
            paymentMethodId: payment.paymentMethod || "bank_transfer",
            status: payment.status || "paid",
          }));
        }

        // Carregar atividades
        const storedActivities = localStorage.getItem("employeeTasks");
        let activities: Transaction[] = [];

        if (storedActivities) {
          const parsedActivities = JSON.parse(storedActivities);
          activities = parsedActivities
            .filter(
              (activity: any) =>
                activity.status === "approved" || activity.status === "paid",
            )
            .map((activity: any) => ({
              id: activity.id,
              amount: activity.hours * activity.rate,
              date: new Date(activity.date),
              paymentMethodId: activity.paymentMethodId || "bank_transfer",
              activityTypeId: activity.type,
              status: activity.status,
            }));
        }

        // Filtrar por período se dateRange estiver definido
        let filteredPayments = payments;
        let filteredActivities = activities;

        if (dateRange?.from && dateRange?.to) {
          filteredPayments = payments.filter((payment) => {
            return (
              payment.date >= dateRange.from && payment.date <= dateRange.to
            );
          });

          filteredActivities = activities.filter((activity) => {
            return (
              activity.date >= dateRange.from && activity.date <= dateRange.to
            );
          });
        }

        // Combinar transações filtradas
        setTransactions([...filteredPayments, ...filteredActivities]);
      } catch (error) {
        console.error("Erro ao carregar transações:", error);
        setTransactions([]);
      }
    };

    loadTransactions();

    // Atualizar quando houver mudanças
    window.addEventListener("paymentsUpdated", loadTransactions);
    window.addEventListener("activitiesUpdated", loadTransactions);

    return () => {
      window.removeEventListener("paymentsUpdated", loadTransactions);
      window.removeEventListener("activitiesUpdated", loadTransactions);
    };
  }, [dateRange]);

  // Calcular estatísticas por método de pagamento
  const getPaymentMethodStats = () => {
    const stats = paymentMethods.map((method) => {
      const methodTransactions = transactions.filter(
        (t) => t.paymentMethodId === method.id,
      );
      const totalAmount = methodTransactions.reduce(
        (sum, t) => sum + t.amount,
        0,
      );
      const count = methodTransactions.length;
      const pendingCount = methodTransactions.filter(
        (t) => t.status === "pending",
      ).length;
      const approvedCount = methodTransactions.filter(
        (t) => t.status === "approved",
      ).length;
      const paidCount = methodTransactions.filter(
        (t) => t.status === "paid",
      ).length;

      return {
        id: method.id,
        name: method.name,
        totalAmount,
        count,
        pendingCount,
        approvedCount,
        paidCount,
      };
    });

    return stats;
  };

  // Calcular estatísticas por tipo de atividade
  const getActivityTypeStats = () => {
    const stats = activityTypes.map((type) => {
      const typeTransactions = transactions.filter(
        (t) => t.activityTypeId === type.id,
      );
      const totalAmount = typeTransactions.reduce(
        (sum, t) => sum + t.amount,
        0,
      );
      const count = typeTransactions.length;
      const pendingCount = typeTransactions.filter(
        (t) => t.status === "pending",
      ).length;
      const approvedCount = typeTransactions.filter(
        (t) => t.status === "approved",
      ).length;
      const paidCount = typeTransactions.filter(
        (t) => t.status === "paid",
      ).length;

      return {
        id: type.id,
        name: type.name,
        totalAmount,
        count,
        pendingCount,
        approvedCount,
        paidCount,
      };
    });

    return stats;
  };

  // Gerar cores para os cards
  const getCardColor = (index: number) => {
    const colors = [
      "bg-blue-50",
      "bg-green-50",
      "bg-purple-50",
      "bg-amber-50",
      "bg-rose-50",
      "bg-cyan-50",
      "bg-emerald-50",
      "bg-indigo-50",
      "bg-orange-50",
      "bg-pink-50",
    ];

    return colors[index % colors.length];
  };

  // Gerar cores para os textos
  const getTextColor = (index: number) => {
    const colors = [
      "text-blue-700",
      "text-green-700",
      "text-purple-700",
      "text-amber-700",
      "text-rose-700",
      "text-cyan-700",
      "text-emerald-700",
      "text-indigo-700",
      "text-orange-700",
      "text-pink-700",
    ];

    return colors[index % colors.length];
  };

  // Exportar dados para Excel
  const handleExportToExcel = () => {
    if (activeTab === "methods") {
      const data = formatPaymentMethodsForExport(paymentMethodStats);
      exportToExcel(data, "Relatório_Métodos_Pagamento");
    } else {
      const data = formatActivityTypesForExport(activityTypeStats);
      exportToExcel(data, "Relatório_Tipos_Atividade");
    }
  };

  const paymentMethodStats = getPaymentMethodStats();
  const activityTypeStats = getActivityTypeStats();

  return (
    <div className="space-y-6">
      <Tabs
        defaultValue="methods"
        onValueChange={(value) =>
          setActiveTab(value as "methods" | "activities")
        }
      >
        <div className="flex justify-between items-center">
          <TabsList className="mb-4">
            <TabsTrigger value="methods">Por Método de Pagamento</TabsTrigger>
            <TabsTrigger value="activities">Por Tipo de Atividade</TabsTrigger>
          </TabsList>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportToExcel}
            className="ml-2"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar Excel
          </Button>
        </div>

        <TabsContent value="methods" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paymentMethodStats.map((stat, index) => (
              <Card
                key={stat.id}
                className={`${getCardColor(index)} border-none shadow-sm`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className={`h-5 w-5 ${getTextColor(index)}`} />
                    <h3 className={`font-medium ${getTextColor(index)}`}>
                      {stat.name}
                    </h3>
                  </div>
                  <p className="text-3xl font-bold">
                    {stat.totalAmount.toFixed(2)}€
                  </p>
                  <div className="text-sm mt-2 flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span>{stat.count} transações</span>
                  </div>
                  <div className="flex justify-between mt-3 text-xs">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-yellow-600" />
                      <span className="text-yellow-600">
                        {stat.pendingCount} pendentes
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span className="text-green-600">
                        {stat.paidCount} pagos
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {activityTypeStats.map((stat, index) => (
              <Card
                key={stat.id}
                className={`${getCardColor(index)} border-none shadow-sm`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className={`h-5 w-5 ${getTextColor(index)}`} />
                    <h3 className={`font-medium ${getTextColor(index)}`}>
                      {stat.name}
                    </h3>
                  </div>
                  <p className="text-3xl font-bold">
                    {stat.totalAmount.toFixed(2)}€
                  </p>
                  <div className="text-sm mt-2 flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span>{stat.count} atividades</span>
                  </div>
                  <div className="flex justify-between mt-3 text-xs">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-yellow-600" />
                      <span className="text-yellow-600">
                        {stat.pendingCount} pendentes
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span className="text-green-600">
                        {stat.paidCount} pagos
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentMethodsOverview;
