import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LayoutGrid,
  Settings,
  BarChart,
  PieChart,
  LineChart,
  Table,
  FileText,
  Save,
  Plus,
  Trash2,
  Edit,
} from "lucide-react";
import DashboardCustomizer from "@/components/dashboard/DashboardCustomizer";
import WidgetEditor from "@/components/dashboard/WidgetEditor";

const DashboardSettings = () => {
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isWidgetEditorOpen, setIsWidgetEditorOpen] = useState(false);
  const [currentWidget, setCurrentWidget] = useState(null);
  const [dashboardConfig, setDashboardConfig] = useState({
    layout: "grid",
    theme: "default",
    density: "comfortable",
    refreshInterval: "0",
  });
  const [defaultWidgets, setDefaultWidgets] = useState([
    {
      id: "sales-chart",
      title: "Vendas Mensais",
      type: "chart",
      chartType: "bar",
      dataSource: "Sistema de Vendas",
      enabled: true,
    },
    {
      id: "revenue-metric",
      title: "Receita Total",
      type: "metric",
      dataSource: "Sistema Financeiro",
      enabled: true,
    },
    {
      id: "expense-chart",
      title: "Distribuição de Despesas",
      type: "chart",
      chartType: "pie",
      dataSource: "Sistema Financeiro",
      enabled: true,
    },
    {
      id: "revenue-trend",
      title: "Tendência de Receita",
      type: "chart",
      chartType: "line",
      dataSource: "Sistema Financeiro",
      enabled: true,
    },
    {
      id: "employee-table",
      title: "Funcionários Ativos",
      type: "table",
      dataSource: "Sistema de RH",
      enabled: true,
    },
  ]);

  const handleOpenCustomizer = () => {
    setIsCustomizerOpen(true);
  };

  const handleSaveCustomizer = (config) => {
    setDashboardConfig(config);
    setIsCustomizerOpen(false);
  };

  const handleOpenWidgetEditor = (widget = null) => {
    setCurrentWidget(widget);
    setIsWidgetEditorOpen(true);
  };

  const handleSaveWidget = (widget) => {
    if (currentWidget) {
      // Editar widget existente
      setDefaultWidgets(
        defaultWidgets.map((w) =>
          w.id === currentWidget.id ? { ...widget, enabled: w.enabled } : w,
        ),
      );
    } else {
      // Adicionar novo widget
      setDefaultWidgets([...defaultWidgets, { ...widget, enabled: true }]);
    }
    setIsWidgetEditorOpen(false);
    setCurrentWidget(null);
  };

  const toggleWidgetEnabled = (id) => {
    setDefaultWidgets(
      defaultWidgets.map((widget) =>
        widget.id === id ? { ...widget, enabled: !widget.enabled } : widget,
      ),
    );
  };

  const deleteWidget = (id) => {
    if (confirm("Tem certeza que deseja remover este widget?")) {
      setDefaultWidgets(defaultWidgets.filter((widget) => widget.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Configurações do Dashboard</h2>
          <p className="text-gray-500">
            Personalize a aparência e os widgets do seu dashboard
          </p>
        </div>
        <Button
          onClick={handleOpenCustomizer}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Settings className="mr-2 h-4 w-4" />
          Personalizar Dashboard
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Configurações Gerais</CardTitle>
          <Button
            onClick={() => {
              try {
                // Garantir que o objeto está sendo serializado corretamente
                const configString = JSON.stringify(dashboardConfig);
                console.log("Salvando configurações:", configString);

                // Limpar o localStorage antes de salvar
                localStorage.removeItem("dashboardConfig");

                // Salvar com um pequeno delay para garantir que o localStorage foi limpo
                setTimeout(() => {
                  localStorage.setItem("dashboardConfig", configString);

                  // Verificar se foi salvo corretamente
                  const saved = localStorage.getItem("dashboardConfig");
                  console.log("Configuração salva:", saved);

                  // Forçar atualização imediata
                  window.dispatchEvent(new Event("dashboard-config-changed"));

                  alert(
                    "Configurações gerais salvas com sucesso! A página será recarregada para aplicar as alterações.",
                  );

                  // Recarregar a página após um breve delay
                  setTimeout(() => {
                    window.location.reload();
                  }, 500);
                }, 100);
              } catch (error) {
                console.error("Erro ao salvar configurações:", error);
                alert(
                  "Erro ao salvar configurações. Verifique o console para mais detalhes.",
                );
              }
            }}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Save className="mr-2 h-4 w-4" />
            Salvar Configurações Gerais
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Layout do Dashboard</Label>
              <Select
                value={dashboardConfig.layout}
                onValueChange={(value) =>
                  setDashboardConfig({ ...dashboardConfig, layout: value })
                }
              >
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

            <div className="space-y-2">
              <Label>Tema de Cores</Label>
              <Select
                value={dashboardConfig.theme}
                onValueChange={(value) =>
                  setDashboardConfig({ ...dashboardConfig, theme: value })
                }
              >
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

            <div className="space-y-2">
              <Label>Densidade</Label>
              <Select
                value={dashboardConfig.density}
                onValueChange={(value) =>
                  setDashboardConfig({ ...dashboardConfig, density: value })
                }
              >
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

          <Separator className="my-4" />

          <div className="space-y-2">
            <Label>Atualização Automática</Label>
            <Select
              value={dashboardConfig.refreshInterval}
              onValueChange={(value) =>
                setDashboardConfig({
                  ...dashboardConfig,
                  refreshInterval: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o intervalo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Desativado</SelectItem>
                <SelectItem value="30">A cada 30 segundos</SelectItem>
                <SelectItem value="60">A cada minuto</SelectItem>
                <SelectItem value="300">A cada 5 minutos</SelectItem>
                <SelectItem value="600">A cada 10 minutos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator className="my-4" />

          <div className="space-y-4">
            <Label>Dados a Exibir no Dashboard</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-sales"
                  checked={
                    defaultWidgets.find((w) => w.id === "sales-chart")
                      ?.enabled || false
                  }
                  onCheckedChange={(checked) => {
                    setDefaultWidgets(
                      defaultWidgets.map((w) =>
                        w.id === "sales-chart" ? { ...w, enabled: checked } : w,
                      ),
                    );
                  }}
                />
                <Label htmlFor="show-sales">Vendas Mensais</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-revenue"
                  checked={
                    defaultWidgets.find((w) => w.id === "revenue-metric")
                      ?.enabled || false
                  }
                  onCheckedChange={(checked) => {
                    setDefaultWidgets(
                      defaultWidgets.map((w) =>
                        w.id === "revenue-metric"
                          ? { ...w, enabled: checked }
                          : w,
                      ),
                    );
                  }}
                />
                <Label htmlFor="show-revenue">Receita Total</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-expenses"
                  checked={
                    defaultWidgets.find((w) => w.id === "expense-chart")
                      ?.enabled || false
                  }
                  onCheckedChange={(checked) => {
                    setDefaultWidgets(
                      defaultWidgets.map((w) =>
                        w.id === "expense-chart"
                          ? { ...w, enabled: checked }
                          : w,
                      ),
                    );
                  }}
                />
                <Label htmlFor="show-expenses">Despesas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-customers"
                  checked={
                    defaultWidgets.find((w) => w.id === "customer-metric")
                      ?.enabled || false
                  }
                  onCheckedChange={(checked) => {
                    setDefaultWidgets(
                      defaultWidgets.map((w) =>
                        w.id === "customer-metric"
                          ? { ...w, enabled: checked }
                          : w,
                      ),
                    );
                  }}
                />
                <Label htmlFor="show-customers">Clientes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-employees"
                  checked={
                    defaultWidgets.find((w) => w.id === "employee-table")
                      ?.enabled || false
                  }
                  onCheckedChange={(checked) => {
                    setDefaultWidgets(
                      defaultWidgets.map((w) =>
                        w.id === "employee-table"
                          ? { ...w, enabled: checked }
                          : w,
                      ),
                    );
                  }}
                />
                <Label htmlFor="show-employees">Funcionários</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-products"
                  defaultChecked={false}
                  onCheckedChange={(checked) => {
                    // Adicionar ou remover widget de produtos
                    if (
                      checked &&
                      !defaultWidgets.find((w) => w.id === "products-widget")
                    ) {
                      setDefaultWidgets([
                        ...defaultWidgets,
                        {
                          id: "products-widget",
                          title: "Produtos",
                          type: "table",
                          dataSource: "Sistema de Produtos",
                          enabled: true,
                        },
                      ]);
                    } else if (!checked) {
                      setDefaultWidgets(
                        defaultWidgets.filter(
                          (w) => w.id !== "products-widget",
                        ),
                      );
                    }
                  }}
                />
                <Label htmlFor="show-products">Produtos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-orders"
                  defaultChecked={false}
                  onCheckedChange={(checked) => {
                    // Adicionar ou remover widget de pedidos
                    if (
                      checked &&
                      !defaultWidgets.find((w) => w.id === "orders-widget")
                    ) {
                      setDefaultWidgets([
                        ...defaultWidgets,
                        {
                          id: "orders-widget",
                          title: "Pedidos",
                          type: "chart",
                          chartType: "bar",
                          dataSource: "Sistema de Pedidos",
                          enabled: true,
                        },
                      ]);
                    } else if (!checked) {
                      setDefaultWidgets(
                        defaultWidgets.filter((w) => w.id !== "orders-widget"),
                      );
                    }
                  }}
                />
                <Label htmlFor="show-orders">Pedidos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-inventory"
                  defaultChecked={false}
                  onCheckedChange={(checked) => {
                    // Adicionar ou remover widget de inventário
                    if (
                      checked &&
                      !defaultWidgets.find((w) => w.id === "inventory-widget")
                    ) {
                      setDefaultWidgets([
                        ...defaultWidgets,
                        {
                          id: "inventory-widget",
                          title: "Inventário",
                          type: "chart",
                          chartType: "pie",
                          dataSource: "Sistema de Inventário",
                          enabled: true,
                        },
                      ]);
                    } else if (!checked) {
                      setDefaultWidgets(
                        defaultWidgets.filter(
                          (w) => w.id !== "inventory-widget",
                        ),
                      );
                    }
                  }}
                />
                <Label htmlFor="show-inventory">Inventário</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Widgets do Dashboard</CardTitle>
          <Button onClick={() => handleOpenWidgetEditor()} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Widget
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {defaultWidgets.map((widget) => (
              <div
                key={widget.id}
                className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  {widget.type === "chart" ? (
                    widget.chartType === "bar" ? (
                      <BarChart className="h-5 w-5 text-blue-500" />
                    ) : widget.chartType === "line" ? (
                      <LineChart className="h-5 w-5 text-green-500" />
                    ) : (
                      <PieChart className="h-5 w-5 text-purple-500" />
                    )
                  ) : widget.type === "table" ? (
                    <Table className="h-5 w-5 text-amber-500" />
                  ) : (
                    <FileText className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium">{widget.title}</p>
                    <p className="text-sm text-gray-500">
                      {widget.type === "chart"
                        ? `Gráfico ${widget.chartType === "bar" ? "de barras" : widget.chartType === "line" ? "de linha" : "de pizza"}`
                        : widget.type === "table"
                          ? "Tabela"
                          : "Métrica"}{" "}
                      • {widget.dataSource}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 mr-4">
                    <Switch
                      checked={widget.enabled}
                      onCheckedChange={() => toggleWidgetEnabled(widget.id)}
                      id={`widget-${widget.id}`}
                    />
                    <Label
                      htmlFor={`widget-${widget.id}`}
                      className="cursor-pointer"
                    >
                      {widget.enabled ? "Ativo" : "Inativo"}
                    </Label>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenWidgetEditor(widget)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => deleteWidget(widget.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {defaultWidgets.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <LayoutGrid className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p className="font-medium">Nenhum widget configurado</p>
                <p className="text-sm mt-1">
                  Adicione widgets para personalizar seu dashboard
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => {
            try {
              // Garantir que os objetos estão sendo serializados corretamente
              const configString = JSON.stringify(dashboardConfig);
              const widgetsString = JSON.stringify(defaultWidgets);

              console.log("Salvando configurações completas:", configString);
              console.log("Salvando widgets:", widgetsString);

              // Limpar o localStorage antes de salvar
              localStorage.removeItem("dashboardConfig");
              localStorage.removeItem("dashboardWidgets");

              // Salvar com um pequeno delay para garantir que o localStorage foi limpo
              setTimeout(() => {
                localStorage.setItem("dashboardConfig", configString);
                localStorage.setItem("dashboardWidgets", widgetsString);

                // Verificar se foi salvo corretamente
                const savedConfig = localStorage.getItem("dashboardConfig");
                const savedWidgets = localStorage.getItem("dashboardWidgets");
                console.log("Configuração salva:", savedConfig);
                console.log("Widgets salvos:", savedWidgets);

                // Forçar atualização imediata
                const event = new Event("dashboard-config-changed");
                window.dispatchEvent(event);

                alert(
                  "Configurações salvas com sucesso! Você será redirecionado para o dashboard.",
                );

                // Redirecionar após um breve delay
                setTimeout(() => {
                  window.location.href = "/dashboards";
                }, 500);
              }, 100);
            } catch (error) {
              console.error("Erro ao salvar configurações:", error);
              alert(
                "Erro ao salvar configurações. Verifique o console para mais detalhes.",
              );
            }
          }}
        >
          <Save className="mr-2 h-4 w-4" />
          Salvar Configurações
        </Button>
      </div>

      {/* Customizer Dialog */}
      <DashboardCustomizer
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        onSave={handleSaveCustomizer}
        initialConfig={dashboardConfig}
      />

      {/* Widget Editor Dialog */}
      <WidgetEditor
        isOpen={isWidgetEditorOpen}
        onClose={() => setIsWidgetEditorOpen(false)}
        onSave={handleSaveWidget}
        widget={currentWidget}
      />
    </div>
  );
};

export default DashboardSettings;
