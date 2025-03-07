import React from "react";
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

interface PaymentAlert {
  id: string;
  title: string;
  description: string;
  date: string;
  status: "pending" | "overdue" | "attention" | "completed";
  priority: "high" | "medium" | "low";
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

const defaultAlerts: PaymentAlert[] = [
  {
    id: "1",
    title: "Processamento de Salários",
    description:
      "Processamento de salários do mês atual pendente para 25 funcionários",
    date: "2023-05-25",
    status: "pending",
    priority: "high",
  },
  {
    id: "2",
    title: "Subsídios de Férias em Atraso",
    description:
      "Pagamentos de subsídios de férias em atraso para 3 funcionários",
    date: "2023-05-15",
    status: "overdue",
    priority: "high",
  },
  {
    id: "3",
    title: "Revisão de Horas Extras",
    description:
      "Necessária revisão das horas extras reportadas no departamento de logística",
    date: "2023-05-20",
    status: "attention",
    priority: "medium",
  },
  {
    id: "4",
    title: "Atualização de Escalões IRS",
    description: "Atualização dos escalões de IRS para 10 funcionários",
    date: "2023-05-30",
    status: "pending",
    priority: "medium",
  },
  {
    id: "5",
    title: "Pagamentos Processados",
    description:
      "Todos os pagamentos do mês anterior foram processados com sucesso",
    date: "2023-04-30",
    status: "completed",
    priority: "low",
  },
];

const PaymentAlerts: React.FC<PaymentAlertsProps> = ({
  alerts = defaultAlerts,
  onViewAlert = () => {},
  onResolveAlert = () => {},
}) => {
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
          {alerts.map((alert) => (
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentAlerts;
