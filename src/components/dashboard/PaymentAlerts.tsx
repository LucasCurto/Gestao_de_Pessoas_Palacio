import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  AlertTriangle,
  Clock,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { useCompany } from "@/context/CompanyContext";

interface PaymentAlert {
  id: string;
  title: string;
  description: string;
  date: string;
  status: "pending" | "overdue" | "attention" | "completed";
  priority: "high" | "medium" | "low";
  companyId?: string;
}

interface PaymentAlertsProps {
  alerts?: PaymentAlert[];
  onViewAlert?: (id: string) => void;
  onResolveAlert?: (id: string) => void;
}

const getStatusIcon = (status: PaymentAlert["status"]) => {
  switch (status) {
    case "pending":
      return <Clock className="h-4 w-4" />;
    case "overdue":
      return <AlertTriangle className="h-4 w-4" />;
    case "attention":
      return <Bell className="h-4 w-4" />;
    case "completed":
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

const getStatusColor = (status: PaymentAlert["status"]) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "overdue":
      return "bg-red-100 text-red-800";
    case "attention":
      return "bg-orange-100 text-orange-800";
    case "completed":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPriorityBadge = (priority: PaymentAlert["priority"]) => {
  switch (priority) {
    case "high":
      return <Badge variant="destructive">Alta</Badge>;
    case "medium":
      return <Badge variant="secondary">Média</Badge>;
    case "low":
      return <Badge variant="outline">Baixa</Badge>;
    default:
      return <Badge variant="outline">Baixa</Badge>;
  }
};

// Alerts by company
const alertsByCompany: Record<string, PaymentAlert[]> = {
  "1": [
    {
      id: "1",
      title: "Processamento de Salários",
      description:
        "Processamento de salários do mês atual pendente para 25 funcionários",
      date: "2023-05-25",
      status: "pending",
      priority: "high",
      companyId: "1",
    },
    {
      id: "2",
      title: "Subsídios de Férias em Atraso",
      description:
        "Pagamentos de subsídios de férias em atraso para 3 funcionários",
      date: "2023-05-15",
      status: "overdue",
      priority: "high",
      companyId: "1",
    },
    {
      id: "3",
      title: "Revisão de Horas Extras",
      description:
        "Necessária revisão das horas extras reportadas no departamento de logística",
      date: "2023-05-20",
      status: "attention",
      priority: "medium",
      companyId: "1",
    },
    {
      id: "4",
      title: "Atualização de Escalões IRS",
      description: "Atualização dos escalões de IRS para 10 funcionários",
      date: "2023-05-30",
      status: "pending",
      priority: "medium",
      companyId: "1",
    },
    {
      id: "5",
      title: "Pagamentos Processados",
      description:
        "Todos os pagamentos do mês anterior foram processados com sucesso",
      date: "2023-04-30",
      status: "completed",
      priority: "low",
      companyId: "1",
    },
  ],
  "2": [
    {
      id: "6",
      title: "Processamento de Salários",
      description:
        "Processamento de salários do mês atual pendente para 12 funcionários",
      date: "2023-05-25",
      status: "pending",
      priority: "high",
      companyId: "2",
    },
    {
      id: "7",
      title: "Bónus Trimestrais",
      description:
        "Aprovação de bónus trimestrais para o departamento de vendas",
      date: "2023-05-18",
      status: "attention",
      priority: "medium",
      companyId: "2",
    },
    {
      id: "8",
      title: "Pagamentos Processados",
      description:
        "Todos os pagamentos do mês anterior foram processados com sucesso",
      date: "2023-04-30",
      status: "completed",
      priority: "low",
      companyId: "2",
    },
  ],
};

const PaymentAlerts: React.FC<PaymentAlertsProps> = ({
  alerts: propAlerts,
  onViewAlert = () => {},
  onResolveAlert = () => {},
}) => {
  const { currentCompany } = useCompany();
  const [alerts, setAlerts] = useState<PaymentAlert[]>(
    propAlerts || alertsByCompany["1"],
  );

  // Update alerts when company changes
  useEffect(() => {
    // @ts-ignore - Ignoring index error for simplicity
    const companyAlerts = alertsByCompany[currentCompany.id] || [];
    setAlerts(propAlerts || companyAlerts);
  }, [currentCompany.id, propAlerts]);

  return (
    <Card className="w-full h-full bg-white overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold">
            Alertas de Pagamentos
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-xs">
            Ver todos <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2">
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`p-2 rounded-full mr-3 ${getStatusColor(alert.status)}`}
                >
                  {getStatusIcon(alert.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm truncate">
                      {alert.title}
                    </h4>
                    {getPriorityBadge(alert.priority)}
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    {alert.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {new Date(alert.date).toLocaleDateString("pt-PT")}
                    </span>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => onViewAlert(alert.id)}
                      >
                        Detalhes
                      </Button>
                      {alert.status !== "completed" && (
                        <Button
                          variant="default"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => onResolveAlert(alert.id)}
                        >
                          Resolver
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
              <Bell className="h-8 w-8 mb-2 text-gray-400" />
              <p className="text-sm font-medium">Nenhum alerta pendente</p>
              <p className="text-xs">Todos os pagamentos estão em dia</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentAlerts;
