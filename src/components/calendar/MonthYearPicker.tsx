import * as React from "react";
import {
  format,
  getYear,
  setMonth,
  setYear,
  addMonths,
  subMonths,
} from "date-fns";
import { pt } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";

interface MonthYearPickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  showMonthOnly?: boolean;
}

export function MonthYearPicker({
  date,
  onDateChange,
  className,
  placeholder = "Selecione um período",
  disabled = false,
  showMonthOnly = false,
}: MonthYearPickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    date,
  );
  const [isOpen, setIsOpen] = React.useState(false);
  const [view, setView] = React.useState<"grid" | "select">("grid");

  React.useEffect(() => {
    setSelectedDate(date);
  }, [date]);

  const handleMonthChange = (month: string) => {
    if (!selectedDate) {
      const newDate = new Date();
      const updatedDate = setMonth(newDate, parseInt(month));
      setSelectedDate(updatedDate);
      onDateChange(updatedDate);
    } else {
      const updatedDate = setMonth(selectedDate, parseInt(month));
      setSelectedDate(updatedDate);
      onDateChange(updatedDate);
    }
  };

  const handleYearChange = (year: string) => {
    if (!selectedDate) {
      const newDate = new Date();
      const updatedDate = setYear(newDate, parseInt(year));
      setSelectedDate(updatedDate);
      onDateChange(updatedDate);
    } else {
      const updatedDate = setYear(selectedDate, parseInt(year));
      setSelectedDate(updatedDate);
      onDateChange(updatedDate);
    }
  };

  const handlePreviousMonth = () => {
    if (selectedDate) {
      const newDate = subMonths(selectedDate, 1);
      setSelectedDate(newDate);
      onDateChange(newDate);
    } else {
      const newDate = subMonths(new Date(), 1);
      setSelectedDate(newDate);
      onDateChange(newDate);
    }
  };

  const handleNextMonth = () => {
    if (selectedDate) {
      const newDate = addMonths(selectedDate, 1);
      setSelectedDate(newDate);
      onDateChange(newDate);
    } else {
      const newDate = addMonths(new Date(), 1);
      setSelectedDate(newDate);
      onDateChange(newDate);
    }
  };

  const selectMonth = (monthIndex: number) => {
    const currentDate = selectedDate || new Date();
    const newDate = setMonth(currentDate, monthIndex);
    setSelectedDate(newDate);
    onDateChange(newDate);
    setIsOpen(false);
  };

  // Generate years (current year - 10 to current year + 10)
  const currentYear = getYear(new Date());
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  // Generate months
  const months = [
    { value: 0, label: "Janeiro" },
    { value: 1, label: "Fevereiro" },
    { value: 2, label: "Março" },
    { value: 3, label: "Abril" },
    { value: 4, label: "Maio" },
    { value: 5, label: "Junho" },
    { value: 6, label: "Julho" },
    { value: 7, label: "Agosto" },
    { value: 8, label: "Setembro" },
    { value: 9, label: "Outubro" },
    { value: 10, label: "Novembro" },
    { value: 11, label: "Dezembro" },
  ];

  const currentMonth = selectedDate
    ? selectedDate.getMonth()
    : new Date().getMonth();
  const currentYearValue = selectedDate ? getYear(selectedDate) : currentYear;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-between text-left font-normal",
            !selectedDate && "text-muted-foreground",
            className,
          )}
          disabled={disabled}
        >
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? (
              <span className="font-medium">
                {format(selectedDate, "MMMM yyyy", { locale: pt })}
              </span>
            ) : (
              <span>{placeholder}</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {selectedDate && (
              <Badge
                variant="outline"
                className="font-normal bg-blue-50 text-blue-700 border-blue-200"
              >
                {format(selectedDate, "MMM", { locale: pt })}
              </Badge>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 border-b">
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("grid")}
              className={view === "grid" ? "bg-blue-50" : ""}
            >
              Grade
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("select")}
              className={view === "select" ? "bg-blue-50" : ""}
            >
              Seletor
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-sm font-medium">
              {selectedDate
                ? format(selectedDate, "MMMM yyyy", { locale: pt })
                : format(new Date(), "MMMM yyyy", { locale: pt })}
            </h2>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {view === "grid" ? (
          <div className="p-3">
            <div className="grid grid-cols-3 gap-2">
              {months.map((month) => (
                <Button
                  key={month.value}
                  variant={currentMonth === month.value ? "default" : "outline"}
                  className={cn(
                    "h-9 text-xs",
                    currentMonth === month.value && "bg-blue-600",
                  )}
                  onClick={() => selectMonth(month.value)}
                >
                  {month.label.substring(0, 3)}
                </Button>
              ))}
            </div>
            {!showMonthOnly && (
              <div className="mt-3 flex justify-between items-center">
                <label className="text-sm font-medium">Ano:</label>
                <Select
                  value={currentYearValue.toString()}
                  onValueChange={handleYearChange}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        ) : (
          <div className="p-3">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Mês
                    </label>
                    <Select
                      value={currentMonth.toString()}
                      onValueChange={(value) => handleMonthChange(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem
                            key={month.value}
                            value={month.value.toString()}
                          >
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {!showMonthOnly && (
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Ano
                      </label>
                      <Select
                        value={currentYearValue.toString()}
                        onValueChange={handleYearChange}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-3 border-t flex justify-end">
          <Button size="sm" onClick={() => setIsOpen(false)}>
            Aplicar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
