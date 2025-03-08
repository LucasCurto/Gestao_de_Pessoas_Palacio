import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  DollarSign,
  Download,
  Eye,
  Edit,
  Trash2,
  CreditCard,
  BanknoteIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import SimplePaymentForm from "./SimplePaymentForm";

interface Activity {
  id: string;
  employeeId: string;
  type: string;
  description: string;
  date: Date;
  hours: number;
  rate: number;
  status: "pending" | "approved" | "rejected" | "paid";
  paymentId?: string;
}

interface Payment {
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
  paymentMethod: "bank_transfer" | "multibanco" | "mbway";
}

interface EmployeePaymentSystemProps {
  employeeId: string;
  employeeName: string;
  baseSalary: number;
}

const EmployeePaymentSystem: React.FC<EmployeePaymentSystemProps> = ({
  employeeId,
  employeeName,
  baseSalary,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  // Sincronizar com o mês selecionado no perfil
  useEffect(() => {
    const handleSelectedMonthChange = () => {
      const storedMonth = localStorage.getItem("selectedMonth");
      if (storedMonth) {
        setSelectedMonth(new Date(storedMonth));
      }
    };

    // Carregar o mês inicial
    handleSelectedMonthChange();

    // Escutar por mudanças
    window.addEventListener("selectedMonthChanged", handleSelectedMonthChange);

    return () => {
      window.removeEventListener(
        "selectedMonthChanged",
        handleSelectedMonthChange,
      );
    };
  }, []);
  // Estado para controlar a exibição do formulário de pagamento
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // Carregar pagamentos do localStorage
  const loadPaymentsFromStorage = () => {
    try {
      const storedPayments = localStorage.getItem("employeePayments");
      if (storedPayments) {
        return JSON.parse(storedPayments).map((payment: any) => ({
          ...payment,
          date: new Date(payment.date),
          dueDate: new Date(payment.dueDate),
          activities: payment.activities.map((activity: any) => ({
            ...activity,
            date: new Date(activity.date),
          })),
        }));
      }
    } catch (error) {
      console.error("Erro ao carregar pagamentos:", error);
    }
    return [
      {
        id: "payment-1",
        employeeId,
        month: "Maio 2023",
        date: new Date(2023, 4, 25),
        dueDate: new Date(2023, 4, 27),
        baseSalary: baseSalary,
        activities: [
          {
            id: "activity-1",
            employeeId,
            type: "Horas Extras",
            description: "Trabalho adicional no projeto X",
            date: new Date(2023, 4, 15),
            hours: 3,
            rate: 15,
            status: "paid",
          },
          {
            id: "activity-2",
            employeeId,
            type: "Formação",
            description: "Curso de Excel avançado",
            date: new Date(2023, 4, 20),
            hours: 8,
            rate: 12,
            status: "paid",
          },
        ],
        bonus: 100,
        allowances: 50,
        deductions: 150,
        taxes: 500,
        total: 2545,
        status: "paid",
        paymentMethod: "bank_transfer",
      },
      {
        id: "payment-2",
        employeeId,
        month: "Junho 2023",
        date: new Date(2023, 5, 25),
        dueDate: new Date(2023, 5, 27),
        baseSalary: baseSalary,
        activities: [
          {
            id: "activity-3",
            employeeId,
            type: "Horas Extras",
            description: "Preparação para lançamento do produto",
            date: new Date(2023, 5, 10),
            hours: 5,
            rate: 15,
            status: "paid",
          },
        ],
        bonus: 200,
        allowances: 50,
        deductions: 150,
        taxes: 550,
        total: 2625,
        status: "paid",
        paymentMethod: "multibanco",
      },
      {
        id: "payment-3",
        employeeId,
        month: "Julho 2023",
        date: new Date(2023, 6, 25),
        dueDate: new Date(2023, 6, 27),
        baseSalary: baseSalary,
        activities: [],
        bonus: 0,
        allowances: 50,
        deductions: 150,
        taxes: 480,
        total: 1920,
        status: "pending",
        paymentMethod: "mbway",
      },
    ];
  };

  // Carregar dados de pagamentos
  const [payments, setPayments] = useState<Payment[]>(
    loadPaymentsFromStorage(),
  );

  // Filtrar pagamentos pelo mês selecionado
  const filteredPayments = payments.filter((payment) => {
    // Verificar se a data do pagamento é válida
    if (
      !payment.date ||
      !(payment.date instanceof Date) ||
      isNaN(payment.date.getTime())
    ) {
      console.warn("Pagamento com data inválida:", payment);
      return false;
    }

    // Extrair mês e ano do pagamento e do mês selecionado
    const paymentMonth = payment.date.getMonth();
    const paymentYear = payment.date.getFullYear();
    const selectedMonthValue = selectedMonth.getMonth();
    const selectedYearValue = selectedMonth.getFullYear();

    // Comparar mês e ano
    return (
      paymentMonth === selectedMonthValue && paymentYear === selectedYearValue
    );
  });

  // Ordenar pagamentos por data (ordem cronológica)
  const sortedPayments = [...filteredPayments].sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );

  // Get all activities from payments
  const allActivities = payments.flatMap((payment) => payment.activities);

  // Importar tarefas aprovadas do componente EmployeeTimelineView
  // Normalmente isso seria feito através de um contexto ou API
  const [approvedTasks, setApprovedTasks] = useState<Activity[]>([]);

  // Função para atualizar as tarefas aprovadas
  useEffect(() => {
    // Buscar tarefas aprovadas
    const fetchApprovedTasks = () => {
      try {
        // Buscar todas as tarefas do funcionário
        const allEmployeeTasks = localStorage.getItem("employeeTasks");
        if (allEmployeeTasks) {
          const parsedTasks = JSON.parse(allEmployeeTasks);

          // Filtrar apenas as tarefas aprovadas que não estão em nenhum pagamento
          const approvedTasksList = parsedTasks
            .filter(
              (task: any) =>
                task.status === "approved" &&
                !task.paymentId &&
                (task.employeeId === employeeId || !task.employeeId),
            )
            .map((task: any) => ({
              ...task,
              employeeId: employeeId,
              date: new Date(task.date),
            }));

          setApprovedTasks(approvedTasksList);
          console.log(
            "Tarefas aprovadas disponíveis para pagamento:",
            approvedTasksList,
          );
        }
      } catch (error) {
        console.error("Erro ao carregar tarefas aprovadas:", error);
      }
    };

    fetchApprovedTasks();

    // Adicionar listener para atualizar quando houver mudanças
    window.addEventListener("approvedTasksUpdated", fetchApprovedTasks);

    // Também atualizar quando mudar de mês
    window.addEventListener("selectedMonthChanged", fetchApprovedTasks);

    return () => {
      window.removeEventListener("approvedTasksUpdated", fetchApprovedTasks);
      window.removeEventListener("selectedMonthChanged", fetchApprovedTasks);
    };
  }, [employeeId]);

  // Combinar tarefas aprovadas com as atividades mock
  const mockActivities: Activity[] = [
    {
      id: "activity-4",
      employeeId,
      type: "Trabalho Fim de Semana",
      description: "Suporte ao cliente no fim de semana",
      date: new Date(2023, 6, 15),
      hours: 6,
      rate: 20,
      status: "approved",
    },
    {
      id: "activity-5",
      employeeId,
      type: "Deslocação",
      description: "Visita ao cliente em Faro",
      date: new Date(2023, 6, 20),
      hours: 4,
      rate: 10,
      status: "approved",
    },
  ];

  // Combinar as tarefas aprovadas com as atividades mock
  const availableActivities: Activity[] = [...mockActivities, ...approvedTasks];

  // Exibir no console para debug
  useEffect(() => {
    console.log("Atividades disponíveis para pagamento:", availableActivities);

    // Carregar tipos de atividades e métodos de pagamento das configurações
    const loadConfigsFromSettings = () => {
      try {
        // Verificar se já existem configurações no localStorage
        if (!localStorage.getItem("activityTypes")) {
          // Carregar tipos de atividades padrão da configuração do sistema
          const defaultActivityTypes = [
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
          ];
          localStorage.setItem(
            "activityTypes",
            JSON.stringify(defaultActivityTypes),
          );
        }

        if (!localStorage.getItem("paymentMethods")) {
          // Carregar métodos de pagamento padrão da configuração do sistema
          const defaultPaymentMethods = [
            {
              id: "bank_transfer",
              name: "Transferência Bancária",
              description: "Pagamento via transferência bancária",
              isActive: true,
              processingFee: 0,
              requiresApproval: true,
              instructions:
                "Transferência para o IBAN do funcionário registrado no sistema",
            },
            {
              id: "multibanco",
              name: "Multibanco",
              description: "Pagamento via referência multibanco",
              isActive: true,
              processingFee: 0.5,
              requiresApproval: true,
              instructions:
                "Referência gerada automaticamente e enviada por email",
            },
            {
              id: "mbway",
              name: "MBWay",
              description: "Pagamento via aplicação MBWay",
              isActive: true,
              processingFee: 1.0,
              requiresApproval: false,
              instructions:
                "Pagamento enviado para o número de telefone registrado",
            },
          ];
          localStorage.setItem(
            "paymentMethods",
            JSON.stringify(defaultPaymentMethods),
          );
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      }
    };

    loadConfigsFromSettings();
  }, [availableActivities]);

  // Função para criar ou atualizar um pagamento
  const handleCreatePayment = (paymentData: any) => {
    try {
      // Filtrar atividades selecionadas
      const selectedActivities = availableActivities.filter((activity) =>
        paymentData.activityIds.includes(activity.id),
      );

      let updatedPayments: Payment[];

      if (editingPayment) {
        // Atualizar pagamento existente
        updatedPayments = payments.map((payment) =>
          payment.id === editingPayment.id
            ? {
                ...payment,
                ...paymentData,
                activities: selectedActivities,
              }
            : payment,
        );
        setEditingPayment(null);
      } else {
        // Criar novo pagamento
        const newPayment: Payment = {
          id: `payment-${Date.now()}`,
          employeeId,
          status: "approved", // Inicialmente aprovado para pagamento
          activities: selectedActivities,
          ...paymentData,
        };

        // Adicionar o pagamento à lista
        updatedPayments = [...payments, newPayment];
      }

      setPayments(updatedPayments);

      // Salvar pagamentos no localStorage
      localStorage.setItem("employeePayments", JSON.stringify(updatedPayments));

      // Atualizar o status das tarefas para incluir o ID do pagamento
      if (selectedActivities.length > 0) {
        // Buscar todas as tarefas
        const allEmployeeTasks = localStorage.getItem("employeeTasks");
        if (allEmployeeTasks) {
          const parsedTasks = JSON.parse(allEmployeeTasks);

          // Atualizar as tarefas selecionadas com o ID do pagamento
          const updatedTasks = parsedTasks.map((task: any) => {
            if (selectedActivities.some((a) => a.id === task.id)) {
              return {
                ...task,
                paymentId: editingPayment?.id || `payment-${Date.now()}`,
                status: "paid", // Marcar como paga
              };
            }
            return task;
          });

          // Salvar tarefas atualizadas
          localStorage.setItem("employeeTasks", JSON.stringify(updatedTasks));

          // Notificar outros componentes
          window.dispatchEvent(new Event("approvedTasksUpdated"));
        }
      }

      // Fechar o formulário
      setShowPaymentForm(false);
    } catch (error) {
      console.error("Erro ao criar pagamento:", error);
    }
  };

  // Função para processar um pagamento
  const handleProcessPayment = (paymentId: string) => {
    const updatedPayments = payments.map((payment) =>
      payment.id === paymentId ? { ...payment, status: "paid" } : payment,
    );

    setPayments(updatedPayments);

    // Salvar no localStorage
    localStorage.setItem("employeePayments", JSON.stringify(updatedPayments));

    // Atualizar status das atividades para pagas
    const payment = payments.find((p) => p.id === paymentId);
    if (payment && payment.activities.length > 0) {
      const allEmployeeTasks = localStorage.getItem("employeeTasks");
      if (allEmployeeTasks) {
        const parsedTasks = JSON.parse(allEmployeeTasks);

        // Atualizar status das tarefas incluídas no pagamento
        const activityIds = payment.activities.map((a) => a.id);
        const updatedTasks = parsedTasks.map((task: any) => {
          if (activityIds.includes(task.id)) {
            return {
              ...task,
              status: "paid",
              paymentId: paymentId,
            };
          }
          return task;
        });

        // Salvar tarefas atualizadas
        localStorage.setItem("employeeTasks", JSON.stringify(updatedTasks));

        // Notificar outros componentes
        window.dispatchEvent(new Event("approvedTasksUpdated"));
      }
    }
  };

  // Função para visualizar um pagamento
  const handleViewPayment = (paymentId: string) => {
    console.log("Visualizando pagamento:", paymentId);
    // Implementar visualização detalhada do pagamento
  };

  // Função para baixar recibo
  const handleDownloadReceipt = (paymentId: string) => {
    try {
      // Encontrar o pagamento pelo ID
      const payment = payments.find((p) => p.id === paymentId);
      if (!payment) {
        alert("Pagamento não encontrado");
        return;
      }

      // Importar dinamicamente jsPDF para evitar problemas de SSR
      import("jspdf")
        .then(({ jsPDF }) => {
          import("jspdf-autotable").then(() => {
            const doc = new jsPDF();

            // Cabeçalho do recibo
            doc.setFontSize(18);
            doc.text("Recibo de Pagamento", 105, 15, { align: "center" });

            // Informações da empresa
            doc.setFontSize(10);
            doc.text("PayManager - Sistema de Gestão de Pagamentos", 105, 25, {
              align: "center",
            });
            doc.text("Rua Principal, 123 - Lisboa, Portugal", 105, 30, {
              align: "center",
            });
            doc.text("NIF: 123456789", 105, 35, { align: "center" });

            // Linha separadora
            doc.setDrawColor(200, 200, 200);
            doc.line(20, 40, 190, 40);

            // Informações do pagamento
            doc.setFontSize(12);
            doc.text(`Recibo Nº: ${payment.id}`, 20, 50);
            doc.text(
              `Data: ${format(payment.date, "dd/MM/yyyy", { locale: pt })}`,
              20,
              60,
            );
            doc.text(`Funcionário: ${employeeName}`, 20, 70);
            doc.text(`Mês de Referência: ${payment.month}`, 20, 80);

            // Detalhes do pagamento
            doc.setFontSize(14);
            doc.text("Detalhes do Pagamento", 105, 95, { align: "center" });

            // Tabela de valores
            const tableData = [
              ["Salário Base", `${payment.baseSalary.toFixed(2)}€`],
              [
                "Atividades",
                `${payment.activities.reduce((sum, a) => sum + a.hours * a.rate, 0).toFixed(2)}€`,
              ],
              ["Bónus", `${payment.bonus.toFixed(2)}€`],
              ["Subsídios", `${payment.allowances.toFixed(2)}€`],
              ["Deduções", `${payment.deductions.toFixed(2)}€`],
              ["Impostos", `${payment.taxes.toFixed(2)}€`],
              ["Total", `${payment.total.toFixed(2)}€`],
            ];

            (doc as any).autoTable({
              startY: 100,
              head: [["Descrição", "Valor"]],
              body: tableData,
              theme: "grid",
              headStyles: { fillColor: [41, 128, 185], textColor: 255 },
              foot: [["Total Líquido", `${payment.total.toFixed(2)}€`]],
              footStyles: {
                fillColor: [41, 128, 185],
                textColor: 255,
                fontStyle: "bold",
              },
            });

            // Método de pagamento
            doc.setFontSize(10);
            doc.text(
              `Método de Pagamento: ${
                payment.paymentMethod === "bank_transfer"
                  ? "Transferência Bancária"
                  : payment.paymentMethod === "multibanco"
                    ? "Multibanco"
                    : "MBWay"
              }`,
              20,
              (doc as any).lastAutoTable.finalY + 10,
            );

            // Assinaturas
            doc.text(
              "_______________________",
              40,
              (doc as any).lastAutoTable.finalY + 30,
            );
            doc.text(
              "Assinatura do Empregador",
              40,
              (doc as any).lastAutoTable.finalY + 35,
            );

            doc.text(
              "_______________________",
              150,
              (doc as any).lastAutoTable.finalY + 30,
            );
            doc.text(
              "Assinatura do Funcionário",
              150,
              (doc as any).lastAutoTable.finalY + 35,
            );

            // Rodapé
            doc.setFontSize(8);
            doc.text(
              "Este documento serve como comprovativo de pagamento.",
              105,
              280,
              { align: "center" },
            );

            // Salvar o PDF
            doc.save(
              `Recibo_${payment.id}_${format(payment.date, "yyyy-MM-dd")}.pdf`,
            );
          });
        })
        .catch((error) => {
          console.error("Erro ao carregar bibliotecas PDF:", error);
          alert("Erro ao gerar PDF. Verifique o console para mais detalhes.");
        });
    } catch (error) {
      console.error("Erro ao baixar recibo:", error);
      alert("Erro ao gerar recibo. Verifique o console para mais detalhes.");
    }
  };

  // Função para excluir um pagamento
  const handleDeletePayment = (paymentId: string) => {
    if (confirm("Tem certeza que deseja excluir este pagamento?")) {
      // Encontrar o pagamento a ser excluído
      const paymentToDelete = payments.find((p) => p.id === paymentId);

      // Remover o pagamento da lista
      const updatedPayments = payments.filter(
        (payment) => payment.id !== paymentId,
      );
      setPayments(updatedPayments);

      // Salvar no localStorage
      localStorage.setItem("employeePayments", JSON.stringify(updatedPayments));

      // Liberar as atividades associadas a este pagamento
      if (paymentToDelete && paymentToDelete.activities.length > 0) {
        const allEmployeeTasks = localStorage.getItem("employeeTasks");
        if (allEmployeeTasks) {
          const parsedTasks = JSON.parse(allEmployeeTasks);

          // Restaurar status das tarefas incluídas no pagamento para 'approved'
          const activityIds = paymentToDelete.activities.map((a) => a.id);
          const updatedTasks = parsedTasks.map((task: any) => {
            if (activityIds.includes(task.id)) {
              return {
                ...task,
                status: "approved",
                paymentId: undefined,
              };
            }
            return task;
          });

          // Salvar tarefas atualizadas
          localStorage.setItem("employeeTasks", JSON.stringify(updatedTasks));

          // Notificar outros componentes
          window.dispatchEvent(new Event("approvedTasksUpdated"));
        }
      }
    }
  };

  // Estado para edição de pagamento
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  // Função para editar um pagamento
  const handleEditPayment = (payment: Payment) => {
    setEditingPayment(payment);
    setShowPaymentForm(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Pago
          </Badge>
        );
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
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {showPaymentForm ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingPayment ? "Editar Pagamento" : "Novo Pagamento"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimplePaymentForm
              employeeId={employeeId}
              employeeName={employeeName}
              baseSalary={baseSalary}
              availableActivities={availableActivities}
              onSubmit={handleCreatePayment}
              onCancel={() => {
                setShowPaymentForm(false);
                setEditingPayment(null);
              }}
              initialData={editingPayment}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Histórico de Pagamentos</h2>
            <Button
              onClick={() => {
                setEditingPayment(null);
                setShowPaymentForm(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" /> Novo Pagamento
            </Button>
          </div>

          {sortedPayments.length > 0 ? (
            <div className="overflow-hidden rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="py-3 px-4 text-left font-medium">Data</th>
                    <th className="py-3 px-4 text-left font-medium">Mês</th>
                    <th className="py-3 px-4 text-left font-medium">
                      Salário Base
                    </th>
                    <th className="py-3 px-4 text-left font-medium">
                      Atividades
                    </th>
                    <th className="py-3 px-4 text-left font-medium">Bônus</th>
                    <th className="py-3 px-4 text-left font-medium">Total</th>
                    <th className="py-3 px-4 text-left font-medium">Método</th>
                    <th className="py-3 px-4 text-left font-medium">Status</th>
                    <th className="py-3 px-4 text-left font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPayments.map((payment) => (
                    <tr key={payment.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {format(payment.date, "dd/MM/yyyy", { locale: pt })}
                      </td>
                      <td className="py-3 px-4">{payment.month}</td>
                      <td className="py-3 px-4">
                        {payment.baseSalary.toFixed(2)}€
                      </td>
                      <td className="py-3 px-4">
                        {payment.activities.length > 0 ? (
                          <span
                            className="text-blue-600 cursor-pointer"
                            onClick={() => handleViewPayment(payment.id)}
                          >
                            {payment.activities.length} atividades
                          </span>
                        ) : (
                          "Nenhuma"
                        )}
                      </td>
                      <td className="py-3 px-4">{payment.bonus.toFixed(2)}€</td>
                      <td className="py-3 px-4 font-medium">
                        {payment.total.toFixed(2)}€
                      </td>
                      <td className="py-3 px-4">
                        {(() => {
                          // Tentar obter o nome do método de pagamento das configurações
                          try {
                            const storedMethods =
                              localStorage.getItem("paymentMethods");
                            if (storedMethods) {
                              const methods = JSON.parse(storedMethods);
                              const method = methods.find(
                                (m: any) => m.id === payment.paymentMethod,
                              );
                              if (method) {
                                return (
                                  <Badge
                                    variant="outline"
                                    className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"
                                  >
                                    {method.name
                                      .toLowerCase()
                                      .includes("transferência") ? (
                                      <BanknoteIcon className="h-3 w-3" />
                                    ) : (
                                      <CreditCard className="h-3 w-3" />
                                    )}
                                    {method.name}
                                  </Badge>
                                );
                              }
                            }
                          } catch (error) {
                            console.error(
                              "Erro ao carregar método de pagamento:",
                              error,
                            );
                          }

                          // Fallback para métodos padrão
                          if (payment.paymentMethod === "bank_transfer") {
                            return (
                              <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"
                              >
                                <BanknoteIcon className="h-3 w-3" />{" "}
                                Transferência
                              </Badge>
                            );
                          } else if (payment.paymentMethod === "multibanco") {
                            return (
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                              >
                                <CreditCard className="h-3 w-3" /> Multibanco
                              </Badge>
                            );
                          } else if (payment.paymentMethod === "mbway") {
                            return (
                              <Badge
                                variant="outline"
                                className="bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1"
                              >
                                <CreditCard className="h-3 w-3" /> MBWay
                              </Badge>
                            );
                          } else {
                            return (
                              <Badge
                                variant="outline"
                                className="bg-gray-50 text-gray-700 border-gray-200 flex items-center gap-1"
                              >
                                <CreditCard className="h-3 w-3" />{" "}
                                {payment.paymentMethod}
                              </Badge>
                            );
                          }
                        })()}
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => handleViewPayment(payment.id)}
                          >
                            <Eye className="h-3 w-3 mr-1" /> Detalhes
                          </Button>
                          {payment.status === "approved" && (
                            <Button
                              size="sm"
                              variant="default"
                              className="h-7 text-xs bg-green-600 hover:bg-green-700"
                              onClick={() => handleProcessPayment(payment.id)}
                            >
                              <DollarSign className="h-3 w-3 mr-1" /> Pagar
                            </Button>
                          )}
                          {payment.status === "paid" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={() => handleDownloadReceipt(payment.id)}
                            >
                              <Download className="h-3 w-3 mr-1" /> Recibo
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={() => handleEditPayment(payment)}
                            disabled={payment.status === "paid"}
                          >
                            <Edit className="h-3 w-3 mr-1" /> Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleDeletePayment(payment.id)}
                            disabled={payment.status === "paid"}
                          >
                            <Trash2 className="h-3 w-3 mr-1" /> Excluir
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="font-medium">
                Nenhum pagamento registrado para este mês
              </p>
              <p className="text-sm mt-1">
                Os pagamentos processados aparecerão aqui
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EmployeePaymentSystem;
