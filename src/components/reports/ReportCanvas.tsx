import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutGrid,
  Table,
  BarChart,
  PieChart,
  LineChart,
  GripVertical,
  Plus,
  Settings,
  Trash2,
  Copy,
  MoveHorizontal,
  ChevronDown,
  Eye,
  EyeOff,
  HelpCircle,
} from "lucide-react";

interface ReportCanvasProps {
  onElementAdd?: (element: ReportElement) => void;
  onElementUpdate?: (id: string, element: Partial<ReportElement>) => void;
  onElementRemove?: (id: string) => void;
  onLayoutChange?: (layout: string) => void;
  elements?: ReportElement[];
  className?: string;
}

interface ReportElement {
  id: string;
  type: "table" | "chart" | "text" | "image";
  title: string;
  config: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
  visible: boolean;
}

const CHART_TYPES = [
  {
    value: "bar",
    label: "Gráfico de Barras",
    icon: <BarChart className="h-4 w-4" />,
  },
  {
    value: "line",
    label: "Gráfico de Linhas",
    icon: <LineChart className="h-4 w-4" />,
  },
  {
    value: "pie",
    label: "Gráfico Circular",
    icon: <PieChart className="h-4 w-4" />,
  },
];

const LAYOUT_OPTIONS = [
  { value: "grid", label: "Grade", icon: <LayoutGrid className="h-4 w-4" /> },
  { value: "list", label: "Lista", icon: <Table className="h-4 w-4" /> },
];

const ReportCanvas = ({
  onElementAdd = () => {},
  onElementUpdate = () => {},
  onElementRemove = () => {},
  onLayoutChange = () => {},
  elements = [
    {
      id: "table-1",
      type: "table",
      title: "Tabela de Funcionários",
      config: {
        columns: [
          { field: "name", header: "Nome" },
          { field: "department", header: "Departamento" },
          { field: "salary", header: "Salário" },
        ],
      },
      position: { x: 0, y: 0 },
      size: { width: 12, height: 4 },
      visible: true,
    },
    {
      id: "chart-1",
      type: "chart",
      title: "Distribuição de Salários por Departamento",
      config: {
        chartType: "bar",
        xAxis: "department",
        yAxis: "salary",
      },
      position: { x: 0, y: 4 },
      size: { width: 6, height: 4 },
      visible: true,
    },
    {
      id: "text-1",
      type: "text",
      title: "Sumário",
      config: {
        content:
          "Este relatório apresenta uma visão geral dos salários por departamento.",
      },
      position: { x: 6, y: 4 },
      size: { width: 6, height: 2 },
      visible: true,
    },
  ],
  className,
}: ReportCanvasProps) => {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [layout, setLayout] = useState("grid");
  const [activeTab, setActiveTab] = useState("design");
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

  const handleLayoutChange = (newLayout: string) => {
    setLayout(newLayout);
    onLayoutChange(newLayout);
  };

  const handleElementSelect = (id: string) => {
    setSelectedElement(id === selectedElement ? null : id);
  };

  const handleElementVisibilityToggle = (id: string) => {
    const element = elements.find((el) => el.id === id);
    if (element) {
      onElementUpdate(id, { visible: !element.visible });
    }
  };

  const handleElementRemove = (id: string) => {
    onElementRemove(id);
    if (selectedElement === id) {
      setSelectedElement(null);
    }
  };

  const handleElementDuplicate = (id: string) => {
    const element = elements.find((el) => el.id === id);
    if (element) {
      const newElement = {
        ...element,
        id: `${element.type}-${Date.now()}`,
        position: { x: element.position.x + 1, y: element.position.y + 1 },
      };
      onElementAdd(newElement);
    }
  };

  const handleAddElement = (type: "table" | "chart" | "text" | "image") => {
    const newElement: ReportElement = {
      id: `${type}-${Date.now()}`,
      type,
      title:
        type === "table"
          ? "Nova Tabela"
          : type === "chart"
            ? "Novo Gráfico"
            : type === "text"
              ? "Novo Texto"
              : "Nova Imagem",
      config:
        type === "table"
          ? { columns: [] }
          : type === "chart"
            ? { chartType: "bar", xAxis: "", yAxis: "" }
            : type === "text"
              ? { content: "" }
              : { url: "" },
      position: {
        x: 0,
        y:
          elements.length > 0
            ? Math.max(...elements.map((e) => e.position.y + e.size.height))
            : 0,
      },
      size: { width: 12, height: type === "text" ? 2 : 4 },
      visible: true,
    };
    onElementAdd(newElement);
    setSelectedElement(newElement.id);
  };

  const handleDragStart = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setIsDragging(true);
    setSelectedElement(id);
    setDragPosition({ x: e.clientX, y: e.clientY });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragMove = (e: React.MouseEvent) => {
    if (isDragging && selectedElement) {
      const deltaX = e.clientX - dragPosition.x;
      const deltaY = e.clientY - dragPosition.y;

      const element = elements.find((el) => el.id === selectedElement);
      if (element) {
        onElementUpdate(selectedElement, {
          position: {
            x: element.position.x + Math.round(deltaX / 20),
            y: element.position.y + Math.round(deltaY / 20),
          },
        });
      }

      setDragPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const renderElementConfig = () => {
    if (!selectedElement) return null;

    const element = elements.find((el) => el.id === selectedElement);
    if (!element) return null;

    return (
      <div className="p-4 border rounded-md bg-white">
        <h3 className="text-lg font-medium mb-4">Configurações do Elemento</h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="element-title">Título</Label>
            <Input
              id="element-title"
              value={element.title}
              onChange={(e) =>
                onElementUpdate(element.id, { title: e.target.value })
              }
              className="mt-1"
            />
          </div>

          {element.type === "table" && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Colunas da Tabela</h4>
              {element.config.columns.map((column: any, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={column.field}
                    onChange={(e) => {
                      const newColumns = [...element.config.columns];
                      newColumns[index] = { ...column, field: e.target.value };
                      onElementUpdate(element.id, {
                        config: { ...element.config, columns: newColumns },
                      });
                    }}
                    placeholder="Campo"
                    className="flex-1"
                  />
                  <Input
                    value={column.header}
                    onChange={(e) => {
                      const newColumns = [...element.config.columns];
                      newColumns[index] = { ...column, header: e.target.value };
                      onElementUpdate(element.id, {
                        config: { ...element.config, columns: newColumns },
                      });
                    }}
                    placeholder="Cabeçalho"
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newColumns = element.config.columns.filter(
                        (_: any, i: number) => i !== index,
                      );
                      onElementUpdate(element.id, {
                        config: { ...element.config, columns: newColumns },
                      });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newColumns = [
                    ...element.config.columns,
                    { field: "", header: "" },
                  ];
                  onElementUpdate(element.id, {
                    config: { ...element.config, columns: newColumns },
                  });
                }}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" /> Adicionar Coluna
              </Button>
            </div>
          )}

          {element.type === "chart" && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="chart-type">Tipo de Gráfico</Label>
                <Select
                  value={element.config.chartType}
                  onValueChange={(value) =>
                    onElementUpdate(element.id, {
                      config: { ...element.config, chartType: value },
                    })
                  }
                >
                  <SelectTrigger id="chart-type" className="mt-1">
                    <SelectValue placeholder="Selecione o tipo de gráfico" />
                  </SelectTrigger>
                  <SelectContent>
                    {CHART_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center">
                          {type.icon}
                          <span className="ml-2">{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="x-axis">Eixo X</Label>
                <Input
                  id="x-axis"
                  value={element.config.xAxis}
                  onChange={(e) =>
                    onElementUpdate(element.id, {
                      config: { ...element.config, xAxis: e.target.value },
                    })
                  }
                  placeholder="Campo para o eixo X"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="y-axis">Eixo Y</Label>
                <Input
                  id="y-axis"
                  value={element.config.yAxis}
                  onChange={(e) =>
                    onElementUpdate(element.id, {
                      config: { ...element.config, yAxis: e.target.value },
                    })
                  }
                  placeholder="Campo para o eixo Y"
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {element.type === "text" && (
            <div>
              <Label htmlFor="text-content">Conteúdo</Label>
              <textarea
                id="text-content"
                value={element.config.content}
                onChange={(e) =>
                  onElementUpdate(element.id, {
                    config: { ...element.config, content: e.target.value },
                  })
                }
                placeholder="Digite o conteúdo do texto"
                className="w-full min-h-[100px] p-2 border rounded-md mt-1"
              />
            </div>
          )}

          {element.type === "image" && (
            <div>
              <Label htmlFor="image-url">URL da Imagem</Label>
              <Input
                id="image-url"
                value={element.config.url}
                onChange={(e) =>
                  onElementUpdate(element.id, {
                    config: { ...element.config, url: e.target.value },
                  })
                }
                placeholder="https://exemplo.com/imagem.jpg"
                className="mt-1"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 mt-4">
            <div>
              <Label htmlFor="element-width">Largura</Label>
              <Select
                value={element.size.width.toString()}
                onValueChange={(value) =>
                  onElementUpdate(element.id, {
                    size: { ...element.size, width: parseInt(value) },
                  })
                }
              >
                <SelectTrigger id="element-width" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((width) => (
                    <SelectItem key={width} value={width.toString()}>
                      {width}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="element-height">Altura</Label>
              <Select
                value={element.size.height.toString()}
                onValueChange={(value) =>
                  onElementUpdate(element.id, {
                    size: { ...element.size, height: parseInt(value) },
                  })
                }
              >
                <SelectTrigger id="element-height" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((height) => (
                    <SelectItem key={height} value={height.toString()}>
                      {height}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-white border rounded-md",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-medium">Área de Design do Relatório</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Arraste e solte elementos para criar seu relatório</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Elemento
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleAddElement("table")}>
                <Table className="h-4 w-4 mr-2" />
                Tabela
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddElement("chart")}>
                <BarChart className="h-4 w-4 mr-2" />
                Gráfico
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddElement("text")}>
                <span className="mr-2 text-lg">T</span>
                Texto
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddElement("image")}>
                <span className="mr-2 text-lg">🖼️</span>
                Imagem
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="border rounded-md flex">
            {LAYOUT_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant={layout === option.value ? "default" : "ghost"}
                size="sm"
                className="h-9 px-3 rounded-none first:rounded-l-md last:rounded-r-md"
                onClick={() => handleLayoutChange(option.value)}
              >
                {option.icon}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div
          className="flex-1 p-6 overflow-auto grid grid-cols-12 gap-4 bg-slate-50"
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          {elements.map((element) => (
            <div
              key={element.id}
              className={cn(
                "relative border rounded-md bg-white shadow-sm transition-all",
                selectedElement === element.id ? "ring-2 ring-primary" : "",
                !element.visible ? "opacity-50" : "",
                layout === "grid"
                  ? `col-span-${element.size.width} row-span-${element.size.height}`
                  : "col-span-12 mb-4",
              )}
              style={
                layout === "grid"
                  ? {
                      gridRow: `span ${element.size.height}`,
                      gridColumn: `span ${element.size.width}`,
                      order: element.position.y * 12 + element.position.x,
                    }
                  : {}
              }
              onClick={() => handleElementSelect(element.id)}
            >
              <div
                className="absolute top-0 left-0 right-0 h-6 bg-slate-100 flex items-center px-2 cursor-move rounded-t-md"
                onMouseDown={(e) => handleDragStart(e, element.id)}
              >
                <GripVertical className="h-3 w-3 text-slate-400 mr-2" />
                <span className="text-xs font-medium truncate flex-1">
                  {element.title}
                </span>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleElementVisibilityToggle(element.id);
                    }}
                  >
                    {element.visible ? (
                      <Eye className="h-3 w-3 text-slate-500" />
                    ) : (
                      <EyeOff className="h-3 w-3 text-slate-500" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleElementDuplicate(element.id);
                    }}
                  >
                    <Copy className="h-3 w-3 text-slate-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleElementRemove(element.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="p-4 pt-8">
                {element.type === "table" && (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-slate-50">
                          {element.config.columns.map(
                            (column: any, index: number) => (
                              <th
                                key={index}
                                className="border p-2 text-left text-sm font-medium"
                              >
                                {column.header || `Coluna ${index + 1}`}
                              </th>
                            ),
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {[1, 2, 3].map((row) => (
                          <tr key={row} className="border-b">
                            {element.config.columns.map(
                              (column: any, index: number) => (
                                <td key={index} className="border p-2 text-sm">
                                  Dado de exemplo
                                </td>
                              ),
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {element.type === "chart" && (
                  <div className="h-full min-h-[150px] flex items-center justify-center bg-slate-50 rounded-md">
                    {element.config.chartType === "bar" && (
                      <BarChart className="h-12 w-12 text-slate-400" />
                    )}
                    {element.config.chartType === "line" && (
                      <LineChart className="h-12 w-12 text-slate-400" />
                    )}
                    {element.config.chartType === "pie" && (
                      <PieChart className="h-12 w-12 text-slate-400" />
                    )}
                    <p className="text-sm text-slate-500 ml-2">
                      Visualização do gráfico {element.config.chartType}
                    </p>
                  </div>
                )}

                {element.type === "text" && (
                  <div className="prose max-w-none">
                    {element.config.content || (
                      <p className="text-slate-400 italic">
                        Clique para editar o texto
                      </p>
                    )}
                  </div>
                )}

                {element.type === "image" && (
                  <div className="h-full min-h-[150px] flex items-center justify-center bg-slate-50 rounded-md">
                    {element.config.url ? (
                      <img
                        src={element.config.url}
                        alt="Imagem do relatório"
                        className="max-w-full max-h-[200px] object-contain"
                      />
                    ) : (
                      <div className="text-center text-slate-400">
                        <span className="text-3xl">🖼️</span>
                        <p className="text-sm mt-2">Imagem não configurada</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {elements.length === 0 && (
            <div className="col-span-12 flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-md p-6 text-center">
              <div className="bg-slate-100 p-4 rounded-full mb-4">
                <Plus className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Relatório Vazio</h3>
              <p className="text-slate-500 mb-4 max-w-md">
                Adicione elementos ao seu relatório usando o botão "Adicionar
                Elemento" acima
              </p>
              <Button onClick={() => handleAddElement("table")}>
                <Plus className="h-4 w-4 mr-2" /> Adicionar Tabela
              </Button>
            </div>
          )}
        </div>

        {selectedElement && (
          <div className="w-80 border-l overflow-y-auto p-4 bg-slate-50">
            <Tabs defaultValue="properties">
              <TabsList className="w-full grid grid-cols-2 mb-4">
                <TabsTrigger value="properties">Propriedades</TabsTrigger>
                <TabsTrigger value="style">Estilo</TabsTrigger>
              </TabsList>
              <TabsContent value="properties">
                {renderElementConfig()}
              </TabsContent>
              <TabsContent value="style">
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div>
                      <Label htmlFor="bg-color">Cor de Fundo</Label>
                      <div className="flex items-center mt-1">
                        <div className="w-6 h-6 rounded-md bg-white border mr-2" />
                        <Input
                          id="bg-color"
                          value="#FFFFFF"
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="text-color">Cor do Texto</Label>
                      <div className="flex items-center mt-1">
                        <div className="w-6 h-6 rounded-md bg-slate-900 mr-2" />
                        <Input
                          id="text-color"
                          value="#0F172A"
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="border-style">Estilo da Borda</Label>
                      <Select defaultValue="solid">
                        <SelectTrigger id="border-style" className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Nenhuma</SelectItem>
                          <SelectItem value="solid">Sólida</SelectItem>
                          <SelectItem value="dashed">Tracejada</SelectItem>
                          <SelectItem value="dotted">Pontilhada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="padding">Espaçamento Interno</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger id="padding" className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Pequeno</SelectItem>
                          <SelectItem value="medium">Médio</SelectItem>
                          <SelectItem value="large">Grande</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportCanvas;
