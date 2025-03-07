import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus, Trash2, HelpCircle, Calculator } from "lucide-react";

interface CalculationConfiguratorProps {
  onSave?: (config: CalculationConfig) => void;
  initialConfig?: CalculationConfig;
  availableFields?: Field[];
  isEditing?: boolean;
}

interface Field {
  id: string;
  name: string;
  type: "number" | "text" | "date" | "boolean";
  category: string;
}

interface CalculationConfig {
  name: string;
  description: string;
  formula: string;
  variables: Variable[];
  roundingMethod: "none" | "up" | "down" | "nearest";
  decimalPlaces: number;
  isActive: boolean;
}

interface Variable {
  id: string;
  name: string;
  fieldId: string;
  defaultValue: string;
}

const CalculationConfigurator: React.FC<CalculationConfiguratorProps> = ({
  onSave = () => {},
  initialConfig = {
    name: "",
    description: "",
    formula: "",
    variables: [],
    roundingMethod: "none",
    decimalPlaces: 2,
    isActive: true,
  },
  availableFields = [
    {
      id: "salary",
      name: "Salário Base",
      type: "number",
      category: "Remuneração",
    },
    {
      id: "hours",
      name: "Horas Trabalhadas",
      type: "number",
      category: "Tempo",
    },
    { id: "overtime", name: "Horas Extra", type: "number", category: "Tempo" },
    { id: "bonus", name: "Bónus", type: "number", category: "Remuneração" },
    { id: "tax", name: "Taxa IRS", type: "number", category: "Impostos" },
    {
      id: "soc_sec",
      name: "Segurança Social",
      type: "number",
      category: "Impostos",
    },
  ],
  isEditing = false,
}) => {
  const [config, setConfig] = useState<CalculationConfig>(initialConfig);
  const [activeTab, setActiveTab] = useState("formula");
  const [testResult, setTestResult] = useState<number | null>(null);

  const handleAddVariable = () => {
    const newVariable = {
      id: `var_${Date.now()}`,
      name: `Variable ${config.variables.length + 1}`,
      fieldId: "",
      defaultValue: "0",
    };

    setConfig({
      ...config,
      variables: [...config.variables, newVariable],
    });
  };

  const handleRemoveVariable = (id: string) => {
    setConfig({
      ...config,
      variables: config.variables.filter((v) => v.id !== id),
    });
  };

  const updateVariable = (id: string, field: string, value: string) => {
    setConfig({
      ...config,
      variables: config.variables.map((v) =>
        v.id === id ? { ...v, [field]: value } : v,
      ),
    });
  };

  const handleTestCalculation = () => {
    // This is a simplified test calculation for UI demonstration
    // In a real implementation, this would evaluate the formula with the variables
    try {
      // Simple mock calculation for demonstration
      const mockResult = Math.random() * 1000;
      const roundedResult = parseFloat(
        mockResult.toFixed(config.decimalPlaces),
      );
      setTestResult(roundedResult);
    } catch (error) {
      console.error("Calculation error:", error);
      setTestResult(null);
    }
  };

  const handleSave = () => {
    onSave(config);
  };

  return (
    <Card className="w-full bg-white border-gray-200">
      <CardHeader className="border-b">
        <CardTitle className="text-xl">
          {isEditing ? "Editar Cálculo" : "Configurar Novo Cálculo"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-6">
            <TabsTrigger value="formula">Fórmula</TabsTrigger>
            <TabsTrigger value="variables">Variáveis</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="formula" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nome do Cálculo
                </label>
                <Input
                  value={config.name}
                  onChange={(e) =>
                    setConfig({ ...config, name: e.target.value })
                  }
                  placeholder="Ex: Cálculo de Subsídio de Alimentação"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Descrição
                </label>
                <Textarea
                  value={config.description}
                  onChange={(e) =>
                    setConfig({ ...config, description: e.target.value })
                  }
                  placeholder="Descreva o propósito deste cálculo"
                  rows={3}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium">Fórmula</label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <HelpCircle className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Use variáveis como $var_name na fórmula</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Textarea
                  value={config.formula}
                  onChange={(e) =>
                    setConfig({ ...config, formula: e.target.value })
                  }
                  placeholder="Ex: $base_salary * (1 + $bonus_rate)"
                  rows={4}
                  className="font-mono"
                />
              </div>

              <div className="pt-4">
                <Button onClick={handleTestCalculation} className="w-full">
                  <Calculator className="mr-2 h-4 w-4" />
                  Testar Cálculo
                </Button>

                {testResult !== null && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-md border">
                    <p className="text-sm font-medium">Resultado do teste:</p>
                    <p className="text-2xl font-bold text-primary">
                      {testResult.toLocaleString("pt-PT", {
                        minimumFractionDigits: config.decimalPlaces,
                        maximumFractionDigits: config.decimalPlaces,
                      })}
                      €
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="variables" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Variáveis</h3>
              <Button onClick={handleAddVariable} size="sm">
                <Plus className="mr-1 h-4 w-4" /> Adicionar Variável
              </Button>
            </div>

            {config.variables.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhuma variável definida</p>
                <p className="text-sm">
                  Adicione variáveis para usar na sua fórmula
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {config.variables.map((variable) => (
                  <div
                    key={variable.id}
                    className="p-4 border rounded-md bg-slate-50 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <label className="block text-sm font-medium">
                          Nome da Variável
                        </label>
                        <Input
                          value={variable.name}
                          onChange={(e) =>
                            updateVariable(variable.id, "name", e.target.value)
                          }
                          placeholder="Nome da variável"
                          className="max-w-xs"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveVariable(variable.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Campo Associado
                        </label>
                        <Select
                          value={variable.fieldId}
                          onValueChange={(value) =>
                            updateVariable(variable.id, "fieldId", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar campo" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableFields.map((field) => (
                              <SelectItem key={field.id} value={field.id}>
                                {field.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Valor Padrão
                        </label>
                        <Input
                          value={variable.defaultValue}
                          onChange={(e) =>
                            updateVariable(
                              variable.id,
                              "defaultValue",
                              e.target.value,
                            )
                          }
                          placeholder="Valor padrão"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Arredondamento</h3>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Método de Arredondamento
                  </label>
                  <Select
                    value={config.roundingMethod}
                    onValueChange={(
                      value: "none" | "up" | "down" | "nearest",
                    ) => setConfig({ ...config, roundingMethod: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sem arredondamento</SelectItem>
                      <SelectItem value="up">Arredondar para cima</SelectItem>
                      <SelectItem value="down">
                        Arredondar para baixo
                      </SelectItem>
                      <SelectItem value="nearest">
                        Arredondar para o mais próximo
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Casas Decimais
                  </label>
                  <Select
                    value={config.decimalPlaces.toString()}
                    onValueChange={(value) =>
                      setConfig({ ...config, decimalPlaces: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecionar casas decimais" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Estado</h3>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Ativar Cálculo</p>
                    <p className="text-sm text-gray-500">
                      Quando ativo, este cálculo será aplicado automaticamente
                    </p>
                  </div>
                  <Switch
                    checked={config.isActive}
                    onCheckedChange={(checked) =>
                      setConfig({ ...config, isActive: checked })
                    }
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
          <Button variant="outline">Cancelar</Button>
          <Button onClick={handleSave}>
            {isEditing ? "Atualizar" : "Guardar"} Cálculo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalculationConfigurator;
