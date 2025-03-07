import React, { useState, useEffect } from "react";
import { useCompany } from "@/context/CompanyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  FileText,
  Download,
  Filter,
  Calendar,
  Printer,
  Mail,
  Save,
  Plus,
  Settings,
  LayoutGrid,
  Trash2,
  Edit,
  Eye,
  Copy,
  Share,
} from "lucide-react";
import FieldSelector from "./FieldSelector";
import ReportPreview from "./ReportPreview";

interface Field {
  id: string;
  name: string;
  category: string;
  type: "text" | "number" | "date" | "boolean" | "currency";
  description?: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  fields: Field[];
  filters: {
    field: string;
    operator: string;
    value: string;
  }[];
  groupBy?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  companyId?: string;
  isGlobal?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReportBuilder: React.FC = () => {
  const { currentCompany } = useCompany();
  const [activeTab, setActiveTab] = useState("builder");
  const [selectedFields, setSelectedFields] = useState<Field[]>([]);
  const [reportName, setReportName] = useState("Novo Relatório");
  const [reportDescription, setReportDescription] = useState("");
  const [groupByField, setGroupByField] = useState("");
  const [sortByField, setSortByField] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<
    { field: string; operator: string; value: string }[]
  >([]);
  const [savedReports, setSavedReports] = useState<ReportTemplate[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isGlobalReport, setIsGlobalReport] = useState(false);

  // Dados de exemplo por empresa
  const reportTemplatesByCompany: Record<string, ReportTemplate[]> = {
    "1": [
      {
        id: "report-1",
        name: "Relatório de Salários por Departamento",
        description: "Análise de salários médios por departamento",
        fields: [
          {
            id: "department",
            name: "Departamento",
            category: "position",
            type: "text",
          },
          {
            id: "employee_count",
            name: "Número de Funcionários",
            category: "position",
            type: "number",
          },
          {
            id: "avg_salary",
            name: "Salário Médio",
            category: "payment",
            type: "currency",
          },
          {
            id: "min_salary",
            name: "Salário Mínimo",
            category: "payment",
            type: "currency",
          },
          {
            id: "max_salary",
            name: "Salário Máximo",
            category: "payment",
            type: "currency",
          },
        ],
        filters: [],
        groupBy: "department",
        sortBy: "avg_salary",
        sortDirection: "desc",
        companyId: "1",
        isGlobal: false,
        createdAt: new Date("2023-05-10"),
        updatedAt: new Date("2023-05-10"),
      },
      {
        id: "report-2",
        name: "Análise de Bónus Anuais",
        description: "Distribuição de bónus por funcionário e departamento",
        fields: [
          {
            id: "employee_name",
            name: "Nome do Funcionário",
            category: "employee",
            type: "text",
          },
          {
            id: "department",
            name: "Departamento",
            category: "position",
            type: "text",
          },
          {
            id: "base_salary",
            name: "Salário Base",
            category: "payment",
            type: "currency",
          },
          {
            id: "bonus_amount",
            name: "Valor do Bónus",
            category: "payment",
            type: "currency",
          },
          {
            id: "bonus_percentage",
            name: "Percentagem do Bónus",
            category: "payment",
            type: "number",
          },
        ],
        filters: [{ field: "bonus_amount", operator: ">", value: "0" }],
        sortBy: "bonus_amount",
        sortDirection: "desc",
        companyId: "1",
        isGlobal: false,
        createdAt: new Date("2023-04-15"),
        updatedAt: new Date("2023-04-20"),
      },
    ],
    "2": [
      {
        id: "report-3",
        name: "Relatório de Vendas por Funcionário",
        description: "Análise de desempenho de vendas por funcionário",
        fields: [
          {
            id: "employee_name",
            name: "Nome do Funcionário",
            category: "employee",
            type: "text",
          },
          {
            id: "sales_amount",
            name: "Valor de Vendas",
            category: "performance",
            type: "currency",
          },
          {
            id: "sales_target",
            name: "Meta de Vendas",
            category: "performance",
            type: "currency",
          },
          {
            id: "achievement_percentage",
            name: "Percentagem de Alcance",
            category: "performance",
            type: "number",
          },
          {
            id: "commission",
            name: "Comissão",
            category: "payment",
            type: "currency",
          },
        ],
        filters: [],
        sortBy: "sales_amount",
        sortDirection: "desc",
        companyId: "2",
        isGlobal: false,
        createdAt: new Date("2023-05-05"),
        updatedAt: new Date("2023-05-05"),
      },
    ],
    global: [
      {
        id: "report-global-1",
        name: "Análise de Rotatividade de Pessoal",
        description: "Relatório global de rotatividade de pessoal por empresa",
        fields: [
          {
            id: "company_name",
            name: "Empresa",
            category: "company",
            type: "text",
          },
          {
            id: "employee_count",
            name: "Total de Funcionários",
            category: "company",
            type: "number",
          },
          {
            id: "new_hires",
            name: "Novas Contratações",
            category: "employee",
            type: "number",
          },
          {
            id: "terminations",
            name: "Desligamentos",
            category: "employee",
            type: "number",
          },
          {
            id: "turnover_rate",
            name: "Taxa de Rotatividade",
            category: "employee",
            type: "number",
          },
        ],
        filters: [],
        groupBy: "company_name",
        sortBy: "turnover_rate",
        sortDirection: "desc",
        isGlobal: true,
        createdAt: new Date("2023-03-01"),
        updatedAt: new Date("2023-03-15"),
      },
    ],
  };

  // Carregar relatórios quando a empresa mudar
  useEffect(() => {
    // Obter relatórios específicos da empresa
    // @ts-ignore - Ignorando o erro de índice para simplificar
    const companyReports = reportTemplatesByCompany[currentCompany.id] || [];

    // Obter relatórios globais
    const globalReports = reportTemplatesByCompany["global"] || [];

    // Combinar relatórios específicos da empresa com relatórios globais
    setSavedReports([...companyReports, ...globalReports]);
  }, [currentCompany.id]);

  const handleFieldSelect = (field: Field) => {
    // Verificar se o campo já está selecionado
    if (selectedFields.some((f) => f.id === field.id)) {
      // Remover o campo se já estiver selecionado
      setSelectedFields(selectedFields.filter((f) => f.id !== field.id));
    } else {
      // Adicionar o campo se não estiver selecionado
      setSelectedFields([...selectedFields, field]);
    }
  };

  const handleAddFilter = () => {
    setFilters([...filters, { field: "", operator: "=", value: "" }]);
  };

  const handleUpdateFilter = (index: number, key: string, value: string) => {
    const updatedFilters = [...filters];
    updatedFilters[index] = { ...updatedFilters[index], [key]: value };
    setFilters(updatedFilters);
  };

  const handleRemoveFilter = (index: number) => {
    const updatedFilters = [...filters];
    updatedFilters.splice(index, 1);
    setFilters(updatedFilters);
  };

  const handleSaveReport = () => {
    const newReport: ReportTemplate = {
      id: `report-${Date.now()}`,
      name: reportName,
      description: reportDescription,
      fields: selectedFields,
      filters: filters,
      groupBy: groupByField || undefined,
      sortBy: sortByField || undefined,
      sortDirection: sortDirection,
      companyId: isGlobalReport ? undefined : currentCompany.id,
      isGlobal: isGlobalReport,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSavedReports([...savedReports, newReport]);
    setIsSaveDialogOpen(false);
  };

  const handleLoadReport = (report: ReportTemplate) => {
    setReportName(report.name);
    setReportDescription(report.description);
    setSelectedFields(report.fields);
    setFilters(report.filters);
    setGroupByField(report.groupBy || "");
    setSortByField(report.sortBy || "");
    setSortDirection(report.sortDirection || "asc");
    setIsGlobalReport(report.isGlobal || false);
    setActiveTab("builder");
  };

  const handleDeleteReport = (reportId: string) => {
    if (confirm("Tem certeza que deseja excluir este relatório?")) {
      setSavedReports(savedReports.filter((report) => report.id !== reportId));
    }
  };

  const handleDuplicateReport = (report: ReportTemplate) => {
    const duplicatedReport: ReportTemplate = {
      ...report,
      id: `report-${Date.now()}`,
      name: `${report.name} (Cópia)`,
      companyId: currentCompany.id,
      isGlobal: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSavedReports([...savedReports, duplicatedReport]);
  };

  const handleMoveFieldUp = (index: number) => {
    if (index === 0) return;
    const updatedFields = [...selectedFields];
    [updatedFields[index - 1], updatedFields[index]] = [
      updatedFields[index],
      updatedFields[index - 1],
    ];
    setSelectedFields(updatedFields);
  };

  const handleMoveFieldDown = (index: number) => {
    if (index === selectedFields.length - 1) return;
    const updatedFields = [...selectedFields];
    [updatedFields[index], updatedFields[index + 1]] = [
      updatedFields[index + 1],
      updatedFields[index],
    ];
    setSelectedFields(updatedFields);
  };

  const handleRemoveField = (fieldId: string) => {
    setSelectedFields(selectedFields.filter((field) => field.id !== fieldId));
  };

  const handleExportReport = (format: "pdf" | "excel" | "csv") => {
    // Simulação de exportação
    alert(`Exportando relatório em formato ${format.toUpperCase()}...`);
    // Em uma implementação real, isso chamaria uma API ou usaria uma biblioteca para gerar o arquivo
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Construtor de Relatórios</h2>
          <p className="text-gray-500">
            Crie relatórios personalizados para análise de dados
          </p>
        </div>
        <div className="flex gap-2">
          {activeTab === "builder" && (
            <>
              <Button
                variant="outline"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
              >
                {isPreviewMode ? (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Pré-visualizar
                  </>
                )}
              </Button>
              <Button onClick={() => setIsSaveDialogOpen(true)}>
                <Save className="h-4 w-4 mr-2" />
                Guardar Relatório
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="builder">Construtor</TabsTrigger>
          <TabsTrigger value="saved">Relatórios Guardados</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-6">
          {isPreviewMode ? (
            <ReportPreview
              reportName={reportName}
              reportDescription={reportDescription}
              fields={selectedFields}
              filters={filters}
              groupBy={groupByField}
              sortBy={sortByField}
              sortDirection={sortDirection}
              onExport={handleExportReport}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Seletor de Campos */}
              <div className="lg:col-span-1">
                <FieldSelector
                  onFieldSelect={handleFieldSelect}
                  selectedFields={selectedFields}
                />
              </div>

              {/* Configuração do Relatório */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações do Relatório</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="report-name">Nome do Relatório</Label>
                      <Input
                        id="report-name"
                        value={reportName}
                        onChange={(e) => setReportName(e.target.value)}
                        placeholder="Ex: Relatório de Salários por Departamento"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="report-description">Descrição</Label>
                      <Textarea
                        id="report-description"
                        value={reportDescription}
                        onChange={(e) => setReportDescription(e.target.value)}
                        placeholder="Descreva o propósito deste relatório"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Campos Selecionados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedFields.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>Nenhum campo selecionado</p>
                        <p className="text-sm mt-1">
                          Selecione campos do painel à esquerda para incluir no
                          relatório
                        </p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">Ordem</TableHead>
                            <TableHead>Nome do Campo</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedFields.map((field, index) => (
                            <TableRow key={field.id}>
                              <TableCell>
                                <div className="flex flex-col space-y-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => handleMoveFieldUp(index)}
                                    disabled={index === 0}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="lucide lucide-chevron-up"
                                    >
                                      <path d="m18 15-6-6-6 6" />
                                    </svg>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => handleMoveFieldDown(index)}
                                    disabled={
                                      index === selectedFields.length - 1
                                    }
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="lucide lucide-chevron-down"
                                    >
                                      <path d="m6 9 6 6 6-6" />
                                    </svg>
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">
                                {field.name}
                              </TableCell>
                              <TableCell className="capitalize">
                                {field.category}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize">
                                  {field.type === "text"
                                    ? "Texto"
                                    : field.type === "number"
                                      ? "Número"
                                      : field.type === "date"
                                        ? "Data"
                                        : field.type === "boolean"
                                          ? "Sim/Não"
                                          : field.type === "currency"
                                            ? "Moeda"
                                            : field.type}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleRemoveField(field.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Filtros</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddFilter}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Filtro
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {filters.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        <p>Nenhum filtro definido</p>
                        <p className="text-sm mt-1">
                          Adicione filtros para limitar os dados do relatório
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filters.map((filter, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Select
                              value={filter.field}
                              onValueChange={(value) =>
                                handleUpdateFilter(index, "field", value)
                              }
                            >
                              <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Selecione um campo" />
                              </SelectTrigger>
                              <SelectContent>
                                {selectedFields.map((field) => (
                                  <SelectItem key={field.id} value={field.id}>
                                    {field.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select
                              value={filter.operator}
                              onValueChange={(value) =>
                                handleUpdateFilter(index, "operator", value)
                              }
                            >
                              <SelectTrigger className="w-[100px]">
                                <SelectValue placeholder="Operador" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="=">Igual a</SelectItem>
                                <SelectItem value="!=">Diferente de</SelectItem>
                                <SelectItem value=">">Maior que</SelectItem>
                                <SelectItem value="<">Menor que</SelectItem>
                                <SelectItem value="contains">Contém</SelectItem>
                              </SelectContent>
                            </Select>

                            <Input
                              value={filter.value}
                              onChange={(e) =>
                                handleUpdateFilter(
                                  index,
                                  "value",
                                  e.target.value,
                                )
                              }
                              placeholder="Valor"
                              className="flex-1"
                            />

                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleRemoveFilter(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Opções de Agrupamento e Ordenação</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="group-by">Agrupar por</Label>
                        <Select
                          value={groupByField}
                          onValueChange={setGroupByField}
                        >
                          <SelectTrigger id="group-by">
                            <SelectValue placeholder="Selecione um campo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Nenhum</SelectItem>
                            {selectedFields
                              .filter((field) => field.type === "text")
                              .map((field) => (
                                <SelectItem key={field.id} value={field.id}>
                                  {field.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="sort-by">Ordenar por</Label>
                        <Select
                          value={sortByField}
                          onValueChange={setSortByField}
                        >
                          <SelectTrigger id="sort-by">
                            <SelectValue placeholder="Selecione um campo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Nenhum</SelectItem>
                            {selectedFields.map((field) => (
                              <SelectItem key={field.id} value={field.id}>
                                {field.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {sortByField && (
                      <div className="space-y-2">
                        <Label>Direção da Ordenação</Label>
                        <div className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="sort-asc"
                              checked={sortDirection === "asc"}
                              onChange={() => setSortDirection("asc")}
                              className="h-4 w-4"
                            />
                            <Label
                              htmlFor="sort-asc"
                              className="cursor-pointer"
                            >
                              Ascendente (A-Z, 0-9)
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id="sort-desc"
                              checked={sortDirection === "desc"}
                              onChange={() => setSortDirection("desc")}
                              className="h-4 w-4"
                            />
                            <Label
                              htmlFor="sort-desc"
                              className="cursor-pointer"
                            >
                              Descendente (Z-A, 9-0)
                            </Label>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Guardados</CardTitle>
            </CardHeader>
            <CardContent>
              {savedReports.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhum relatório guardado</p>
                  <p className="text-sm mt-1">
                    Crie e guarde relatórios para acesso rápido
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedReports.map((report) => (
                    <Card key={report.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">
                            {report.name}
                          </CardTitle>
                          {report.isGlobal && (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200"
                            >
                              Global
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Criado em {report.createdAt.toLocaleDateString()}
                        </p>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {report.description || "Sem descrição"}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {report.fields.slice(0, 3).map((field) => (
                            <Badge
                              key={field.id}
                              variant="secondary"
                              className="text-xs"
                            >
                              {field.name}
                            </Badge>
                          ))}
                          {report.fields.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{report.fields.length - 3} campos
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                      <div className="p-3 bg-gray-50 border-t flex justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLoadReport(report)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDuplicateReport(report)}
                            title="Duplicar"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          {!report.isGlobal && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteReport(report.id)}
                              title="Excluir"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Report Dialog */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Guardar Relatório</DialogTitle>
            <DialogDescription>
              Preencha as informações para guardar o relatório.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="save-report-name">Nome do Relatório</Label>
              <Input
                id="save-report-name"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="save-report-description">Descrição</Label>
              <Textarea
                id="save-report-description"
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="global-report"
                checked={isGlobalReport}
                onChange={(e) => setIsGlobalReport(e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="global-report" className="cursor-pointer">
                Relatório Global (disponível para todas as empresas)
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSaveDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveReport} disabled={!reportName}>
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportBuilder;
