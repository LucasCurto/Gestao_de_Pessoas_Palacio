import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Temporarily remove drag and drop functionality until package is installed
// Will use simple list rendering instead
import {
  Save,
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Check,
  X,
  AlertCircle,
} from "lucide-react";

interface CustomField {
  id: string;
  name: string;
  type: "text" | "number" | "date" | "select" | "checkbox" | "textarea";
  entity: "employee" | "payment" | "company" | "activity";
  required: boolean;
  visible: boolean;
  defaultValue?: string;
  placeholder?: string;
  options?: string[];
  order: number;
  description?: string;
}

const mockCustomFields: CustomField[] = [
  {
    id: "field1",
    name: "Número de Dependentes",
    type: "number",
    entity: "employee",
    required: false,
    visible: true,
    defaultValue: "0",
    placeholder: "Número de dependentes",
    order: 1,
    description: "Número de dependentes para efeitos fiscais",
  },
  {
    id: "field2",
    name: "Tipo de Contrato",
    type: "select",
    entity: "employee",
    required: true,
    visible: true,
    options: [
      "Sem Termo",
      "Termo Certo",
      "Termo Incerto",
      "Estágio",
      "Prestação de Serviços",
    ],
    defaultValue: "Sem Termo",
    order: 2,
    description: "Tipo de contrato do funcionário",
  },
  {
    id: "field3",
    name: "Data de Fim de Contrato",
    type: "date",
    entity: "employee",
    required: false,
    visible: true,
    placeholder: "Data de fim de contrato",
    order: 3,
    description: "Data de fim de contrato (apenas para contratos a termo)",
  },
  {
    id: "field4",
    name: "Método de Pagamento",
    type: "select",
    entity: "payment",
    required: true,
    visible: true,
    options: ["Transferência Bancária", "Cheque", "Dinheiro"],
    defaultValue: "Transferência Bancária",
    order: 1,
    description: "Método de pagamento preferencial",
  },
  {
    id: "field5",
    name: "Observações de Pagamento",
    type: "textarea",
    entity: "payment",
    required: false,
    visible: true,
    placeholder: "Observações adicionais sobre o pagamento",
    order: 2,
    description: "Observações adicionais sobre o pagamento",
  },
];

const FieldSettings = () => {
  const [customFields, setCustomFields] =
    useState<CustomField[]>(mockCustomFields);
  const [isAddFieldDialogOpen, setIsAddFieldDialogOpen] = useState(false);
  const [isEditFieldDialogOpen, setIsEditFieldDialogOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<CustomField | null>(null);
  const [activeEntity, setActiveEntity] =
    useState<CustomField["entity"]>("employee");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [newField, setNewField] = useState<Omit<CustomField, "id" | "order">>({
    name: "",
    type: "text",
    entity: "employee",
    required: false,
    visible: true,
    defaultValue: "",
    placeholder: "",
    options: [],
    description: "",
  });

  const filteredFields = customFields
    .filter((field) => field.entity === activeEntity)
    .sort((a, b) => a.order - b.order);

  const handleAddField = () => {
    const fieldsForEntity = customFields.filter(
      (field) => field.entity === newField.entity,
    );
    const maxOrder = fieldsForEntity.length
      ? Math.max(...fieldsForEntity.map((f) => f.order))
      : 0;

    const newFieldObj: CustomField = {
      id: `field-${Date.now()}`,
      ...newField,
      order: maxOrder + 1,
      options: newField.options || [],
    };

    setCustomFields([...customFields, newFieldObj]);
    setNewField({
      name: "",
      type: "text",
      entity: "employee",
      required: false,
      visible: true,
      defaultValue: "",
      placeholder: "",
      options: [],
      description: "",
    });
    setIsAddFieldDialogOpen(false);
    setActiveEntity(newField.entity);
  };

  const handleEditField = (field: CustomField) => {
    setSelectedField(field);
    setIsEditFieldDialogOpen(true);
  };

  const handleUpdateField = () => {
    if (!selectedField) return;

    setCustomFields(
      customFields.map((field) => {
        if (field.id === selectedField.id) {
          return selectedField;
        }
        return field;
      }),
    );

    setIsEditFieldDialogOpen(false);
    setSelectedField(null);
  };

  const handleDeleteField = (id: string) => {
    if (confirm("Tem certeza que deseja remover este campo?")) {
      setCustomFields(customFields.filter((field) => field.id !== id));
    }
  };

  const handleToggleFieldVisibility = (id: string) => {
    setCustomFields(
      customFields.map((field) => {
        if (field.id === id) {
          return { ...field, visible: !field.visible };
        }
        return field;
      }),
    );
  };

  const handleDragEnd = (/*result: any*/) => {
    // Drag and drop functionality temporarily disabled
    // Will be re-implemented when @hello-pangea/dnd is installed
  };

  const handleAddOption = () => {
    if (!selectedField) return;

    const newOption = "Nova Opção";
    setSelectedField({
      ...selectedField,
      options: [...(selectedField.options || []), newOption],
    });
  };

  const handleUpdateOption = (index: number, value: string) => {
    if (!selectedField || !selectedField.options) return;

    const updatedOptions = [...selectedField.options];
    updatedOptions[index] = value;

    setSelectedField({
      ...selectedField,
      options: updatedOptions,
    });
  };

  const handleRemoveOption = (index: number) => {
    if (!selectedField || !selectedField.options) return;

    const updatedOptions = [...selectedField.options];
    updatedOptions.splice(index, 1);

    setSelectedField({
      ...selectedField,
      options: updatedOptions,
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Campos Personalizados</h2>
          <p className="text-gray-500">
            Configure campos personalizados para diferentes entidades do sistema
          </p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "A guardar..." : "Guardar alterações"}
        </Button>
      </div>

      {saveSuccess && (
        <div className="bg-green-50 text-green-700 p-4 rounded-md">
          Configurações guardadas com sucesso!
        </div>
      )}

      <Tabs
        value={activeEntity}
        onValueChange={(value) =>
          setActiveEntity(value as CustomField["entity"])
        }
      >
        <TabsList className="mb-4">
          <TabsTrigger value="employee">Funcionários</TabsTrigger>
          <TabsTrigger value="payment">Pagamentos</TabsTrigger>
          <TabsTrigger value="activity">Atividades</TabsTrigger>
          <TabsTrigger value="company">Empresa</TabsTrigger>
        </TabsList>

        <TabsContent value={activeEntity}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                Campos Personalizados para{" "}
                {activeEntity === "employee"
                  ? "Funcionários"
                  : activeEntity === "payment"
                    ? "Pagamentos"
                    : activeEntity === "activity"
                      ? "Atividades"
                      : "Empresa"}
              </CardTitle>
              <Button onClick={() => setIsAddFieldDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Campo
              </Button>
            </CardHeader>
            <CardContent>
              {filteredFields.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhum campo personalizado definido para esta entidade.</p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setIsAddFieldDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Campo
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredFields.map((field, index) => (
                    <div
                      key={field.id}
                      className={`p-4 border rounded-md ${field.visible ? "bg-white" : "bg-gray-50"}`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start">
                          <div className="mr-2 mt-1">
                            <GripVertical className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{field.name}</h3>
                              {field.required && (
                                <Badge className="bg-red-100 text-red-800">
                                  Obrigatório
                                </Badge>
                              )}
                              <Badge variant="outline" className="capitalize">
                                {field.type === "text"
                                  ? "Texto"
                                  : field.type === "number"
                                    ? "Número"
                                    : field.type === "date"
                                      ? "Data"
                                      : field.type === "select"
                                        ? "Seleção"
                                        : field.type === "checkbox"
                                          ? "Checkbox"
                                          : "Área de Texto"}
                              </Badge>
                            </div>
                            {field.description && (
                              <p className="text-sm text-gray-500 mt-1">
                                {field.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleToggleFieldVisibility(field.id)
                            }
                            title={field.visible ? "Ocultar" : "Mostrar"}
                          >
                            {field.visible ? (
                              <Eye className="h-4 w-4" />
                            ) : (
                              <EyeOff className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditField(field)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600"
                            onClick={() => handleDeleteField(field.id)}
                            title="Remover"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Field Dialog */}
      <Dialog
        open={isAddFieldDialogOpen}
        onOpenChange={setIsAddFieldDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Campo Personalizado</DialogTitle>
            <DialogDescription>
              Configure um novo campo personalizado para o sistema.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="field-name">Nome do Campo</Label>
              <Input
                id="field-name"
                value={newField.name}
                onChange={(e) =>
                  setNewField({ ...newField, name: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="field-entity">Entidade</Label>
              <Select
                value={newField.entity}
                onValueChange={(value) =>
                  setNewField({
                    ...newField,
                    entity: value as CustomField["entity"],
                  })
                }
              >
                <SelectTrigger id="field-entity">
                  <SelectValue placeholder="Selecione a entidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Funcionário</SelectItem>
                  <SelectItem value="payment">Pagamento</SelectItem>
                  <SelectItem value="activity">Atividade</SelectItem>
                  <SelectItem value="company">Empresa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="field-type">Tipo de Campo</Label>
              <Select
                value={newField.type}
                onValueChange={(value) =>
                  setNewField({
                    ...newField,
                    type: value as CustomField["type"],
                  })
                }
              >
                <SelectTrigger id="field-type">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Texto</SelectItem>
                  <SelectItem value="number">Número</SelectItem>
                  <SelectItem value="date">Data</SelectItem>
                  <SelectItem value="select">Seleção</SelectItem>
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                  <SelectItem value="textarea">Área de Texto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="field-description">Descrição</Label>
              <Input
                id="field-description"
                value={newField.description}
                onChange={(e) =>
                  setNewField({ ...newField, description: e.target.value })
                }
                placeholder="Descrição do campo"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="field-required"
                checked={newField.required}
                onCheckedChange={(checked) =>
                  setNewField({ ...newField, required: checked })
                }
              />
              <Label htmlFor="field-required">Campo obrigatório</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddFieldDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddField}
              disabled={!newField.name || !newField.type || !newField.entity}
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Field Dialog */}
      <Dialog
        open={isEditFieldDialogOpen}
        onOpenChange={setIsEditFieldDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Campo Personalizado</DialogTitle>
            <DialogDescription>
              Modifique as propriedades do campo personalizado.
            </DialogDescription>
          </DialogHeader>

          {selectedField && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-field-name">Nome do Campo</Label>
                <Input
                  id="edit-field-name"
                  value={selectedField.name}
                  onChange={(e) =>
                    setSelectedField({
                      ...selectedField,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-field-type">Tipo de Campo</Label>
                <Select
                  value={selectedField.type}
                  onValueChange={(value) =>
                    setSelectedField({
                      ...selectedField,
                      type: value as CustomField["type"],
                    })
                  }
                >
                  <SelectTrigger id="edit-field-type">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="number">Número</SelectItem>
                    <SelectItem value="date">Data</SelectItem>
                    <SelectItem value="checkbox">Checkbox</SelectItem>
                    <SelectItem value="select">Seleção</SelectItem>
                    <SelectItem value="textarea">Área de Texto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedField.type === "select" && (
                <div className="grid gap-2">
                  <Label>Opções</Label>
                  <div className="space-y-2">
                    {selectedField.options?.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={option}
                          onChange={(e) =>
                            handleUpdateOption(index, e.target.value)
                          }
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveOption(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddOption}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" /> Adicionar Opção
                    </Button>
                  </div>
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="edit-field-placeholder">Placeholder</Label>
                <Input
                  id="edit-field-placeholder"
                  value={selectedField.placeholder || ""}
                  onChange={(e) =>
                    setSelectedField({
                      ...selectedField,
                      placeholder: e.target.value,
                    })
                  }
                  placeholder="Texto de exemplo"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-field-default">Valor Padrão</Label>
                <Input
                  id="edit-field-default"
                  value={selectedField.defaultValue || ""}
                  onChange={(e) =>
                    setSelectedField({
                      ...selectedField,
                      defaultValue: e.target.value,
                    })
                  }
                  placeholder="Valor padrão"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-field-description">Descrição</Label>
                <Input
                  id="edit-field-description"
                  value={selectedField.description || ""}
                  onChange={(e) =>
                    setSelectedField({
                      ...selectedField,
                      description: e.target.value,
                    })
                  }
                  placeholder="Descrição do campo"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-field-required"
                  checked={selectedField.required}
                  onCheckedChange={(checked) =>
                    setSelectedField({
                      ...selectedField,
                      required: checked,
                    })
                  }
                />
                <Label htmlFor="edit-field-required">Campo obrigatório</Label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditFieldDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdateField}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FieldSettings;
