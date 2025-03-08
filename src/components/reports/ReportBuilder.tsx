import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  Save,
  Plus,
  Trash2,
  MoveVertical,
  BarChart,
  PieChart,
  LineChart,
  Table,
  FileText,
  Eye,
  Download,
  Settings,
  Calendar,
  Filter,
  Layout,
  Columns,
  GripVertical,
} from "lucide-react";
import { EnhancedDateRangePicker } from "@/components/calendar/EnhancedDateRangePicker";
import { DateRange } from "react-day-picker";
import { format, addMonths } from "date-fns";
import { pt } from "date-fns/locale";
import ReportPreview from "./ReportPreview";
import FieldSelector from "./FieldSelector";

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

const ReportBuilder = () => {
  const [reportName, setReportName] = useState("Novo Relatório");
  const [reportDescription, setReportDescription] = useState(
    "Descrição do relatório",
  );
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addMonths(new Date(), -1),
    to: new Date(),
  });
  const [dataSource, setDataSource] = useState("payments");
  const [activeTab, setActiveTab] = useState("fields");
  const [showPreview, setShowPreview] = useState(false);

  // Available data sources
  const dataSources = [
    { id: "payments", name: "Pagamentos" },
    { id: "activities", name: "Atividades" },
    { id: "employees", name: "Funcionários" },
  ];

  // Fields for each data source
  const availableFields: Record<string, ReportField[]> = {
    payments: [
      {
        id: "payment_id",
        name: "id",
        label: "ID do Pagamento",
        type: "string",
        source: "payments",
        width: 100,
        visible: true,
        sortable: true,
        filterable: true,
      },
      {
        id: "payment_date",
        name: "date",
        label: "Data do Pagamento",
        type: "date",
        source: "payments",
        width: 120,
        visible: true,
        sortable: true,
        filterable: true,
      },
      {
        id: "payment_employee",
        name: "employeeName",
        label: "Funcionário",
        type: "string",
        source: "payments",
        width: 150,
        visible: true,
        sortable: true,
        filterable: true,
      },
      {
        id: "payment_amount",
        name: "amount",
        label: "Valor",
        type: "number",
        source: "payments",
        width: 100,
        visible: true,
        sortable: true,
        filterable: true,
      },
      {
        id: "payment_status",
        name: "status",
        label: "Status",
        type: "string",
        source: "payments",
        width: 100,
        visible: true,
        sortable: true,
        filterable: true,
      },
    ],
    activities: [
      {
        id: "activity_id",
        name: "id",
        label: "ID da Atividade",
        type: "string",
        source: "activities",
        width: 100,
        visible: true,
        sortable: true,
        filterable: true,
      },
      {
        id: "activity_type",
        name: "type",
        label: "Tipo de Atividade",
        type: "string",
        source: "activities",
        width: 150,
        visible: true,
        sortable: true,
        filterable: true,
      },
      {
        id: "activity_date",
        name: "date",
        label: "Data",
        type: "date",
        source: "activities",
        width: 120,
        visible: true,
        sortable: true,
        filterable: true,
      },
      {
        id: "activity_employee",
        name: "employeeName",
        label: "Funcionário",
        type: "string",
        source: "activities",
        width: 150,
        visible: true,
        sortable: true,
        filterable: true,
      },
      {
        id: "activity_hours",
        name: "hours",
        label: "Horas",
        type: "number",
        source: "activities",
        width: 80,
        visible: true,
        sortable: true,
        filterable: true,
      },
      {
        id: "activity_rate",
        name: "rate",
        label: "Taxa",
        type: "number",
        source: "activities",
        width: 80,
        visible: true,
        sortable: true,
        filterable: true,
      },
      {
        id: "activity_value",
        name: "value",
        label: "Valor",
        type: "number",
        source: "activities",
        width: 100,
        visible: true,
        sortable: true,
        filterable: true,
      },
    ],
    employees: [
      {
        id: "employee_id",
        name: "id",
        label: "ID do Funcionário",
        type: "string",
        source: "employees",
        width: 100,
        visible: true,
        sortable: true,
        filterable: true,
      },
      {
        id: "employee_name",
        name: "name",
        label: "Nome",
        type: "string",
        source: "employees",
        width: 150,
        visible: true,
        sortable: true,
        filterable: true,
      },
      {
        id: "employee_department",
        name: "department",
        label: "Departamento",
        type: "string",
        source: "employees",
        width: 120,
        visible: true,
        sortable: true,
        filterable: true,
      },
      {
        id: "employee_position",
        name: "position",
        label: "Cargo",
        type: "string",
        source: "employees",
        width: 150,
        visible: true,
        sortable: true,
        filterable: true,
      },
      {
        id: "employee_salary",
        name: "baseSalary",
        label: "Salário Base",
        type: "number",
        source: "employees",
        width: 120,
        visible: true,
        sortable: true,
        filterable: true,
      },
      {
        id: "employee_status",
        name: "status",
        label: "Status",
        type: "string",
        source: "employees",
        width: 100,
        visible: true,
        sortable: true,
        filterable: true,
      },
    ],
  };

  // Selected fields for the report
  const [selectedFields, setSelectedFields] = useState<ReportField[]>([]);

  // Filters for the report
  const [filters, setFilters] = useState<ReportFilter[]>([]);

  // Visualizations for the report
  const [visualizations, setVisualizations] = useState<ReportVisualization[]>(
    [],
  );

  // Handle data source change
  const handleDataSourceChange = (source: string) => {
    setDataSource(source);
    setSelectedFields([]);
    setFilters([]);
    setVisualizations([]);
  };

  // Handle field selection
  const handleFieldToggle = (field: ReportField) => {
    const fieldIndex = selectedFields.findIndex((f) => f.id === field.id);
    if (fieldIndex === -1) {
      setSelectedFields([...selectedFields, field]);
    } else {
      const newFields = [...selectedFields];
      newFields.splice(fieldIndex, 1);
      setSelectedFields(newFields);
    }
  };

  // Handle field reordering
  const handleFieldReorder = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(selectedFields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSelectedFields(items);
  };

  // Handle field visibility toggle
  const handleFieldVisibilityToggle = (fieldId: string) => {
    setSelectedFields(
      selectedFields.map((field) =>
        field.id === fieldId ? { ...field, visible: !field.visible } : field,
      ),
    );
  };

  // Add a new filter
  const handleAddFilter = () => {
    if (selectedFields.length === 0) return;

    const newFilter: ReportFilter = {
      id: `filter-${Date.now()}`,
      field: selectedFields[0].id,
      operator: "equals",
      value: "",
    };

    setFilters([...filters, newFilter]);
  };

  // Update a filter
  const handleUpdateFilter = (
    filterId: string,
    property: keyof ReportFilter,
    value: string,
  ) => {
    setFilters(
      filters.map((filter) =>
        filter.id === filterId ? { ...filter, [property]: value } : filter,
      ),
    );
  };

  // Remove a filter
  const handleRemoveFilter = (filterId: string) => {
    setFilters(filters.filter((filter) => filter.id !== filterId));
  };

  // Add a new visualization
  const handleAddVisualization = (type: ReportVisualization["type"]) => {
    if (selectedFields.length === 0) return;

    const newVisualization: ReportVisualization = {
      id: `viz-${Date.now()}`,
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`,
      fields: selectedFields.filter((f) => f.visible).map((f) => f.id),
      showTotals: type === "table",
    };

    setVisualizations([...visualizations, newVisualization]);
  };

  // Update a visualization
  const handleUpdateVisualization = (
    vizId: string,
    property: keyof ReportVisualization,
    value: any,
  ) => {
    setVisualizations(
      visualizations.map((viz) =>
        viz.id === vizId ? { ...viz, [property]: value } : viz,
      ),
    );
  };

  // Remove a visualization
  const handleRemoveVisualization = (vizId: string) => {
    setVisualizations(visualizations.filter((viz) => viz.id !== vizId));
  };

  // Save the report
  const handleSaveReport = () => {
    const report = {
      name: reportName,
      description: reportDescription,
      dataSource,
      dateRange,
      fields: selectedFields,
      filters,
      visualizations,
    };

    console.log("Saving report:", report);
    // Here you would typically save the report to your backend
    alert("Relatório salvo com sucesso!");
  };

  return (
    <div className="space-y-6">
      {showPreview ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{reportName}</h2>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              <Settings className="mr-2 h-4 w-4" />
              Voltar para Edição
            </Button>
          </div>
          <ReportPreview
            reportName={reportName}
            reportDescription={reportDescription}
            dateRange={dateRange}
            fields={selectedFields}
            filters={filters}
            visualizations={visualizations}
            dataSource={dataSource}
          />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Construtor de Relatórios</h2>
              <p className="text-gray-500">
                Crie relatórios personalizados com os dados que você precisa
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowPreview(true)}>
                <Eye className="mr-2 h-4 w-4" />
                Pré-visualizar
              </Button>
              <Button onClick={handleSaveReport}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Relatório
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="report-name">Nome do Relatório</Label>
                  <Input
                    id="report-name"
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                    placeholder="Ex: Relatório de Pagamentos Mensal"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data-source">Fonte de Dados</Label>
                  <Select
                    value={dataSource}
                    onValueChange={handleDataSourceChange}
                  >
                    <SelectTrigger id="data-source">
                      <SelectValue placeholder="Selecione a fonte de dados" />
                    </SelectTrigger>
                    <SelectContent>
                      {dataSources.map((source) => (
                        <SelectItem key={source.id} value={source.id}>
                          {source.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Período</Label>
                  <EnhancedDateRangePicker
                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                    showCompactPresets
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="report-description">Descrição</Label>
                  <Textarea
                    id="report-description"
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                    placeholder="Descreva o propósito deste relatório"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="fields">Campos</TabsTrigger>
              <TabsTrigger value="filters">Filtros</TabsTrigger>
              <TabsTrigger value="visualizations">Visualizações</TabsTrigger>
            </TabsList>

            <TabsContent value="fields" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Seleção de Campos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3">
                        Campos Disponíveis
                      </h3>
                      <div className="border rounded-md p-4 max-h-[400px] overflow-y-auto">
                        <FieldSelector
                          fields={availableFields[dataSource] || []}
                          selectedFields={selectedFields}
                          onFieldToggle={handleFieldToggle}
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-3">
                        Campos Selecionados
                      </h3>
                      <div className="border rounded-md p-4 max-h-[400px] overflow-y-auto">
                        {selectedFields.length > 0 ? (
                          <DragDropContext onDragEnd={handleFieldReorder}>
                            <Droppable droppableId="selected-fields">
                              {(provided) => (
                                <div
                                  {...provided.droppableProps}
                                  ref={provided.innerRef}
                                  className="space-y-2"
                                >
                                  {selectedFields.map((field, index) => (
                                    <Draggable
                                      key={field.id}
                                      draggableId={field.id}
                                      index={index}
                                    >
                                      {(provided) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          className="flex items-center justify-between p-2 bg-gray-50 rounded-md border"
                                        >
                                          <div className="flex items-center">
                                            <div
                                              {...provided.dragHandleProps}
                                              className="mr-2 cursor-move"
                                            >
                                              <GripVertical className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <Switch
                                                checked={field.visible}
                                                onCheckedChange={() =>
                                                  handleFieldVisibilityToggle(
                                                    field.id,
                                                  )
                                                }
                                              />
                                              <span
                                                className={`text-sm ${!field.visible ? "text-gray-400" : ""}`}
                                              >
                                                {field.label}
                                              </span>
                                            </div>
                                          </div>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-gray-500"
                                            onClick={() =>
                                              handleFieldToggle(field)
                                            }
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </DragDropContext>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <p className="font-medium">
                              Nenhum campo selecionado
                            </p>
                            <p className="text-sm mt-1">
                              Selecione campos da lista à esquerda
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="filters" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Filtros</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddFilter}
                    disabled={selectedFields.length === 0}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Filtro
                  </Button>
                </CardHeader>
                <CardContent>
                  {filters.length > 0 ? (
                    <div className="space-y-4">
                      {filters.map((filter) => (
                        <div
                          key={filter.id}
                          className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 flex-1">
                            <div>
                              <Label className="text-xs mb-1 block">
                                Campo
                              </Label>
                              <Select
                                value={filter.field}
                                onValueChange={(value) =>
                                  handleUpdateFilter(filter.id, "field", value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione um campo" />
                                </SelectTrigger>
                                <SelectContent>
                                  {selectedFields.map((field) => (
                                    <SelectItem key={field.id} value={field.id}>
                                      {field.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-xs mb-1 block">
                                Operador
                              </Label>
                              <Select
                                value={filter.operator}
                                onValueChange={(value) =>
                                  handleUpdateFilter(
                                    filter.id,
                                    "operator",
                                    value,
                                  )
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione um operador" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="equals">
                                    Igual a
                                  </SelectItem>
                                  <SelectItem value="not_equals">
                                    Diferente de
                                  </SelectItem>
                                  <SelectItem value="contains">
                                    Contém
                                  </SelectItem>
                                  <SelectItem value="greater_than">
                                    Maior que
                                  </SelectItem>
                                  <SelectItem value="less_than">
                                    Menor que
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="md:col-span-2">
                              <Label className="text-xs mb-1 block">
                                Valor
                              </Label>
                              <Input
                                value={filter.value}
                                onChange={(e) =>
                                  handleUpdateFilter(
                                    filter.id,
                                    "value",
                                    e.target.value,
                                  )
                                }
                                placeholder="Valor do filtro"
                              />
                            </div>
                          </div>
                          <div className="flex items-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-10 w-10 p-0 text-gray-500"
                              onClick={() => handleRemoveFilter(filter.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Filter className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p className="font-medium">Nenhum filtro definido</p>
                      <p className="text-sm mt-1">
                        Adicione filtros para restringir os dados do relatório
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="visualizations" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Visualizações</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddVisualization("table")}
                      disabled={selectedFields.length === 0}
                    >
                      <Table className="mr-2 h-4 w-4" />
                      Tabela
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddVisualization("bar")}
                      disabled={selectedFields.length === 0}
                    >
                      <BarChart className="mr-2 h-4 w-4" />
                      Barras
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddVisualization("line")}
                      disabled={selectedFields.length === 0}
                    >
                      <LineChart className="mr-2 h-4 w-4" />
                      Linha
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddVisualization("pie")}
                      disabled={selectedFields.length === 0}
                    >
                      <PieChart className="mr-2 h-4 w-4" />
                      Pizza
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {visualizations.length > 0 ? (
                    <div className="space-y-6">
                      {visualizations.map((viz) => (
                        <div
                          key={viz.id}
                          className="p-4 bg-gray-50 rounded-md border"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-2">
                              {viz.type === "table" && (
                                <Table className="h-5 w-5 text-blue-600" />
                              )}
                              {viz.type === "bar" && (
                                <BarChart className="h-5 w-5 text-green-600" />
                              )}
                              {viz.type === "line" && (
                                <LineChart className="h-5 w-5 text-purple-600" />
                              )}
                              {viz.type === "pie" && (
                                <PieChart className="h-5 w-5 text-amber-600" />
                              )}
                              <Input
                                value={viz.title}
                                onChange={(e) =>
                                  handleUpdateVisualization(
                                    viz.id,
                                    "title",
                                    e.target.value,
                                  )
                                }
                                className="h-8 w-64 text-sm font-medium"
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-gray-500"
                              onClick={() => handleRemoveVisualization(viz.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-xs">Campos a exibir</Label>
                              <Select
                                value={viz.fields[0] || ""}
                                onValueChange={(value) =>
                                  handleUpdateVisualization(viz.id, "fields", [
                                    value,
                                    ...viz.fields.slice(1),
                                  ])
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione um campo" />
                                </SelectTrigger>
                                <SelectContent>
                                  {selectedFields
                                    .filter((f) => f.visible)
                                    .map((field) => (
                                      <SelectItem
                                        key={field.id}
                                        value={field.id}
                                      >
                                        {field.label}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {viz.type !== "table" && (
                              <div className="space-y-2">
                                <Label className="text-xs">Agrupar por</Label>
                                <Select
                                  value={viz.groupBy || ""}
                                  onValueChange={(value) =>
                                    handleUpdateVisualization(
                                      viz.id,
                                      "groupBy",
                                      value,
                                    )
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione um campo" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="">Nenhum</SelectItem>
                                    {selectedFields
                                      .filter((f) => f.visible)
                                      .map((field) => (
                                        <SelectItem
                                          key={field.id}
                                          value={field.id}
                                        >
                                          {field.label}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                            {viz.type === "table" && (
                              <div className="flex items-center space-x-2">
                                <Switch
                                  id={`show-totals-${viz.id}`}
                                  checked={viz.showTotals}
                                  onCheckedChange={(checked) =>
                                    handleUpdateVisualization(
                                      viz.id,
                                      "showTotals",
                                      checked,
                                    )
                                  }
                                />
                                <Label
                                  htmlFor={`show-totals-${viz.id}`}
                                  className="text-sm"
                                >
                                  Mostrar totais
                                </Label>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Layout className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                      <p className="font-medium">
                        Nenhuma visualização definida
                      </p>
                      <p className="text-sm mt-1">
                        Adicione visualizações para exibir os dados do relatório
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default ReportBuilder;
