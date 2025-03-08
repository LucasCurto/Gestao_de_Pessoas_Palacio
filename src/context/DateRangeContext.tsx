import React, { createContext, useContext, useState, ReactNode } from "react";
import { DateRange } from "react-day-picker";

interface DateRangeContextType {
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
}

const DateRangeContext = createContext<DateRangeContextType | undefined>(
  undefined,
);

export function useDateRange() {
  const context = useContext(DateRangeContext);
  if (context === undefined) {
    throw new Error("useDateRange must be used within a DateRangeProvider");
  }
  return context;
}

interface DateRangeProviderProps {
  children: ReactNode;
}

export function DateRangeProvider({ children }: DateRangeProviderProps) {
  // Default to current month
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: firstDayOfMonth,
    to: lastDayOfMonth,
  });

  return (
    <DateRangeContext.Provider value={{ dateRange, setDateRange }}>
      {children}
    </DateRangeContext.Provider>
  );
}
