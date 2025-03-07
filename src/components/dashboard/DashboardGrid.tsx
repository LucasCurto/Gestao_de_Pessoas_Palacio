import React, { useState, useEffect } from "react";
import { useCompany } from "@/context/CompanyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutGrid,
  Plus,
  MoreVertical,
  Trash2,
  Settings,
  MoveHorizontal,
  MoveVertical,
  Maximize2,
  Minimize2,
  BarChart,
  PieChart,
  LineChart,
  Table,
  FileText,
  Download,
  Save,
} from "lucide-react";

interface DashboardWidget {
  id: string;
  title: string;
  type: "chart" | "table" | "metric" | "list";
  chartType?: "bar" | "line" | "pie" | "area";
  dataSource: string;
  filters?: {
    field: string;
    operator: string;
    value: string;
  }[];
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  companyId?: string;
  isGlobal?: boolean;
}

interface Dashboard {
  id: string;
  name: string;
  description?: string;
  widgets: DashboardWidget[];
  companyId?: string;
  isGlobal?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DashboardGrid: React.FC = () => {
  const { currentCompany } = useCompany();
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [activeDashboard, setActiveDashboard] = useState<Dashboard | null>(
    null,
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddWidgetDialogOpen, setIsAddWidgetDialogOpen] = useState(false);
  const [isCreateDashboardDialogOpen, setIsCreateDashboardDialogOpen] =
    useState(false);
  const [newDashboardName, setNewDashboardName] = useState("");
  const [newDashboardDescription, setNewDashboardDescription] = useState("");
  const [isGlobalDashboard, setIsGlobalDashboard] = useState(false);

  // Dados de exemplo por empresa
  const dashboardsByCompany: Record<string, Dashboard[]> = {
    "1": [
      {
        id: "dashboard-1",
        name: "Dashboard Principal - RH",
        description: "Visão geral de métricas de RH e pagamentos",
        widgets: [
          {
            id: "widget-1",
            title: "Distribuição de Salários",
            type: "chart",
            chartType: "bar",
            dataSource: "salary_distribution",
            layout: { x: 0, y: 0, w: 6, h: 4 },
            companyId: "1",
          },
          {
            id: "widget-2",
            title: "Pagamentos Pendentes",
            type: "table",
            dataSource: "pending_payments",
            layout: { x: 6, y: 0, w: 6, h: 4 },
            companyId: "1",
          },
          {
            id: "widget-3",
            title: "Total de Funcionários",
            type: "metric",
            dataSource: "employee_count",
            layout: { x: 0, y: 4, w: 3, h: 2 },
            companyId: "1",
          },
          {
            id: "widget-4",
            title: "Folha de Pagamento Mensal",
            type: "metric",
            dataSource: "monthly_payroll",
            layout: { x: 3, y: 4, w: 3, h: 2 },
            companyId: "1",
          },
          {
            id: "widget-5",
            title: "Taxa de Rotatividade",
            type: "chart",
            chartType: "line",
            dataSource: "turnover_rate",
            layout: { x: 6, y: 4, w: 6, h: 4 },
            companyId: "1",
          },
        ],
        companyId: "1",
        isGlobal: false,
        createdAt: new Date("2023-05-01"),
        updatedAt: new Date("2023-05-15"),
      },
    ],
    "2": [
      {
        id: "dashboard-2",
        name: "Dashboard de Vendas",
        description: "Métricas de desempenho da equipe de vendas",
        widgets: [
          {
            id: "widget-6",
            title: "Vendas por Funcionário",
            type: "chart",
            chartType: "bar",
            dataSource: "sales_by_employee",
            layout: { x: 0, y: 0, w: 8, h: 4 },
            companyId: "2",
          },
          {
            id: "widget-7",
            title: "Comissões Mensais",
            type: "table",
            dataSource: "monthly_commissions",
            layout: { x: 8, y: 0, w: 4, h: 4 },
            companyId: "2",
          },
          {
            id: "widget-8",
            title: "Meta vs. Realizado",
            type: "chart",
            chartType: "line",
            dataSource: "sales_target_vs_actual",
            layout: { x: 0, y: 4, w: 12, h: 4 },
            companyId: "2",
          },
        ],
        companyId: "2",
        isGlobal: false,
        createdAt: new Date("2023-04-10"),
        updatedAt: new Date("2023-05-05"),
      },
    ],
    global: [
      {
        id: "dashboard-global",
        name: "Visão Geral Corporativa",
        description: "Métricas consolidadas de todas as empresas",
        widgets: [
          {
            id: "widget-9",
            title: "Comparativo de Folha de Pagamento",
            type: "chart",
            chartType: "bar",
            dataSource: "payroll_comparison",
            layout: { x: 0, y: 0, w: 12, h: 4 },
            isGlobal: true,
          },
          {
            id: "widget-10",
            title: "Funcionários por Empresa",
            type: "chart",
            chartType: "pie",
            dataSource: "employees_by_company",
            layout: { x: 0, y: 4, w: 6, h: 4 },
            isGlobal: true,
          },
          {
            id: "widget-11",
            title: "Indicadores Financeiros",
            type: "table",
            dataSource: "financial_indicators",
            layout: { x: 6, y: 4, w: 6, h: 4 },
            isGlobal: true,
          },
        ],
        isGlobal: true,
        createdAt: new Date("2023-03-15"),
        updatedAt: new Date("2023-05-10"),
      },
    ],
  };

  // Carregar dashboards quando a empresa mudar
  useEffect(() => {
    // Obter dashboards específicos da empresa
    // @ts-ignore - Ignorando o erro de índice para simplificar
    const companyDashboards = dashboardsByCompany[currentCompany.id] || [];

    // Obter dashboards globais
    const globalDashboards = dashboardsByCompany["global"] || [];

    // Combinar dashboards específicos da empresa com dashboards globais
    const allDashboards = [...companyDashboards, ...globalDashboards];

    setDashboards(allDashboards);
    setActiveDashboard(allDashboards.length > 0 ? allDashboards[0] : null);
  }, [currentCompany.id]);

  const handleCreateDashboard = () => {
    const newDashboard: Dashboard = {
      id: `dashboard-${Date.now()}`,
      name: newDashboardName,
      description: newDashboardDescription,
      widgets: [],
      companyId: isGlobalDashboard ? undefined : currentCompany.id,
      isGlobal: isGlobalDashboard,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setDashboards([...dashboards, newDashboard]);
    setActiveDashboard(newDashboard);
    setIsCreateDashboardDialogOpen(false);
    setNewDashboardName("");
    setNewDashboardDescription("");
    setIsGlobalDashboard(false);
  };

  const handleDeleteDashboard = (dashboardId: string) => {
    if (confirm("Tem certeza que deseja excluir este dashboard?")) {
      const updatedDashboards = dashboards.filter((d) => d.id !== dashboardId);
      setDashboards(updatedDashboards);

      if (activeDashboard?.id === dashboardId) {
        setActiveDashboard(
          updatedDashboards.length > 0 ? updatedDashboards[0] : null,
        );
      }
    }
  };

  const handleAddWidget = () => {
    // Implementação simplificada - em um cenário real, isso abriria um modal de configuração
    if (!activeDashboard) return;

    const newWidget: DashboardWidget = {
      id: `widget-${Date.now()}`,
      title: "Novo Widget",
      type: "chart",
      chartType: "bar",
      dataSource: "employee_data",
      layout: { x: 0, y: 0, w: 6, h: 4 },
      companyId: activeDashboard.isGlobal ? undefined : currentCompany.id,
      isGlobal: activeDashboard.isGlobal,
    };

    const updatedDashboard = {
      ...activeDashboard,
      widgets: [...activeDashboard.widgets, newWidget],
      updatedAt: new Date(),
    };

    setActiveDashboard(updatedDashboard);
    setDashboards(
      dashboards.map((d) =>
        d.id === updatedDashboard.id ? updatedDashboard : d,
      ),
    );
    setIsAddWidgetDialogOpen(false);
  };

  const handleDeleteWidget = (widgetId: string) => {
    if (!activeDashboard) return;

    const updatedWidgets = activeDashboard.widgets.filter(
      (w) => w.id !== widgetId,
    );
    const updatedDashboard = {
      ...activeDashboard,
      widgets: updatedWidgets,
      updatedAt: new Date(),
    };

    setActiveDashboard(updatedDashboard);
    setDashboards(
      dashboards.map((d) =>
        d.id === updatedDashboard.id ? updatedDashboard : d,
      ),
    );
  };

  const handleExportDashboard = (format: "pdf" | "image") => {
    alert(`Exportando dashboard em formato ${format.toUpperCase()}...`);
    // Em uma implementação real, isso chamaria uma API ou usaria uma biblioteca para gerar o arquivo
  };

  const getWidgetIcon = (widget: DashboardWidget) => {
    if (widget.type === "chart") {
      switch (widget.chartType) {
        case "bar":
          return <BarChart className="h-5 w-5 text-blue-500" />;
        case "line":
          return <LineChart className="h-5 w-5 text-green-500" />;
        case "pie":
          return <PieChart className="h-5 w-5 text-purple-500" />;
        default:
          return <BarChart className="h-5 w-5 text-blue-500" />;
      }
    }

    if (widget.type === "table") {
      return <Table className="h-5 w-5 text-amber-500" />;
    }

    if (widget.type === "metric") {
      return <FileText className="h-5 w-5 text-red-500" />;
    }

    return <FileText className="h-5 w-5 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Dashboards</h2>
          <p className="text-gray-500">
            Visualize e gerencie seus dashboards personalizados
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditMode(!isEditMode)}>
            <Settings className="h-4 w-4 mr-2" />
            {isEditMode ? "Concluir Edição" : "Editar Dashboard"}
          </Button>
          <Button onClick={() => setIsCreateDashboardDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Dashboard
          </Button>
        </div>
      </div>

      {/* Dashboard Selector */}
      {dashboards.length > 0 && (
        <div className="flex justify-between items-center bg-white p-4 rounded-md shadow-sm">
          <div className="flex gap-4">
            {dashboards.map((dashboard) => (
              <Button
                key={dashboard.id}
                variant={
                  activeDashboard?.id === dashboard.id ? "default" : "outline"
                }
                onClick={() => setActiveDashboard(dashboard)}
                className="flex items-center gap-2"
              >
                <LayoutGrid className="h-4 w-4" />
                <span>{dashboard.name}</span>
                {dashboard.isGlobal && (
                  <Badge
                    variant="outline"
                    className="ml-1 bg-blue-50 text-blue-700 border-blue-200"
                  >
                    Global
                  </Badge>
                )}
              </Button>
            ))}
          </div>

          {activeDashboard && (
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Opções do Dashboard</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleExportDashboard("pdf")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar como PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleExportDashboard("image")}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar como Imagem
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {!activeDashboard.isGlobal && (
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDeleteDashboard(activeDashboard.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir Dashboard
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {isEditMode && (
                <Button onClick={() => setIsAddWidgetDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Widget
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Dashboard Content */}
      {activeDashboard ? (
        <div className="bg-gray-50 p-6 rounded-md min-h-[600px]">
          <div className="grid grid-cols-12 gap-4 auto-rows-[100px]">
            {activeDashboard.widgets.map((widget) => {
              // Calcular a posição e tamanho do widget na grade
              const gridColumnStart = widget.layout.x + 1;
              const gridColumnEnd = gridColumnStart + widget.layout.w;
              const gridRowStart = widget.layout.y + 1;
              const gridRowEnd = gridRowStart + widget.layout.h;

              return (
                <div
                  key={widget.id}
                  className="bg-white rounded-md shadow-sm overflow-hidden"
                  style={{
                    gridColumnStart,
                    gridColumnEnd,
                    gridRowStart,
                    gridRowEnd,
                  }}
                >
                  <div className="flex justify-between items-center p-3 border-b">
                    <div className="flex items-center gap-2">
                      {getWidgetIcon(widget)}
                      <h3 className="font-medium text-sm">{widget.title}</h3>
                    </div>
                    {isEditMode && (
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoveHorizontal className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoveVertical className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteWidget(widget.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="p-4 h-[calc(100%-48px)] flex items-center justify-center">
                    {/* Placeholder para o conteúdo do widget */}
                    <div className="text-gray-400 text-sm text-center">
                      {widget.type === "chart" ? (
                        <>
                          <BarChart className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                          <p>Gráfico: {widget.chartType}</p>
                          <p className="text-xs mt-1">
                            Fonte de dados: {widget.dataSource}
                          </p>
                        </>
                      ) : widget.type === "table" ? (
                        <>
                          <Table className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                          <p>Tabela de dados</p>
                          <p className="text-xs mt-1">
                            Fonte de dados: {widget.dataSource}
                          </p>
                        </>
                      ) : (
                        <>
                          <FileText className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                          <p>Métrica</p>
                          <p className="text-xs mt-1">
                            Fonte de dados: {widget.dataSource}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {activeDashboard.widgets.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[400px] text-gray-500">
              <LayoutGrid className="h-16 w-16 text-gray-300 mb-4" />
              <p className="font-medium">Este dashboard está vazio</p>
              <p className="text-sm mt-1">
                Adicione widgets para visualizar dados
              </p>
              {isEditMode && (
                <Button
                  className="mt-4"
                  onClick={() => setIsAddWidgetDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Widget
                </Button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[400px] bg-gray-50 rounded-md text-gray-500">
          <LayoutGrid className="h-16 w-16 text-gray-300 mb-4" />
          <p className="font-medium">Nenhum dashboard encontrado</p>
          <p className="text-sm mt-1">Crie um novo dashboard para começar</p>
          <Button
            className="mt-4"
            onClick={() => setIsCreateDashboardDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar Dashboard
          </Button>
        </div>
      )}

      {/* Create Dashboard Dialog */}
      <Dialog
        open={isCreateDashboardDialogOpen}
        onOpenChange={setIsCreateDashboardDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Dashboard</DialogTitle>
            <DialogDescription>
              Preencha as informações para criar um novo dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="dashboard-name" className="text-sm font-medium">
                Nome do Dashboard
              </label>
              <input
                id="dashboard-name"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newDashboardName}
                onChange={(e) => setNewDashboardName(e.target.value)}
                placeholder="Ex: Dashboard de RH"
              />
            </div>
            <div className="grid gap-2">
              <label
                htmlFor="dashboard-description"
                className="text-sm font-medium"
              >
                Descrição
              </label>
              <textarea
                id="dashboard-description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newDashboardDescription}
                onChange={(e) => setNewDashboardDescription(e.target.value)}
                placeholder="Descreva o propósito deste dashboard"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="global-dashboard"
                checked={isGlobalDashboard}
                onChange={(e) => setIsGlobalDashboard(e.target.checked)}
                className="h-4 w-4"
              />
              <label htmlFor="global-dashboard" className="text-sm">
                Dashboard Global (disponível para todas as empresas)
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDashboardDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateDashboard}
              disabled={!newDashboardName}
            >
              Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Widget Dialog */}
      <Dialog
        open={isAddWidgetDialogOpen}
        onOpenChange={setIsAddWidgetDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Widget</DialogTitle>
            <DialogDescription>
              Selecione o tipo de widget que deseja adicionar ao dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center gap-2"
              onClick={handleAddWidget}
            >
              <BarChart className="h-8 w-8 text-blue-500" />
              <span>Gráfico</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center gap-2"
              onClick={handleAddWidget}
            >
              <Table className="h-8 w-8 text-amber-500" />
              <span>Tabela</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center gap-2"
              onClick={handleAddWidget}
            >
              <FileText className="h-8 w-8 text-red-500" />
              <span>Métrica</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center justify-center gap-2"
              onClick={handleAddWidget}
            >
              <LineChart className="h-8 w-8 text-green-500" />
              <span>Tendência</span>
            </Button>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddWidgetDialogOpen(false)}
            >
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardGrid;
