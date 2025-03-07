import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  FileText,
  Edit,
  ArrowDown,
  ArrowUp,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  Printer,
  Mail,
} from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface Activity {
  id: string;
  employeeId: string;
  type: string;
  description: string;
  date: Date;
  hours: number;
  rate: number;
  status: "pending" | "approved" | "rejected" | "paid";
  paymentRequestId?: string;
}

interface PaymentAdjustment {
  id: string;
  paymentId: string;
  type: "bonus" | "deduction" | "correction";
  amount: number;
  description: string;
  date: Date;
  appliedBy: string;
}

interface Payment {
  id: string;
  employeeId: string;
  month: string;
  date: Date;
  dueDate: Date;
  amount: number;
  status: "draft" | "pending" | "processing" | "paid" | "failed";
  activities: string[];
  adjustments: PaymentAdjustment[];
  details: {
    baseSalary: number;
    activityTotal: number;
    bonus: number;
    allowances: number;
    deductions: number;
    taxes: number;
  };
  notes?: string;
}

interface PaymentDetailsProps {
  payment: Payment;
  activities: Activity[];
  onStatusChange: (paymentId: string, newStatus: Payment["status"]) => void;
  onAdjustmentClick: () => void;
}

const getStatusBadge = (status: Payment["status"]) => {
  switch (status) {
    case "draft":
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800">
          Rascunho
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="outline" className="text-amber-600 border-amber-300">
          Pendente
        </Badge>
      );
    case "processing":
      return (
        <Badge variant="outline" className="text-blue-600 border-blue-300">
          Em Processamento
        </Badge>
      );
    case "paid":
      return <Badge className="bg-green-100 text-green-800">Pago</Badge>;
    case "failed":
      return <Badge variant="destructive">Falha</Badge>;
    default:
      return <Badge variant="outline">Desconhecido</Badge>;
  }
};

const PaymentDetails: React.FC<PaymentDetailsProps> = ({
  payment,
  activities,
  onStatusChange,
  onAdjustmentClick,
}) => {
  const paymentActivities = activities.filter((a) =>
    payment.activities.includes(a.id),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">
            Detalhes do Pagamento - {payment.month}
          </h2>
          <p className="text-sm text-gray-500">
            Referência: #{payment.id.replace("p", "")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4 mr-1" />
            Enviar Recibo
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-1" />
            Imprimir
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Recibo PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações do Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="mt-1">{getStatusBadge(payment.status)}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Valor Total</p>
                  <p className="font-bold text-lg">
                    {payment.amount.toLocaleString("pt-PT")}€
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Mês de Referência</span>
                  <span className="font-medium">{payment.month}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-500">Data de Pagamento</span>
                  <span className="font-medium">
                    {format(payment.date, "PPP", { locale: pt })}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-500">Data de Vencimento</span>
                  <span className="font-medium">
                    {format(payment.dueDate, "PPP", { locale: pt })}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium mb-3">Detalhes do Valor</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Salário Base</span>
                    <span>
                      {payment.details.baseSalary.toLocaleString("pt-PT")}€
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Atividades</span>
                    <span>
                      {payment.details.activityTotal.toLocaleString("pt-PT")}€
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bónus</span>
                    <span>
                      {payment.details.bonus.toLocaleString("pt-PT")}€
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subsídios</span>
                    <span>
                      {payment.details.allowances.toLocaleString("pt-PT")}€
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Deduções</span>
                    <span className="text-red-600">
                      -{payment.details.deductions.toLocaleString("pt-PT")}€
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Impostos</span>
                    <span className="text-red-600">
                      -{payment.details.taxes.toLocaleString("pt-PT")}€
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{payment.amount.toLocaleString("pt-PT")}€</span>
                  </div>
                </div>
              </div>

              {payment.notes && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Notas</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                    {payment.notes}
                  </p>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-2">
                {payment.status === "draft" && (
                  <Button onClick={() => onStatusChange(payment.id, "pending")}>
                    Submeter para Aprovação
                  </Button>
                )}
                {payment.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => onStatusChange(payment.id, "failed")}
                    >
                      Rejeitar
                    </Button>
                    <Button
                      onClick={() => onStatusChange(payment.id, "processing")}
                    >
                      Aprovar
                    </Button>
                  </>
                )}
                {payment.status === "processing" && (
                  <Button onClick={() => onStatusChange(payment.id, "paid")}>
                    Marcar como Pago
                  </Button>
                )}
                <Button variant="outline" onClick={onAdjustmentClick}>
                  <Edit className="h-4 w-4 mr-1" />
                  Ajustar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {paymentActivities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Atividades Incluídas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paymentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">{activity.type}</span>
                            <Badge className="bg-blue-100 text-blue-800">
                              Pago
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {activity.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">
                            {(activity.hours * activity.rate).toFixed(2)}€
                          </p>
                          <p className="text-xs text-gray-500">
                            {activity.hours}h × {activity.rate}€/h
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                        <span>
                          {format(activity.date, "PPP", { locale: pt })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {payment.adjustments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ajustes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {payment.adjustments.map((adjustment) => (
                    <div
                      key={adjustment.id}
                      className="p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            {adjustment.type === "bonus" ? (
                              <ArrowUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <ArrowDown className="h-4 w-4 text-red-600" />
                            )}
                            <span className="font-medium">
                              {adjustment.type === "bonus"
                                ? "Bónus"
                                : "Dedução"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {adjustment.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-bold ${adjustment.type === "deduction" ? "text-red-600" : "text-green-600"}`}
                          >
                            {adjustment.type === "deduction" ? "-" : "+"}
                            {Math.abs(adjustment.amount).toLocaleString(
                              "pt-PT",
                            )}
                            €
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                        <span>
                          {format(adjustment.date, "PPP", { locale: pt })}
                        </span>
                        <span>{adjustment.appliedBy}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Histórico de Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* This would be dynamic in a real app */}
                <div className="flex">
                  <div className="mr-4">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Pagamento Criado</h4>
                        <p className="text-sm text-gray-500">
                          Pagamento criado como rascunho
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {format(payment.date, "dd/MM/yyyy HH:mm")}
                      </span>
                    </div>
                    <Separator className="my-4" />
                  </div>
                </div>

                {payment.status !== "draft" && (
                  <div className="flex">
                    <div className="mr-4">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">
                            Submetido para Aprovação
                          </h4>
                          <p className="text-sm text-gray-500">
                            Pagamento submetido para aprovação
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {format(
                            new Date(payment.date.getTime() + 86400000),
                            "dd/MM/yyyy HH:mm",
                          )}
                        </span>
                      </div>
                      <Separator className="my-4" />
                    </div>
                  </div>
                )}

                {(payment.status === "processing" ||
                  payment.status === "paid") && (
                  <div className="flex">
                    <div className="mr-4">
                      <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-amber-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Em Processamento</h4>
                          <p className="text-sm text-gray-500">
                            Pagamento aprovado e em processamento
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {format(
                            new Date(payment.date.getTime() + 172800000),
                            "dd/MM/yyyy HH:mm",
                          )}
                        </span>
                      </div>
                      <Separator className="my-4" />
                    </div>
                  </div>
                )}

                {payment.status === "paid" && (
                  <div className="flex">
                    <div className="mr-4">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Pagamento Concluído</h4>
                          <p className="text-sm text-gray-500">
                            Pagamento processado com sucesso
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {format(
                            new Date(payment.date.getTime() + 259200000),
                            "dd/MM/yyyy HH:mm",
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {payment.status === "failed" && (
                  <div className="flex">
                    <div className="mr-4">
                      <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                        <ArrowDown className="h-4 w-4 text-red-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Pagamento Rejeitado</h4>
                          <p className="text-sm text-gray-500">
                            Pagamento rejeitado
                          </p>
                        </div>
                        <span className="text-sm text-gray-500">
                          {format(
                            new Date(payment.date.getTime() + 172800000),
                            "dd/MM/yyyy HH:mm",
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetails;
