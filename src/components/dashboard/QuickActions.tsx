import React, { useState, useEffect } from "react";
import { useCompany } from "@/context/CompanyContext";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { PlusCircle, Users } from "lucide-react";
import AddEmployeeForm from "../employees/AddEmployeeForm";
import NewPaymentForm from "../employees/NewPaymentForm";

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
  const navigate = useNavigate();
  const { currentCompany } = useCompany();
  const [isAddEmployeeDialogOpen, setIsAddEmployeeDialogOpen] = useState(false);
  const [isNewPaymentDialogOpen, setIsNewPaymentDialogOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");

  // Atualizar o nome da empresa quando ela mudar
  useEffect(() => {
    setCompanyName(currentCompany.name);
  }, [currentCompany]);

  const handleAddEmployee = (data: any) => {
    // In a real app, this would add the employee to the database
    console.log("Adding employee:", data);
    setIsAddEmployeeDialogOpen(false);
    // Navigate to employees page after adding
    navigate("/employees");
  };

  const handleCreatePayment = (paymentData: any) => {
    // In a real app, this would create a payment in the database
    console.log("Creating payment:", paymentData);
    setIsNewPaymentDialogOpen(false);
    // Navigate to employee profile after creating payment
    navigate(`/employees/${paymentData.employeeId}`);
  };

  const defaultActions = [
    {
      id: "new-payment",
      label: "Novo Pagamento",
      icon: <PlusCircle className="h-5 w-5" />,
      onClick: () => setIsNewPaymentDialogOpen(true),
      tooltip: "Criar um novo pagamento",
    },
    {
      id: "add-employee",
      label: "Adicionar Funcionário",
      icon: <Users className="h-5 w-5" />,
      onClick: () => setIsAddEmployeeDialogOpen(true),
      tooltip: "Adicionar um novo funcionário",
    },
  ];

  const displayActions = actions || defaultActions;

  // Mock data for the payment form
  const mockActivities = [
    {
      id: "1",
      employeeId: "1",
      type: "overtime",
      description: "Finalização de relatório mensal",
      date: new Date("2023-05-15"),
      hours: 3,
      rate: 15,
      status: "approved",
    },
    {
      id: "2",
      employeeId: "1",
      type: "weekend",
      description: "Preparação para auditoria",
      date: new Date("2023-05-20"),
      hours: 5,
      rate: 20,
      status: "approved",
    },
  ];

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

      {/* Add Employee Dialog */}
      <Dialog
        open={isAddEmployeeDialogOpen}
        onOpenChange={setIsAddEmployeeDialogOpen}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Adicionar Novo Funcionário - {companyName}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do novo funcionário para adicioná-lo ao sistema.
            </DialogDescription>
          </DialogHeader>
          <AddEmployeeForm
            onSubmit={handleAddEmployee}
            onCancel={() => setIsAddEmployeeDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* New Payment Dialog */}
      <Dialog
        open={isNewPaymentDialogOpen}
        onOpenChange={setIsNewPaymentDialogOpen}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Novo Pagamento - {companyName}</DialogTitle>
            <DialogDescription>
              Preencha os detalhes para criar um novo pagamento.
            </DialogDescription>
          </DialogHeader>
          <NewPaymentForm
            employeeId="1"
            employeeName="Ana Silva"
            baseSalary={2500}
            availableActivities={mockActivities}
            onSubmit={handleCreatePayment}
            onCancel={() => setIsNewPaymentDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default QuickActions;
