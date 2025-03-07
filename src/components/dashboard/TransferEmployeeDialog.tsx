import React, { useState } from "react";
import { useCompany } from "@/context/CompanyContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TransferEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: {
    id: string;
    name: string;
    position: string;
    department: string;
    avatarUrl?: string;
    companyId?: string;
  };
  onTransfer: (
    employeeId: string,
    targetCompanyId: string,
    notes: string,
  ) => void;
}

const TransferEmployeeDialog: React.FC<TransferEmployeeDialogProps> = ({
  open,
  onOpenChange,
  employee,
  onTransfer,
}) => {
  const { companies, currentCompany } = useCompany();
  const [targetCompanyId, setTargetCompanyId] = useState("");
  const [transferNotes, setTransferNotes] = useState("");

  // Filtrar a empresa atual da lista de opções
  const availableCompanies = companies.filter(
    (company) => company.id !== currentCompany.id,
  );

  const handleTransfer = () => {
    if (!targetCompanyId) return;

    onTransfer(employee.id, targetCompanyId, transferNotes);
    onOpenChange(false);

    // Limpar o formulário
    setTargetCompanyId("");
    setTransferNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transferir Funcionário para Outra Empresa</DialogTitle>
          <DialogDescription>
            Transfira o funcionário para outra empresa do grupo.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-4 py-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={employee.avatarUrl} alt={employee.name} />
            <AvatarFallback>
              {employee.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{employee.name}</h3>
            <p className="text-sm text-gray-500">
              {employee.position} - {employee.department}
            </p>
          </div>
        </div>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="target-company">Empresa de Destino</Label>
            <Select value={targetCompanyId} onValueChange={setTargetCompanyId}>
              <SelectTrigger id="target-company">
                <SelectValue placeholder="Selecione a empresa de destino" />
              </SelectTrigger>
              <SelectContent>
                {availableCompanies.length > 0 ? (
                  availableCompanies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    Nenhuma outra empresa disponível
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="transfer-notes">Notas de Transferência</Label>
            <Textarea
              id="transfer-notes"
              placeholder="Adicione informações sobre a transferência"
              value={transferNotes}
              onChange={(e) => setTransferNotes(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleTransfer}
            disabled={!targetCompanyId || availableCompanies.length === 0}
          >
            Transferir Funcionário
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransferEmployeeDialog;
