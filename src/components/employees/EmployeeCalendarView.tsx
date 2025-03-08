import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { pt } from "date-fns/locale";
import { format, isSameDay } from "date-fns";
import { MonthYearPicker } from "@/components/calendar/MonthYearPicker";

interface Event {
  id: string;
  date: Date;
  title: string;
  type:
    | "vacation"
    | "absence"
    | "holiday"
    | "birthday"
    | "meeting"
    | "training";
}

interface EmployeeCalendarViewProps {
  employeeId?: string;
  events?: Event[];
}

export default function EmployeeCalendarView({
  employeeId,
  events: propEvents,
}: EmployeeCalendarViewProps) {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [events, setEvents] = useState<Event[]>(
    propEvents || [
      {
        id: "1",
        date: new Date(2023, 6, 10),
        title: "Férias",
        type: "vacation",
      },
      {
        id: "2",
        date: new Date(2023, 6, 11),
        title: "Férias",
        type: "vacation",
      },
      {
        id: "3",
        date: new Date(2023, 6, 12),
        title: "Férias",
        type: "vacation",
      },
      {
        id: "4",
        date: new Date(2023, 7, 5),
        title: "Consulta Médica",
        type: "absence",
      },
      {
        id: "5",
        date: new Date(2023, 7, 15),
        title: "Aniversário",
        type: "birthday",
      },
      {
        id: "6",
        date: new Date(2023, 8, 10),
        title: "Treinamento",
        type: "training",
      },
    ],
  );

  // Filter events for the selected date
  const selectedDateEvents = selectedDate
    ? events.filter((event) => isSameDay(event.date, selectedDate))
    : [];

  // Function to get event type color
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "vacation":
        return "bg-blue-500";
      case "absence":
        return "bg-red-500";
      case "holiday":
        return "bg-green-500";
      case "birthday":
        return "bg-purple-500";
      case "meeting":
        return "bg-amber-500";
      case "training":
        return "bg-indigo-500";
      default:
        return "bg-gray-500";
    }
  };

  // Function to get event type label
  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case "vacation":
        return "Férias";
      case "absence":
        return "Ausência";
      case "holiday":
        return "Feriado";
      case "birthday":
        return "Aniversário";
      case "meeting":
        return "Reunião";
      case "training":
        return "Treinamento";
      default:
        return type;
    }
  };

  // Function to check if a date has events
  const hasEvents = (date: Date) => {
    return events.some((event) => isSameDay(event.date, date));
  };

  // Custom day render function for the calendar
  const renderDay = (day: Date) => {
    const dayEvents = events.filter((event) => isSameDay(event.date, day));
    const hasEvent = dayEvents.length > 0;

    return (
      <div className="relative w-full h-full">
        <div>{day.getDate()}</div>
        {hasEvent && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center">
            <div className="flex space-x-0.5">
              {dayEvents.slice(0, 3).map((event, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full ${getEventTypeColor(event.type)}`}
                />
              ))}
              {dayEvents.length > 3 && (
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Calendário do Funcionário</CardTitle>
        <MonthYearPicker
          date={selectedMonth}
          onDateChange={(date) => date && setSelectedMonth(date)}
          className="w-[200px]"
          showMonthOnly
        />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
          <div className="md:col-span-5">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              month={selectedMonth}
              locale={pt}
              modifiers={{
                event: (date) => hasEvents(date),
              }}
              modifiersClassNames={{
                event: "font-bold",
              }}
              components={{
                Day: ({ date, ...props }) => (
                  <div
                    {...props}
                    className={`${props.className} relative h-9 w-9 p-0 font-normal aria-selected:opacity-100`}
                  >
                    {renderDay(date)}
                  </div>
                ),
              }}
            />
          </div>
          <div className="md:col-span-2">
            <div className="rounded-md border p-4 h-full">
              <h3 className="font-medium mb-3">
                {selectedDate
                  ? format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", {
                      locale: pt,
                    })
                  : "Selecione uma data"}
              </h3>

              {selectedDate && selectedDateEvents.length === 0 && (
                <p className="text-sm text-gray-500">
                  Nenhum evento nesta data
                </p>
              )}

              <div className="space-y-2 mt-2">
                {selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-2 rounded-md border bg-gray-50 flex items-start gap-2"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 ${getEventTypeColor(
                        event.type,
                      )}`}
                    />
                    <div>
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs text-gray-500">
                        {getEventTypeLabel(event.type)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2">Legenda</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-xs">Férias</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-xs">Ausência</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs">Feriado</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <span className="text-xs">Aniversário</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-xs">Reunião</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span className="text-xs">Treinamento</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
