import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ActivityRegistry from "./ActivityRegistry";
import PaymentHistory from "./PaymentHistory";
import EditEmployeeForm from "./EditEmployeeForm";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  FileText,
  Clock,
  DollarSign,
  Edit,
  Download,
  User,
  Building,
  GraduationCap,
  Heart,
} from "lucide-react";

interface EmployeeActivity {
  id: string;
  type: string;
  description: string;
  date: string;
  icon: React.ReactNode;
}

interface EmployeePayment {
  id: string;
  month: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "processing" | "failed";
  details: {
    baseSalary: number;
    bonus: number;
    allowances: number;
    deductions: number;
    taxes: number;
  };
}

interface EmployeeData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  department: string;
  position: string;
  status: "active" | "inactive" | "on_leave";
  hireDate: string;
  birthDate: string;
  nif: string;
  bankAccount: string;
  emergencyContact: string;
  avatarUrl?: string;
  manager?: string;
  contractType: string;
  education: string;
  skills: string[];
  activities: EmployeeActivity[];
  payments: EmployeePayment[];
}

const employeesData: Record<string, EmployeeData> = {
  "1": {
    id: "1",
    name: "Ana Silva",
    email: "ana.silva@empresa.pt",
    phone: "+351 912 345 678",
    address: "Rua das Flores, 123, Lisboa",
    department: "Recursos Humanos",
    position: "Gerente de RH",
    status: "active",
    hireDate: "2020-03-15",
    birthDate: "1985-06-12",
    nif: "123456789",
    bankAccount: "PT50 1234 5678 9012 3456 7890 1",
    emergencyContact: "João Silva: +351 913 456 789",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
    manager: "Carlos Mendes",
    contractType: "Sem Termo",
    education: "Mestrado em Gestão de Recursos Humanos",
    skills: [
      "Recrutamento",
      "Gestão de Talento",
      "Legislação Laboral",
      "Formação",
    ],
    activities: [
      {
        id: "a1",
        type: "Sistema",
        description: "Atualizou informações de perfil",
        date: "2023-05-20T14:30:00",
        icon: <User className="h-4 w-4 text-blue-500" />,
      },
      {
        id: "a2",
        type: "Departamento",
        description: "Alteração de departamento: Marketing → Recursos Humanos",
        date: "2023-04-15T09:15:00",
        icon: <Building className="h-4 w-4 text-purple-500" />,
      },
      {
        id: "a3",
        type: "Formação",
        description: "Concluiu formação: Legislação Laboral Atualizada",
        date: "2023-03-10T16:45:00",
        icon: <GraduationCap className="h-4 w-4 text-green-500" />,
      },
      {
        id: "a4",
        type: "Ausência",
        description: "Férias aprovadas: 10 dias",
        date: "2023-02-28T11:20:00",
        icon: <Calendar className="h-4 w-4 text-amber-500" />,
      },
      {
        id: "a5",
        type: "Benefício",
        description: "Adicionado ao plano de saúde empresarial",
        date: "2023-01-15T10:00:00",
        icon: <Heart className="h-4 w-4 text-red-500" />,
      },
    ],
    payments: [
      {
        id: "p1",
        month: "Maio 2023",
        date: "2023-05-28",
        amount: 2850,
        status: "paid",
        details: {
          baseSalary: 2500,
          bonus: 500,
          allowances: 200,
          deductions: 150,
          taxes: 200,
        },
      },
      {
        id: "p2",
        month: "Abril 2023",
        date: "2023-04-28",
        amount: 2650,
        status: "paid",
        details: {
          baseSalary: 2500,
          bonus: 300,
          allowances: 200,
          deductions: 150,
          taxes: 200,
        },
      },
      {
        id: "p3",
        month: "Março 2023",
        date: "2023-03-28",
        amount: 2700,
        status: "paid",
        details: {
          baseSalary: 2500,
          bonus: 350,
          allowances: 200,
          deductions: 150,
          taxes: 200,
        },
      },
      {
        id: "p4",
        month: "Fevereiro 2023",
        date: "2023-02-28",
        amount: 2650,
        status: "paid",
        details: {
          baseSalary: 2500,
          bonus: 300,
          allowances: 200,
          deductions: 150,
          taxes: 200,
        },
      },
      {
        id: "p5",
        month: "Janeiro 2023",
        date: "2023-01-28",
        amount: 2600,
        status: "paid",
        details: {
          baseSalary: 2500,
          bonus: 250,
          allowances: 200,
          deductions: 150,
          taxes: 200,
        },
      },
    ],
  },
  "2": {
    id: "2",
    name: "João Santos",
    email: "joao.santos@empresa.pt",
    phone: "+351 923 456 789",
    address: "Avenida da República, 45, Porto",
    department: "Financeiro",
    position: "Analista Financeiro",
    status: "active",
    hireDate: "2021-05-10",
    birthDate: "1990-08-22",
    nif: "234567890",
    bankAccount: "PT50 2345 6789 0123 4567 8901 2",
    emergencyContact: "Maria Santos: +351 924 567 890",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao",
    manager: "Ana Silva",
    contractType: "Sem Termo",
    education: "Licenciatura em Economia",
    skills: ["Análise Financeira", "Excel Avançado", "SAP", "Contabilidade"],
    activities: [
      {
        id: "a1",
        type: "Sistema",
        description: "Atualizou informações de contacto",
        date: "2023-05-18T10:30:00",
        icon: <User className="h-4 w-4 text-blue-500" />,
      },
      {
        id: "a2",
        type: "Formação",
        description: "Concluiu formação: Excel Avançado para Finanças",
        date: "2023-04-05T14:15:00",
        icon: <GraduationCap className="h-4 w-4 text-green-500" />,
      },
      {
        id: "a3",
        type: "Promoção",
        description: "Promovido: Assistente Financeiro → Analista Financeiro",
        date: "2023-03-01T09:45:00",
        icon: <Briefcase className="h-4 w-4 text-indigo-500" />,
      },
    ],
    payments: [
      {
        id: "p1",
        month: "Maio 2023",
        date: "2023-05-28",
        amount: 1950,
        status: "paid",
        details: {
          baseSalary: 1800,
          bonus: 200,
          allowances: 150,
          deductions: 100,
          taxes: 100,
        },
      },
      {
        id: "p2",
        month: "Abril 2023",
        date: "2023-04-28",
        amount: 1900,
        status: "paid",
        details: {
          baseSalary: 1800,
          bonus: 150,
          allowances: 150,
          deductions: 100,
          taxes: 100,
        },
      },
    ],
  },
};

const getStatusBadge = (status: EmployeeData["status"]) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
    case "inactive":
      return <Badge variant="destructive">Inativo</Badge>;
    case "on_leave":
      return (
        <Badge variant="outline" className="text-amber-600 border-amber-300">
          Ausente
        </Badge>
      );
    default:
      return <Badge variant="outline">Desconhecido</Badge>;
  }
};

const getPaymentStatusBadge = (status: EmployeePayment["status"]) => {
  switch (status) {
    case "paid":
      return <Badge className="bg-green-100 text-green-800">Pago</Badge>;
    case "pending":
      return (
        <Badge variant="outline" className="text-amber-600 border-amber-300">
          Pendente
        </Badge>
      );
    case "processing":
      return (
        <Badge variant="outline" className="text-blue-600 border-blue-300">
          Em Processamento
        </Badge>
      );
    case "failed":
      return <Badge variant="destructive">Falha</Badge>;
    default:
      return <Badge variant="outline">Desconhecido</Badge>;
  }
};

const EmployeeProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [employeeData, setEmployeeData] =
    useState<Record<string, EmployeeData>>(employeesData);

  // Default to first employee if no ID is provided
  const employeeId = id || "1";
  const employee = employeeData[employeeId] || employeeData["1"];

  const handleUpdateEmployee = (updatedEmployee: any) => {
    setEmployeeData({
      ...employeeData,
      [employeeId]: {
        ...updatedEmployee,
        // Convert Date objects back to strings for storage
        hireDate: updatedEmployee.hireDate.toISOString().split("T")[0],
        birthDate: updatedEmployee.birthDate.toISOString().split("T")[0],
        // Preserve activities and payments from the original employee data
        activities: employee.activities,
        payments: employee.payments,
      },
    });
    setIsEditDialogOpen(false);
  };

  if (!employee) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-96 text-center p-6">
          <h2 className="text-xl font-bold mb-4">Funcionário não encontrado</h2>
          <p className="mb-6 text-gray-500">
            O funcionário que procura não existe ou foi removido.
          </p>
          <Button onClick={() => navigate("/employees")}>Voltar à Lista</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/employees")}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">
          Perfil do Funcionário
        </h1>
        <Button
          variant="outline"
          className="ml-auto"
          onClick={() => setIsEditDialogOpen(true)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </div>

      {/* Employee Profile Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-shrink-0">
          <Avatar className="h-32 w-32 border-4 border-white shadow-md">
            <AvatarImage src={employee.avatarUrl} alt={employee.name} />
            <AvatarFallback className="text-3xl">
              {employee.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold">{employee.name}</h2>
            {getStatusBadge(employee.status)}
          </div>
          <p className="text-gray-600 mb-4">
            {employee.position} • {employee.department}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-gray-500 mr-2" />
              <span>{employee.email}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 text-gray-500 mr-2" />
              <span>{employee.phone}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-gray-500 mr-2" />
              <span>{employee.address}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
              <span>
                Contratado em{" "}
                {new Date(employee.hireDate).toLocaleDateString("pt-PT")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="activities">Registo de Atividades</TabsTrigger>
          <TabsTrigger value="payments">Histórico de Pagamentos</TabsTrigger>
          <TabsTrigger value="activity-registry">Registo de Horas</TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="info" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detalhes Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Data de Nascimento</span>
                    <span className="font-medium">
                      {new Date(employee.birthDate).toLocaleDateString("pt-PT")}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-500">NIF</span>
                    <span className="font-medium">{employee.nif}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-500">Conta Bancária</span>
                    <span className="font-medium">{employee.bankAccount}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Contacto de Emergência
                    </span>
                    <span className="font-medium">
                      {employee.emergencyContact}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Detalhes Profissionais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Departamento</span>
                    <span className="font-medium">{employee.department}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-500">Cargo</span>
                    <span className="font-medium">{employee.position}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tipo de Contrato</span>
                    <span className="font-medium">{employee.contractType}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-500">Gestor</span>
                    <span className="font-medium">
                      {employee.manager || "N/A"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-gray-500">Formação Académica</span>
                    <span className="font-medium">{employee.education}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Competências</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {employee.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                  {employee.skills.length === 0 && (
                    <p className="text-gray-500">
                      Nenhuma competência registada
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Atividades Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {employee.activities.slice(0, 3).map((activity) => (
                    <div key={activity.id} className="flex">
                      <div className="mr-4">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          {activity.icon}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium">{activity.type}</p>
                        <p className="text-sm text-gray-600">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(activity.date).toLocaleString("pt-PT", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {employee.activities.length === 0 && (
                    <p className="text-gray-500">Nenhuma atividade registada</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Activities Tab */}
        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Histórico de Atividades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {employee.activities.map((activity) => (
                  <div key={activity.id} className="flex">
                    <div className="mr-4">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        {activity.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{activity.type}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(activity.date).toLocaleString("pt-PT", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                      <p className="text-gray-600 mt-1">
                        {activity.description}
                      </p>
                      <Separator className="my-4" />
                    </div>
                  </div>
                ))}
                {employee.activities.length === 0 && (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">
                      Nenhuma atividade registada
                    </h3>
                    <p className="text-gray-500 mt-2">
                      Este funcionário ainda não tem atividades registadas.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments">
          <PaymentHistory
            employeeId={employee.id}
            employeeName={employee.name}
            activities={[]}
          />
        </TabsContent>

        {/* Activity Registry Tab */}
        <TabsContent value="activity-registry">
          <ActivityRegistry employeeId={employee.id} />
        </TabsContent>
      </Tabs>

      {/* Edit Employee Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Funcionário</DialogTitle>
            <DialogDescription>
              Atualize as informações do funcionário {employee.name}.
            </DialogDescription>
          </DialogHeader>
          <EditEmployeeForm
            employee={{
              ...employee,
              hireDate: new Date(employee.hireDate),
              birthDate: new Date(employee.birthDate),
              skills: employee.skills || [],
            }}
            onSubmit={handleUpdateEmployee}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeProfile;
