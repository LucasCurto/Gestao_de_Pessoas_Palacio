import * as React from "react";
import { addDays, format } from "date-fns";
import { pt } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithPresetsProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function DatePickerWithPresets({
  date,
  onDateChange,
  className,
  placeholder = "Selecione uma data",
  disabled = false,
}: DatePickerWithPresetsProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className,
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "PPP", { locale: pt })
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            onClick={() => onDateChange(new Date())}
            className="text-xs"
          >
            Hoje
          </Button>
          <Button
            variant="outline"
            onClick={() => onDateChange(addDays(new Date(), 1))}
            className="text-xs"
          >
            Amanhã
          </Button>
          <Button
            variant="outline"
            onClick={() => onDateChange(addDays(new Date(), 7))}
            className="text-xs"
          >
            Em 1 semana
          </Button>
          <Button
            variant="outline"
            onClick={() => onDateChange(addDays(new Date(), 30))}
            className="text-xs"
          >
            Em 1 mês
          </Button>
        </div>
        <div className="rounded-md border">
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
            locale={pt}
            initialFocus
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
