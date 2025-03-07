import React from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  PlusCircle,
  FileText,
  Users,
  Calculator,
  Calendar,
} from "lucide-react";

interface QuickActionProps {
  actions?: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
    onClick?: () => void;
    tooltip: string;
  }>;
}

const QuickActions = ({ actions }: QuickActionProps) => {
  const defaultActions = [
    {
      id: "new-payment",
      label: "Novo Pagamento",
      icon: <PlusCircle className="h-5 w-5" />,
      onClick: () => console.log("Novo pagamento"),
      tooltip: "Criar um novo pagamento",
    },
    {
      id: "generate-report",
      label: "Gerar Relatório",
      icon: <FileText className="h-5 w-5" />,
      onClick: () => console.log("Gerar relatório"),
      tooltip: "Gerar um novo relatório",
    },
    {
      id: "add-employee",
      label: "Adicionar Funcionário",
      icon: <Users className="h-5 w-5" />,
      onClick: () => console.log("Adicionar funcionário"),
      tooltip: "Adicionar um novo funcionário",
    },
    {
      id: "calculate-taxes",
      label: "Calcular Impostos",
      icon: <Calculator className="h-5 w-5" />,
      onClick: () => console.log("Calcular impostos"),
      tooltip: "Calcular impostos do período",
    },
    {
      id: "schedule-payment",
      label: "Agendar Pagamento",
      icon: <Calendar className="h-5 w-5" />,
      onClick: () => console.log("Agendar pagamento"),
      tooltip: "Agendar um pagamento futuro",
    },
  ];

  const displayActions = actions || defaultActions;

  return (
    <Card className="w-full p-4 bg-white shadow-sm">
      <div className="flex flex-col">
        <h3 className="text-lg font-medium mb-3">Ações Rápidas</h3>
        <div className="flex flex-wrap gap-2">
          <TooltipProvider>
            {displayActions.map((action) => (
              <Tooltip key={action.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 border-gray-200 hover:bg-gray-50"
                    onClick={action.onClick}
                  >
                    {action.icon}
                    <span>{action.label}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{action.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </div>
    </Card>
  );
};

export default QuickActions;
