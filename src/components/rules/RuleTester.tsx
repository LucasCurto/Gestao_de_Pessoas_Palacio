import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Play, RefreshCw, Save, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RuleTesterProps {
  rule?: {
    id: string;
    name: string;
    description: string;
    conditions: any[];
    calculations: any[];
  };
  onTest?: (testData: any) => Promise<any>;
  onSaveTestCase?: (testCase: any) => void;
}

const RuleTester = ({
  rule = {
    id: "rule-1",
    name: "Cálculo de Subsídio de Férias",
    description:
      "Regra para calcular o subsídio de férias baseado no tempo de serviço e categoria do funcionário",
    conditions: [],
    calculations: [],
  },
  onTest = async () => ({
    success: true,
    result: {
      baseValue: 1000,
      additionalValue: 250,
      totalValue: 1250,
    },
  }),
  onSaveTestCase = () => {},
}: RuleTesterProps) => {
  const [testData, setTestData] = useState({
    employeeId: "",
    employeeName: "João Silva",
    employeeCategory: "Técnico",
    baseSalary: 1200,
    serviceYears: 3,
    testDate: new Date().toISOString().split("T")[0],
  });

  const [testResult, setTestResult] = useState<null | {
    success: boolean;
    result?: any;
    error?: string;
  }>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("input");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTestData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setTestData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTest = async () => {
    setIsLoading(true);
    try {
      const result = await onTest(testData);
      setTestResult(result);
      setActiveTab("result");
    } catch (error) {
      setTestResult({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao testar regra",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTestCase = () => {
    onSaveTestCase({
      ruleId: rule.id,
      testData,
      result: testResult?.result,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <Card className="w-full bg-white border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Testar Regra</CardTitle>
        <CardDescription>
          Teste a regra "{rule.name}" com dados de exemplo para verificar os
          resultados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="input" className="flex-1">
              Dados de Entrada
            </TabsTrigger>
            <TabsTrigger
              value="result"
              className="flex-1"
              disabled={!testResult}
            >
              Resultados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="employeeName" className="text-sm font-medium">
                  Nome do Funcionário
                </label>
                <Input
                  id="employeeName"
                  name="employeeName"
                  value={testData.employeeName}
                  onChange={handleInputChange}
                  placeholder="Nome do funcionário"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="employeeCategory"
                  className="text-sm font-medium"
                >
                  Categoria
                </label>
                <Select
                  value={testData.employeeCategory}
                  onValueChange={(value) =>
                    handleSelectChange("employeeCategory", value)
                  }
                >
                  <SelectTrigger id="employeeCategory">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Técnico">Técnico</SelectItem>
                    <SelectItem value="Administrativo">
                      Administrativo
                    </SelectItem>
                    <SelectItem value="Gerente">Gerente</SelectItem>
                    <SelectItem value="Diretor">Diretor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="baseSalary" className="text-sm font-medium">
                  Salário Base (€)
                </label>
                <Input
                  id="baseSalary"
                  name="baseSalary"
                  type="number"
                  value={testData.baseSalary}
                  onChange={handleInputChange}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="serviceYears" className="text-sm font-medium">
                  Anos de Serviço
                </label>
                <Input
                  id="serviceYears"
                  name="serviceYears"
                  type="number"
                  value={testData.serviceYears}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="testDate" className="text-sm font-medium">
                  Data do Teste
                </label>
                <Input
                  id="testDate"
                  name="testDate"
                  type="date"
                  value={testData.testDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-md mt-4">
              <h4 className="text-sm font-medium mb-2">Informações da Regra</h4>
              <p className="text-sm text-slate-600">{rule.description}</p>
            </div>
          </TabsContent>

          <TabsContent value="result" className="mt-4">
            {testResult && (
              <div className="space-y-4">
                <div
                  className={cn(
                    "p-4 rounded-md",
                    testResult.success
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200",
                  )}
                >
                  <div className="flex items-start">
                    {testResult.success ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                    )}
                    <div>
                      <h4 className="text-sm font-medium">
                        {testResult.success
                          ? "Regra aplicada com sucesso"
                          : "Erro ao aplicar regra"}
                      </h4>
                      {!testResult.success && testResult.error && (
                        <p className="text-sm text-red-700 mt-1">
                          {testResult.error}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {testResult.success && testResult.result && (
                  <div className="bg-slate-50 p-4 rounded-md">
                    <h4 className="text-sm font-medium mb-3">
                      Resultados do Cálculo
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(testResult.result).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between py-1 border-b border-slate-200 last:border-0"
                        >
                          <span className="text-sm text-slate-600">
                            {key
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())
                              .trim()}
                          </span>
                          <span className="text-sm font-medium">
                            {typeof value === "number"
                              ? `${value.toFixed(2)} €`
                              : value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-slate-100 pt-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setTestResult(null);
              setActiveTab("input");
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Limpar
          </Button>
          {testResult?.success && (
            <Button variant="outline" size="sm" onClick={handleSaveTestCase}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Caso de Teste
            </Button>
          )}
        </div>
        <Button size="sm" onClick={handleTest} disabled={isLoading}>
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Testar Regra
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RuleTester;
