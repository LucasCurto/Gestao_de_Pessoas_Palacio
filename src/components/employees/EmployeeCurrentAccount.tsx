import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MonthYearPicker } from "@/components/calendar/MonthYearPicker";
import { ArrowDown, ArrowUp, FileText, Download, Filter } from "lucide-react";

interface Transaction {
  id: string;
  date: Date;
  description: string;
  type: "task" | "payment";
  amount: number;
  reference: string;
  status: string;
}

interface EmployeeCurrentAccountProps {
  employeeId: string;
  employeeName: string;
}

const EmployeeCurrentAccount: React.FC<EmployeeCurrentAccountProps> = ({
  employeeId,
  employeeName,
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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Carregar transações do localStorage
  useEffect(() => {
    const loadTransactions = () => {
      try {
        // Carregar todas as tarefas do funcionário
        const employeeTasksJson = localStorage.getItem("employeeTasks");
        let taskTransactions: Transaction[] = [];

        if (employeeTasksJson) {
          const allTasks = JSON.parse(employeeTasksJson);
          // Filtrar tarefas do funcionário atual
          taskTransactions = allTasks
            .filter(
              (task: any) =>
                (task.employeeId === employeeId || !task.employeeId) &&
                (task.status === "approved" || task.status === "paid"),
            )
            .map((task: any) => ({
              id: `task-${task.id}`,
              date: new Date(task.date),
              description: `${task.type}: ${task.description}`,
              type: "task" as const,
              amount: task.hours * task.rate,
              reference: task.id,
              status: task.status,
            }));
        }

        // Carregar pagamentos do localStorage
        let paymentTransactions: Transaction[] = [];
        const employeePaymentsJson = localStorage.getItem("employeePayments");

        if (employeePaymentsJson) {
          const allPayments = JSON.parse(employeePaymentsJson);
          // Filtrar pagamentos do funcionário atual
          paymentTransactions = allPayments
            .filter((payment: any) => payment.employeeId === employeeId)
            .map((payment: any) => ({
              id: `payment-${payment.id}`,
              date: new Date(payment.date),
              description: `Pagamento de ${payment.month}`,
              type: "payment" as const,
              amount: -payment.total, // Valor negativo pois é uma saída
              reference: payment.id,
              status: payment.status,
            }));
        }

        // Se não houver pagamentos no localStorage, usar os mock payments
        if (paymentTransactions.length === 0) {
          paymentTransactions = [
            {
              id: "payment-1",
              date: new Date(2023, 4, 25),
              description: "Pagamento de Maio 2023",
              type: "payment",
              amount: -2545,
              reference: "payment-1",
              status: "paid",
            },
            {
              id: "payment-2",
              date: new Date(2023, 5, 25),
              description: "Pagamento de Junho 2023",
              type: "payment",
              amount: -2625,
              reference: "payment-2",
              status: "paid",
            },
            {
              id: "payment-3",
              date: new Date(2023, 6, 25),
              description: "Pagamento de Julho 2023",
              type: "payment",
              amount: -1920,
              reference: "payment-3",
              status: "pending",
            },
          ];
        }

        // Combinar transações e ordenar por data
        const allTransactions = [
          ...taskTransactions,
          ...paymentTransactions,
        ].sort((a, b) => a.date.getTime() - b.date.getTime());

        setTransactions(allTransactions);
        console.log("Transações carregadas:", allTransactions);
      } catch (error) {
        console.error("Erro ao carregar transações:", error);
      }
    };

    loadTransactions();

    // Atualizar quando houver mudanças nas tarefas ou pagamentos
    window.addEventListener("approvedTasksUpdated", loadTransactions);
    window.addEventListener("selectedMonthChanged", loadTransactions);

    return () => {
      window.removeEventListener("approvedTasksUpdated", loadTransactions);
      window.removeEventListener("selectedMonthChanged", loadTransactions);
    };
  }, [employeeId]);

  // Filtrar transações por mês e filtros selecionados
  useEffect(() => {
    const filterTransactions = () => {
      let filtered = transactions.filter((transaction) => {
        // Verificar se a data da transação é válida
        if (
          !transaction.date ||
          !(transaction.date instanceof Date) ||
          isNaN(transaction.date.getTime())
        ) {
          console.warn("Transação com data inválida:", transaction);
          return false;
        }

        // Extrair mês e ano da transação e do mês selecionado
        const transactionMonth = transaction.date.getMonth();
        const transactionYear = transaction.date.getFullYear();
        const selectedMonthValue = selectedMonth.getMonth();
        const selectedYearValue = selectedMonth.getFullYear();

        const matchesMonth =
          transactionMonth === selectedMonthValue &&
          transactionYear === selectedYearValue;

        const matchesStatus =
          statusFilter === "all" || transaction.status === statusFilter;

        const matchesType =
          typeFilter === "all" || transaction.type === typeFilter;

        return matchesMonth && matchesStatus && matchesType;
      });

      setFilteredTransactions(filtered);
    };

    filterTransactions();
  }, [transactions, selectedMonth, statusFilter, typeFilter]);

  // Calcular saldo atual
  const calculateBalance = () => {
    return filteredTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0,
    );
  };

  // Calcular totais por tipo
  const calculateTotalByType = (type: "task" | "payment") => {
    return filteredTransactions
      .filter((t) => t.type === type)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  };

  const balance = calculateBalance();
  const totalTasks = calculateTotalByType("task");
  const totalPayments = calculateTotalByType("payment");

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Conta Corrente do Funcionário</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Importar dinamicamente para evitar problemas de SSR
              import("../reports/ExportUtils").then(
                ({ exportToExcel, formatTransactionsForExport }) => {
                  const formattedData =
                    formatTransactionsForExport(filteredTransactions);
                  exportToExcel(
                    formattedData,
                    `Conta_Corrente_${employeeName.replace(" ", "_")}`,
                  );
                },
              );
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Importar dinamicamente para evitar problemas de SSR
              import("../reports/ExportUtils").then(
                ({ exportToPDF, formatTransactionsForExport }) => {
                  const formattedData =
                    formatTransactionsForExport(filteredTransactions);
                  const columns = [
                    "Data",
                    "Descrição",
                    "Tipo",
                    "Valor",
                    "Status",
                    "Referência",
                  ];
                  exportToPDF(
                    formattedData,
                    columns,
                    `Conta_Corrente_${employeeName.replace(" ", "_")}`,
                    `Conta Corrente - ${employeeName}`,
                  );
                },
              );
            }}
          >
            <FileText className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card
            className={`p-4 ${balance === 0 ? "bg-green-50" : balance > 0 ? "bg-yellow-50" : "bg-blue-50"}`}
          >
            <div className="text-sm font-medium text-gray-500">Saldo Atual</div>
            <div
              className={`text-2xl font-bold ${balance === 0 ? "text-green-600" : balance > 0 ? "text-yellow-600" : "text-blue-600"}`}
            >
              {balance.toFixed(2)}€
            </div>
            <div className="text-xs mt-1">
              {balance === 0
                ? "Todas as tarefas foram pagas"
                : balance > 0
                  ? "Existem tarefas pendentes de pagamento"
                  : "Pagamento em excesso"}
            </div>
          </Card>

          <Card className="p-4 bg-amber-50">
            <div className="text-sm font-medium text-gray-500">
              Total de Tarefas
            </div>
            <div className="text-2xl font-bold text-amber-600">
              {totalTasks.toFixed(2)}€
            </div>
            <div className="text-xs mt-1">
              Valor total das tarefas no período
            </div>
          </Card>

          <Card className="p-4 bg-purple-50">
            <div className="text-sm font-medium text-gray-500">
              Total de Pagamentos
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {totalPayments.toFixed(2)}€
            </div>
            <div className="text-xs mt-1">
              Valor total dos pagamentos no período
            </div>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Extrato de Movimentos</h3>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="approved">Aprovado</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="task">Tarefas</SelectItem>
                <SelectItem value="payment">Pagamentos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Saldo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction, index) => {
                  // Calcular saldo acumulado até esta transação
                  const runningBalance = filteredTransactions
                    .slice(0, index + 1)
                    .reduce((sum, t) => sum + t.amount, 0);

                  return (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {format(transaction.date, "dd/MM/yyyy", { locale: pt })}
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        {transaction.type === "task" ? (
                          <Badge
                            variant="outline"
                            className="bg-amber-50 text-amber-700 border-amber-200"
                          >
                            <ArrowUp className="h-3 w-3 mr-1" /> Tarefa
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-purple-50 text-purple-700 border-purple-200"
                          >
                            <ArrowDown className="h-3 w-3 mr-1" /> Pagamento
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`
                            ${transaction.status === "paid" ? "bg-green-50 text-green-700 border-green-200" : ""}
                            ${transaction.status === "pending" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
                            ${transaction.status === "approved" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
                          `}
                        >
                          {transaction.status === "paid"
                            ? "Pago"
                            : transaction.status === "pending"
                              ? "Pendente"
                              : transaction.status === "approved"
                                ? "Aprovado"
                                : transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {transaction.amount > 0 ? "+" : ""}
                        {transaction.amount.toFixed(2)}€
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium ${runningBalance > 0 ? "text-green-600" : runningBalance < 0 ? "text-red-600" : "text-gray-600"}`}
                      >
                        {runningBalance.toFixed(2)}€
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-4 text-gray-500"
                  >
                    Nenhuma transação encontrada para o período selecionado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {balance !== 0 && (
          <div
            className={`mt-4 p-4 rounded-md ${balance > 0 ? "bg-yellow-50 border border-yellow-200" : "bg-blue-50 border border-blue-200"}`}
          >
            <div className="flex items-center">
              <FileText
                className={`h-5 w-5 mr-2 ${balance > 0 ? "text-yellow-600" : "text-blue-600"}`}
              />
              <span className="font-medium">
                {balance > 0
                  ? `Existem ${balance.toFixed(2)}€ em tarefas que ainda não foram pagas.`
                  : `Existe um pagamento em excesso de ${Math.abs(balance).toFixed(2)}€.`}
              </span>
            </div>
            <p className="text-sm mt-2">
              {balance > 0
                ? "O objetivo é ter um saldo zero, o que significa que todas as tarefas foram devidamente pagas."
                : "O saldo negativo indica que foram realizados pagamentos superiores às tarefas registradas."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmployeeCurrentAccount;
