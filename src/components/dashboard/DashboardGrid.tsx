import React, { useState, useEffect } from "react";
import { useDateRange } from "@/context/DateRangeContext";
import { useCompany } from "@/context/CompanyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Edit,
} from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import DashboardWidget from "./DashboardWidget";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DashboardGrid = () => {
  const { dateRange } = useDateRange();
  const { currentCompany } = useCompany();
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isCustomizeDialogOpen, setIsCustomizeDialogOpen] = useState(false);
  const [isAddWidgetDialogOpen, setIsAddWidgetDialogOpen] = useState(false);
  const [widgets, setWidgets] = useState<any[]>([]);
  const [editingWidget, setEditingWidget] = useState<any>(null);

  // Efeito para carregar configurações salvas
  useEffect(() => {
    const loadDashboardSettings = () => {
      try {
        console.log("Tentando carregar configurações do dashboard...");
        const savedConfig = localStorage.getItem("dashboardConfig");
        const savedWidgets = localStorage.getItem("dashboardWidgets");

        console.log("Config salva no localStorage:", savedConfig);
        console.log("Widgets salvos no localStorage:", savedWidgets);

        if (savedConfig) {
          try {
            const config = JSON.parse(savedConfig);
            console.log("Aplicando configurações salvas ao dashboard:", config);

            // Aplicar configurações ao layout do dashboard
            document.documentElement.style.setProperty(
              "--dashboard-density",
              config.density,
            );
            document.documentElement.style.setProperty(
              "--dashboard-theme",
              config.theme,
            );

            // Aplicar classes diretamente ao corpo do documento
            document.body.classList.remove(
              "dashboard-theme-default",
              "dashboard-theme-dark",
              "dashboard-theme-light",
              "dashboard-theme-colorful",
            );
            document.body.classList.add(`dashboard-theme-${config.theme}`);

            document.body.classList.remove(
              "dashboard-density-compact",
              "dashboard-density-comfortable",
              "dashboard-density-spacious",
            );
            document.body.classList.add(`dashboard-density-${config.density}`);

            // Aplicar layout como atributo de dados no body
            document.body.setAttribute("data-layout", config.layout);

            // Aplicar estilos inline para garantir que as mudanças sejam aplicadas
            if (config.theme === "dark") {
              document.body.style.backgroundColor = "#1f2937";
              document.body.style.color = "white";
            } else if (config.theme === "light") {
              document.body.style.backgroundColor = "#ffffff";
              document.body.style.color = "#1f2937";
            } else if (config.theme === "colorful") {
              document.body.style.background =
                "linear-gradient(to bottom right, #f0f9ff, #f5f3ff)";
            }

            // Forçar atualização do estado para re-renderizar componentes
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 100);
          } catch (e) {
            console.error("Erro ao carregar configurações do dashboard:", e);
          }
        }

        if (savedWidgets) {
          try {
            const widgetsConfig = JSON.parse(savedWidgets);
            console.log(
              "Aplicando widgets salvos ao dashboard:",
              widgetsConfig,
            );
            // Filtrar apenas os widgets ativos
            const activeWidgets = widgetsConfig.filter((w) => w.enabled);
            setWidgets(activeWidgets);
          } catch (e) {
            console.error("Erro ao carregar widgets do dashboard:", e);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      }
    };

    // Carregar configurações iniciais
    loadDashboardSettings();

    // Adicionar event listener para detectar mudanças no localStorage
    const handleStorageChange = (e) => {
      if (e.key === "dashboardConfig" || e.key === "dashboardWidgets") {
        console.log("Detectada mudança nas configurações do dashboard");
        loadDashboardSettings();
        window.location.reload(); // Forçar recarregamento da página para aplicar mudanças
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Criar um evento personalizado para forçar atualização
    const handleCustomEvent = () => {
      console.log("Evento personalizado detectado, recarregando página");
      window.location.reload();
    };

    window.addEventListener("dashboard-config-changed", handleCustomEvent);

    // Verificar mudanças a cada 1 segundo (fallback para mesma aba)
    const interval = setInterval(loadDashboardSettings, 1000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("dashboard-config-changed", handleCustomEvent);
      clearInterval(interval);
    };
  }, []);

  // Efeito para carregar dados com base no período selecionado
  useEffect(() => {
    if (!dateRange?.from || !dateRange?.to) return;

    const fromDate = format(dateRange.from, "yyyy-MM-dd");
    const toDate = format(dateRange.to, "yyyy-MM-dd");

    console.log(`Carregando dados para o período: ${fromDate} até ${toDate}`);
    setIsLoading(true);

    // Simulação de carregamento de dados com base no período
    setTimeout(() => {
      // Simulação de dados que mudam com base no período selecionado
      const monthDiff =
        dateRange.to.getMonth() -
        dateRange.from.getMonth() +
        12 * (dateRange.to.getFullYear() - dateRange.from.getFullYear());

      // Quanto maior o período, maiores os valores (apenas para simulação)
      const multiplier = 1 + monthDiff * 0.1;

      setDashboardData({
        salesData: {
          labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
          datasets: [
            {
              label: "Vendas",
              data: [65, 59, 80, 81, 56, 55].map((val) =>
                Math.round(val * multiplier),
              ),
            },
          ],
        },
        revenueData: {
          labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
          datasets: [
            {
              label: "Receita",
              data: [28, 48, 40, 19, 86, 27].map((val) =>
                Math.round(val * multiplier),
              ),
            },
          ],
        },
        expenseData: {
          labels: ["Salários", "Marketing", "Operações"],
          datasets: [
            {
              data: [300, 50, 100].map((val) => Math.round(val * multiplier)),
            },
          ],
        },
        employeeData: {
          headers: ["Nome", "Departamento", "Status"],
          rows: [
            ["Ana Silva", "RH", "Ativo"],
            ["João Santos", "Financeiro", "Ativo"],
            ["Maria Costa", "TI", "Ativo"],
            ["Pedro Oliveira", "Vendas", "Inativo"],
          ],
        },
        metrics: {
          totalRevenue: Math.round(12500 * multiplier),
          growth: 5.2 + monthDiff * 0.3,
          customers: Math.round(150 * (1 + monthDiff * 0.05)),
          averageOrder: Math.round(85 * multiplier),
        },
      });
      setIsLoading(false);
    }, 1000);
  }, [dateRange, currentCompany.id]);

  // Formatar o período para exibição
  const formattedDateRange =
    dateRange?.from && dateRange?.to
      ? `${format(dateRange.from, "dd/MM/yyyy", { locale: pt })} - ${format(dateRange.to, "dd/MM/yyyy", { locale: pt })}`
      : "";

  // Função para abrir o diálogo de edição de widget
  const handleEditWidget = (widget: any) => {
    setEditingWidget(widget);
    setIsCustomizeDialogOpen(true);
  };

  // Função para adicionar um novo widget
  const handleAddWidget = (widgetType: string) => {
    const newWidget = {
      id: `widget-${Date.now()}`,
      title: "Novo Widget",
      type: widgetType === "metric" ? "metric" : "chart",
      chartType:
        widgetType === "bar" ? "bar" : widgetType === "line" ? "line" : "pie",
      dataSource: "Sistema",
    };
    setWidgets([...widgets, newWidget]);
    setIsAddWidgetDialogOpen(false);
  };

  // Função para salvar as alterações de um widget
  const handleSaveWidgetChanges = () => {
    if (!editingWidget) return;

    setWidgets(
      widgets.map((widget) =>
        widget.id === editingWidget.id ? editingWidget : widget,
      ),
    );

    setIsCustomizeDialogOpen(false);
    setEditingWidget(null);
  };

  // Função para remover um widget
  const handleRemoveWidget = (widgetId: string) => {
    setWidgets(widgets.filter((widget) => widget.id !== widgetId));
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Controls */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-gray-500">
            Visualize e personalize seus indicadores de desempenho
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </Button>
        </div>
      </div>

      {/* Period Display */}
      {formattedDateRange && (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium">
            Dados do período:{" "}
            <span className="text-blue-600">{formattedDateRange}</span>
          </h2>
          <p className="text-sm text-gray-500">
            Os widgets abaixo refletem as informações deste período selecionado.
          </p>
        </div>
      )}

      {/* Dashboard Grid */}
      <div
        className={`dashboard-grid gap-6 ${(() => {
          // Aplicar layout com base nas configurações salvas
          const savedConfig = localStorage.getItem("dashboardConfig");
          if (savedConfig) {
            try {
              const config = JSON.parse(savedConfig);
              // Aplicar layout como atributo de dados no body
              document.body.setAttribute("data-layout", config.layout);

              switch (config.layout) {
                case "columns":
                  return "flex flex-col";
                case "masonry":
                  return "columns-1 md:columns-2 lg:columns-3 space-y-6";
                case "grid":
                default:
                  return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
              }
            } catch (e) {
              console.error("Erro ao aplicar layout:", e);
            }
          }
          return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
        })()}`}
        id="dashboard-grid"
        key={`dashboard-grid-${Date.now()}`} // Forçar re-renderização com key dinâmica
      >
        {/* Default Widgets */}
        <DashboardWidget
          id="sales-chart"
          title="Vendas Mensais"
          type="chart"
          chartType="bar"
          dataSource="Sistema de Vendas"
          className="col-span-1 md:col-span-2"
          isLoading={isLoading}
          customData={dashboardData?.salesData}
          onSettings={() =>
            handleEditWidget({
              id: "sales-chart",
              title: "Vendas Mensais",
              type: "chart",
              chartType: "bar",
              dataSource: "Sistema de Vendas",
            })
          }
          onDelete={() => handleRemoveWidget("sales-chart")}
        />

        {/* Revenue Metric */}
        <DashboardWidget
          id="revenue-metric"
          title="Receita Total"
          type="metric"
          dataSource="Sistema Financeiro"
          isLoading={isLoading}
          customData={
            dashboardData?.metrics
              ? {
                  value: dashboardData.metrics.totalRevenue,
                  unit: "€",
                  change: dashboardData.metrics.growth,
                  trend: "up",
                }
              : null
          }
          onSettings={() =>
            handleEditWidget({
              id: "revenue-metric",
              title: "Receita Total",
              type: "metric",
              dataSource: "Sistema Financeiro",
            })
          }
          onDelete={() => handleRemoveWidget("revenue-metric")}
        />

        {/* Expense Distribution */}
        <DashboardWidget
          id="expense-chart"
          title="Distribuição de Despesas"
          type="chart"
          chartType="pie"
          dataSource="Sistema Financeiro"
          isLoading={isLoading}
          customData={dashboardData?.expenseData}
          onSettings={() =>
            handleEditWidget({
              id: "expense-chart",
              title: "Distribuição de Despesas",
              type: "chart",
              chartType: "pie",
              dataSource: "Sistema Financeiro",
            })
          }
          onDelete={() => handleRemoveWidget("expense-chart")}
        />

        {/* Revenue Trend */}
        <DashboardWidget
          id="revenue-trend"
          title="Tendência de Receita"
          type="chart"
          chartType="line"
          dataSource="Sistema Financeiro"
          isLoading={isLoading}
          customData={dashboardData?.revenueData}
          onSettings={() =>
            handleEditWidget({
              id: "revenue-trend",
              title: "Tendência de Receita",
              type: "chart",
              chartType: "line",
              dataSource: "Sistema Financeiro",
            })
          }
          onDelete={() => handleRemoveWidget("revenue-trend")}
        />

        {/* Customer Metric */}
        <DashboardWidget
          id="customer-metric"
          title="Total de Clientes"
          type="metric"
          dataSource="CRM"
          isLoading={isLoading}
          customData={
            dashboardData?.metrics
              ? {
                  value: dashboardData.metrics.customers,
                  unit: "",
                  change: dashboardData.metrics.growth - 1.2,
                  trend: "up",
                }
              : null
          }
          onSettings={() =>
            handleEditWidget({
              id: "customer-metric",
              title: "Total de Clientes",
              type: "metric",
              dataSource: "CRM",
            })
          }
          onDelete={() => handleRemoveWidget("customer-metric")}
        />

        {/* Employee Table */}
        <DashboardWidget
          id="employee-table"
          title="Funcionários Ativos"
          type="table"
          dataSource="Sistema de RH"
          className="col-span-1 md:col-span-2"
          isLoading={isLoading}
          customData={dashboardData?.employeeData}
          onSettings={() =>
            handleEditWidget({
              id: "employee-table",
              title: "Funcionários Ativos",
              type: "table",
              dataSource: "Sistema de RH",
            })
          }
          onDelete={() => handleRemoveWidget("employee-table")}
        />

        {/* Custom Widgets */}
        {widgets.map((widget) => (
          <DashboardWidget
            key={widget.id}
            id={widget.id}
            title={widget.title}
            type={widget.type}
            chartType={widget.chartType}
            dataSource={widget.dataSource}
            isLoading={isLoading}
            onSettings={() => handleEditWidget(widget)}
            onDelete={() => handleRemoveWidget(widget.id)}
          />
        ))}
      </div>

      {/* Customize Dashboard Dialog */}
      <Dialog
        open={isCustomizeDialogOpen}
        onOpenChange={setIsCustomizeDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingWidget ? "Editar Widget" : "Personalizar Dashboard"}
            </DialogTitle>
            <DialogDescription>
              {editingWidget
                ? "Modifique as configurações deste widget"
                : "Personalize a aparência e layout do seu dashboard"}
            </DialogDescription>
          </DialogHeader>

          {editingWidget ? (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="widget-title">Título do Widget</Label>
                <Input
                  id="widget-title"
                  value={editingWidget.title}
                  onChange={(e) =>
                    setEditingWidget({
                      ...editingWidget,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              {editingWidget.type === "chart" && (
                <div className="grid gap-2">
                  <Label htmlFor="chart-type">Tipo de Gráfico</Label>
                  <Select
                    value={editingWidget.chartType}
                    onValueChange={(value) =>
                      setEditingWidget({ ...editingWidget, chartType: value })
                    }
                  >
                    <SelectTrigger id="chart-type">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bar">Barras</SelectItem>
                      <SelectItem value="line">Linha</SelectItem>
                      <SelectItem value="pie">Pizza</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="data-source">Fonte de Dados</Label>
                <Input
                  id="data-source"
                  value={editingWidget.dataSource}
                  onChange={(e) =>
                    setEditingWidget({
                      ...editingWidget,
                      dataSource: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="widget-size">Tamanho</Label>
                <Select
                  value={editingWidget.className || "col-span-1"}
                  onValueChange={(value) =>
                    setEditingWidget({ ...editingWidget, className: value })
                  }
                >
                  <SelectTrigger id="widget-size">
                    <SelectValue placeholder="Selecione o tamanho" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="col-span-1">Pequeno</SelectItem>
                    <SelectItem value="col-span-1 md:col-span-2">
                      Médio
                    </SelectItem>
                    <SelectItem value="col-span-1 md:col-span-3">
                      Grande
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Layout do Dashboard</Label>
                <Select defaultValue="grid">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o layout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grade</SelectItem>
                    <SelectItem value="columns">Colunas</SelectItem>
                    <SelectItem value="masonry">Mosaico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Tema de Cores</Label>
                <Select defaultValue="default">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Padrão</SelectItem>
                    <SelectItem value="dark">Escuro</SelectItem>
                    <SelectItem value="light">Claro</SelectItem>
                    <SelectItem value="colorful">Colorido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Densidade</Label>
                <Select defaultValue="comfortable">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a densidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compacta</SelectItem>
                    <SelectItem value="comfortable">Confortável</SelectItem>
                    <SelectItem value="spacious">Espaçosa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCustomizeDialogOpen(false);
                setEditingWidget(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={
                editingWidget
                  ? handleSaveWidgetChanges
                  : () => setIsCustomizeDialogOpen(false)
              }
            >
              Salvar
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
              Escolha o tipo de widget que deseja adicionar ao seu dashboard
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={() => handleAddWidget("metric")}
            >
              <FileText className="h-8 w-8 text-blue-500" />
              <span>Métrica</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={() => handleAddWidget("bar")}
            >
              <BarChart className="h-8 w-8 text-green-500" />
              <span>Gráfico de Barras</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={() => handleAddWidget("line")}
            >
              <LineChart className="h-8 w-8 text-purple-500" />
              <span>Gráfico de Linha</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={() => handleAddWidget("pie")}
            >
              <PieChart className="h-8 w-8 text-amber-500" />
              <span>Gráfico de Pizza</span>
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
