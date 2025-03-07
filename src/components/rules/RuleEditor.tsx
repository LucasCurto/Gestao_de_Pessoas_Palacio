import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
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
import {
  Save,
  Play,
  Settings,
  Code,
  FileText,
  AlertCircle,
  CheckCircle,
  HelpCircle,
} from "lucide-react";

import ConditionBuilder from "./ConditionBuilder";
import CalculationConfigurator from "./CalculationConfigurator";
import RuleTester from "./RuleTester";

interface RuleEditorProps {
  rule?: Rule;
  onSave?: (rule: Rule) => void;
  onTest?: (rule: Rule) => Promise<any>;
  isEditing?: boolean;
}

interface Rule {
  id?: string;
  name: string;
  description: string;
  conditions: any[];
  calculations: any[];
  isActive: boolean;
  priority: number;
  category: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

const RuleEditor = ({
  rule = {
    name: "",
    description: "",
    conditions: [],
    calculations: [],
    isActive: true,
    priority: 1,
    category: "payment",
  },
  onSave = () => {},
  onTest = async () => ({}),
  isEditing = false,
}: RuleEditorProps) => {
  const [currentRule, setCurrentRule] = useState<Rule>(rule);
  const [activeTab, setActiveTab] = useState("conditions");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCurrentRule((prev) => ({ ...prev, [name]: value }));

    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: any) => {
    setCurrentRule((prev) => ({ ...prev, [name]: value }));

    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleConditionsChange = (conditions: any[]) => {
    setCurrentRule((prev) => ({ ...prev, conditions }));

    // Clear validation error when conditions are edited
    if (validationErrors.conditions) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.conditions;
        return newErrors;
      });
    }
  };

  const handleCalculationsChange = (calculations: any) => {
    setCurrentRule((prev) => ({ ...prev, calculations }));

    // Clear validation error when calculations are edited
    if (validationErrors.calculations) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.calculations;
        return newErrors;
      });
    }
  };

  const validateRule = (): boolean => {
    const errors: Record<string, string> = {};

    if (!currentRule.name.trim()) {
      errors.name = "O nome da regra é obrigatório";
    }

    if (!currentRule.description.trim()) {
      errors.description = "A descrição da regra é obrigatória";
    }

    if (currentRule.conditions.length === 0) {
      errors.conditions = "Pelo menos uma condição é necessária";
    }

    if (
      !currentRule.calculations ||
      (Array.isArray(currentRule.calculations) &&
        currentRule.calculations.length === 0)
    ) {
      errors.calculations = "Pelo menos um cálculo é necessário";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateRule()) {
      return;
    }

    setIsSaving(true);
    try {
      await onSave(currentRule);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving rule:", error);
      setValidationErrors({
        ...validationErrors,
        general: "Erro ao salvar a regra. Por favor, tente novamente.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    if (!validateRule()) {
      setActiveTab("test");
      return;
    }

    try {
      await onTest(currentRule);
      setActiveTab("test");
    } catch (error) {
      console.error("Error testing rule:", error);
    }
  };

  return (
    <div className="w-full h-full bg-white rounded-md border border-gray-200 flex flex-col">
      <div className="border-b border-gray-200 p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">
            {isEditing ? "Editar Regra" : "Nova Regra"}
          </h2>
          <p className="text-sm text-gray-500">
            {isEditing
              ? "Modifique os parâmetros da regra existente"
              : "Configure uma nova regra de cálculo"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saveSuccess && (
            <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-md">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="text-sm">Salvo com sucesso</span>
            </div>
          )}
          <Button variant="outline" onClick={handleTest} className="gap-1">
            <Play className="h-4 w-4" />
            <span>Testar</span>
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="gap-1">
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Salvando..." : "Salvar"}</span>
          </Button>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-auto">
        {validationErrors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{validationErrors.general}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Nome da Regra
                <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                name="name"
                value={currentRule.name}
                onChange={handleInputChange}
                placeholder="Ex: Cálculo de Subsídio de Férias"
                className={cn(
                  validationErrors.name &&
                    "border-red-500 focus-visible:ring-red-500",
                )}
              />
              {validationErrors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {validationErrors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium mb-1"
              >
                Categoria
              </label>
              <Select
                value={currentRule.category}
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="payment">Pagamento</SelectItem>
                  <SelectItem value="bonus">Bónus</SelectItem>
                  <SelectItem value="tax">Impostos</SelectItem>
                  <SelectItem value="deduction">Deduções</SelectItem>
                  <SelectItem value="benefit">Benefícios</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4 md:col-span-2">
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-1"
              >
                Descrição
                <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="description"
                name="description"
                value={currentRule.description}
                onChange={handleInputChange}
                placeholder="Descreva o propósito e funcionamento desta regra"
                rows={3}
                className={cn(
                  validationErrors.description &&
                    "border-red-500 focus-visible:ring-red-500",
                )}
              />
              {validationErrors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {validationErrors.description}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={currentRule.isActive}
                  onCheckedChange={(checked) =>
                    handleSelectChange("isActive", checked)
                  }
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  Regra Ativa
                </label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Quando ativa, esta regra será aplicada automaticamente
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex items-center space-x-2">
                <label htmlFor="priority" className="text-sm font-medium">
                  Prioridade:
                </label>
                <Select
                  value={currentRule.priority.toString()}
                  onValueChange={(value) =>
                    handleSelectChange("priority", parseInt(value))
                  }
                >
                  <SelectTrigger id="priority" className="w-20">
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 (Alta)</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5 (Baixa)</SelectItem>
                  </SelectContent>
                </Select>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Define a ordem de execução quando múltiplas regras são
                        aplicáveis
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="conditions" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>Condições</span>
            </TabsTrigger>
            <TabsTrigger
              value="calculations"
              className="flex items-center gap-1"
            >
              <Code className="h-4 w-4" />
              <span>Cálculos</span>
            </TabsTrigger>
            <TabsTrigger value="test" className="flex items-center gap-1">
              <Play className="h-4 w-4" />
              <span>Testar</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="conditions" className="space-y-4">
            <ConditionBuilder
              conditions={currentRule.conditions}
              onChange={handleConditionsChange}
              error={validationErrors.conditions}
            />
          </TabsContent>

          <TabsContent value="calculations" className="space-y-4">
            <CalculationConfigurator
              initialConfig={currentRule.calculations}
              onSave={handleCalculationsChange}
              isEditing={isEditing}
            />
            {validationErrors.calculations && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>{validationErrors.calculations}</span>
              </div>
            )}
          </TabsContent>

          <TabsContent value="test" className="space-y-4">
            <RuleTester rule={currentRule} onTest={onTest} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RuleEditor;
