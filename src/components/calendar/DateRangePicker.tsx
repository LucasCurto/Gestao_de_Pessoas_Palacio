import React, { useState } from "react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  className?: string;
}

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
  className,
}: DateRangePickerProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Predefined date ranges
  const selectThisMonth = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0,
    );
    onDateRangeChange({ from: firstDayOfMonth, to: lastDayOfMonth });
    setIsCalendarOpen(false);
  };

  const selectLastMonth = () => {
    const today = new Date();
    const firstDayOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1,
    );
    const lastDayOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      0,
    );
    onDateRangeChange({ from: firstDayOfLastMonth, to: lastDayOfLastMonth });
    setIsCalendarOpen(false);
  };

  const selectLast30Days = () => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    onDateRangeChange({ from: thirtyDaysAgo, to: today });
    setIsCalendarOpen(false);
  };

  const selectLast90Days = () => {
    const today = new Date();
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(today.getDate() - 90);
    onDateRangeChange({ from: ninetyDaysAgo, to: today });
    setIsCalendarOpen(false);
  };

  const selectThisYear = () => {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const lastDayOfYear = new Date(today.getFullYear(), 11, 31);
    onDateRangeChange({ from: firstDayOfYear, to: lastDayOfYear });
    setIsCalendarOpen(false);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !dateRange && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "dd/MM/yyyy", { locale: pt })} -{" "}
                  {format(dateRange.to, "dd/MM/yyyy", { locale: pt })}
                </>
              ) : (
                format(dateRange.from, "dd/MM/yyyy", { locale: pt })
              )
            ) : (
              <span>Selecione um período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-col sm:flex-row">
            <div className="border-r p-2 space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={selectThisMonth}
              >
                Este mês
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={selectLastMonth}
              >
                Mês anterior
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={selectLast30Days}
              >
                Últimos 30 dias
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={selectLast90Days}
              >
                Últimos 90 dias
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={selectThisYear}
              >
                Este ano
              </Button>
            </div>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={onDateRangeChange}
              numberOfMonths={2}
              locale={pt}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
