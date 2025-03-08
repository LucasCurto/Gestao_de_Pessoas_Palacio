import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";

export interface ActivityType {
  id: string;
  name: string;
  description: string;
  defaultRate: number;
}

interface ActivityTypeManagerProps {
  activityTypes: ActivityType[];
  onAddActivityType: (activityType: Omit<ActivityType, "id">) => void;
  onEditActivityType: (
    id: string,
    activityType: Omit<ActivityType, "id">,
  ) => void;
  onDeleteActivityType: (id: string) => void;
}

const ActivityTypeManager: React.FC<ActivityTypeManagerProps> = ({
  activityTypes,
  onAddActivityType,
  onEditActivityType,
  onDeleteActivityType,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [formData, setFormData] = useState<
    Omit<ActivityType, "id"> & { defaultRate: any }
  >({
    name: "",
    description: "",
    defaultRate: "",
  });

  const handleOpenDialog = (activityType?: ActivityType) => {
    if (activityType) {
      setFormData({
        name: activityType.name,
        description: activityType.description,
        defaultRate: activityType.defaultRate,
      });
      setCurrentId(activityType.id);
      setIsEditing(true);
    } else {
      setFormData({
        name: "",
        description: "",
        defaultRate: "",
      });
      setCurrentId(null);
      setIsEditing(false);
    }
    setIsDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "defaultRate" ? parseFloat(value) || 0 : value,
    });
  };

  const handleSubmit = () => {
    if (isEditing && currentId) {
      onEditActivityType(currentId, formData);
    } else {
      onAddActivityType(formData);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este tipo de atividade?")) {
      onDeleteActivityType(id);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Tipos de Atividades</CardTitle>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" /> Novo Tipo
        </Button>
      </CardHeader>
      <CardContent>
        {activityTypes.length > 0 ? (
          <div className="space-y-4">
            {activityTypes.map((type) => (
              <div
                key={type.id}
                className="p-4 border rounded-md hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{type.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {type.description}
                    </p>
                    <p className="text-sm font-medium mt-1">
                      Taxa padrão: {type.defaultRate.toFixed(2)}€/h
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenDialog(type)}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleDelete(type.id)}
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
            <p className="font-medium">Nenhum tipo de atividade cadastrado</p>
            <p className="text-sm mt-1">
              Clique em "Novo Tipo" para adicionar tipos de atividades
            </p>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Editar" : "Adicionar"} Tipo de Atividade
              </DialogTitle>
              <DialogDescription>
                {isEditing
                  ? "Edite as informações do tipo de atividade"
                  : "Preencha as informações para criar um novo tipo de atividade"}
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
                  placeholder="Ex: Horas Extras"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Ex: Horas trabalhadas além do horário normal"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="defaultRate">Taxa Padrão (€/h)</Label>
                <Input
                  id="defaultRate"
                  name="defaultRate"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.defaultRate}
                  onChange={handleInputChange}
                  placeholder="Ex: 15"
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

export default ActivityTypeManager;
