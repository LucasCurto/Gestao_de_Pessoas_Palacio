import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ActivityTypeManager, {
  ActivityType,
} from "../employees/ActivityTypeManager";
import PaymentMethodManager, {
  PaymentMethod,
} from "../employees/PaymentMethodManager";

const PaymentSettings = () => {
  // Estado para tipos de atividades
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([
    {
      id: "type-1",
      name: "Horas Extras",
      description: "Horas trabalhadas além do horário normal",
      defaultRate: 15,
    },
    {
      id: "type-2",
      name: "Trabalho Fim de Semana",
      description: "Trabalho realizado aos sábados e domingos",
      defaultRate: 20,
    },
    {
      id: "type-3",
      name: "Trabalho em Feriado",
      description: "Trabalho realizado em feriados nacionais",
      defaultRate: 25,
    },
    {
      id: "type-4",
      name: "Formação",
      description: "Horas dedicadas a formação e desenvolvimento",
      defaultRate: 12,
    },
    {
      id: "type-5",
      name: "Deslocação",
      description: "Tempo gasto em deslocações a serviço da empresa",
      defaultRate: 10,
    },
  ]);

  // Estado para métodos de pagamento
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "method-1",
      name: "Transferência Bancária",
      description: "Pagamento via transferência bancária",
      isActive: true,
      processingFee: 0,
      requiresApproval: true,
      instructions:
        "Transferência para o IBAN do funcionário registrado no sistema",
    },
    {
      id: "method-2",
      name: "Multibanco",
      description: "Pagamento via referência multibanco",
      isActive: true,
      processingFee: 0.5,
      requiresApproval: true,
      instructions: "Referência gerada automaticamente e enviada por email",
    },
    {
      id: "method-3",
      name: "MBWay",
      description: "Pagamento via aplicação MBWay",
      isActive: true,
      processingFee: 1.0,
      requiresApproval: false,
      instructions: "Pagamento enviado para o número de telefone registrado",
    },
  ]);

  // Funções para gerenciar tipos de atividades
  const handleAddActivityType = (activityType: Omit<ActivityType, "id">) => {
    const newType: ActivityType = {
      id: `type-${Date.now()}`,
      ...activityType,
    };
    setActivityTypes([...activityTypes, newType]);
  };

  const handleEditActivityType = (
    id: string,
    activityType: Omit<ActivityType, "id">,
  ) => {
    setActivityTypes(
      activityTypes.map((type) =>
        type.id === id ? { ...type, ...activityType } : type,
      ),
    );
  };

  const handleDeleteActivityType = (id: string) => {
    setActivityTypes(activityTypes.filter((type) => type.id !== id));
  };

  // Funções para gerenciar métodos de pagamento
  const handleAddPaymentMethod = (method: Omit<PaymentMethod, "id">) => {
    const newMethod: PaymentMethod = {
      id: `method-${Date.now()}`,
      ...method,
    };
    setPaymentMethods([...paymentMethods, newMethod]);
  };

  const handleEditPaymentMethod = (
    id: string,
    method: Omit<PaymentMethod, "id">,
  ) => {
    setPaymentMethods(
      paymentMethods.map((m) => (m.id === id ? { ...m, ...method } : m)),
    );
  };

  const handleDeletePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Configurações de Pagamento</h2>
        <p className="text-gray-500">
          Gerencie tipos de atividades e métodos de pagamento
        </p>
      </div>

      <Tabs defaultValue="activityTypes">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="activityTypes">Tipos de Atividades</TabsTrigger>
          <TabsTrigger value="paymentMethods">Métodos de Pagamento</TabsTrigger>
        </TabsList>

        <TabsContent value="activityTypes">
          <ActivityTypeManager
            activityTypes={activityTypes}
            onAddActivityType={handleAddActivityType}
            onEditActivityType={handleEditActivityType}
            onDeleteActivityType={handleDeleteActivityType}
          />
        </TabsContent>

        <TabsContent value="paymentMethods">
          <PaymentMethodManager
            paymentMethods={paymentMethods}
            onAddPaymentMethod={handleAddPaymentMethod}
            onEditPaymentMethod={handleEditPaymentMethod}
            onDeletePaymentMethod={handleDeletePaymentMethod}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentSettings;
