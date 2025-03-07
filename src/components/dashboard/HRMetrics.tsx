import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { BarChart, Users, TrendingUp, DollarSign } from "lucide-react";

interface HRMetricsProps {
  metrics?: {
    turnoverRate: number;
    averageCost: number;
    salaryDistribution: {
      category: string;
      percentage: number;
      count: number;
    }[];
    employeeGrowth: number;
  };
}

const HRMetrics = ({
  metrics = {
    turnoverRate: 12.5,
    averageCost: 2850,
    salaryDistribution: [
      { category: "Administração", percentage: 35, count: 12 },
      { category: "Operações", percentage: 25, count: 8 },
      { category: "Vendas", percentage: 20, count: 7 },
      { category: "TI", percentage: 15, count: 5 },
      { category: "Outros", percentage: 5, count: 2 },
    ],
    employeeGrowth: 8.3,
  },
}: HRMetricsProps) => {
  return (
    <Card className="w-full h-full bg-white overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center justify-between">
          <span>Métricas de RH</span>
          <span className="text-sm text-muted-foreground font-normal">
            Último mês
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-blue-100 mr-3">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Taxa de Rotatividade
                </p>
                <p className="text-2xl font-bold">{metrics.turnoverRate}%</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-green-100 mr-3">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Custo Médio por Funcionário
                </p>
                <p className="text-2xl font-bold">
                  {metrics.averageCost.toLocaleString("pt-PT")} €
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-purple-100 mr-3">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Crescimento de Pessoal
                </p>
                <p className="text-2xl font-bold">+{metrics.employeeGrowth}%</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-amber-100 mr-3">
                <BarChart className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total de Departamentos
                </p>
                <p className="text-2xl font-bold">
                  {metrics.salaryDistribution.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium">
            Distribuição Salarial por Departamento
          </h4>
          <div className="space-y-2">
            {metrics.salaryDistribution.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{item.category}</span>
                  <span className="text-muted-foreground">
                    {item.count} funcionários ({item.percentage}%)
                  </span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HRMetrics;
