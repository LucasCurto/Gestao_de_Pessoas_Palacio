import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { Download, FileText, Calendar, Filter } from "lucide-react";

interface ReportField {
  id: string;
  name: string;
  label: string;
  type: string;
  source: string;
  width: number;
  visible: boolean;
  sortable: boolean;
  filterable: boolean;
}

interface ReportFilter {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface ReportVisualization {
  id: string;
  type: "table" | "bar" | "pie" | "line";
  title: string;
  fields: string[];
  groupBy?: string;
  showTotals: boolean;
}

interface ReportPreviewProps {
  reportName: string;
  reportDescription: string;
  dateRange: DateRange | undefined;
  fields: ReportField[];
  filters: ReportFilter[];
  visualizations: ReportVisualization[];
  dataSource: string;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({
  reportName,
  reportDescription,
  dateRange,
  fields,
  filters,
  visualizations,
  dataSource,
}) => {
  // Mock data for preview
  const mockData = {
    payments: [
      {
        id: "pay-001",
        date: new Date(2023, 4, 15),
        employeeName: "João Silva",
        amount: 2500,
        status: "paid",
      },
      {
        id: "pay-002",
        date: new Date(2023, 4, 15),
        employeeName: "Maria Santos",
        amount: 2800,
        status: "paid",
      },
      {
        id: "pay-003",
        date: new Date(2023, 4, 30),
        employeeName: "Ana Oliveira",
        amount: 2200,
        status: "pending",
      },
      {
        id: "pay-004",
        date: new Date(2023, 5, 15),
        employeeName: "Pedro Costa",
        amount: 2100,
        status: "paid",
      },
      {
        id: "pay-005",
        date: new Date(2023, 5, 15),
        employeeName: "Sofia Martins",
        amount: 2300,
        status: "paid",
      },
    ],
    activities: [
      {
        id: "act-001",
        type: "Horas Extras",
        date: new Date(2023, 4, 10),
        employeeName: "João Silva",
        hours: 3,
        rate: 15,
        value: 45,
      },
      {
        id: "act-002",
        type: "Trabalho Fim de Semana",
        date: new Date(2023, 4, 20),
        employeeName: "Maria Santos",
        hours: 6,
        rate: 20,
        value: 120,
      },
      {
        id: "act-003",
        type: "Formação",
        date: new Date(2023, 4, 25),
        employeeName: "João Silva",
        hours: 8,
        rate: 12,
        value: 96,
      },
      {
        id: "act-004",
        type: "Deslocação",
        date: new Date(2023, 5, 2),
        employeeName: "Ana Oliveira",
        hours: 4,
        rate: 10,
        value: 40,
      },
      {
        id: "act-005",
        type: "Horas Extras",
        date: new Date(2023, 5, 10),
        employeeName: "Maria Santos",
        hours: 5,
        rate: 15,
        value: 75,
      },
    ],
    employees: [
      {
        id: "emp-001",
        name: "João Silva",
        department: "TI",
        position: "Desenvolvedor Senior",
        baseSalary: 2500,
        status: "active",
      },
      {
        id: "emp-002",
        name: "Maria Santos",
        department: "Vendas",
        position: "Gerente de Contas",
        baseSalary: 2800,
        status: "active",
      },
      {
        id: "emp-003",
        name: "Ana Oliveira",
        department: "RH",
        position: "Especialista de RH",
        baseSalary: 2200,
        status: "active",
      },
      {
        id: "emp-004",
        name: "Pedro Costa",
        department: "TI",
        position: "Analista de Sistemas",
        baseSalary: 2100,
        status: "active",
      },
      {
        id: "emp-005",
        name: "Sofia Martins",
        department: "Marketing",
        position: "Especialista de Marketing",
        baseSalary: 2300,
        status: "inactive",
      },
    ],
  };

  const data = mockData[dataSource as keyof typeof mockData] || [];

  // Get field by ID
  const getFieldById = (fieldId: string) => {
    return fields.find((field) => field.id === fieldId);
  };

  // Get field value from data item
  const getFieldValue = (item: any, fieldName: string) => {
    const value = item[fieldName];
    if (value instanceof Date) {
      return format(value, "dd/MM/yyyy", { locale: pt });
    }
    if (typeof value === "number") {
      return value.toFixed(2);
    }
    return value;
  };

  // Get status badge
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
        return <span>{status}</span>;
    }
  };

  // Format date range for display
  const formattedDateRange =
    dateRange?.from && dateRange?.to
      ? `${format(dateRange.from, "dd/MM/yyyy", { locale: pt })} - ${format(dateRange.to, "dd/MM/yyyy", { locale: pt })}`
      : "Todos os períodos";

  // Get filter description
  const getFilterDescription = (filter: ReportFilter) => {
    const field = getFieldById(filter.field);
    if (!field) return "";

    const operatorMap: Record<string, string> = {
      equals: "igual a",
      not_equals: "diferente de",
      contains: "contém",
      greater_than: "maior que",
      less_than: "menor que",
    };

    return `${field.label} ${operatorMap[filter.operator] || filter.operator} ${filter.value}`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{reportName}</CardTitle>
              <p className="text-sm text-gray-500 mt-1">{reportDescription}</p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm">
              <Calendar className="h-4 w-4" />
              <span>{formattedDateRange}</span>
            </div>

            {filters.map((filter) => (
              <div
                key={filter.id}
                className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-sm"
              >
                <Filter className="h-4 w-4" />
                <span>{getFilterDescription(filter)}</span>
              </div>
            ))}
          </div>

          {visualizations.map((viz) => (
            <div key={viz.id} className="mb-8">
              <h3 className="text-lg font-medium mb-4">{viz.title}</h3>

              {viz.type === "table" && (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {fields
                          .filter((field) => field.visible)
                          .map((field) => (
                            <TableHead key={field.id}>{field.label}</TableHead>
                          ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.length > 0 ? (
                        data.map((item: any, index: number) => (
                          <TableRow key={index}>
                            {fields
                              .filter((field) => field.visible)
                              .map((field) => (
                                <TableCell key={field.id}>
                                  {field.name === "status"
                                    ? getStatusBadge(item[field.name])
                                    : getFieldValue(item, field.name)}
                                </TableCell>
                              ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={fields.filter((f) => f.visible).length}
                            className="text-center py-4 text-gray-500"
                          >
                            Nenhum dado encontrado
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}

              {viz.type !== "table" && (
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md border p-4">
                  <div className="text-center text-gray-500">
                    <p className="font-medium">
                      Visualização de gráfico {viz.type}
                    </p>
                    <p className="text-sm mt-1">
                      Os dados seriam exibidos em um gráfico{" "}
                      {viz.type === "bar"
                        ? "de barras"
                        : viz.type === "line"
                          ? "de linha"
                          : "de pizza"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {visualizations.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p className="font-medium">Nenhuma visualização definida</p>
              <p className="text-sm mt-1">
                Adicione visualizações para exibir os dados do relatório
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportPreview;
