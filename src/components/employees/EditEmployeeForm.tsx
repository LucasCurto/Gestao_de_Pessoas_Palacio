import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon, Save, X, Plus } from "lucide-react";

export interface EmployeeFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  department: string;
  position: string;
  status: "active" | "inactive" | "on_leave";
  hireDate: Date;
  birthDate: Date;
  nif: string;
  bankAccount: string;
  emergencyContact: string;
  avatarUrl?: string;
  manager?: string;
  contractType: string;
  education: string;
  skills: string[];
}

interface EditEmployeeFormProps {
  employee: EmployeeFormData;
  onSubmit: (data: EmployeeFormData) => void;
  onCancel: () => void;
}

const departments = [
  "Recursos Humanos",
  "Financeiro",
  "Tecnologia",
  "Vendas",
  "Marketing",
  "Operações",
  "Administrativo",
  "Jurídico",
];

const contractTypes = [
  "Sem Termo",
  "Termo Certo",
  "Termo Incerto",
  "Estágio",
  "Prestação de Serviços",
  "Temporário",
];

const EditEmployeeForm: React.FC<EditEmployeeFormProps> = ({
  employee,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<EmployeeFormData>(employee);
  const [newSkill, setNewSkill] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() === "") return;
    if (!formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
    }
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!formData.email) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.phone) {
      newErrors.phone = "Telefone é obrigatório";
    }

    if (!formData.nif) {
      newErrors.nif = "NIF é obrigatório";
    } else if (!/^\d{9}$/.test(formData.nif)) {
      newErrors.nif = "NIF deve ter 9 dígitos";
    }

    if (!formData.department) {
      newErrors.department = "Departamento é obrigatório";
    }

    if (!formData.position) {
      newErrors.position = "Cargo é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Informações Pessoais</h3>
          <div className="grid gap-2">
            <Label htmlFor="name" className="font-medium">
              Nome Completo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email" className="font-medium">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone" className="font-medium">
              Telefone <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address" className="font-medium">
              Morada
            </Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={2}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="birthDate" className="font-medium">
              Data de Nascimento
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.birthDate ? (
                    format(formData.birthDate, "PPP", { locale: pt })
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.birthDate}
                  onSelect={(date) =>
                    date && setFormData({ ...formData, birthDate: date })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="nif" className="font-medium">
              NIF <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nif"
              name="nif"
              value={formData.nif}
              onChange={handleInputChange}
              className={errors.nif ? "border-red-500" : ""}
            />
            {errors.nif && <p className="text-sm text-red-500">{errors.nif}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bankAccount" className="font-medium">
              Conta Bancária (IBAN)
            </Label>
            <Input
              id="bankAccount"
              name="bankAccount"
              value={formData.bankAccount}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="emergencyContact" className="font-medium">
              Contacto de Emergência
            </Label>
            <Input
              id="emergencyContact"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Professional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Informações Profissionais</h3>
          <div className="grid gap-2">
            <Label htmlFor="department" className="font-medium">
              Departamento <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.department}
              onValueChange={(value) =>
                setFormData({ ...formData, department: value })
              }
            >
              <SelectTrigger
                id="department"
                className={errors.department ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Selecione o departamento" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.department && (
              <p className="text-sm text-red-500">{errors.department}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="position" className="font-medium">
              Cargo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="position"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              className={errors.position ? "border-red-500" : ""}
            />
            {errors.position && (
              <p className="text-sm text-red-500">{errors.position}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status" className="font-medium">
              Status
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  status: value as "active" | "inactive" | "on_leave",
                })
              }
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="on_leave">Ausente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="hireDate" className="font-medium">
              Data de Contratação
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.hireDate ? (
                    format(formData.hireDate, "PPP", { locale: pt })
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.hireDate}
                  onSelect={(date) =>
                    date && setFormData({ ...formData, hireDate: date })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="manager" className="font-medium">
              Gestor
            </Label>
            <Input
              id="manager"
              name="manager"
              value={formData.manager || ""}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contractType" className="font-medium">
              Tipo de Contrato
            </Label>
            <Select
              value={formData.contractType}
              onValueChange={(value) =>
                setFormData({ ...formData, contractType: value })
              }
            >
              <SelectTrigger id="contractType">
                <SelectValue placeholder="Selecione o tipo de contrato" />
              </SelectTrigger>
              <SelectContent>
                {contractTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="education" className="font-medium">
              Formação Académica
            </Label>
            <Input
              id="education"
              name="education"
              value={formData.education}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid gap-2">
            <Label className="font-medium">Competências</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="gap-1">
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Adicionar competência"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleAddSkill}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="avatarUrl" className="font-medium">
              URL da Foto de Perfil
            </Label>
            <Input
              id="avatarUrl"
              name="avatarUrl"
              value={formData.avatarUrl || ""}
              onChange={handleInputChange}
              placeholder="https://exemplo.com/foto.jpg"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" /> Cancelar
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" /> Salvar Alterações
        </Button>
      </div>
    </form>
  );
};

export default EditEmployeeForm;
