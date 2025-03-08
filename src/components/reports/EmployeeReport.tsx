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
import {
  Download,
  FileText,
  BarChart,
  PieChart,
  Filter,
  Users,
} from "lucide-react";

const EmployeeReport = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addMonths(new Date(), -3),
    to: new Date(),
  });
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Mock data for employees
  const employees = [
    {
      id: "emp1",
      name: "João Silva",
      department: "TI",
      position: "Desenvolvedor Senior",
      hireDate: new Date(2020, 3, 15),
      baseSalary: 2500,
      status: "active",
      totalActivities: 12,
      totalHours: 45,
      totalEarnings: 3200,
    },
    {
      id: "emp2",
      name: "Maria Santos",
      department: "Vendas",
      position: "Gerente de Contas",
      hireDate: new Date(2019, 6, 10),
      baseSalary: 2800,
      status: "active",
      totalActivities: 8,
      totalHours: 32,
      totalEarnings: 3500,
    },
    {
      id: "emp3",
      name: "Ana Oliveira",
      department: "RH",
      position: "Especialista de RH",
      hireDate: new Date(2021, 1, 5),
      baseSalary: 2200,
      status: "active",
      totalActivities: 5,
      totalHours: 18,
      totalEarnings: 2450,
    },
    {
      id: "emp4",
      name: "Pedro Costa",
      department: "TI",
      position: "Analista de Sistemas",
      hireDate: new Date(2022, 2, 20),
      baseSalary: 2100,
      status: "active",
      totalActivities: 7,
      totalHours: 28,
      totalEarnings: 2350,
    },
    {
      id: "emp5",
      name: "Sofia Martins",
      department: "Marketing",
      position: "Especialista de Marketing",
      hireDate: new Date(2020, 8, 12),
      baseSalary: 2300,
      status: "inactive",
      totalActivities: 0,
      totalHours: 0,
      totalEarnings: 2300,
    },
  ];

  // Filter employees based on selected filters
  const filteredEmployees = employees.filter((employee) => {
    // Department filter
    if (
      departmentFilter !== "all" &&
      employee.department !== departmentFilter
    ) {
      return false;
    }

    // Status filter
    if (statusFilter !== "all" && employee.status !== statusFilter) {
      return false;
    }

    return true;
  });

  // Calculate summary statistics
  const totalEmployees = filteredEmployees.length;
  const activeEmployees = filteredEmployees.filter(
    (emp) => emp.status === "active",
  ).length;
  const totalSalaries = filteredEmployees.reduce(
    (sum, emp) => sum + emp.baseSalary,
    0,
  );
  const totalEarnings = filteredEmployees.reduce(
    (sum, emp) => sum + emp.totalEarnings,
    0,
  );

  // Group by department for chart data
  const departmentData = filteredEmployees.reduce(
    (acc, employee) => {
      if (!acc[employee.department]) {
        acc[employee.department] = {
          count: 0,
          totalSalary: 0,
          totalEarnings: 0,
        };
      }
      acc[employee.department].count += 1;
      acc[employee.department].totalSalary += employee.baseSalary;
      acc[employee.department].totalEarnings += employee.totalEarnings;
      return acc;
    },
    {} as Record<
      string,
      { count: number; totalSalary: number; totalEarnings: number }
    >,
  );

  // Get unique departments for filters
  const departments = Array.from(
    new Set(employees.map((employee) => employee.department)),
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Ativo
          </Badge>
        );
      case "inactive":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200"
          >
            Inativo
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
          <CardTitle>Relatório de Funcionários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label>Período de Análise</Label>
              <EnhancedDateRangePicker
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                showCompactPresets
              />
            </div>
            <div className="space-y-2">
              <Label>Departamento</Label>
              <Select
                value={departmentFilter}
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os departamentos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os departamentos</SelectItem>
                  {departments.map((department) => (
                    <SelectItem key={department} value={department}>
                      {department}
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
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-700">
                Total de Funcionários
              </h3>
              <p className="text-2xl font-bold text-blue-800 mt-1">
                {totalEmployees}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-700">
                Funcionários Ativos
              </h3>
              <p className="text-2xl font-bold text-green-800 mt-1">
                {activeEmployees}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-purple-700">
                Total Salários Base
              </h3>
              <p className="text-2xl font-bold text-purple-800 mt-1">
                {totalSalaries.toFixed(2)}€
              </p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-amber-700">
                Total Ganhos
              </h3>
              <p className="text-2xl font-bold text-amber-800 mt-1">
                {totalEarnings.toFixed(2)}€
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Lista de Funcionários</h3>
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
                    ({ exportToExcel, formatEmployeesForExport }) => {
                      const formattedData =
                        formatEmployeesForExport(filteredEmployees);
                      exportToExcel(formattedData, "Relatório_Funcionários");
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
                    ({ exportToPDF, formatEmployeesForExport }) => {
                      const formattedData =
                        formatEmployeesForExport(filteredEmployees);
                      const columns = [
                        "Nome",
                        "Departamento",
                        "Cargo",
                        "Data Contratação",
                        "Salário Base",
                        "Status",
                      ];
                      exportToPDF(
                        formattedData,
                        columns,
                        "Relatório_Funcionários",
                        "Relatório de Funcionários",
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
                  <TableHead>Nome</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Data Contratação</TableHead>
                  <TableHead>Salário Base</TableHead>
                  <TableHead>Atividades</TableHead>
                  <TableHead>Ganhos Totais</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">
                        {employee.name}
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>
                        {format(employee.hireDate, "dd/MM/yyyy", {
                          locale: pt,
                        })}
                      </TableCell>
                      <TableCell>{employee.baseSalary.toFixed(2)}€</TableCell>
                      <TableCell>
                        {employee.totalActivities} ({employee.totalHours}h)
                      </TableCell>
                      <TableCell>
                        {employee.totalEarnings.toFixed(2)}€
                      </TableCell>
                      <TableCell>{getStatusBadge(employee.status)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-4 text-gray-500"
                    >
                      Nenhum funcionário encontrado para os filtros selecionados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">
              Resumo por Departamento
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-md border p-4">
                <h4 className="text-sm font-medium mb-3">
                  Distribuição de Funcionários
                </h4>
                <div className="space-y-3">
                  {Object.entries(departmentData).map(([department, data]) => (
                    <div key={department}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{department}</span>
                        <span>{data.count} funcionários</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{
                            width: `${(data.count / totalEmployees) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-md border p-4">
                <h4 className="text-sm font-medium mb-3">
                  Distribuição de Salários
                </h4>
                <div className="space-y-3">
                  {Object.entries(departmentData).map(([department, data]) => (
                    <div key={department}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{department}</span>
                        <span>{data.totalSalary.toFixed(2)}€</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-600 h-2.5 rounded-full"
                          style={{
                            width: `${(data.totalSalary / totalSalaries) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeReport;
