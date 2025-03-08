import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, CreditCard, BanknoteIcon } from "lucide-react";

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  processingFee?: number;
  requiresApproval: boolean;
  instructions?: string;
}

interface PaymentMethodManagerProps {
  paymentMethods: PaymentMethod[];
  onAddPaymentMethod: (method: Omit<PaymentMethod, "id">) => void;
  onEditPaymentMethod: (id: string, method: Omit<PaymentMethod, "id">) => void;
  onDeletePaymentMethod: (id: string) => void;
}

const PaymentMethodManager: React.FC<PaymentMethodManagerProps> = ({
  paymentMethods,
  onAddPaymentMethod,
  onEditPaymentMethod,
  onDeletePaymentMethod,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [formData, setFormData] = useState<
    Omit<PaymentMethod, "id"> & { processingFee: any }
  >({
    name: "",
    description: "",
    isActive: true,
    processingFee: "",
    requiresApproval: true,
    instructions: "",
  });

  const handleOpenDialog = (method?: PaymentMethod) => {
    if (method) {
      setFormData({
        name: method.name,
        description: method.description,
        isActive: method.isActive,
        processingFee: method.processingFee || 0,
        requiresApproval: method.requiresApproval,
        instructions: method.instructions || "",
      });
      setCurrentId(method.id);
      setIsEditing(true);
    } else {
      setFormData({
        name: "",
        description: "",
        isActive: true,
        processingFee: "",
        requiresApproval: true,
        instructions: "",
      });
      setCurrentId(null);
      setIsEditing(false);
    }
    setIsDialogOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "processingFee" ? parseFloat(value) || 0 : value,
    });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleSubmit = () => {
    if (isEditing && currentId) {
      onEditPaymentMethod(currentId, formData);
    } else {
      onAddPaymentMethod(formData);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este método de pagamento?")) {
      onDeletePaymentMethod(id);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Métodos de Pagamento</CardTitle>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" /> Novo Método
        </Button>
      </CardHeader>
      <CardContent>
        {paymentMethods.length > 0 ? (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="p-4 border rounded-md hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{method.name}</h3>
                      {method.isActive ? (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          Ativo
                        </span>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded-full">
                          Inativo
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {method.description}
                    </p>
                    {method.processingFee > 0 && (
                      <p className="text-sm mt-1">
                        Taxa de processamento: {method.processingFee.toFixed(2)}
                        %
                      </p>
                    )}
                    {method.requiresApproval && (
                      <p className="text-sm mt-1 text-amber-600">
                        Requer aprovação
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenDialog(method)}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleDelete(method.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Excluir
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="font-medium">Nenhum método de pagamento cadastrado</p>
            <p className="text-sm mt-1">
              Clique em "Novo Método" para adicionar métodos de pagamento
            </p>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Editar" : "Adicionar"} Método de Pagamento
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Edite as informações do método de pagamento"
                  : "Preencha as informações para criar um novo método de pagamento"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ex: Transferência Bancária"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Ex: Pagamento via transferência bancária"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="processingFee">Taxa de Processamento (%)</Label>
                <Input
                  id="processingFee"
                  name="processingFee"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.processingFee}
                  onChange={handleInputChange}
                  placeholder="Ex: 1.5"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="instructions">Instruções</Label>
                <Textarea
                  id="instructions"
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  placeholder="Ex: Instruções para processamento do pagamento"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isActive" className="cursor-pointer">
                  Ativo
                </Label>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("isActive", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="requiresApproval" className="cursor-pointer">
                  Requer Aprovação
                </Label>
                <Switch
                  id="requiresApproval"
                  checked={formData.requiresApproval}
                  onCheckedChange={(checked) =>
                    handleSwitchChange("requiresApproval", checked)
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>
                {isEditing ? "Salvar Alterações" : "Adicionar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PaymentMethodManager;
