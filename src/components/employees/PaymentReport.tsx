import React, { useState, useEffect } from "react";
import { useCompany } from "@/context/CompanyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  FileText,
  Download,
  Filter,
  Calendar,
  Printer,
  Mail,
} from "lucide-react";

interface PaymentReportProps {
  companyId?: string;
  period?: string;
  department?: string;
}

interface PaymentSummary {
  id: string;
  period: string;
  department: string;
  employeeCount: number;
  totalSalaries: number;
  totalBonuses: number;
  totalAllowances: number;
  totalDeductions: number;
  totalTaxes: number;
  netTotal: number;
  companyId: string;
}

const PaymentReport: React.FC<PaymentReportProps> = ({
  companyId: propCompanyId,
  period: propPeriod,
  department: propDepartment,
}) => {
  const { currentCompany } = useCompany();
  const [period, setPeriod] = useState(propPeriod || "2023-06");
  const [department, setDepartment] = useState(propDepartment || "Todos");
  const [reportData, setReportData] = useState<PaymentSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [availablePeriods, setAvailablePeriods] = useState<string[]>([]);
  const [availableDepartments, setAvailableDepartments] = useState<string[]>(
    [],
  );

  // Dados de exemplo por empresa
  const reportsByCompany: Record<string, PaymentSummary[]> = {
    "1": [
      {
        id: "report-1-1",
        period: "2023-06",
        department: "Todos",
        employeeCount: 50,
        totalSalaries: 125000,
        totalBonuses: 18750,
        totalAllowances: 15000,
        totalDeductions: 12500,
        totalTaxes: 37500,
        netTotal: 108750,
        companyId: "1",
      },
      {
        id: "report-1-2",
        period: "2023-06",
        department: "Recursos Humanos",
        employeeCount: 8,
        totalSalaries: 20000,
        totalBonuses: 3000,
        totalAllowances: 2400,
        totalDeductions: 2000,
        totalTaxes: 6000,
        netTotal: 17400,
        companyId: "1",
      },
      {
        id: "report-1-3",
        period: "2023-06",
        department: "Financeiro",
        employeeCount: 12,
        totalSalaries: 30000,
        totalBonuses: 4500,
        totalAllowances: 3600,
        totalDeductions: 3000,
        totalTaxes: 9000,
        netTotal: 26100,
        companyId: "1",
      },
      {
        id: "report-1-4",
        period: "2023-05",
        department: "Todos",
        employeeCount: 48,
        totalSalaries: 120000,
        totalBonuses: 18000,
        totalAllowances: 14400,
        totalDeductions: 12000,
        totalTaxes: 36000,
        netTotal: 104400,
        companyId: "1",
      },
    ],
    "2": [
      {
        id: "report-2-1",
        period: "2023-06",
        department: "Todos",
        employeeCount: 20,
        totalSalaries: 64000,
        totalBonuses: 7680,
        totalAllowances: 6400,
        totalDeductions: 5120,
        totalTaxes: 19200,
        netTotal: 53760,
        companyId: "2",
      },
      {
        id: "report-2-2",
        period: "2023-06",
        department: "Vendas",
        employeeCount: 8,
        totalSalaries: 25600,
        totalBonuses: 3840,
        totalAllowances: 2560,
        totalDeductions: 2048,
        totalTaxes: 7680,
        netTotal: 22272,
        companyId: "2",
      },
      {
        id: "report-2-3",
        period: "2023-05",
        department: "Todos",
        employeeCount: 18,
        totalSalaries: 57600,
        totalBonuses: 6912,
        totalAllowances: 5760,
        totalDeductions: 4608,
        totalTaxes: 17280,
        netTotal: 48384,
        companyId: "2",
      },
    ],
  };

  // Carregar dados do relatório quando a empresa, período ou departamento mudar
  useEffect(() => {
    setIsLoading(true);

    // Determinar o ID da empresa a ser usada
    const targetCompanyId = propCompanyId || currentCompany.id;

    // Obter relatórios para a empresa selecionada
    // @ts-ignore - Ignorando o erro de índice para simplificar
    const companyReports = reportsByCompany[targetCompanyId] || [];

    // Extrair períodos e departamentos disponíveis
    const periods = [...new Set(companyReports.map((report) => report.period))]
      .sort()
      .reverse();
    const departments = [
      "Todos",
      ...new Set(
        companyReports
          .filter((report) => report.department !== "Todos")
          .map((report) => report.department),
      ),
    ];

    setAvailablePeriods(periods);
    setAvailableDepartments(departments);

    // Encontrar o relatório correspondente ao período e departamento selecionados
    const selectedReport = companyReports.find(
      (report) => report.period === period && report.department === department,
    );

    // Se não encontrar o relatório exato, tentar encontrar um para "Todos" os departamentos
    const fallbackReport = companyReports.find(
      (report) => report.period === period && report.department === "Todos",
    );

    setReportData(selectedReport || fallbackReport || null);
    setIsLoading(false);
  }, [currentCompany.id, propCompanyId, period, department]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-PT", {
      style: "currency",
      currency: "EUR",
    });
  };

  const formatPeriod = (periodStr: string) => {
    const [year, month] = periodStr.split("-");
    const monthNames = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const handleExportPDF = () => {
    alert("Exportando relatório em PDF...");
    // Implementação real usaria uma biblioteca como jsPDF ou chamaria uma API
  };

  const handleExportExcel = () => {
    alert("Exportando relatório em Excel...");
    // Implementação real usaria uma biblioteca como xlsx ou chamaria uma API
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    alert("Enviando relatório por email...");
    // Implementação real abriria um modal para configurar o email ou chamaria uma API
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Relatório de Pagamentos</h2>
          <p className="text-gray-500">
            Resumo de pagamentos por período e departamento
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <FileText className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" onClick={handleExportExcel}>
            <Download className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button variant="outline" onClick={handleSendEmail}>
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Filtros do Relatório</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="period">Período</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger id="period" className="w-full">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Selecione o período" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {availablePeriods.map((p) => (
                    <SelectItem key={p} value={p}>
                      {formatPeriod(p)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger id="department" className="w-full">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Selecione o departamento" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {availableDepartments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                value={currentCompany.name}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Carregando relatório...</p>
        </div>
      ) : reportData ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                Resumo de Pagamentos - {formatPeriod(reportData.period)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Total Líquido
                    </h3>
                    <p className="text-3xl font-bold text-green-600">
                      {formatCurrency(reportData.netTotal)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      Funcionários
                    </h3>
                    <p className="text-3xl font-bold">
                      {reportData.employeeCount}
                    </p>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="bg-gray-50 p-4 rounded-lg h-full">
                    <h3 className="text-sm font-medium mb-4">
                      Distribuição de Pagamentos
                    </h3>
                    <div className="flex items-center justify-center h-[200px]">
                      <BarChart className="h-32 w-32 text-gray-300" />
                      <p className="text-gray-500 ml-4">
                        Gráfico de distribuição de pagamentos por categoria
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detalhamento de Valores</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="text-right">% do Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Salários Base</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(reportData.totalSalaries)}
                    </TableCell>
                    <TableCell className="text-right">
                      {(
                        (reportData.totalSalaries /
                          (reportData.totalSalaries +
                            reportData.totalBonuses +
                            reportData.totalAllowances)) *
                        100
                      ).toFixed(1)}
                      %
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Bónus</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(reportData.totalBonuses)}
                    </TableCell>
                    <TableCell className="text-right">
                      {(
                        (reportData.totalBonuses /
                          (reportData.totalSalaries +
                            reportData.totalBonuses +
                            reportData.totalAllowances)) *
                        100
                      ).toFixed(1)}
                      %
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Subsídios</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(reportData.totalAllowances)}
                    </TableCell>
                    <TableCell className="text-right">
                      {(
                        (reportData.totalAllowances /
                          (reportData.totalSalaries +
                            reportData.totalBonuses +
                            reportData.totalAllowances)) *
                        100
                      ).toFixed(1)}
                      %
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total Bruto</TableCell>
                    <TableCell className="text-right font-bold">
                      {formatCurrency(
                        reportData.totalSalaries +
                          reportData.totalBonuses +
                          reportData.totalAllowances,
                      )}
                    </TableCell>
                    <TableCell className="text-right">100%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-red-600">
                      Deduções
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      -{formatCurrency(reportData.totalDeductions)}
                    </TableCell>
                    <TableCell className="text-right">
                      {(
                        (reportData.totalDeductions /
                          (reportData.totalSalaries +
                            reportData.totalBonuses +
                            reportData.totalAllowances)) *
                        100
                      ).toFixed(1)}
                      %
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-red-600">
                      Impostos
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      -{formatCurrency(reportData.totalTaxes)}
                    </TableCell>
                    <TableCell className="text-right">
                      {(
                        (reportData.totalTaxes /
                          (reportData.totalSalaries +
                            reportData.totalBonuses +
                            reportData.totalAllowances)) *
                        100
                      ).toFixed(1)}
                      %
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-gray-50">
                    <TableCell className="font-bold">Total Líquido</TableCell>
                    <TableCell className="text-right font-bold text-green-600">
                      {formatCurrency(reportData.netTotal)}
                    </TableCell>
                    <TableCell className="text-right">
                      {(
                        (reportData.netTotal /
                          (reportData.totalSalaries +
                            reportData.totalBonuses +
                            reportData.totalAllowances)) *
                        100
                      ).toFixed(1)}
                      %
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 mb-2">
              Nenhum dado disponível para o período e departamento selecionados.
            </p>
            <p className="text-sm text-gray-400">
              Tente selecionar outro período ou departamento.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentReport;
