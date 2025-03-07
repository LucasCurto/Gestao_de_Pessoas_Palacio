import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  X,
  AlertCircle,
} from "lucide-react";

interface ConditionBuilderProps {
  conditions?: Condition[];
  onChange?: (conditions: Condition[]) => void;
  className?: string;
  disabled?: boolean;
  error?: string;
}

interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
  logicalOperator?: "AND" | "OR";
}

const FIELD_OPTIONS = [
  { value: "salary", label: "Salário Base" },
  { value: "age", label: "Idade" },
  { value: "yearsOfService", label: "Anos de Serviço" },
  { value: "department", label: "Departamento" },
  { value: "position", label: "Cargo" },
  { value: "contractType", label: "Tipo de Contrato" },
];

const OPERATOR_OPTIONS = [
  { value: "equals", label: "Igual a" },
  { value: "notEquals", label: "Diferente de" },
  { value: "greaterThan", label: "Maior que" },
  { value: "lessThan", label: "Menor que" },
  { value: "contains", label: "Contém" },
  { value: "startsWith", label: "Começa com" },
  { value: "endsWith", label: "Termina com" },
];

const ConditionBuilder = ({
  conditions = [
    {
      id: "1",
      field: "salary",
      operator: "greaterThan",
      value: "1000",
      logicalOperator: "AND",
    },
    {
      id: "2",
      field: "department",
      operator: "equals",
      value: "Financeiro",
    },
  ],
  onChange = () => {},
  className = "",
  disabled = false,
  error = "",
}: ConditionBuilderProps) => {
  const [localConditions, setLocalConditions] =
    useState<Condition[]>(conditions);

  const handleAddCondition = () => {
    const newCondition: Condition = {
      id: Date.now().toString(),
      field: "salary",
      operator: "equals",
      value: "",
      logicalOperator: "AND",
    };

    const updatedConditions = [...localConditions, newCondition];
    setLocalConditions(updatedConditions);
    onChange(updatedConditions);
  };

  const handleRemoveCondition = (id: string) => {
    const updatedConditions = localConditions.filter(
      (condition) => condition.id !== id,
    );
    setLocalConditions(updatedConditions);
    onChange(updatedConditions);
  };

  const handleConditionChange = (
    id: string,
    field: keyof Condition,
    value: any,
  ) => {
    const updatedConditions = localConditions.map((condition) => {
      if (condition.id === id) {
        return { ...condition, [field]: value };
      }
      return condition;
    });

    setLocalConditions(updatedConditions);
    onChange(updatedConditions);
  };

  const moveCondition = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === localConditions.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updatedConditions = [...localConditions];
    [updatedConditions[index], updatedConditions[newIndex]] = [
      updatedConditions[newIndex],
      updatedConditions[index],
    ];

    setLocalConditions(updatedConditions);
    onChange(updatedConditions);
  };

  return (
    <div className={cn("space-y-4 bg-white p-4 rounded-md border", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Condições da Regra</h3>
        <Button
          type="button"
          onClick={handleAddCondition}
          disabled={disabled}
          size="sm"
          className="flex items-center gap-1"
        >
          <Plus size={16} />
          <span>Adicionar Condição</span>
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md flex items-start gap-2 mb-4">
          <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {localConditions.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-md border border-dashed">
          <p>Nenhuma condição definida. Adicione uma condição para começar.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {localConditions.map((condition, index) => (
            <div
              key={condition.id}
              className="p-4 border rounded-md bg-gray-50 relative"
            >
              <div className="absolute right-2 top-2 flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => moveCondition(index, "up")}
                  disabled={index === 0 || disabled}
                >
                  <ChevronUp size={16} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => moveCondition(index, "down")}
                  disabled={index === localConditions.length - 1 || disabled}
                >
                  <ChevronDown size={16} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleRemoveCondition(condition.id)}
                  disabled={disabled}
                >
                  <Trash2 size={16} />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 pr-24">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Campo
                  </label>
                  <Select
                    value={condition.field}
                    onValueChange={(value) =>
                      handleConditionChange(condition.id, "field", value)
                    }
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um campo" />
                    </SelectTrigger>
                    <SelectContent>
                      {FIELD_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Operador
                  </label>
                  <Select
                    value={condition.operator}
                    onValueChange={(value) =>
                      handleConditionChange(condition.id, "operator", value)
                    }
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um operador" />
                    </SelectTrigger>
                    <SelectContent>
                      {OPERATOR_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Valor
                  </label>
                  <Input
                    value={condition.value}
                    onChange={(e) =>
                      handleConditionChange(
                        condition.id,
                        "value",
                        e.target.value,
                      )
                    }
                    placeholder="Digite o valor"
                    disabled={disabled}
                  />
                </div>

                {index < localConditions.length - 1 && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Operador Lógico
                    </label>
                    <Select
                      value={condition.logicalOperator || "AND"}
                      onValueChange={(value) =>
                        handleConditionChange(
                          condition.id,
                          "logicalOperator",
                          value as "AND" | "OR",
                        )
                      }
                      disabled={disabled}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Operador lógico" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AND">E (AND)</SelectItem>
                        <SelectItem value="OR">OU (OR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {index < localConditions.length - 1 && (
                <div className="flex items-center justify-center mt-2">
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                    {condition.logicalOperator === "AND"
                      ? "E (AND)"
                      : "OU (OR)"}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConditionBuilder;
