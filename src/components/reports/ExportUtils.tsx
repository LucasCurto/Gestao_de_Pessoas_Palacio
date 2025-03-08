import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

// Função para exportar dados para Excel
export const exportToExcel = (data: any[], fileName: string) => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Gerar arquivo Excel
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Salvar arquivo
    saveAs(blob, `${fileName}_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
    return true;
  } catch (error) {
    console.error("Erro ao exportar para Excel:", error);
    return false;
  }
};

// Função para exportar dados para PDF
export const exportToPDF = (
  data: any[],
  columns: string[],
  fileName: string,
  title: string,
) => {
  try {
    const doc = new jsPDF();

    // Adicionar título
    doc.setFontSize(16);
    doc.text(title, 14, 15);

    // Adicionar data
    doc.setFontSize(10);
    doc.text(`Gerado em: ${format(new Date(), "PPP", { locale: pt })}`, 14, 22);

    // Preparar dados para a tabela
    const tableData = data.map((item) => columns.map((col) => item[col] || ""));

    // Adicionar tabela
    (doc as any).autoTable({
      head: [columns],
      body: tableData,
      startY: 30,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // Salvar arquivo
    doc.save(`${fileName}_${format(new Date(), "yyyy-MM-dd")}.pdf`);
    return true;
  } catch (error) {
    console.error("Erro ao exportar para PDF:", error);
    return false;
  }
};

// Função para formatar dados de pagamentos para exportação
export const formatPaymentsForExport = (payments: any[]) => {
  return payments.map((payment) => ({
    Data: format(new Date(payment.date), "dd/MM/yyyy", { locale: pt }),
    Mês: payment.month,
    Funcionário: payment.employeeName || "",
    "Salário Base": payment.baseSalary.toFixed(2) + "€",
    "Nº Atividades": payment.activities?.length || 0,
    "Valor Atividades":
      payment.activities
        ?.reduce((sum: number, a: any) => sum + a.hours * a.rate, 0)
        .toFixed(2) + "€" || "0.00€",
    Bónus: payment.bonus.toFixed(2) + "€",
    Subsídios: payment.allowances?.toFixed(2) + "€" || "0.00€",
    Deduções: payment.deductions.toFixed(2) + "€",
    Impostos: payment.taxes.toFixed(2) + "€",
    Total: payment.total.toFixed(2) + "€",
    Status: payment.status,
    "Método de Pagamento": payment.paymentMethod,
  }));
};

// Função para formatar dados de atividades para exportação
export const formatActivitiesForExport = (activities: any[]) => {
  return activities.map((activity) => ({
    Data: format(new Date(activity.date), "dd/MM/yyyy", { locale: pt }),
    Tipo: activity.type,
    Descrição: activity.description,
    Funcionário: activity.employeeName || "",
    Horas: activity.hours,
    "Taxa (€/h)": activity.rate.toFixed(2) + "€",
    Valor: (activity.hours * activity.rate).toFixed(2) + "€",
    Status: activity.status,
  }));
};

// Função para formatar dados de funcionários para exportação
export const formatEmployeesForExport = (employees: any[]) => {
  return employees.map((employee) => ({
    Nome: employee.name,
    Email: employee.email,
    Telefone: employee.phone,
    Departamento: employee.department,
    Cargo: employee.position,
    "Data Contratação": format(new Date(employee.hireDate), "dd/MM/yyyy", {
      locale: pt,
    }),
    "Salário Base": employee.baseSalary.toFixed(2) + "€",
    Status: employee.status,
  }));
};

// Função para formatar dados de transações para exportação
export const formatTransactionsForExport = (transactions: any[]) => {
  return transactions.map((transaction) => ({
    Data: format(new Date(transaction.date), "dd/MM/yyyy", { locale: pt }),
    Descrição: transaction.description,
    Tipo: transaction.type === "task" ? "Tarefa" : "Pagamento",
    Valor: transaction.amount.toFixed(2) + "€",
    Status: transaction.status,
    Referência: transaction.reference,
  }));
};

// Função para formatar dados de métodos de pagamento para exportação
export const formatPaymentMethodsForExport = (methods: any[]) => {
  return methods.map((method) => ({
    Nome: method.name,
    "Total Transações": method.count,
    "Valor Total": `${method.totalAmount.toFixed(2)}€`,
    Pendentes: method.pendingCount,
    Aprovados: method.approvedCount,
    Pagos: method.paidCount,
  }));
};

// Função para formatar dados de tipos de atividade para exportação
export const formatActivityTypesForExport = (types: any[]) => {
  return types.map((type) => ({
    Nome: type.name,
    "Total Atividades": type.count,
    "Valor Total": `${type.totalAmount.toFixed(2)}€`,
    Pendentes: type.pendingCount,
    Aprovados: type.approvedCount,
    Pagos: type.paidCount,
  }));
};
