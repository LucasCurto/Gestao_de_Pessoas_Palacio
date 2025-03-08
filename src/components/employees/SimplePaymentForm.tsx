import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { MonthYearPicker } from "@/components/calendar/MonthYearPicker";
import { DatePickerWithPresets } from "@/components/calendar/DatePickerWithPresets";
import { Activity } from "./ActivityRegistry";
import { Save, X, CreditCard, BanknoteIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SimplePaymentFormProps {
  employeeId: string;
  employeeName: string;
  baseSalary: number;
  availableActivities: Activity[];
  onSubmit: (paymentData: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const SimplePaymentForm: React.FC<SimplePaymentFormProps> = ({
  employeeId,
  employeeName,
  baseSalary,
  availableActivities,
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [referenceMonth, setReferenceMonth] = useState<Date>(
    initialData?.date ? new Date(initialData.date) : new Date(),
  );
  const [paymentDate, setPaymentDate] = useState<Date>(
    initialData?.date ? new Date(initialData.date) : new Date(),
  );
  const [selectedActivities, setSelectedActivities] = useState<string[]>(
    initialData?.activities ? initialData.activities.map((a: any) => a.id) : [],
  );
  const [values, setValues] = useState<{
    baseSalary: any;
    bonus: any;
    allowances: any;
    deductions: any;
    taxes: any;
    notes: string;
    paymentMethod: string;
  }>({
    baseSalary:
      initialData?.baseSalary !== undefined
        ? initialData.baseSalary
        : baseSalary !== undefined
          ? baseSalary
          : "",
    bonus: initialData?.bonus !== undefined ? initialData.bonus : "",
    allowances:
      initialData?.allowances !== undefined ? initialData.allowances : "",
    deductions:
      initialData?.deductions !== undefined ? initialData.deductions : "",
    taxes: initialData?.taxes !== undefined ? initialData.taxes : "",
    notes: initialData?.notes || "",
    paymentMethod: initialData?.paymentMethod || "bank_transfer",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleActivityToggle = (activityId: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activityId)
        ? prev.filter((id) => id !== activityId)
        : [...prev, activityId],
    );
  };

  const calculateTotal = () => {
    const baseSalary = parseFloat(values.baseSalary as string) || 0;
    const bonus = parseFloat(values.bonus as string) || 0;
    const allowances = parseFloat(values.allowances as string) || 0;
    const deductions = parseFloat(values.deductions as string) || 0;
    const taxes = parseFloat(values.taxes as string) || 0;

    const activitiesTotal = availableActivities
      .filter((activity) => selectedActivities.includes(activity.id))
      .reduce((sum, activity) => sum + activity.hours * activity.rate, 0);

    return (
      baseSalary + bonus + allowances + activitiesTotal - deductions - taxes
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const paymentData = {
      employeeId,
      month: format(referenceMonth, "MMMM yyyy", { locale: pt }),
      date: paymentDate,
      dueDate: new Date(paymentDate.getTime() + 2 * 24 * 60 * 60 * 1000),
      baseSalary: parseFloat(values.baseSalary as string) || 0,
      activityIds: selectedActivities,
      bonus: parseFloat(values.bonus as string) || 0,
      allowances: parseFloat(values.allowances as string) || 0,
      deductions: parseFloat(values.deductions as string) || 0,
      taxes: parseFloat(values.taxes as string) || 0,
      notes: values.notes,
      paymentMethod: values.paymentMethod,
      total: calculateTotal(),
    };

    onSubmit(paymentData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="month">Mês de Referência</Label>
            <MonthYearPicker
              date={referenceMonth}
              onDateChange={(date) => date && setReferenceMonth(date)}
              showMonthOnly
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="date">Data de Pagamento</Label>
            <DatePickerWithPresets
              date={paymentDate}
              onDateChange={(date) => date && setPaymentDate(date)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="baseSalary">Salário Base</Label>
            <Input
              id="baseSalary"
              name="baseSalary"
              type="number"
              value={values.baseSalary}
              onChange={handleInputChange}
              placeholder=""
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="bonus">Bónus</Label>
              <Input
                id="bonus"
                name="bonus"
                type="number"
                value={values.bonus}
                onChange={handleInputChange}
                placeholder=""
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="allowances">Subsídios</Label>
              <Input
                id="allowances"
                name="allowances"
                type="number"
                value={values.allowances}
                onChange={handleInputChange}
                placeholder=""
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="deductions">Deduções</Label>
              <Input
                id="deductions"
                name="deductions"
                type="number"
                value={values.deductions}
                onChange={handleInputChange}
                placeholder=""
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="taxes">Impostos</Label>
              <Input
                id="taxes"
                name="taxes"
                type="number"
                value={values.taxes}
                onChange={handleInputChange}
                placeholder=""
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {availableActivities.length > 0 ? (
            <div>
              <Label className="block mb-2">Atividades Disponíveis</Label>
              <div className="border rounded-md p-3 max-h-[250px] overflow-y-auto space-y-2">
                {availableActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start">
                    <Checkbox
                      id={`activity-${activity.id}`}
                      checked={selectedActivities.includes(activity.id)}
                      onCheckedChange={() => handleActivityToggle(activity.id)}
                      className="mt-1 mr-2"
                    />
                    <div>
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="border rounded-md p-4 text-center text-gray-500">
              <p>Não há atividades disponíveis para incluir neste pagamento</p>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="paymentMethod">Método de Pagamento</Label>
            <Select
              value={values.paymentMethod as string}
              onValueChange={(value) =>
                setValues({ ...values, paymentMethod: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o método de pagamento" />
              </SelectTrigger>
              <SelectContent>
                {/* Carregar métodos de pagamento das configurações do sistema */}
                {(() => {
                  // Tentar carregar métodos de pagamento do localStorage
                  try {
                    const storedMethods =
                      localStorage.getItem("paymentMethods");
                    if (storedMethods) {
                      const methods = JSON.parse(storedMethods);
                      if (methods && methods.length > 0) {
                        return methods
                          .filter((method: any) => method.isActive)
                          .map((method: any) => (
                            <SelectItem key={method.id} value={method.id}>
                              <div className="flex items-center">
                                {method.name
                                  .toLowerCase()
                                  .includes("transferência") ? (
                                  <BanknoteIcon className="h-4 w-4 mr-2 text-blue-600" />
                                ) : (
                                  <CreditCard className="h-4 w-4 mr-2 text-green-600" />
                                )}
                                {method.name}
                              </div>
                            </SelectItem>
                          ));
                      }
                    }
                  } catch (error) {
                    console.error(
                      "Erro ao carregar métodos de pagamento:",
                      error,
                    );
                  }

                  // Métodos padrão caso não haja configurações
                  return (
                    <>
                      <SelectItem value="bank_transfer">
                        <div className="flex items-center">
                          <BanknoteIcon className="h-4 w-4 mr-2 text-blue-600" />
                          Transferência Bancária
                        </div>
                      </SelectItem>
                      <SelectItem value="multibanco">
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2 text-green-600" />
                          Multibanco
                        </div>
                      </SelectItem>
                      <SelectItem value="mbway">
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2 text-purple-600" />
                          MBWay
                        </div>
                      </SelectItem>
                    </>
                  );
                })()}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              name="notes"
              value={values.notes}
              onChange={handleInputChange}
              placeholder="Observações sobre este pagamento"
              rows={3}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-md mt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Salário Base:</span>
                <span>
                  {parseFloat(values.baseSalary as string)?.toFixed(2) ||
                    "0.00"}
                  €
                </span>
              </div>

              {selectedActivities.length > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Atividades:</span>
                  <span>
                    {availableActivities
                      .filter((activity) =>
                        selectedActivities.includes(activity.id),
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

              {values.bonus && (
                <div className="flex justify-between text-sm">
                  <span>Bónus:</span>
                  <span>{parseFloat(values.bonus as string).toFixed(2)}€</span>
                </div>
              )}

              {values.allowances && (
                <div className="flex justify-between text-sm">
                  <span>Subsídios:</span>
                  <span>
                    {parseFloat(values.allowances as string).toFixed(2)}€
                  </span>
                </div>
              )}

              {values.deductions && (
                <div className="flex justify-between text-sm">
                  <span>Deduções:</span>
                  <span className="text-red-600">
                    -{parseFloat(values.deductions as string).toFixed(2)}€
                  </span>
                </div>
              )}

              {values.taxes && (
                <div className="flex justify-between text-sm">
                  <span>Impostos:</span>
                  <span className="text-red-600">
                    -{parseFloat(values.taxes as string).toFixed(2)}€
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
          <Save className="h-4 w-4 mr-2" />{" "}
          {initialData ? "Salvar Alterações" : "Criar Pagamento"}
        </Button>
      </div>
    </form>
  );
};

export default SimplePaymentForm;
