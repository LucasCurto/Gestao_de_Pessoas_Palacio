import React, { useState, useEffect } from "react";
import { useCompany } from "@/context/CompanyContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewPaymentForm, { PaymentFormData } from "./NewPaymentForm";
import MonthlyStatement from "./MonthlyStatement";
import PaymentDetails from "./PaymentDetails";
import {
  Download,
  FileText,
  Edit,
  Plus,
  ArrowDown,
  ArrowUp,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  Trash2,
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
  companyId?: string;
}

interface AccountEntry {
  id: string;
  date: Date;
  description: string;
  type: "salary" | "activity" | "bonus" | "deduction" | "tax" | "payment";
  amount: number;
  balance: number;
  relatedId?: string;
}

interface PaymentHistoryProps {
  employeeId: string;
  employeeName: string;
  activities: Activity[];
}

// Mock data for payments
const mockPayments: Payment[] = [
  {
    id: "p1",
    employeeId: "1",
    month: "Maio 2023",
    date: new Date("2023-05-28"),
    dueDate: new Date("2023-05-30"),
    amount: 2850,
    status: "paid",
    activities: ["1", "2"],
    adjustments: [
      {
        id: "adj1",
        paymentId: "p1",
        type: "bonus",
        amount: 200,
        description: "Bónus de desempenho",
        date: new Date("2023-05-25"),
        appliedBy: "Carlos Mendes",
      },
    ],
    details: {
      baseSalary: 2500,
      activityTotal: 145,
      bonus: 200,
      allowances: 200,
      deductions: 150,
      taxes: 200,
    },
    notes: "Pagamento processado com sucesso",
    companyId: "1",
  },
  {
    id: "p2",
    employeeId: "1",
    month: "Abril 2023",
    date: new Date("2023-04-28"),
    dueDate: new Date("2023-04-30"),
    amount: 2650,
    status: "paid",
    activities: [],
    adjustments: [],
    details: {
      baseSalary: 2500,
      activityTotal: 0,
      bonus: 300,
      allowances: 200,
      deductions: 150,
      taxes: 200,
    },
  },
  {
    id: "p3",
    employeeId: "1",
    month: "Março 2023",
    date: new Date("2023-03-28"),
    dueDate: new Date("2023-03-30"),
    amount: 2700,
    status: "paid",
    activities: [],
    adjustments: [
      {
        id: "adj2",
        paymentId: "p3",
        type: "deduction",
        amount: -50,
        description: "Correção de horas extras",
        date: new Date("2023-03-26"),
        appliedBy: "Ana Silva",
      },
    ],
    details: {
      baseSalary: 2500,
      activityTotal: 0,
      bonus: 350,
      allowances: 200,
      deductions: 150,
      taxes: 200,
    },
  },
  {
    id: "p4",
    employeeId: "1",
    month: "Junho 2023",
    date: new Date("2023-06-28"),
    dueDate: new Date("2023-06-30"),
    amount: 2900,
    status: "draft",
    activities: ["3"],
    adjustments: [],
    details: {
      baseSalary: 2500,
      activityTotal: 48,
      bonus: 300,
      allowances: 200,
      deductions: 150,
      taxes: 200,
    },
  },
];

// Generate account entries from payments
const generateAccountEntries = (
  payments: Payment[],
  employeeId: string,
): AccountEntry[] => {
  let balance = 0;
  const entries: AccountEntry[] = [];

  // Sort payments by date
  const sortedPayments = [...payments]
    .filter((p) => p.employeeId === employeeId && p.status === "paid")
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  sortedPayments.forEach((payment) => {
    // Base salary entry
    balance += payment.details.baseSalary;
    entries.push({
      id: `entry-salary-${payment.id}`,
      date: payment.date,
      description: `Salário base - ${payment.month}`,
      type: "salary",
      amount: payment.details.baseSalary,
      balance,
      relatedId: payment.id,
    });

    // Activity payments
    if (payment.details.activityTotal > 0) {
      balance += payment.details.activityTotal;
      entries.push({
        id: `entry-activity-${payment.id}`,
        date: payment.date,
        description: `Pagamento de atividades - ${payment.month}`,
        type: "activity",
        amount: payment.details.activityTotal,
        balance,
        relatedId: payment.id,
      });
    }

    // Bonus
    if (payment.details.bonus > 0) {
      balance += payment.details.bonus;
      entries.push({
        id: `entry-bonus-${payment.id}`,
        date: payment.date,
        description: `Bónus - ${payment.month}`,
        type: "bonus",
        amount: payment.details.bonus,
        balance,
        relatedId: payment.id,
      });
    }

    // Allowances (included in bonus for simplicity)
    if (payment.details.allowances > 0) {
      balance += payment.details.allowances;
      entries.push({
        id: `entry-allowance-${payment.id}`,
        date: payment.date,
        description: `Subsídios - ${payment.month}`,
        type: "bonus",
        amount: payment.details.allowances,
        balance,
        relatedId: payment.id,
      });
    }

    // Deductions
    if (payment.details.deductions > 0) {
      balance -= payment.details.deductions;
      entries.push({
        id: `entry-deduction-${payment.id}`,
        date: payment.date,
        description: `Deduções - ${payment.month}`,
        type: "deduction",
        amount: -payment.details.deductions,
        balance,
        relatedId: payment.id,
      });
    }

    // Taxes
    if (payment.details.taxes > 0) {
      balance -= payment.details.taxes;
      entries.push({
        id: `entry-tax-${payment.id}`,
        date: payment.date,
        description: `Impostos - ${payment.month}`,
        type: "tax",
        amount: -payment.details.taxes,
        balance,
        relatedId: payment.id,
      });
    }

    // Adjustments
    payment.adjustments.forEach((adjustment) => {
      const adjustmentAmount =
        adjustment.type === "deduction"
          ? -Math.abs(adjustment.amount)
          : Math.abs(adjustment.amount);
      balance += adjustmentAmount;
      entries.push({
        id: `entry-adjustment-${adjustment.id}`,
        date: adjustment.date,
        description: `${adjustment.type === "bonus" ? "Bónus" : "Dedução"}: ${adjustment.description}`,
        type: adjustment.type === "bonus" ? "bonus" : "deduction",
        amount: adjustmentAmount,
        balance,
        relatedId: adjustment.id,
      });
    });
  });

  return entries.sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort by date descending
};

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

const getEntryTypeIcon = (type: AccountEntry["type"]) => {
  switch (type) {
    case "salary":
      return <DollarSign className="h-4 w-4 text-green-600" />;
    case "activity":
      return <Clock className="h-4 w-4 text-blue-600" />;
    case "bonus":
      return <ArrowUp className="h-4 w-4 text-green-600" />;
    case "deduction":
      return <ArrowDown className="h-4 w-4 text-red-600" />;
    case "tax":
      return <ArrowDown className="h-4 w-4 text-red-600" />;
    case "payment":
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    default:
      return <FileText className="h-4 w-4 text-gray-600" />;
  }
};

const PaymentHistory: React.FC<PaymentHistoryProps> = ({
  employeeId,
  employeeName,
  activities,
}) => {
  const { currentCompany } = useCompany();
  const [payments, setPayments] = useState<Payment[]>(
    mockPayments.filter((p) => p.employeeId === employeeId),
  );

  // Filtrar pagamentos por empresa quando a empresa mudar
  useEffect(() => {
    // Em um cenário real, você buscaria os pagamentos do backend filtrados por empresa
    // Aqui estamos apenas simulando com dados estáticos
    const filteredPayments = mockPayments.filter(
      (p) =>
        p.employeeId === employeeId &&
        (!p.companyId || p.companyId === currentCompany.id),
    );
    setPayments(filteredPayments);
  }, [employeeId, currentCompany.id]);
  const [accountEntries, setAccountEntries] = useState<AccountEntry[]>(
    generateAccountEntries(mockPayments, employeeId),
  );
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isAdjustmentDialogOpen, setIsAdjustmentDialogOpen] = useState(false);
  const [newAdjustment, setNewAdjustment] = useState<
    Omit<PaymentAdjustment, "id" | "paymentId" | "date" | "appliedBy">
  >({
    type: "bonus",
    amount: 0,
    description: "",
  });
  const [activeTab, setActiveTab] = useState<
    "payments" | "account" | "monthly"
  >("payments");
  const [isNewPaymentDialogOpen, setIsNewPaymentDialogOpen] = useState(false);
  const [viewingPaymentDetails, setViewingPaymentDetails] = useState(false);
  const [paymentRequests, setPaymentRequests] = useState<any[]>([]);

  // Filter activities that are approved but not yet paid
  const availableActivities = activities.filter(
    (a) =>
      a.status === "approved" &&
      !payments.some((p) => p.activities.includes(a.id) && p.status === "paid"),
  );

  const handleAddAdjustment = () => {
    if (!selectedPayment) return;

    const newAdjustmentObj: PaymentAdjustment = {
      id: `adj${Date.now()}`,
      paymentId: selectedPayment.id,
      type: newAdjustment.type,
      amount:
        newAdjustment.type === "deduction"
          ? -Math.abs(newAdjustment.amount)
          : Math.abs(newAdjustment.amount),
      description: newAdjustment.description,
      date: new Date(),
      appliedBy: "Utilizador Atual", // In a real app, this would be the current user
    };

    // Update the payment with the new adjustment
    const updatedPayment = {
      ...selectedPayment,
      adjustments: [...selectedPayment.adjustments, newAdjustmentObj],
      amount:
        selectedPayment.amount +
        (newAdjustment.type === "deduction"
          ? -Math.abs(newAdjustment.amount)
          : Math.abs(newAdjustment.amount)),
      details: {
        ...selectedPayment.details,
        bonus:
          newAdjustment.type === "bonus"
            ? selectedPayment.details.bonus + Math.abs(newAdjustment.amount)
            : selectedPayment.details.bonus,
        deductions:
          newAdjustment.type === "deduction"
            ? selectedPayment.details.deductions +
              Math.abs(newAdjustment.amount)
            : selectedPayment.details.deductions,
      },
    };

    // Update payments state
    const updatedPayments = payments.map((p) =>
      p.id === selectedPayment.id ? updatedPayment : p,
    );
    setPayments(updatedPayments);
    setSelectedPayment(updatedPayment);

    // Update account entries
    setAccountEntries(generateAccountEntries(updatedPayments, employeeId));

    // Reset and close dialog
    setNewAdjustment({ type: "bonus", amount: 0, description: "" });
    setIsAdjustmentDialogOpen(false);
  };

  const handleCreatePayment = (paymentData: PaymentFormData) => {
    const activityTotal = activities
      .filter((activity) => paymentData.activityIds.includes(activity.id))
      .reduce((sum, activity) => sum + activity.hours * activity.rate, 0);

    const totalAmount =
      paymentData.baseSalary +
      activityTotal +
      paymentData.bonus +
      paymentData.allowances -
      paymentData.deductions -
      paymentData.taxes;

    const newPayment: Payment = {
      id: `p${Date.now()}`,
      employeeId: paymentData.employeeId,
      month: paymentData.month,
      date: paymentData.date,
      dueDate: paymentData.dueDate,
      amount: totalAmount,
      status: "draft",
      activities: paymentData.activityIds,
      adjustments: [],
      details: {
        baseSalary: paymentData.baseSalary,
        activityTotal,
        bonus: paymentData.bonus,
        allowances: paymentData.allowances,
        deductions: paymentData.deductions,
        taxes: paymentData.taxes,
      },
      notes: paymentData.notes,
      companyId: currentCompany.id, // Associar o pagamento à empresa atual
    };

    setPayments([...payments, newPayment]);
    setIsNewPaymentDialogOpen(false);
  };

  const handleUpdatePaymentStatus = (
    paymentId: string,
    newStatus: Payment["status"] | "deleted",
  ) => {
    // Handle deletion case separately
    if (newStatus === "deleted") {
      const updatedPayments = payments.filter(
        (payment) => payment.id !== paymentId,
      );
      setPayments(updatedPayments);
      setAccountEntries(generateAccountEntries(updatedPayments, employeeId));
      setViewingPaymentDetails(false);
      setSelectedPayment(null);
      return;
    }

    const updatedPayments = payments.map((payment) => {
      if (payment.id === paymentId) {
        return { ...payment, status: newStatus as Payment["status"] };
      }
      return payment;
    });

    setPayments(updatedPayments);

    // If the payment is now paid, update the account entries
    if (newStatus === "paid") {
      setAccountEntries(generateAccountEntries(updatedPayments, employeeId));
    }

    // Update selected payment if it's the one being changed
    if (selectedPayment && selectedPayment.id === paymentId) {
      setSelectedPayment({
        ...selectedPayment,
        status: newStatus as Payment["status"],
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Histórico de Pagamentos</h2>
          <p className="text-sm text-gray-500">
            Gestão de pagamentos e ajustes para {employeeName}
          </p>
        </div>
        <Button onClick={() => setIsNewPaymentDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Pagamento
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as "payments" | "account" | "monthly")
        }
      >
        <TabsList className="mb-4">
          <TabsTrigger value="payments">Pagamentos</TabsTrigger>
          <TabsTrigger value="account">Extrato de Conta</TabsTrigger>
          <TabsTrigger value="monthly">Extrato Mensal</TabsTrigger>
        </TabsList>

        <TabsContent value="payments">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mês</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Atividades</TableHead>
                    <TableHead>Ajustes</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        {payment.month}
                      </TableCell>
                      <TableCell>
                        {format(payment.date, "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell className="font-bold">
                        {payment.amount.toLocaleString("pt-PT")} €
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>{payment.activities.length}</TableCell>
                      <TableCell>{payment.adjustments.length}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedPayment(payment);
                              setIsAdjustmentDialogOpen(true);
                            }}
                          >
                            <Edit className="h-3.5 w-3.5 mr-1" />
                            Ajustar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedPayment(payment);
                              setViewingPaymentDetails(true);
                            }}
                          >
                            <FileText className="h-3.5 w-3.5 mr-1" />
                            Detalhes
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => {
                              if (
                                confirm(
                                  `Tem certeza que deseja apagar o pagamento de ${payment.month}?`,
                                )
                              ) {
                                setPayments(
                                  payments.filter((p) => p.id !== payment.id),
                                );
                                if (selectedPayment?.id === payment.id) {
                                  setSelectedPayment(null);
                                  setViewingPaymentDetails(false);
                                }
                              }
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            Apagar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Payment Details */}
          {selectedPayment && viewingPaymentDetails && (
            <PaymentDetails
              payment={selectedPayment}
              activities={activities}
              onStatusChange={handleUpdatePaymentStatus}
              onAdjustmentClick={() => setIsAdjustmentDialogOpen(true)}
            />
          )}
        </TabsContent>

        <TabsContent value="monthly">
          <MonthlyStatement
            employeeId={employeeId}
            employeeName={employeeName}
            accountEntries={accountEntries}
          />
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Extrato de Conta</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="text-right">Saldo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accountEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{format(entry.date, "dd/MM/yyyy")}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getEntryTypeIcon(entry.type)}
                          <span>{entry.description}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {entry.type === "salary"
                            ? "Salário"
                            : entry.type === "activity"
                              ? "Atividade"
                              : entry.type === "bonus"
                                ? "Bónus"
                                : entry.type === "deduction"
                                  ? "Dedução"
                                  : entry.type === "tax"
                                    ? "Imposto"
                                    : "Pagamento"}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${entry.amount < 0 ? "text-red-600" : "text-green-600"}`}
                      >
                        {entry.amount < 0 ? "-" : "+"}
                        {Math.abs(entry.amount).toLocaleString("pt-PT")} €
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {entry.balance.toLocaleString("pt-PT")} €
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Adjustment Dialog */}
      <Dialog
        open={isAdjustmentDialogOpen}
        onOpenChange={setIsAdjustmentDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Ajuste ao Pagamento</DialogTitle>
            <DialogDescription>
              Adicione um bónus ou dedução ao pagamento de{" "}
              {selectedPayment?.month}.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="adjustment-type">Tipo de Ajuste</Label>
              <Select
                value={newAdjustment.type}
                onValueChange={(value) =>
                  setNewAdjustment({
                    ...newAdjustment,
                    type: value as "bonus" | "deduction",
                  })
                }
              >
                <SelectTrigger id="adjustment-type">
                  <SelectValue placeholder="Selecione o tipo de ajuste" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bonus">Bónus</SelectItem>
                  <SelectItem value="deduction">Dedução</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="adjustment-amount">Valor (€)</Label>
              <Input
                id="adjustment-amount"
                type="number"
                min="0"
                step="0.01"
                value={newAdjustment.amount || ""}
                onChange={(e) =>
                  setNewAdjustment({
                    ...newAdjustment,
                    amount: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="adjustment-description">Descrição</Label>
              <Textarea
                id="adjustment-description"
                value={newAdjustment.description}
                onChange={(e) =>
                  setNewAdjustment({
                    ...newAdjustment,
                    description: e.target.value,
                  })
                }
                placeholder="Descreva o motivo do ajuste"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAdjustmentDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddAdjustment}
              disabled={newAdjustment.amount <= 0 || !newAdjustment.description}
            >
              Adicionar Ajuste
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Payment Dialog */}
      <Dialog
        open={isNewPaymentDialogOpen}
        onOpenChange={setIsNewPaymentDialogOpen}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Criar Novo Pagamento</DialogTitle>
            <DialogDescription>
              Preencha os detalhes para criar um novo pagamento para{" "}
              {employeeName}.
            </DialogDescription>
          </DialogHeader>

          <NewPaymentForm
            employeeId={employeeId}
            employeeName={employeeName}
            baseSalary={2500} // This would come from employee data in a real app
            availableActivities={availableActivities}
            onSubmit={handleCreatePayment}
            onCancel={() => setIsNewPaymentDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentHistory;
