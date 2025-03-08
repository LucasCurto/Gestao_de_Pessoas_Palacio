import React, { useState } from "react";
import {
  format,
  addDays,
  addMonths,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EnhancedDateRangePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  className?: string;
  align?: "start" | "center" | "end";
  showCompactPresets?: boolean;
}

export function EnhancedDateRangePicker({
  dateRange,
  onDateRangeChange,
  className,
  align = "start",
  showCompactPresets = false,
}: EnhancedDateRangePickerProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("calendar");

  // Predefined date ranges
  const today = new Date();

  const presets = [
    {
      name: "Hoje",
      dateRange: { from: today, to: today },
    },
    {
      name: "Ontem",
      dateRange: { from: addDays(today, -1), to: addDays(today, -1) },
    },
    {
      name: "Últimos 7 dias",
      dateRange: { from: addDays(today, -6), to: today },
    },
    {
      name: "Últimos 30 dias",
      dateRange: { from: addDays(today, -29), to: today },
    },
    {
      name: "Este mês",
      dateRange: { from: startOfMonth(today), to: endOfMonth(today) },
    },
    {
      name: "Mês passado",
      dateRange: {
        from: startOfMonth(addMonths(today, -1)),
        to: endOfMonth(addMonths(today, -1)),
      },
    },
    {
      name: "Este ano",
      dateRange: { from: startOfYear(today), to: endOfYear(today) },
    },
  ];

  const compactPresets = [
    { name: "Hoje", dateRange: { from: today, to: today } },
    {
      name: "Ontem",
      dateRange: { from: addDays(today, -1), to: addDays(today, -1) },
    },
    {
      name: "Esta semana",
      dateRange: { from: addDays(today, -today.getDay()), to: today },
    },
    {
      name: "Este mês",
      dateRange: { from: startOfMonth(today), to: endOfMonth(today) },
    },
    {
      name: "Mês passado",
      dateRange: {
        from: startOfMonth(addMonths(today, -1)),
        to: endOfMonth(addMonths(today, -1)),
      },
    },
  ];

  const handlePresetSelect = (preset: { from: Date; to: Date }) => {
    onDateRangeChange(preset);
    setIsCalendarOpen(false);
  };

  const handleCustomRangeSelect = (range: DateRange | undefined) => {
    onDateRangeChange(range);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
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
        <PopoverContent className="w-auto p-0" align={align}>
          <Tabs
            defaultValue="calendar"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="calendar">Calendário</TabsTrigger>
              <TabsTrigger value="presets">Períodos</TabsTrigger>
            </TabsList>
            <TabsContent value="calendar" className="p-4">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={handleCustomRangeSelect}
                numberOfMonths={2}
                locale={pt}
              />
            </TabsContent>
            <TabsContent value="presets" className="p-4">
              {showCompactPresets ? (
                <div className="grid grid-cols-2 gap-2">
                  {compactPresets.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      className="justify-start font-normal"
                      onClick={() => handlePresetSelect(preset.dateRange)}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  {presets.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      className="justify-start font-normal"
                      onClick={() => handlePresetSelect(preset.dateRange)}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
          <div className="flex items-center justify-between p-4 pt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onDateRangeChange(undefined);
                setIsCalendarOpen(false);
              }}
            >
              Limpar
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setIsCalendarOpen(false);
              }}
            >
              Aplicar
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
