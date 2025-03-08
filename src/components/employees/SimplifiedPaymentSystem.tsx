import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePickerWithPresets } from "@/components/calendar/DatePickerWithPresets";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import {
  Plus,
  Save,
  Clock,
  CheckCircle,
  AlertTriangle,
  Ban,
  Calendar,
  DollarSign,
  FileText,
  Download,
  Eye,
} from "lucide-react";

// Tipos simplificados
interface Activity {
  id: string;
  type: string;
  description: string;
  date: Date;
  hours: number;
  rate: number;
  status: "pending" | "approved" | "rejected" | "paid";
}

interface Payment {
  id: string;
  month: string;
  date: Date;
  total: number;
  status: "pending" | "approved" | "paid";
  activities: string[];
}

interface SimplifiedPaymentSystemProps {
  employeeName: string;
  baseSalary?: number;
}

const SimplifiedPaymentSystem: React.FC<SimplifiedPaymentSystemProps> = ({
  employeeName,
  baseSalary = 1500,
}) => {
  // Estados unificados
  const [activities, setActivities] = useState<Activity[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // Estado para nova atividade
  const [newActivity, setNewActivity] = useState<
    Omit<Activity, "id" | "status"> & { hours: any; rate: any }
  >({
    type: "Horas Extras",
    description: "",
    date: new Date(),
    hours: "",
    rate: "",
  });

  // Estado para novo pagamento
  const [newPayment, setNewPayment] = useState({
    month: format(new Date(), "MMMM yyyy", { locale: pt }),
    date: new Date(),
    selectedActivities: [] as string[],
  });

  // Funções para atividades
  const handleAddActivity = () => {
    const activity: Activity = {
      id: `activity-${Date.now()}`,
      ...newActivity,
      status: "approved",
    };

    setActivities([...activities, activity]);
    setShowActivityForm(false);
    setNewActivity({
      type: "Horas Extras",
      description: "",
      date: new Date(),
      hours: "",
      rate: "",
    });
  };

  // Funções para pagamentos
  const handleAddPayment = () => {
    // Calcular o total baseado nas atividades selecionadas
    const selectedActivityObjects = activities.filter((a) =>
      newPayment.selectedActivities.includes(a.id),
    );

    const activitiesTotal = selectedActivityObjects.reduce(
      (sum, activity) => sum + activity.hours * activity.rate,
      0,
    );

    const payment: Payment = {
      id: `payment-${Date.now()}`,
      month: newPayment.month,
      date: newPayment.date,
      total: baseSalary + activitiesTotal,
      status: "approved",
      activities: newPayment.selectedActivities,
    };

    setPayments([...payments, payment]);

    // Marcar atividades como pagas
    setActivities(
      activities.map((activity) =>
        newPayment.selectedActivities.includes(activity.id)
          ? { ...activity, status: "paid" }
          : activity,
      ),
    );

    setShowPaymentForm(false);
    setNewPayment({
      month: format(new Date(), "MMMM yyyy", { locale: pt }),
      date: new Date(),
      selectedActivities: [],
    });
  };

  const handleProcessPayment = (paymentId: string) => {
    setPayments(
      payments.map((payment) =>
        payment.id === paymentId ? { ...payment, status: "paid" } : payment,
      ),
    );
  };

  // Atividades disponíveis para pagamento (aprovadas e não pagas)
  const availableActivities = activities.filter(
    (activity) => activity.status === "approved",
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="activities">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="activities">Atividades</TabsTrigger>
            <TabsTrigger value="payments">Pagamentos</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="activities">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">Atividades</CardTitle>
              <Button onClick={() => setShowActivityForm(!showActivityForm)}>
                <Plus className="h-4 w-4 mr-2" /> Nova Atividade
              </Button>
            </CardHeader>
            <CardContent>
              {showActivityForm && (
                <div className="space-y-4 mb-6 p-4 border rounded-md bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Tipo</Label>
                      <Input
                        id="type"
                        value={newActivity.type}
                        onChange={(e) =>
                          setNewActivity({
                            ...newActivity,
                            type: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Data</Label>
                      <DatePickerWithPresets
                        date={newActivity.date}
                        onDateChange={(date) =>
                          date && setNewActivity({ ...newActivity, date })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hours">Horas</Label>
                      <Input
                        id="hours"
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={newActivity.hours}
                        onChange={(e) =>
                          setNewActivity({
                            ...newActivity,
                            hours: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rate">Taxa (€/h)</Label>
                      <Input
                        id="rate"
                        type="number"
                        min="0"
                        step="0.5"
                        value={newActivity.rate}
                        onChange={(e) =>
                          setNewActivity({
                            ...newActivity,
                            rate: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={newActivity.description}
                        onChange={(e) =>
                          setNewActivity({
                            ...newActivity,
                            description: e.target.value,
                          })
                        }
                        rows={2}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowActivityForm(false)}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleAddActivity}>Adicionar</Button>
                  </div>
                </div>
              )}

              {activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="p-4 border rounded-md hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{activity.type}</h3>
                            <Badge
                              variant="outline"
                              className={`${
                                activity.status === "approved"
                                  ? "bg-green-50 text-green-700"
                                  : activity.status === "paid"
                                    ? "bg-blue-50 text-blue-700"
                                    : "bg-yellow-50 text-yellow-700"
                              }`}
                            >
                              {activity.status === "approved"
                                ? "Aprovado"
                                : activity.status === "paid"
                                  ? "Pago"
                                  : "Pendente"}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {format(activity.date, "PPP", { locale: pt })} •{" "}
                            {activity.hours}h × {activity.rate}€/h ={" "}
                            {(activity.hours * activity.rate).toFixed(2)}€
                          </p>
                          <p className="text-sm mt-2">{activity.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="font-medium">Nenhuma atividade registrada</p>
                  <p className="text-sm mt-1">
                    Clique em "Nova Atividade" para registrar atividades
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">Pagamentos</CardTitle>
              <Button
                onClick={() => setShowPaymentForm(!showPaymentForm)}
                disabled={availableActivities.length === 0}
              >
                <Plus className="h-4 w-4 mr-2" /> Novo Pagamento
              </Button>
            </CardHeader>
            <CardContent>
              {showPaymentForm && (
                <div className="space-y-4 mb-6 p-4 border rounded-md bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="month">Mês de Referência</Label>
                      <Input
                        id="month"
                        value={newPayment.month}
                        onChange={(e) =>
                          setNewPayment({
                            ...newPayment,
                            month: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="date">Data de Pagamento</Label>
                      <DatePickerWithPresets
                        date={newPayment.date}
                        onDateChange={(date) =>
                          date && setNewPayment({ ...newPayment, date })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Atividades a Incluir</Label>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto p-2 border rounded-md bg-white">
                      {availableActivities.length > 0 ? (
                        availableActivities.map((activity) => (
                          <div
                            key={activity.id}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              id={`activity-${activity.id}`}
                              checked={newPayment.selectedActivities.includes(
                                activity.id,
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewPayment({
                                    ...newPayment,
                                    selectedActivities: [
                                      ...newPayment.selectedActivities,
                                      activity.id,
                                    ],
                                  });
                                } else {
                                  setNewPayment({
                                    ...newPayment,
                                    selectedActivities:
                                      newPayment.selectedActivities.filter(
                                        (id) => id !== activity.id,
                                      ),
                                  });
                                }
                              }}
                              className="h-4 w-4"
                            />
                            <label
                              htmlFor={`activity-${activity.id}`}
                              className="text-sm flex-1"
                            >
                              {activity.type} -{" "}
                              {format(activity.date, "dd/MM/yyyy")} -{" "}
                              {(activity.hours * activity.rate).toFixed(2)}€
                            </label>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-2">
                          Não há atividades disponíveis
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-md border">
                    <div className="flex justify-between font-medium">
                      <span>Salário Base:</span>
                      <span>{baseSalary.toFixed(2)}€</span>
                    </div>
                    {newPayment.selectedActivities.length > 0 && (
                      <div className="flex justify-between mt-1">
                        <span>Atividades:</span>
                        <span>
                          {activities
                            .filter((a) =>
                              newPayment.selectedActivities.includes(a.id),
                            )
                            .reduce((sum, a) => sum + a.hours * a.rate, 0)
                            .toFixed(2)}
                          €
                        </span>
                      </div>
                    )}
                    <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                      <span>Total:</span>
                      <span>
                        {(
                          baseSalary +
                          activities
                            .filter((a) =>
                              newPayment.selectedActivities.includes(a.id),
                            )
                            .reduce((sum, a) => sum + a.hours * a.rate, 0)
                        ).toFixed(2)}
                        €
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowPaymentForm(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleAddPayment}
                      disabled={newPayment.selectedActivities.length === 0}
                    >
                      Criar Pagamento
                    </Button>
                  </div>
                </div>
              )}

              {payments.length > 0 ? (
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
                            <Badge
                              variant="outline"
                              className={
                                payment.status === "paid"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-blue-50 text-blue-700"
                              }
                            >
                              {payment.status === "paid" ? "Pago" : "Aprovado"}
                            </Badge>
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
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {payment.status === "approved" && (
                            <Button
                              size="sm"
                              variant="default"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleProcessPayment(payment.id)}
                            >
                              <DollarSign className="h-4 w-4 mr-1" /> Efetuar
                              Pagamento
                            </Button>
                          )}
                          {payment.status === "paid" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                console.log("Download receipt", payment.id)
                              }
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SimplifiedPaymentSystem;
