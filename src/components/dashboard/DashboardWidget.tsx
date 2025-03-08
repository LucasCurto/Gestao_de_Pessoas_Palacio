import React, { useState, useEffect } from "react";
import { useCompany } from "@/context/CompanyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChart,
  PieChart,
  LineChart,
  Table,
  FileText,
  MoreVertical,
  Download,
  Maximize2,
  RefreshCw,
  Settings,
} from "lucide-react";

interface DashboardWidgetProps {
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
  className?: string;
  onRefresh?: () => void;
  onSettings?: () => void;
  onMaximize?: () => void;
  onExport?: (format: string) => void;
  isLoading?: boolean;
  customData?: any;
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  id,
  title,
  type,
  chartType = "bar",
  dataSource,
  filters = [],
  className = "",
  onRefresh,
  onSettings,
  onMaximize,
  onExport,
  isLoading: propIsLoading,
  customData,
}) => {
  const { currentCompany } = useCompany();
  const [isLoading, setIsLoading] = useState(propIsLoading || false);
  const [data, setData] = useState<any>(customData || null);

  // Simular carregamento de dados quando a empresa mudar ou quando customData mudar
  useEffect(() => {
    loadData();
  }, [currentCompany.id, customData]);

  // Atualizar o estado de carregamento quando a prop mudar
  useEffect(() => {
    if (propIsLoading !== undefined) {
      setIsLoading(propIsLoading);
    }
  }, [propIsLoading]);

  const loadData = () => {
    setIsLoading(true);

    // Se temos dados personalizados, usamos eles
    if (customData) {
      setData(customData);
      setIsLoading(false);
      return;
    }

    // Simulação de carregamento de dados
    setTimeout(() => {
      // Dados de exemplo baseados no tipo de widget
      let mockData;

      if (type === "chart") {
        if (chartType === "bar") {
          mockData = {
            labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
            datasets: [
              {
                label: "Valores",
                data: [65, 59, 80, 81, 56, 55],
              },
            ],
          };
        } else if (chartType === "line") {
          mockData = {
            labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
            datasets: [
              {
                label: "Tendência",
                data: [28, 48, 40, 19, 86, 27],
              },
            ],
          };
        } else if (chartType === "pie") {
          mockData = {
            labels: ["Categoria A", "Categoria B", "Categoria C"],
            datasets: [
              {
                data: [300, 50, 100],
              },
            ],
          };
        }
      } else if (type === "table") {
        mockData = {
          headers: ["Nome", "Valor", "Status"],
          rows: [
            ["Item 1", "€1,200", "Ativo"],
            ["Item 2", "€850", "Pendente"],
            ["Item 3", "€2,300", "Ativo"],
            ["Item 4", "€750", "Inativo"],
          ],
        };
      } else if (type === "metric") {
        mockData = {
          value: 12500,
          unit: "€",
          change: 5.2,
          trend: "up",
        };
      }

      setData(mockData);
      setIsLoading(false);
    }, 1000);
  };

  const handleRefresh = () => {
    loadData();
    if (onRefresh) onRefresh();
  };

  const getWidgetIcon = () => {
    if (type === "chart") {
      switch (chartType) {
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

    if (type === "table") {
      return <Table className="h-5 w-5 text-amber-500" />;
    }

    if (type === "metric") {
      return <FileText className="h-5 w-5 text-red-500" />;
    }

    return <FileText className="h-5 w-5 text-gray-500" />;
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="p-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          {getWidgetIcon()}
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Opções do Widget</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onMaximize && onMaximize()}>
                <Maximize2 className="h-4 w-4 mr-2" />
                Maximizar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSettings && onSettings()}>
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onExport && onExport("image")}>
                <Download className="h-4 w-4 mr-2" />
                Exportar como Imagem
              </DropdownMenuItem>
              {type === "table" && (
                <DropdownMenuItem onClick={() => onExport && onExport("csv")}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar como CSV
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : data ? (
          <div className="h-[200px] flex items-center justify-center">
            {type === "chart" ? (
              <div className="text-center text-gray-400">
                {chartType === "bar" ? (
                  <BarChart className="h-16 w-16 mx-auto mb-2 text-gray-300" />
                ) : chartType === "line" ? (
                  <LineChart className="h-16 w-16 mx-auto mb-2 text-gray-300" />
                ) : (
                  <PieChart className="h-16 w-16 mx-auto mb-2 text-gray-300" />
                )}
                <p className="text-sm">Visualização de gráfico {chartType}</p>
                <p className="text-xs mt-1">Fonte de dados: {dataSource}</p>
              </div>
            ) : type === "table" ? (
              <div className="text-center text-gray-400">
                <Table className="h-16 w-16 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Tabela de dados</p>
                <p className="text-xs mt-1">Fonte de dados: {dataSource}</p>
              </div>
            ) : type === "metric" ? (
              <div className="text-center">
                <p className="text-3xl font-bold">
                  {data.unit}
                  {data.value.toLocaleString()}
                </p>
                <div className="flex items-center justify-center mt-2">
                  {data.trend === "up" ? (
                    <Badge className="bg-green-100 text-green-800">
                      +{data.change}%
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800">
                      -{data.change}%
                    </Badge>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[200px] text-gray-400">
            <p>Sem dados disponíveis</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardWidget;
