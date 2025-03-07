import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  FileText,
  ArrowDown,
  ArrowUp,
  DollarSign,
  Clock,
  Calendar,
  Printer,
} from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface AccountEntry {
  id: string;
  date: Date;
  description: string;
  type: "salary" | "activity" | "bonus" | "deduction" | "tax" | "payment";
  amount: number;
  balance: number;
  relatedId?: string;
}

interface MonthlyStatementProps {
  employeeId: string;
  employeeName: string;
  accountEntries: AccountEntry[];
}

const getEntryTypeIcon = (type: AccountEntry["type"]) => {
  switch (type) {
    case "salary":
      return <DollarSign className="h-4 w-4 text-green-600" />;
    case "activity":
      return <Clock className="h-4 w-4 text-blue-600" />;
    case "bonus":
      return <ArrowUp className="h-4 w-4 text-green-600" />;
    case "deduction":
      return <ArrowDown className="h-4 w-4 text-red-600" />;
    case "tax":
      return <ArrowDown className="h-4 w-4 text-red-600" />;
    case "payment":
      return <Calendar className="h-4 w-4 text-green-600" />;
    default:
      return <FileText className="h-4 w-4 text-gray-600" />;
  }
};

const MonthlyStatement: React.FC<MonthlyStatementProps> = ({
  employeeId,
  employeeName,
  accountEntries,
}) => {
  // Get unique months from entries
  const getAvailableMonths = () => {
    const months = new Set<string>();
    accountEntries.forEach((entry) => {
      const monthYear = format(entry.date, "MMMM yyyy", { locale: pt });
      months.add(monthYear);
    });
    return Array.from(months);
  };

  const availableMonths = getAvailableMonths();
  const [selectedMonth, setSelectedMonth] = useState<string>(
    availableMonths[0] || "",
  );

  // Filter entries by selected month
  const filteredEntries = accountEntries.filter((entry) => {
    const entryMonth = format(entry.date, "MMMM yyyy", { locale: pt });
    return entryMonth === selectedMonth;
  });

  // Calculate monthly summary
  const calculateMonthlySummary = () => {
    let totalCredits = 0;
    let totalDebits = 0;

    filteredEntries.forEach((entry) => {
      if (entry.amount > 0) {
        totalCredits += entry.amount;
      } else {
        totalDebits += Math.abs(entry.amount);
      }
    });

    const netChange = totalCredits - totalDebits;
    const openingBalance =
      filteredEntries.length > 0
        ? filteredEntries[filteredEntries.length - 1].balance - netChange
        : 0;
    const closingBalance =
      filteredEntries.length > 0 ? filteredEntries[0].balance : 0;

    return {
      totalCredits,
      totalDebits,
      netChange,
      openingBalance,
      closingBalance,
    };
  };

  const summary = calculateMonthlySummary();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Extrato Mensal</h2>
          <p className="text-sm text-gray-500">
            Extrato de conta para {employeeName}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecione o mês" />
            </SelectTrigger>
            <SelectContent>
              {availableMonths.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            Resumo do Mês: {selectedMonth}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-500">Saldo Inicial</p>
              <p className="font-bold text-lg">
                {summary.openingBalance.toLocaleString("pt-PT")}€
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-500">Créditos</p>
              <p className="font-bold text-lg text-green-600">
                +{summary.totalCredits.toLocaleString("pt-PT")}€
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-500">Débitos</p>
              <p className="font-bold text-lg text-red-600">
                -{summary.totalDebits.toLocaleString("pt-PT")}€
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-500">Variação</p>
              <p
                className={`font-bold text-lg ${summary.netChange >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {summary.netChange >= 0 ? "+" : ""}
                {summary.netChange.toLocaleString("pt-PT")}€
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-500">Saldo Final</p>
              <p className="font-bold text-lg">
                {summary.closingBalance.toLocaleString("pt-PT")}€
              </p>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Saldo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{format(entry.date, "dd/MM/yyyy")}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getEntryTypeIcon(entry.type)}
                      <span>{entry.description}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {entry.type === "salary"
                        ? "Salário"
                        : entry.type === "activity"
                          ? "Atividade"
                          : entry.type === "bonus"
                            ? "Bónus"
                            : entry.type === "deduction"
                              ? "Dedução"
                              : entry.type === "tax"
                                ? "Imposto"
                                : "Pagamento"}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${entry.amount < 0 ? "text-red-600" : "text-green-600"}`}
                  >
                    {entry.amount < 0 ? "-" : "+"}
                    {Math.abs(entry.amount).toLocaleString("pt-PT")}€
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {entry.balance.toLocaleString("pt-PT")}€
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlyStatement;
