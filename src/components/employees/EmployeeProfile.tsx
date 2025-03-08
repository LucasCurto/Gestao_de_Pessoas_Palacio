import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MonthYearPicker } from "@/components/calendar/MonthYearPicker";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
} from "lucide-react";
import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";
import EmployeePaymentSystem from "./EmployeePaymentSystem";
import EmployeeTimelineView from "./EmployeeTimelineView";
import EmployeeCurrentAccount from "./EmployeeCurrentAccount";
import EditEmployeeButton from "./EditEmployeeButton";

const EmployeeProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [employeeData, setEmployeeData] = useState({
    id: id || "1",
    name: "Ana Silva",
    email: "ana.silva@empresa.pt",
    phone: "+351 912 345 678",
    address: "Rua das Flores, 123, Lisboa",
    department: "Recursos Humanos",
    position: "Gerente de RH",
    status: "active" as const,
    hireDate: new Date(2020, 2, 15),
    birthDate: new Date(1985, 5, 20),
    nif: "123456789",
    bankAccount: "PT50 1234 5678 9012 3456 7890 1",
    emergencyContact: "+351 923 456 789 (Maria Silva)",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
    manager: "Carlos Mendes",
    contractType: "Sem Termo",
    education: "Mestrado em Gestão de Recursos Humanos",
    skills: [
      "Recrutamento",
      "Gestão de Equipes",
      "Legislação Laboral",
      "Formação",
    ],
    baseSalary: 2500,
  });

  // Compartilhar o mês selecionado entre os componentes
  useEffect(() => {
    // Armazenar o mês selecionado no localStorage para compartilhar entre componentes
    localStorage.setItem("selectedMonth", selectedMonth.toISOString());

    // Limpar os dados de cache para forçar recarregamento com o novo mês
    localStorage.removeItem("filteredPayments");
    localStorage.removeItem("filteredTasks");
    localStorage.removeItem("filteredTransactions");

    // Disparar um evento para notificar os componentes sobre a mudança
    window.dispatchEvent(new Event("selectedMonthChanged"));

    console.log("Mês alterado para:", selectedMonth.toISOString());
  }, [selectedMonth]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleEmployeeUpdate = (updatedEmployee: any) => {
    setEmployeeData(updatedEmployee);
    // Aqui você poderia salvar no localStorage ou fazer uma chamada API
    console.log("Funcionário atualizado:", updatedEmployee);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar className={`${isSidebarOpen ? "block" : "hidden"} md:block`} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header title="Perfil do Funcionário" onMenuToggle={toggleSidebar} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Back button */}
            <div>
              <Button
                variant="ghost"
                size="sm"
                className="mb-4"
                onClick={() => navigate("/employees")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
              </Button>
            </div>

            {/* Employee Profile Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
                      <img
                        src={employeeData.avatar}
                        alt={employeeData.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <Badge
                      variant="outline"
                      className={`absolute bottom-0 right-0 ${employeeData.status === "active" ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-700 border-gray-200"}`}
                    >
                      {employeeData.status === "active" ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>

                  {/* Employee Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-2xl font-bold">
                          {employeeData.name}
                        </h2>
                        <p className="text-gray-500">
                          {employeeData.position} • {employeeData.department}
                        </p>
                      </div>
                      <EditEmployeeButton
                        employee={employeeData}
                        onEmployeeUpdate={handleEmployeeUpdate}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-500 mr-2" />
                          <span>{employeeData.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-500 mr-2" />
                          <span>{employeeData.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                          <span>{employeeData.address}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                          <span>
                            Contratado em{" "}
                            {new Date(employeeData.hireDate).toLocaleDateString(
                              "pt-PT",
                            )}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
                          <span>
                            Salário Base: {employeeData.baseSalary.toFixed(2)}€
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information Section */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-medium text-lg mb-4">
                    Informações Adicionais
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">
                          NIF
                        </h4>
                        <p>{employeeData.nif}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">
                          Data de Nascimento
                        </h4>
                        <p>
                          {new Date(employeeData.birthDate).toLocaleDateString(
                            "pt-PT",
                          )}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">
                          Contacto de Emergência
                        </h4>
                        <p>{employeeData.emergencyContact}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">
                          Tipo de Contrato
                        </h4>
                        <p>{employeeData.contractType}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">
                          Gestor
                        </h4>
                        <p>{employeeData.manager}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">
                          Formação Académica
                        </h4>
                        <p>{employeeData.education}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">
                          IBAN
                        </h4>
                        <p className="font-mono text-sm">
                          {employeeData.bankAccount}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">
                          Competências
                        </h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {employeeData.skills.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs for different sections */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Mês de Referência</h3>
              <div className="w-[200px]">
                <MonthYearPicker
                  date={selectedMonth}
                  onDateChange={(date) => date && setSelectedMonth(date)}
                  showMonthOnly
                />
              </div>
            </div>

            <Tabs defaultValue="tasks">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="tasks">Registro de Tarefas</TabsTrigger>
                <TabsTrigger value="payments">Pagamentos</TabsTrigger>
                <TabsTrigger value="account">Conta Corrente</TabsTrigger>
              </TabsList>

              <TabsContent value="tasks">
                <EmployeeTimelineView employeeId={employeeData.id} />
              </TabsContent>

              <TabsContent value="payments">
                <EmployeePaymentSystem
                  employeeId={employeeData.id}
                  employeeName={employeeData.name}
                  baseSalary={employeeData.baseSalary}
                />
              </TabsContent>

              <TabsContent value="account">
                <EmployeeCurrentAccount
                  employeeId={employeeData.id}
                  employeeName={employeeData.name}
                />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeProfile;
