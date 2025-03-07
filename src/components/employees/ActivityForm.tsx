import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Clock, Save, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
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

interface ActivityFormProps {
  employeeId: string;
  onSubmit: (activity: ActivityFormData) => void;
  onCancel: () => void;
}

export interface ActivityFormData {
  employeeId: string;
  type: string;
  description: string;
  date: Date;
  hours: number;
  rate: number;
}

const activityTypes = [
  { id: "overtime", label: "Horas Extras", defaultRate: 15 },
  { id: "weekend", label: "Trabalho Fim de Semana", defaultRate: 20 },
  { id: "holiday", label: "Trabalho em Feriado", defaultRate: 25 },
  { id: "training", label: "Formação", defaultRate: 12 },
  { id: "travel", label: "Deslocação", defaultRate: 10 },
  { id: "special_project", label: "Projeto Especial", defaultRate: 18 },
];

const ActivityForm: React.FC<ActivityFormProps> = ({
  employeeId,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ActivityFormData>({
    employeeId,
    type: "",
    description: "",
    date: new Date(),
    hours: 0,
    rate: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleActivityTypeChange = (type: string) => {
    const selectedType = activityTypes.find((t) => t.id === type);
    setFormData({
      ...formData,
      type,
      rate: selectedType ? selectedType.defaultRate : 0,
    });
    if (errors.type) {
      setErrors({ ...errors, type: "" });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.type) {
      newErrors.type = "Selecione um tipo de atividade";
    }

    if (!formData.description) {
      newErrors.description = "Descrição é obrigatória";
    }

    if (formData.hours <= 0) {
      newErrors.hours = "Horas devem ser maiores que zero";
    }

    if (formData.rate <= 0) {
      newErrors.rate = "Taxa deve ser maior que zero";
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Registar Nova Atividade</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="activity-type" className="font-medium">
              Tipo de Atividade <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.type}
              onValueChange={handleActivityTypeChange}
            >
              <SelectTrigger
                id="activity-type"
                className={errors.type ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Selecione o tipo de atividade" />
              </SelectTrigger>
              <SelectContent>
                {activityTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.label} ({type.defaultRate}€/hora)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date" className="font-medium">
              Data <span className="text-red-500">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? (
                    format(formData.date, "PPP", { locale: pt })
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) =>
                    date && setFormData({ ...formData, date })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="hours" className="font-medium">
                Horas <span className="text-red-500">*</span>
              </Label>
              <Input
                id="hours"
                name="hours"
                type="number"
                min="0.5"
                step="0.5"
                value={formData.hours || ""}
                onChange={handleNumberInputChange}
                className={errors.hours ? "border-red-500" : ""}
              />
              {errors.hours && (
                <p className="text-sm text-red-500">{errors.hours}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="rate" className="font-medium">
                Taxa por Hora (€) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="rate"
                name="rate"
                type="number"
                min="0"
                step="0.5"
                value={formData.rate || ""}
                onChange={handleNumberInputChange}
                className={errors.rate ? "border-red-500" : ""}
              />
              {errors.rate && (
                <p className="text-sm text-red-500">{errors.rate}</p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className="font-medium">
              Descrição <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Descreva a atividade realizada"
              className={errors.description ? "border-red-500" : ""}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="bg-muted p-3 rounded-md">
            <p className="font-medium">
              Valor Total: {(formData.hours * formData.rate).toFixed(2)}€
            </p>
            <p className="text-sm text-muted-foreground">
              {formData.hours} horas × {formData.rate}€/hora
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" /> Cancelar
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" /> Guardar Atividade
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ActivityForm;
