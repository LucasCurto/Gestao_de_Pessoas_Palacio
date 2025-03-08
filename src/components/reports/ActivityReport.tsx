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

const ActivityReport = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addMonths(new Date(), -1),
    to: new Date(),
  });
  const [employeeFilter, setEmployeeFilter] = useState<string>("all");
  const [activityTypeFilter, setActivityTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Mock data for activities
  const activities = [
    {
      id: "1",
      employeeId: "emp1",
      employeeName: "João Silva",
      type: "Horas Extras",
      description: "Trabalho adicional no projeto X",
      date: new Date(2023, 4, 15),
      hours: 3,
      rate: 15,
      status: "approved",
    },
    {
      id: "2",
      employeeId: "emp2",
      employeeName: "Maria Santos",
      type: "Trabalho Fim de Semana",
      description: "Suporte ao cliente no fim de semana",
      date: new Date(2023, 4, 20),
      hours: 6,
      rate: 20,
      status: "paid",
    },
    {
      id: "3",
      employeeId: "emp1",
      employeeName: "João Silva",
      type: "Formação",
      description: "Curso de Excel avançado",
      date: new Date(2023, 4, 25),
      hours: 8,
      rate: 12,
      status: "pending",
    },
    {
      id: "4",
      employeeId: "emp3",
      employeeName: "Ana Oliveira",
      type: "Deslocação",
      description: "Visita ao cliente em Faro",
      date: new Date(2023, 5, 2),
      hours: 4,
      rate: 10,
      status: "approved",
    },
    {
      id: "5",
      employeeId: "emp2",
      employeeName: "Maria Santos",
      type: "Horas Extras",
      description: "Preparação para lançamento do produto",
      date: new Date(2023, 5, 10),
      hours: 5,
      rate: 15,
      status: "paid",
    },
  ];

  // Filter activities based on selected filters
  const filteredActivities = activities.filter((activity) => {
    // Date range filter
    if (
      dateRange?.from &&
      dateRange?.to &&
      (activity.date < dateRange.from || activity.date > dateRange.to)
    ) {
      return false;
    }

    // Employee filter
    if (employeeFilter !== "all" && activity.employeeId !== employeeFilter) {
      return false;
    }

    // Activity type filter
    if (activityTypeFilter !== "all" && activity.type !== activityTypeFilter) {
      return false;
    }

    // Status filter
    if (statusFilter !== "all" && activity.status !== statusFilter) {
      return false;
    }

    return true;
  });

  // Calculate summary statistics
  const totalHours = filteredActivities.reduce(
    (sum, activity) => sum + activity.hours,
    0,
  );
  const totalValue = filteredActivities.reduce(
    (sum, activity) => sum + activity.hours * activity.rate,
    0,
  );
  const averageRate = totalHours > 0 ? totalValue / totalHours : 0;

  // Group by activity type for chart data
  const activityTypeData = filteredActivities.reduce(
    (acc, activity) => {
      if (!acc[activity.type]) {
        acc[activity.type] = {
          hours: 0,
          value: 0,
          count: 0,
        };
      }
      acc[activity.type].hours += activity.hours;
      acc[activity.type].value += activity.hours * activity.rate;
      acc[activity.type].count += 1;
      return acc;
    },
    {} as Record<string, { hours: number; value: number; count: number }>,
  );

  // Get unique activity types and employees for filters
  const activityTypes = Array.from(
    new Set(activities.map((activity) => activity.type)),
  );
  const employees = Array.from(
    new Set(
      activities.map((activity) => ({
        id: activity.employeeId,
        name: activity.employeeName,
      })),
    ),
  );

  const getStatusBadge = (status: string) => {
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
            className="bg-green-50 text-green-700 border-green-200"
          >
            Aprovado
          </Badge>
        );
      case "paid":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Pago
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            Rejeitado
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
          <CardTitle>Relatório de Atividades</CardTitle>
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
              <Label>Tipo de Atividade</Label>
              <Select
                value={activityTypeFilter}
                onValueChange={setActivityTypeFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {activityTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-700">
                Total de Horas
              </h3>
              <p className="text-2xl font-bold text-blue-800 mt-1">
                {totalHours.toFixed(1)}h
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-700">
                Valor Total
              </h3>
              <p className="text-2xl font-bold text-green-800 mt-1">
                {totalValue.toFixed(2)}€
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-purple-700">
                Taxa Média
              </h3>
              <p className="text-2xl font-bold text-purple-800 mt-1">
                {averageRate.toFixed(2)}€/h
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Detalhes das Atividades</h3>
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
                    ({ exportToExcel, formatActivitiesForExport }) => {
                      const formattedData =
                        formatActivitiesForExport(filteredActivities);
                      exportToExcel(formattedData, "Relatório_Atividades");
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
                    ({ exportToPDF, formatActivitiesForExport }) => {
                      const formattedData =
                        formatActivitiesForExport(filteredActivities);
                      const columns = [
                        "Data",
                        "Tipo",
                        "Descrição",
                        "Funcionário",
                        "Horas",
                        "Taxa (€/h)",
                        "Valor",
                        "Status",
                      ];
                      exportToPDF(
                        formattedData,
                        columns,
                        "Relatório_Atividades",
                        "Relatório de Atividades",
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
                  <TableHead>Tipo</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Horas</TableHead>
                  <TableHead>Taxa</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.length > 0 ? (
                  filteredActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>{activity.employeeName}</TableCell>
                      <TableCell>{activity.type}</TableCell>
                      <TableCell>
                        {format(activity.date, "dd/MM/yyyy", { locale: pt })}
                      </TableCell>
                      <TableCell>{activity.hours}h</TableCell>
                      <TableCell>{activity.rate.toFixed(2)}€/h</TableCell>
                      <TableCell>
                        {(activity.hours * activity.rate).toFixed(2)}€
                      </TableCell>
                      <TableCell>{getStatusBadge(activity.status)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-4 text-gray-500"
                    >
                      Nenhuma atividade encontrada para os filtros selecionados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">
              Resumo por Tipo de Atividade
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-md border p-4">
                <h4 className="text-sm font-medium mb-3">
                  Distribuição de Horas
                </h4>
                <div className="space-y-3">
                  {Object.entries(activityTypeData).map(([type, data]) => (
                    <div key={type}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{type}</span>
                        <span>{data.hours.toFixed(1)}h</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{
                            width: `${(data.hours / totalHours) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-md border p-4">
                <h4 className="text-sm font-medium mb-3">
                  Distribuição de Valor
                </h4>
                <div className="space-y-3">
                  {Object.entries(activityTypeData).map(([type, data]) => (
                    <div key={type}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{type}</span>
                        <span>{data.value.toFixed(2)}€</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-green-600 h-2.5 rounded-full"
                          style={{
                            width: `${(data.value / totalValue) * 100}%`,
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

export default ActivityReport;
