import React, { useState, useEffect } from "react";
import { useCompany } from "@/context/CompanyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
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
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock,
  Download,
  Edit,
  FileText,
  Filter,
  Play,
  RefreshCw,
  Save,
  Send,
  Settings,
  Users,
  XCircle,
} from "lucide-react";

interface PaymentProcessingProps {
  companyId?: string;
}

interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  baseSalary: number;
  bankAccount: string;
  selected?: boolean;
  companyId: string;
}

interface PaymentBatch {
  id: string;
  name: string;
  period: string;
  status: "draft" | "processing" | "completed" | "error";
  employeeCount: number;
  totalAmount: number;
  createdAt: Date;
  completedAt?: Date;
  companyId: string;
}

const PaymentProcessing: React.FC<PaymentProcessingProps> = ({
  companyId: propCompanyId,
}) => {
  const { currentCompany } = useCompany();
  const [activeTab, setActiveTab] = useState("employees");
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [period, setPeriod] = useState(getCurrentPeriod());
  const [batchName, setBatchName] = useState(
    `Pagamentos ${getCurrentPeriod()}`,
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState("");
  const [recentBatches, setRecentBatches] = useState<PaymentBatch[]>([]);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("Todos");

  // Dados de exemplo por empresa
  const employeesByCompany: Record<string, Employee[]> = {
    "1": [
      {
        id: "1",
        name: "Ana Silva",
        department: "Recursos Humanos",
        position: "Gerente de RH",
        baseSalary: 2500,
        bankAccount: "PT50 1234 5678 9012 3456 7890 1",
        companyId: "1",
      },
      {
        id: "2",
        name: "João Santos",
        department: "Financeiro",
        position: "Analista Financeiro",
        baseSalary: 2200,
        bankAccount: "PT50 2345 6789 0123 4567 8901 2",
        companyId: "1",
      },
      {
        id: "3",
        name: "Maria Costa",
        department: "Tecnologia",
        position: "Desenvolvedora",
        baseSalary: 2300,
        bankAccount: "PT50 3456 7890 1234 5678 9012 3",
        companyId: "1",
      },
    ],
    "2": [
      {
        id: "4",
        name: "Pedro Oliveira",
        department: "Vendas",
        position: "Gerente de Vendas",
        baseSalary: 2800,
        bankAccount: "PT50 4567 8901 2345 6789 0123 4",
        companyId: "2",
      },
      {
        id: "5",
        name: "Sofia Martins",
        department: "Marketing",
        position: "Especialista em Marketing",
        baseSalary: 2200,
        bankAccount: "PT50 5678 9012 3456 7890 1234 5",
        companyId: "2",
      },
      {
        id: "6",
        name: "Carlos Ferreira",
        department: "Financeiro",
        position: "Diretor Financeiro",
        baseSalary: 3500,
        bankAccount: "PT50 6789 0123 4567 8901 2345 6",
        companyId: "2",
      },
    ],
  };

  const batchesByCompany: Record<string, PaymentBatch[]> = {
    "1": [
      {
        id: "batch-1-1",
        name: "Pagamentos Maio 2023",
        period: "2023-05",
        status: "completed",
        employeeCount: 50,
        totalAmount: 125000,
        createdAt: new Date("2023-05-25T10:30:00"),
        completedAt: new Date("2023-05-25T11:15:00"),
        companyId: "1",
      },
      {
        id: "batch-1-2",
        name: "Pagamentos Abril 2023",
        period: "2023-04",
        status: "completed",
        employeeCount: 48,
        totalAmount: 120000,
        createdAt: new Date("2023-04-25T09:45:00"),
        completedAt: new Date("2023-04-25T10:30:00"),
        companyId: "1",
      },
    ],
    "2": [
      {
        id: "batch-2-1",
        name: "Pagamentos Maio 2023",
        period: "2023-05",
        status: "completed",
        employeeCount: 20,
        totalAmount: 64000,
        createdAt: new Date("2023-05-26T14:20:00"),
        completedAt: new Date("2023-05-26T14:45:00"),
        companyId: "2",
      },
      {
        id: "batch-2-2",
        name: "Pagamentos Abril 2023",
        period: "2023-04",
        status: "completed",
        employeeCount: 18,
        totalAmount: 57600,
        createdAt: new Date("2023-04-26T15:10:00"),
        completedAt: new Date("2023-04-26T15:35:00"),
        companyId: "2",
      },
    ],
  };

  // Carregar funcionários e lotes de pagamento quando a empresa mudar
  useEffect(() => {
    // Determinar o ID da empresa a ser usada
    const targetCompanyId = propCompanyId || currentCompany.id;

    // Carregar funcionários da empresa
    // @ts-ignore - Ignorando o erro de índice para simplificar
    const employees = employeesByCompany[targetCompanyId] || [];
    setAllEmployees(employees);

    // Carregar lotes de pagamento da empresa
    // @ts-ignore - Ignorando o erro de índice para simplificar
    const batches = batchesByCompany[targetCompanyId] || [];
    setRecentBatches(batches);

    // Atualizar o nome do lote com o período atual
    setBatchName(`Pagamentos ${getCurrentPeriod()}`);
  }, [currentCompany.id, propCompanyId]);

  // Filtrar funcionários com base na pesquisa e departamento
  const filteredEmployees = allEmployees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      departmentFilter === "Todos" || employee.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  // Obter departamentos únicos para o filtro
  const departments = [
    "Todos",
    ...new Set(allEmployees.map((emp) => emp.department)),
  ];

  // Calcular o total do lote
  const batchTotal = selectedEmployees.reduce(
    (sum, emp) => sum + emp.baseSalary,
    0,
  );

  function getCurrentPeriod() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }

  const handleSelectAllChange = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedEmployees(filteredEmployees);
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleEmployeeSelection = (employee: Employee, checked: boolean) => {
    if (checked) {
      setSelectedEmployees((prev) => [...prev, employee]);
    } else {
      setSelectedEmployees((prev) =>
        prev.filter((emp) => emp.id !== employee.id),
      );
    }
  };

  const startProcessing = () => {
    setIsConfirmDialogOpen(false);
    setIsProcessing(true);
    setProcessingProgress(0);
    setProcessingStep("Iniciando processamento...");
    setActiveTab("processing");

    // Simulação do processamento
    const steps = [
      { progress: 10, message: "Validando dados dos funcionários..." },
      { progress: 25, message: "Calculando salários e benefícios..." },
      { progress: 40, message: "Aplicando deduções e impostos..." },
      { progress: 60, message: "Gerando recibos de pagamento..." },
      { progress: 80, message: "Preparando transferências bancárias..." },
      { progress: 95, message: "Finalizando processamento..." },
      { progress: 100, message: "Processamento concluído!" },
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setProcessingProgress(steps[stepIndex].progress);
        setProcessingStep(steps[stepIndex].message);
        stepIndex++;
      } else {
        clearInterval(interval);

        // Adicionar o novo lote à lista de lotes recentes
        const newBatch: PaymentBatch = {
          id: `batch-${Date.now()}`,
          name: batchName,
          period: period,
          status: "completed",
          employeeCount: selectedEmployees.length,
          totalAmount: batchTotal,
          createdAt: new Date(),
          completedAt: new Date(),
          companyId: currentCompany.id,
        };

        setRecentBatches((prev) => [newBatch, ...prev]);

        // Resetar o estado após o processamento
        setTimeout(() => {
          setIsProcessing(false);
          setSelectedEmployees([]);
          setSelectAll(false);
          setActiveTab("history");
        }, 1000);
      }
    }, 800);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-PT", {
      style: "currency",
      currency: "EUR",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: PaymentBatch["status"]) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Rascunho</Badge>;
      case "processing":
        return <Badge variant="secondary">Em Processamento</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Concluído</Badge>;
      case "error":
        return <Badge variant="destructive">Erro</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Processamento de Pagamentos</h2>
          <p className="text-gray-500">
            Gerencie e processe pagamentos para os funcionários
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="employees" disabled={isProcessing}>
            <Users className="h-4 w-4 mr-2" />
            Selecionar Funcionários
          </TabsTrigger>
          <TabsTrigger value="processing" disabled={!isProcessing}>
            <Play className="h-4 w-4 mr-2" />
            Processamento
          </TabsTrigger>
          <TabsTrigger value="history" disabled={isProcessing}>
            <Clock className="h-4 w-4 mr-2" />
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuração do Lote de Pagamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="batch-name">Nome do Lote</Label>
                  <Input
                    id="batch-name"
                    value={batchName}
                    onChange={(e) => setBatchName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="period">Período</Label>
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger id="period">
                      <SelectValue placeholder="Selecione o período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023-06">Junho 2023</SelectItem>
                      <SelectItem value="2023-07">Julho 2023</SelectItem>
                      <SelectItem value="2023-08">Agosto 2023</SelectItem>
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Selecionar Funcionários</CardTitle>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={selectAll}
                  onCheckedChange={handleSelectAllChange}
                />
                <Label htmlFor="select-all" className="cursor-pointer">
                  Selecionar Todos
                </Label>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Pesquisar funcionários..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select
                    value={departmentFilter}
                    onValueChange={setDepartmentFilter}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Sel.</TableHead>
                      <TableHead>Funcionário</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead className="text-right">Salário Base</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map((employee) => {
                        const isSelected = selectedEmployees.some(
                          (emp) => emp.id === employee.id,
                        );
                        return (
                          <TableRow key={employee.id}>
                            <TableCell>
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) =>
                                  handleEmployeeSelection(
                                    employee,
                                    checked as boolean,
                                  )
                                }
                              />
                            </TableCell>
                            <TableCell>{employee.name}</TableCell>
                            <TableCell>{employee.department}</TableCell>
                            <TableCell>{employee.position}</TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(employee.baseSalary)}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-4 text-gray-500"
                        >
                          Nenhum funcionário encontrado
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    {selectedEmployees.length} funcionários selecionados
                  </p>
                  <p className="font-medium">
                    Total: {formatCurrency(batchTotal)}
                  </p>
                </div>
                <Button
                  onClick={() => setIsConfirmDialogOpen(true)}
                  disabled={selectedEmployees.length === 0}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Iniciar Processamento
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Processando Pagamentos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso</span>
                  <span>{processingProgress}%</span>
                </div>
                <Progress value={processingProgress} className="h-2" />
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Status</h3>
                <p className="text-sm">{processingStep}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Detalhes do Lote</h3>
                  <p className="text-sm">
                    <strong>Nome:</strong> {batchName}
                  </p>
                  <p className="text-sm">
                    <strong>Período:</strong> {period}
                  </p>
                  <p className="text-sm">
                    <strong>Funcionários:</strong> {selectedEmployees.length}
                  </p>
                  <p className="text-sm">
                    <strong>Total:</strong> {formatCurrency(batchTotal)}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="font-medium mb-2">Ações</h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      disabled={processingProgress < 100}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Ver Relatório
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      disabled={processingProgress < 100}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exportar Resultados
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      disabled={processingProgress < 100}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Recibos
                    </Button>
                  </div>
                </div>
              </div>

              {processingProgress === 100 && (
                <div className="flex justify-center">
                  <div className="bg-green-50 text-green-700 p-4 rounded-md flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span>Processamento concluído com sucesso!</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Processamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome do Lote</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Funcionários</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Data de Processamento</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentBatches.length > 0 ? (
                    recentBatches.map((batch) => (
                      <TableRow key={batch.id}>
                        <TableCell className="font-medium">
                          {batch.name}
                        </TableCell>
                        <TableCell>{batch.period}</TableCell>
                        <TableCell>{getStatusBadge(batch.status)}</TableCell>
                        <TableCell>{batch.employeeCount}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(batch.totalAmount)}
                        </TableCell>
                        <TableCell>{formatDate(batch.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="icon">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-4 text-gray-500"
                      >
                        Nenhum processamento encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Processamento</DialogTitle>
            <DialogDescription>
              Você está prestes a iniciar o processamento de pagamentos para{" "}
              {selectedEmployees.length} funcionários.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Nome do Lote:</span>
                <span>{batchName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Período:</span>
                <span>{period}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Funcionários:</span>
                <span>{selectedEmployees.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total:</span>
                <span className="font-bold">{formatCurrency(batchTotal)}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={startProcessing}>
              <Play className="h-4 w-4 mr-2" />
              Iniciar Processamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentProcessing;
