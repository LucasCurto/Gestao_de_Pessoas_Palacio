import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Activity } from "./ActivityRegistry";
import { FileText, Download, Eye, Calendar, DollarSign } from "lucide-react";

export interface Payment {
  id: string;
  employeeId: string;
  month: string;
  date: Date;
  dueDate: Date;
  baseSalary: number;
  activities: Activity[];
  bonus: number;
  allowances: number;
  deductions: number;
  taxes: number;
  total: number;
  status: "pending" | "approved" | "processed" | "paid";
  notes?: string;
}

interface PaymentHistoryProps {
  employeeId: string;
  employeeName: string;
  payments: Payment[];
  onViewPayment: (paymentId: string) => void;
  onDownloadReceipt: (paymentId: string) => void;
  onProcessPayment: (paymentId: string) => void;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({
  employeeId,
  employeeName,
  payments,
  onViewPayment,
  onDownloadReceipt,
  onProcessPayment,
}) => {
  const getStatusBadge = (status: Payment["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            Pendente
          </Badge>
        );
      case "approved":
        return (
          <Badge
            variant="outline"
            className="bg-orange-50 text-orange-700 border-orange-200"
          >
            Aprovado para Pagamento
          </Badge>
        );
      case "processed":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Processado
          </Badge>
        );
      case "paid":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Pago
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Histórico de Pagamentos</CardTitle>
      </CardHeader>
      <CardContent>
        {payments && payments.length > 0 ? (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="p-4 border rounded-md hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">
                        Pagamento de {payment.month}
                      </h3>
                      {getStatusBadge(payment.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-1 mt-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        Data: {format(payment.date, "P", { locale: pt })}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <DollarSign className="h-3.5 w-3.5 mr-1" />
                        Total: {payment.total.toFixed(2)}€
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FileText className="h-3.5 w-3.5 mr-1" />
                        Atividades:{" "}
                        {payment.activities ? payment.activities.length : 0}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewPayment(payment.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" /> Detalhes
                    </Button>
                    {payment.status === "approved" && (
                      <Button
                        size="sm"
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => onProcessPayment(payment.id)}
                      >
                        <DollarSign className="h-4 w-4 mr-1" /> Efetuar
                        Pagamento
                      </Button>
                    )}
                    {payment.status === "paid" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDownloadReceipt(payment.id)}
                      >
                        <Download className="h-4 w-4 mr-1" /> Recibo
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="font-medium">Nenhum pagamento registrado</p>
            <p className="text-sm mt-1">
              Os pagamentos processados aparecerão aqui
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;
