import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  FileText,
  Download,
  Printer,
  Mail,
  BarChart2,
  PieChart,
  LineChart,
  Table2,
} from "lucide-react";

interface Field {
  id: string;
  name: string;
  category: string;
  type: "text" | "number" | "date" | "boolean" | "currency";
  description?: string;
}

interface ReportPreviewProps {
  reportName: string;
  reportDescription: string;
  fields: Field[];
  filters: {
    field: string;
    operator: string;
    value: string;
  }[];
  groupBy?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  onExport: (format: "pdf" | "excel" | "csv") => void;
}

// Dados de exemplo para o relatório
const generateMockData = (fields: Field[], count: number = 20) => {
  const data = [];

  // Gerar valores para cada campo
  const generateValue = (field: Field) => {
    switch (field.type) {
      case "text":
        if (field.category === "employee") {
          const firstNames = [
            "Ana",
            "João",
            "Maria",
            "Pedro",
            "Sofia",
            "Carlos",
            "Luísa",
            "Miguel",
          ];
          const lastNames = [
            "Silva",
            "Santos",
            "Oliveira",
            "Costa",
            "Pereira",
            "Ferreira",
            "Rodrigues",
          ];
          return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
        }
        if (field.category === "position") {
          const positions = [
            "Gerente",
            "Analista",
            "Desenvolvedor",
            "Diretor",
            "Assistente",
            "Coordenador",
          ];
          return positions[Math.floor(Math.random() * positions.length)];
        }
        if (field.category === "department") {
          const departments = [
            "RH",
            "Financeiro",
            "TI",
            "Vendas",
            "Marketing",
            "Operações",
          ];
          return departments[Math.floor(Math.random() * departments.length)];
        }
        return `Valor ${Math.floor(Math.random() * 100)}`;
      case "number":
        return Math.floor(Math.random() * 100);
      case "date":
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 365));
        return date.toISOString().split("T")[0];
      case "boolean":
        return Math.random() > 0.5;
      case "currency":
        return Math.floor(Math.random() * 10000) / 100;
      default:
        return "";
    }
  };

  // Gerar dados para cada linha
  for (let i = 0; i < count; i++) {
    const row: Record<string, any> = {};
    fields.forEach((field) => {
      row[field.id] = generateValue(field);
    });
    data.push(row);
  }

  return data;
};

const ReportPreview: React.FC<ReportPreviewProps> = ({
  reportName,
  reportDescription,
  fields,
  filters,
  groupBy,
  sortBy,
  sortDirection,
  onExport,
}) => {
  const [viewType, setViewType] = useState<"table" | "bar" | "line" | "pie">(
    "table",
  );
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Gerar dados de exemplo
  const mockData = generateMockData(fields);

  // Aplicar filtros (simulação)
  const filteredData = mockData;

  // Aplicar ordenação
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortBy) return 0;

    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });

  // Paginação
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // Formatar valor com base no tipo
  const formatValue = (value: any, type: string) => {
    if (value === null || value === undefined) return "-";

    switch (type) {
      case "currency":
        return new Intl.NumberFormat("pt-PT", {
          style: "currency",
          currency: "EUR",
        }).format(value);
      case "date":
        return new Date(value).toLocaleDateString("pt-PT");
      case "boolean":
        return value ? "Sim" : "Não";
      default:
        return value;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{reportName}</CardTitle>
              {reportDescription && (
                <p className="text-sm text-gray-500 mt-1">
                  {reportDescription}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onExport("pdf")}>
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button variant="outline" onClick={() => onExport("excel")}>
                <Download className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button variant="outline" onClick={() => onExport("csv")}>
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <Button
                variant={viewType === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType("table")}
              >
                <Table2 className="h-4 w-4 mr-2" />
                Tabela
              </Button>
              <Button
                variant={viewType === "bar" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType("bar")}
              >
                <BarChart2 className="h-4 w-4 mr-2" />
                Gráfico de Barras
              </Button>
              <Button
                variant={viewType === "line" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType("line")}
              >
                <LineChart className="h-4 w-4 mr-2" />
                Gráfico de Linhas
              </Button>
              <Button
                variant={viewType === "pie" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewType("pie")}
              >
                <PieChart className="h-4 w-4 mr-2" />
                Gráfico de Pizza
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Linhas por página:</span>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => {
                  setPageSize(parseInt(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filtros aplicados */}
          {filters.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Filtros aplicados:</p>
              <div className="flex flex-wrap gap-2">
                {filters.map((filter, index) => {
                  const fieldName =
                    fields.find((f) => f.id === filter.field)?.name ||
                    filter.field;
                  const operatorLabel =
                    {
                      "=": "igual a",
                      "!=": "diferente de",
                      ">": "maior que",
                      "<": "menor que",
                      contains: "contém",
                    }[filter.operator] || filter.operator;

                  return (
                    <Badge key={index} variant="outline" className="px-3 py-1">
                      {fieldName} {operatorLabel} {filter.value}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {viewType === "table" ? (
            <>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {fields.map((field) => (
                        <TableHead key={field.id}>
                          {field.name}
                          {sortBy === field.id && (
                            <span className="ml-1">
                              {sortDirection === "asc" ? "↑" : "↓"}
                            </span>
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.length > 0 ? (
                      paginatedData.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {fields.map((field) => (
                            <TableCell key={field.id}>
                              {formatValue(row[field.id], field.type)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={fields.length}
                          className="text-center py-8 text-gray-500"
                        >
                          Nenhum dado encontrado
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Paginação */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-500">
                    Mostrando {(currentPage - 1) * pageSize + 1} a{" "}
                    {Math.min(currentPage * pageSize, sortedData.length)} de{" "}
                    {sortedData.length} registros
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    >
                      Primeira
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Próxima
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      Última
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-[400px] bg-gray-50 rounded-md">
              <div className="text-center">
                <BarChart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">
                  Visualização de gráfico{" "}
                  {viewType === "bar"
                    ? "de barras"
                    : viewType === "line"
                      ? "de linhas"
                      : "de pizza"}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Esta é uma simulação. Em uma implementação real, os gráficos
                  seriam renderizados com base nos dados.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportPreview;
