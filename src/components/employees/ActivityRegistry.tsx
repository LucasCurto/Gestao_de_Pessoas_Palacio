import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Calendar as CalendarIcon,
  Check,
  Clock,
  Plus,
  Trash2,
  FileText,
  AlertCircle,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ActivityForm, { ActivityFormData } from "./ActivityForm";

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

interface PaymentRequest {
  id: string;
  employeeId: string;
  activityIds: string[];
  totalAmount: number;
  status: "pending" | "approved" | "rejected" | "paid";
  requestDate: Date;
  approvalDate?: Date;
  paymentDate?: Date;
  notes?: string;
}

const activityTypes = [
  { id: "overtime", label: "Horas Extras", defaultRate: 15 },
  { id: "weekend", label: "Trabalho Fim de Semana", defaultRate: 20 },
  { id: "holiday", label: "Trabalho em Feriado", defaultRate: 25 },
  { id: "training", label: "Formação", defaultRate: 12 },
  { id: "travel", label: "Deslocação", defaultRate: 10 },
  { id: "special_project", label: "Projeto Especial", defaultRate: 18 },
];

const mockActivities: Activity[] = [
  {
    id: "1",
    employeeId: "1",
    type: "overtime",
    description: "Finalização de relatório mensal",
    date: new Date("2023-05-15"),
    hours: 3,
    rate: 15,
    status: "approved",
    paymentRequestId: "pr1",
  },
  {
    id: "2",
    employeeId: "1",
    type: "weekend",
    description: "Preparação para auditoria",
    date: new Date("2023-05-20"),
    hours: 5,
    rate: 20,
    status: "approved",
    paymentRequestId: "pr1",
  },
  {
    id: "3",
    employeeId: "1",
    type: "training",
    description: "Formação em novas regulamentações",
    date: new Date("2023-05-25"),
    hours: 4,
    rate: 12,
    status: "pending",
  },
  {
    id: "4",
    employeeId: "2",
    type: "overtime",
    description: "Análise de dados financeiros",
    date: new Date("2023-05-18"),
    hours: 2,
    rate: 15,
    status: "approved",
    paymentRequestId: "pr2",
  },
];

const mockPaymentRequests: PaymentRequest[] = [
  {
    id: "pr1",
    employeeId: "1",
    activityIds: ["1", "2"],
    totalAmount: 145, // (3h * 15€) + (5h * 20€)
    status: "pending",
    requestDate: new Date("2023-05-26"),
  },
  {
    id: "pr2",
    employeeId: "2",
    activityIds: ["4"],
    totalAmount: 30, // 2h * 15€
    status: "approved",
    requestDate: new Date("2023-05-19"),
    approvalDate: new Date("2023-05-21"),
  },
];

const getStatusBadge = (status: Activity["status"]) => {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="text-amber-600 border-amber-300">
          Pendente
        </Badge>
      );
    case "approved":
      return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
    case "rejected":
      return <Badge variant="destructive">Rejeitado</Badge>;
    case "paid":
      return <Badge className="bg-blue-100 text-blue-800">Pago</Badge>;
    default:
      return <Badge variant="outline">Desconhecido</Badge>;
  }
};

const ActivityRegistry = ({ employeeId = "1" }) => {
  const [activities, setActivities] = useState<Activity[]>(
    mockActivities.filter((a) => a.employeeId === employeeId),
  );
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>(
    mockPaymentRequests.filter((pr) => pr.employeeId === employeeId),
  );
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [showPaymentRequests, setShowPaymentRequests] = useState(false);

  const handleAddActivity = (formData: ActivityFormData) => {
    const newId = `a${Date.now()}`;
    const activityToAdd: Activity = {
      id: newId,
      employeeId,
      type: formData.type,
      description: formData.description,
      date: formData.date,
      hours: formData.hours,
      rate: formData.rate,
      status: "pending",
    };

    setActivities([...activities, activityToAdd]);
    setIsAddActivityOpen(false);
  };

  const toggleActivitySelection = (activityId: string) => {
    if (selectedActivities.includes(activityId)) {
      setSelectedActivities(
        selectedActivities.filter((id) => id !== activityId),
      );
    } else {
      setSelectedActivities([...selectedActivities, activityId]);
    }
  };

  const createPaymentRequest = () => {
    if (selectedActivities.length === 0) return;

    const selectedActivityObjects = activities.filter((a) =>
      selectedActivities.includes(a.id),
    );
    const totalAmount = selectedActivityObjects.reduce(
      (sum, activity) => sum + activity.hours * activity.rate,
      0,
    );

    const newPaymentRequest: PaymentRequest = {
      id: `pr${Date.now()}`,
      employeeId,
      activityIds: [...selectedActivities],
      totalAmount,
      status: "pending",
      requestDate: new Date(),
    };

    // Update activities to link them to this payment request
    const updatedActivities = activities.map((activity) => {
      if (selectedActivities.includes(activity.id)) {
        return {
          ...activity,
          status: "approved",
          paymentRequestId: newPaymentRequest.id,
        };
      }
      return activity;
    });

    setPaymentRequests([...paymentRequests, newPaymentRequest]);
    setActivities(updatedActivities);
    setSelectedActivities([]);
  };

  const pendingActivities = activities.filter((a) => a.status === "pending");
  const otherActivities = activities.filter((a) => a.status !== "pending");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Registo de Atividades</h2>
          <p className="text-sm text-gray-500">
            Registe atividades adicionais para pagamento
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPaymentRequests(!showPaymentRequests)}
          >
            {showPaymentRequests
              ? "Ver Atividades"
              : "Ver Requisições de Pagamento"}
          </Button>
          <Dialog open={isAddActivityOpen} onOpenChange={setIsAddActivityOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Atividade
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Adicionar Nova Atividade</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes da atividade realizada para solicitar
                  pagamento.
                </DialogDescription>
              </DialogHeader>

              <ActivityForm
                employeeId={employeeId}
                onSubmit={handleAddActivity}
                onCancel={() => setIsAddActivityOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {!showPaymentRequests ? (
        <>
          {/* Pending Activities */}
          {pendingActivities.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    Atividades Pendentes
                  </CardTitle>
                  {selectedActivities.length > 0 && (
                    <Button onClick={createPaymentRequest}>
                      Criar Requisição de Pagamento
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center h-5 mr-3">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          checked={selectedActivities.includes(activity.id)}
                          onChange={() => toggleActivitySelection(activity.id)}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {activityTypes.find(
                                  (t) => t.id === activity.type,
                                )?.label || activity.type}
                              </span>
                              {getStatusBadge(activity.status)}
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
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Other Activities */}
          {otherActivities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Histórico de Atividades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {otherActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {activityTypes.find((t) => t.id === activity.type)
                                ?.label || activity.type}
                            </span>
                            {getStatusBadge(activity.status)}
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
                        {activity.paymentRequestId && (
                          <Badge variant="outline" className="text-xs">
                            Requisição #
                            {activity.paymentRequestId.replace("pr", "")}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {activities.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                Nenhuma atividade registada
              </h3>
              <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                Ainda não existem atividades registadas para este funcionário.
                Clique em "Nova Atividade" para adicionar.
              </p>
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Requisições de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            {paymentRequests.length > 0 ? (
              <div className="space-y-4">
                {paymentRequests.map((request) => {
                  const requestActivities = activities.filter((a) =>
                    request.activityIds.includes(a.id),
                  );
                  return (
                    <div
                      key={request.id}
                      className="border rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">
                              Requisição #{request.id.replace("pr", "")}
                            </h4>
                            {request.status === "pending" && (
                              <Badge
                                variant="outline"
                                className="text-amber-600 border-amber-300"
                              >
                                Pendente
                              </Badge>
                            )}
                            {request.status === "approved" && (
                              <Badge className="bg-green-100 text-green-800">
                                Aprovado
                              </Badge>
                            )}
                            {request.status === "rejected" && (
                              <Badge variant="destructive">Rejeitado</Badge>
                            )}
                            {request.status === "paid" && (
                              <Badge className="bg-blue-100 text-blue-800">
                                Pago
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Solicitado em{" "}
                            {format(request.requestDate, "PPP", { locale: pt })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">
                            {request.totalAmount.toFixed(2)}€
                          </p>
                          <p className="text-sm text-gray-500">
                            {requestActivities.length} atividade(s)
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-md mb-3">
                        <h5 className="font-medium mb-2">
                          Atividades Incluídas
                        </h5>
                        <div className="space-y-2">
                          {requestActivities.map((activity) => (
                            <div
                              key={activity.id}
                              className="flex justify-between text-sm"
                            >
                              <div>
                                <span className="font-medium">
                                  {activityTypes.find(
                                    (t) => t.id === activity.type,
                                  )?.label || activity.type}
                                </span>
                                <span className="text-gray-500 ml-2">
                                  {format(activity.date, "P", { locale: pt })} •{" "}
                                  {activity.hours}h
                                </span>
                              </div>
                              <span>
                                {(activity.hours * activity.rate).toFixed(2)}€
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        {request.status === "pending" && (
                          <>
                            <Button variant="outline" size="sm">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              Cancelar
                            </Button>
                            <Button size="sm">
                              <FileText className="h-4 w-4 mr-1" />
                              Ver Detalhes
                            </Button>
                          </>
                        )}
                        {request.status === "approved" && (
                          <Button size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            Ver Detalhes
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">
                  Nenhuma requisição de pagamento
                </h3>
                <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                  Ainda não existem requisições de pagamento para este
                  funcionário.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ActivityRegistry;
