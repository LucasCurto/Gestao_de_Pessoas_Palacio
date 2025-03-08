import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EnhancedDateRangePicker } from "@/components/calendar/EnhancedDateRangePicker";
import { DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, addMonths } from "date-fns";
import { pt } from "date-fns/locale";
import { Download, FileText, BarChart, PieChart, Filter } from "lucide-react";

const PaymentReport = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addMonths(new Date(), -1),
    to: new Date(),
  });
  const [employeeFilter, setEmployeeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Mock data for payments
  const payments = [
    {
      id: "1",
      employeeId: "emp1",
      employeeName: "João Silva",
      month: "Maio 2023",
      date: new Date(2023, 4, 25),
      baseSalary: 2500,
      activities: 3,
      activitiesValue: 250,
      bonus: 100,
      deductions: 150,
      taxes: 500,
      total: 2200,
      status: "paid",
    },
    {
      id: "2",
      employeeId: "emp2",
      employeeName: "Maria Santos",
      month: "Maio 2023",
      date: new Date(2023, 4, 25),
      baseSalary: 2800,
      activities: 2,
      activitiesValue: 180,
      bonus: 0,
      deductions: 120,
      taxes: 550,
      total: 2310,
      status: "paid",
    },
    {
      id: "3",
      employeeId: "emp3",
      employeeName: "Ana Oliveira",
      month: "Maio 2023",
      date: new Date(2023, 4, 25),
      baseSalary: 2200,
      activities: 1,
      activitiesValue: 80,
      bonus: 50,
      deductions: 100,
      taxes: 450,
      total: 1780,
      status: "paid",
    },
    {
      id: "4",
      employeeId: "emp1",
      employeeName: "João Silva",
      month: "Junho 2023",
      date: new Date(2023, 5, 25),
      baseSalary: 2500,
      activities: 5,
      activitiesValue: 350,
      bonus: 200,
      deductions: 150,
      taxes: 550,
      total: 2350,
      status: "pending",
    },
    {
      id: "5",
      employeeId: "emp2",
      employeeName: "Maria Santos",
      month: "Junho 2023",
      date: new Date(2023, 5, 25),
      baseSalary: 2800,
      activities: 3,
      activitiesValue: 240,
      bonus: 100,
      deductions: 120,
      taxes: 580,
      total: 2440,
      status: "paid",
    },
  ];

  // Filter payments based on selected filters
  const filteredPayments = payments.filter((payment) => {
    // Date range filter
    if (
      dateRange?.from &&
      dateRange?.to &&
      (payment.date < dateRange.from || payment.date > dateRange.to)
    ) {
      return false;
    }

    // Employee filter
    if (employeeFilter !== "all" && payment.employeeId !== employeeFilter) {
      return false;
    }

    // Status filter
    if (statusFilter !== "all" && payment.status !== statusFilter) {
      return false;
    }

    return true;
  });

  // Calculate summary statistics
  const totalPayments = filteredPayments.length;
  const totalAmount = filteredPayments.reduce(
    (sum, payment) => sum + payment.total,
    0,
  );
  const totalBaseSalary = filteredPayments.reduce(
    (sum, payment) => sum + payment.baseSalary,
    0,
  );
  const totalActivitiesValue = filteredPayments.reduce(
    (sum, payment) => sum + payment.activitiesValue,
    0,
  );
  const totalBonus = filteredPayments.reduce(
    (sum, payment) => sum + payment.bonus,
    0,
  );
  const totalDeductions = filteredPayments.reduce(
    (sum, payment) => sum + payment.deductions,
    0,
  );
  const totalTaxes = filteredPayments.reduce(
    (sum, payment) => sum + payment.taxes,
    0,
  );

  // Get unique employees for filter
  const employees = Array.from(
    new Set(
      payments.map((payment) => ({
        id: payment.employeeId,
        name: payment.employeeName,
      })),
    ),
  );

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
      case "processing":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Em Processamento
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Relatório de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label>Período</Label>
              <EnhancedDateRangePicker
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                showCompactPresets
              />
            </div>
            <div className="space-y-2">
              <Label>Funcionário</Label>
              <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os funcionários" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os funcionários</SelectItem>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="processing">Em Processamento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-700">
                Total de Pagamentos
              </h3>
              <p className="text-2xl font-bold text-blue-800 mt-1">
                {totalPayments}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-700">
                Valor Total
              </h3>
              <p className="text-2xl font-bold text-green-800 mt-1">
                {totalAmount.toFixed(2)}€
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-purple-700">
                Salários Base
              </h3>
              <p className="text-2xl font-bold text-purple-800 mt-1">
                {totalBaseSalary.toFixed(2)}€
              </p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-amber-700">Atividades</h3>
              <p className="text-2xl font-bold text-amber-800 mt-1">
                {totalActivitiesValue.toFixed(2)}€
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Detalhes dos Pagamentos</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <BarChart className="h-4 w-4 mr-2" />
                Gráfico
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Importar dinamicamente para evitar problemas de SSR
                  import("../reports/ExportUtils").then(
                    ({ exportToExcel, formatPaymentsForExport }) => {
                      const formattedData =
                        formatPaymentsForExport(filteredPayments);
                      exportToExcel(formattedData, "Relatório_Pagamentos");
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
                    ({ exportToPDF, formatPaymentsForExport }) => {
                      const formattedData =
                        formatPaymentsForExport(filteredPayments);
                      const columns = [
                        "Data",
                        "Mês",
                        "Funcionário",
                        "Salário Base",
                        "Total",
                        "Status",
                        "Método de Pagamento",
                      ];
                      exportToPDF(
                        formattedData,
                        columns,
                        "Relatório_Pagamentos",
                        "Relatório de Pagamentos",
                      );
                    },
                  );
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Funcionário</TableHead>
                  <TableHead>Mês</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Salário Base</TableHead>
                  <TableHead>Atividades</TableHead>
                  <TableHead>Bónus</TableHead>
                  <TableHead>Deduções</TableHead>
                  <TableHead>Impostos</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.employeeName}</TableCell>
                      <TableCell>{payment.month}</TableCell>
                      <TableCell>
                        {format(payment.date, "dd/MM/yyyy", { locale: pt })}
                      </TableCell>
                      <TableCell>{payment.baseSalary.toFixed(2)}€</TableCell>
                      <TableCell>
                        {payment.activitiesValue.toFixed(2)}€
                      </TableCell>
                      <TableCell>{payment.bonus.toFixed(2)}€</TableCell>
                      <TableCell className="text-red-600">
                        -{payment.deductions.toFixed(2)}€
                      </TableCell>
                      <TableCell className="text-red-600">
                        -{payment.taxes.toFixed(2)}€
                      </TableCell>
                      <TableCell className="font-medium">
                        {payment.total.toFixed(2)}€
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="text-center py-4 text-gray-500"
                    >
                      Nenhum pagamento encontrado para os filtros selecionados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Resumo de Pagamentos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-md border p-4">
                <h4 className="text-sm font-medium mb-3">
                  Distribuição por Componente
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Salário Base</span>
                      <span>{totalBaseSalary.toFixed(2)}€</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{
                          width: `${(totalBaseSalary / (totalBaseSalary + totalActivitiesValue + totalBonus)) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Atividades</span>
                      <span>{totalActivitiesValue.toFixed(2)}€</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-amber-600 h-2.5 rounded-full"
                        style={{
                          width: `${(totalActivitiesValue / (totalBaseSalary + totalActivitiesValue + totalBonus)) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Bónus</span>
                      <span>{totalBonus.toFixed(2)}€</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-green-600 h-2.5 rounded-full"
                        style={{
                          width: `${(totalBonus / (totalBaseSalary + totalActivitiesValue + totalBonus)) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-md border p-4">
                <h4 className="text-sm font-medium mb-3">
                  Distribuição por Funcionário
                </h4>
                <div className="space-y-3">
                  {employees.map((employee) => {
                    const employeePayments = filteredPayments.filter(
                      (p) => p.employeeId === employee.id,
                    );
                    const employeeTotal = employeePayments.reduce(
                      (sum, p) => sum + p.total,
                      0,
                    );
                    return (
                      <div key={employee.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{employee.name}</span>
                          <span>{employeeTotal.toFixed(2)}€</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-purple-600 h-2.5 rounded-full"
                            style={{
                              width: `${(employeeTotal / totalAmount) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentReport;
