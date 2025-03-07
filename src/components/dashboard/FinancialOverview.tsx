import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDown,
  ArrowUp,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FinancialOverviewProps {
  totalPayroll?: number;
  previousMonthPayroll?: number;
  averageSalary?: number;
  employeeCount?: number;
  monthlyComparison?: {
    month: string;
    amount: number;
  }[];
  expenseBreakdown?: {
    category: string;
    percentage: number;
    amount: number;
  }[];
}

const FinancialOverview = ({
  totalPayroll = 125000,
  previousMonthPayroll = 120000,
  averageSalary = 2500,
  employeeCount = 50,
  monthlyComparison = [
    { month: "Jan", amount: 110000 },
    { month: "Feb", amount: 115000 },
    { month: "Mar", amount: 118000 },
    { month: "Apr", amount: 120000 },
    { month: "May", amount: 125000 },
    { month: "Jun", amount: 123000 },
  ],
  expenseBreakdown = [
    { category: "Salários Base", percentage: 65, amount: 81250 },
    { category: "Bónus", percentage: 15, amount: 18750 },
    { category: "Subsídios", percentage: 12, amount: 15000 },
    { category: "Outros", percentage: 8, amount: 10000 },
  ],
}: FinancialOverviewProps) => {
  const payrollChange = totalPayroll - previousMonthPayroll;
  const payrollChangePercentage = (payrollChange / previousMonthPayroll) * 100;
  const isPayrollIncreased = payrollChange > 0;

  // Find max value for chart scaling
  const maxAmount = Math.max(...monthlyComparison.map((item) => item.amount));

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Visão Geral Financeira
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Key Metrics */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <MetricCard
                title="Total da Folha"
                value={`€${totalPayroll.toLocaleString()}`}
                icon={<DollarSign className="h-5 w-5" />}
                change={payrollChangePercentage}
                trend={isPayrollIncreased ? "up" : "down"}
              />
              <MetricCard
                title="Salário Médio"
                value={`€${averageSalary.toLocaleString()}`}
                icon={<Users className="h-5 w-5" />}
                change={0}
                trend="neutral"
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <MetricCard
                title="Funcionários"
                value={employeeCount.toString()}
                icon={<Users className="h-5 w-5" />}
                change={0}
                trend="neutral"
                fullWidth
              />
            </div>
          </div>

          {/* Monthly Comparison Chart */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium mb-3">Comparativo Mensal</h3>
            <div className="flex items-end h-40 space-x-2">
              {monthlyComparison.map((item, index) => {
                const height = (item.amount / maxAmount) * 100;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1"
                  >
                    <div className="w-full flex justify-center items-end h-[85%]">
                      <div
                        className="w-5/6 bg-blue-500 rounded-t"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <span className="text-xs mt-1">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Expense Breakdown */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium mb-3">
              Distribuição de Despesas
            </h3>
            <div className="space-y-3">
              {expenseBreakdown.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>{item.category}</span>
                    <span className="font-medium">
                      €{item.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: number;
  trend: "up" | "down" | "neutral";
  fullWidth?: boolean;
}

const MetricCard = ({
  title,
  value,
  icon,
  change,
  trend,
  fullWidth = false,
}: MetricCardProps) => {
  return (
    <div
      className={cn("bg-gray-50 rounded-lg p-4", fullWidth ? "col-span-2" : "")}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl font-bold mt-1">{value}</p>
        </div>
        <div className="p-2 bg-white rounded-full">{icon}</div>
      </div>
      {trend !== "neutral" && (
        <div className="flex items-center mt-3">
          {trend === "up" ? (
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
          )}
          <span
            className={cn(
              "text-xs font-medium",
              trend === "up" ? "text-green-500" : "text-red-500",
            )}
          >
            {change.toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default FinancialOverview;
