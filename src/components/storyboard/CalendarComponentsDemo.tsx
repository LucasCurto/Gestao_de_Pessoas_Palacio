import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePickerWithPresets } from "@/components/calendar/DatePickerWithPresets";
import { MonthYearPicker } from "@/components/calendar/MonthYearPicker";
import { EnhancedDateRangePicker } from "@/components/calendar/EnhancedDateRangePicker";
import { DateRange } from "react-day-picker";
import EmployeeCalendarView from "@/components/employees/EmployeeCalendarView";
import EmployeeTimelineView from "@/components/employees/EmployeeTimelineView";

export default function CalendarComponentsDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [monthYear, setMonthYear] = useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 1),
    to: new Date(2023, 0, 15),
  });

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6">
        Componentes de Calendário Melhorados
      </h1>

      <Tabs defaultValue="pickers">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pickers">Seletores de Data</TabsTrigger>
          <TabsTrigger value="calendar">Calendário do Funcionário</TabsTrigger>
          <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
        </TabsList>

        <TabsContent value="pickers" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Seletor de Data com Presets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <DatePickerWithPresets date={date} onDateChange={setDate} />
                <p className="text-sm text-gray-500 mt-2">
                  Data selecionada:{" "}
                  {date ? date.toLocaleDateString() : "Nenhuma"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seletor de Mês e Ano</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <MonthYearPicker date={monthYear} onDateChange={setMonthYear} />
                <p className="text-sm text-gray-500 mt-2">
                  Período selecionado:{" "}
                  {monthYear
                    ? monthYear.toLocaleDateString("pt-BR", {
                        month: "long",
                        year: "numeric",
                      })
                    : "Nenhum"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seletor de Intervalo de Datas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <EnhancedDateRangePicker
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Intervalo:{" "}
                  {dateRange?.from
                    ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to?.toLocaleDateString() || ""}`
                    : "Nenhum"}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <EmployeeCalendarView />
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <EmployeeTimelineView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
