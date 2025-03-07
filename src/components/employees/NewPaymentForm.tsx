import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
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
import { Calendar as CalendarIcon, Save, X } from "lucide-react";

interface Activity {
  id: string;
  employeeId: string;
  type: string;
  description: string;
  date: Date;
  hours: number;
  rate: number;
  status: "pending" | "approved" | "rejected" | "paid";
  paymentRequestId?: string;
}

interface NewPaymentFormProps {
  employeeId: string;
  employeeName: string;
  baseSalary: number;
  availableActivities: Activity[];
  onSubmit: (paymentData: PaymentFormData) => void;
  onCancel: () => void;
}

export interface PaymentFormData {
  employeeId: string;
  month: string;
  date: Date;
  dueDate: Date;
  baseSalary: number;
  activityIds: string[];
  bonus: number;
  allowances: number;
  deductions: number;
  taxes: number;
  notes?: string;
}

const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const NewPaymentForm: React.FC<NewPaymentFormProps> = ({
  employeeId,
  employeeName,
  baseSalary,
  availableActivities,
  onSubmit,
  onCancel,
}) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const [formData, setFormData] = useState<PaymentFormData>({
    employeeId,
    month: `${months[currentMonth]} ${currentYear}`,
    date: currentDate,
    dueDate: new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000), // Default due date: 2 days from now
    baseSalary,
    activityIds: [],
    bonus: 0,
    allowances: 0,
    deductions: 0,
    taxes: 0,
    notes: "",
  });

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

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleActivityToggle = (activityId: string) => {
    const updatedActivityIds = formData.activityIds.includes(activityId)
      ? formData.activityIds.filter((id) => id !== activityId)
      : [...formData.activityIds, activityId];

    setFormData({ ...formData, activityIds: updatedActivityIds });
  };

  const calculateTotal = () => {
    const activityTotal = availableActivities
      .filter((activity) => formData.activityIds.includes(activity.id))
      .reduce((sum, activity) => sum + activity.hours * activity.rate, 0);

    return (
      formData.baseSalary +
      activityTotal +
      formData.bonus +
      formData.allowances -
      formData.deductions -
      formData.taxes
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.month) {
      newErrors.month = "Mês é obrigatório";
    }

    if (!formData.date) {
      newErrors.date = "Data de pagamento é obrigatória";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Data de vencimento é obrigatória";
    }

    if (formData.baseSalary <= 0) {
      newErrors.baseSalary = "Salário base deve ser maior que zero";
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
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="month" className="font-medium">
              Mês de Referência <span className="text-red-500">*</span>
            </Label>
            <Input
              id="month"
              name="month"
              value={formData.month}
              onChange={handleInputChange}
              className={errors.month ? "border-red-500" : ""}
            />
            {errors.month && (
              <p className="text-sm text-red-500">{errors.month}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date" className="font-medium">
              Data de Pagamento <span className="text-red-500">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${errors.date ? "border-red-500" : ""}`}
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
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dueDate" className="font-medium">
              Data de Vencimento <span className="text-red-500">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${errors.dueDate ? "border-red-500" : ""}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dueDate ? (
                    format(formData.dueDate, "PPP", { locale: pt })
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.dueDate}
                  onSelect={(date) =>
                    date && setFormData({ ...formData, dueDate: date })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.dueDate && (
              <p className="text-sm text-red-500">{errors.dueDate}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes" className="font-medium">
              Notas
            </Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes || ""}
              onChange={handleInputChange}
              placeholder="Observações sobre este pagamento"
              rows={4}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="baseSalary" className="font-medium">
              Salário Base <span className="text-red-500">*</span>
            </Label>
            <Input
              id="baseSalary"
              name="baseSalary"
              type="number"
              min="0"
              step="0.01"
              value={formData.baseSalary}
              onChange={handleNumberInputChange}
              className={errors.baseSalary ? "border-red-500" : ""}
            />
            {errors.baseSalary && (
              <p className="text-sm text-red-500">{errors.baseSalary}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="bonus" className="font-medium">
                Bónus
              </Label>
              <Input
                id="bonus"
                name="bonus"
                type="number"
                min="0"
                step="0.01"
                value={formData.bonus}
                onChange={handleNumberInputChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="allowances" className="font-medium">
                Subsídios
              </Label>
              <Input
                id="allowances"
                name="allowances"
                type="number"
                min="0"
                step="0.01"
                value={formData.allowances}
                onChange={handleNumberInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="deductions" className="font-medium">
                Deduções
              </Label>
              <Input
                id="deductions"
                name="deductions"
                type="number"
                min="0"
                step="0.01"
                value={formData.deductions}
                onChange={handleNumberInputChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="taxes" className="font-medium">
                Impostos
              </Label>
              <Input
                id="taxes"
                name="taxes"
                type="number"
                min="0"
                step="0.01"
                value={formData.taxes}
                onChange={handleNumberInputChange}
              />
            </div>
          </div>

          {availableActivities.length > 0 && (
            <div className="mt-4">
              <Label className="font-medium mb-2 block">
                Atividades Disponíveis
              </Label>
              <div className="bg-gray-50 p-3 rounded-md max-h-[200px] overflow-y-auto">
                <div className="space-y-2">
                  {availableActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start">
                      <Checkbox
                        id={`activity-${activity.id}`}
                        checked={formData.activityIds.includes(activity.id)}
                        onCheckedChange={() =>
                          handleActivityToggle(activity.id)
                        }
                        className="mt-1 mr-2"
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor={`activity-${activity.id}`}
                          className="font-medium cursor-pointer"
                        >
                          {activity.type} -{" "}
                          {(activity.hours * activity.rate).toFixed(2)}€
                        </Label>
                        <p className="text-xs text-gray-500">
                          {format(activity.date, "P", { locale: pt })} •{" "}
                          {activity.hours}h × {activity.rate}€/h
                        </p>
                        <p className="text-xs text-gray-600">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-md mt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Salário Base:</span>
                <span>{formData.baseSalary.toFixed(2)}€</span>
              </div>

              {formData.activityIds.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Atividades:</span>
                  <span>
                    {availableActivities
                      .filter((activity) =>
                        formData.activityIds.includes(activity.id),
                      )
                      .reduce(
                        (sum, activity) => sum + activity.hours * activity.rate,
                        0,
                      )
                      .toFixed(2)}
                    €
                  </span>
                </div>
              )}

              {formData.bonus > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Bónus:</span>
                  <span>{formData.bonus.toFixed(2)}€</span>
                </div>
              )}

              {formData.allowances > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subsídios:</span>
                  <span>{formData.allowances.toFixed(2)}€</span>
                </div>
              )}

              {formData.deductions > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Deduções:</span>
                  <span className="text-red-600">
                    -{formData.deductions.toFixed(2)}€
                  </span>
                </div>
              )}

              {formData.taxes > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Impostos:</span>
                  <span className="text-red-600">
                    -{formData.taxes.toFixed(2)}€
                  </span>
                </div>
              )}

              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>{calculateTotal().toFixed(2)}€</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" /> Cancelar
        </Button>
        <Button type="submit">
          <Save className="h-4 w-4 mr-2" /> Criar Pagamento
        </Button>
      </div>
    </form>
  );
};

export default NewPaymentForm;
