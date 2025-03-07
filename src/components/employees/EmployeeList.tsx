import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCompany } from "@/context/CompanyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TransferEmployeeDialog from "../dashboard/TransferEmployeeDialog";
import EmployeeFilters from "./EmployeeFilters";
import { MoreVertical, Edit, Trash2, FileText, UserPlus } from "lucide-react";
import AddEmployeeForm, { NewEmployeeFormData } from "./AddEmployeeForm";
import EditEmployeeForm from "./EditEmployeeForm";

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  status: "active" | "inactive" | "on_leave";
  hireDate: string;
  avatarUrl?: string;
  birthDate?: string;
  nif?: string;
  bankAccount?: string;
  emergencyContact?: string;
  manager?: string;
  contractType?: string;
  education?: string;
  skills?: string[];
  companyId?: string;
}

// Dados de exemplo por empresa
const employeesByCompany: Record<string, Employee[]> = {
  "1": [
    {
      id: "1",
      name: "Ana Silva",
      email: "ana.silva@empresa.pt",
      department: "Recursos Humanos",
      position: "Gerente de RH",
      status: "active",
      hireDate: "2020-03-15",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
      birthDate: "1985-06-12",
      nif: "123456789",
      bankAccount: "PT50 1234 5678 9012 3456 7890 1",
      emergencyContact: "João Silva: +351 913 456 789",
      manager: "Carlos Mendes",
      contractType: "Sem Termo",
      education: "Mestrado em Gestão de Recursos Humanos",
      skills: [
        "Recrutamento",
        "Gestão de Talento",
        "Legislação Laboral",
        "Formação",
      ],
      companyId: "1",
    },
    {
      id: "2",
      name: "João Santos",
      email: "joao.santos@empresa.pt",
      department: "Financeiro",
      position: "Analista Financeiro",
      status: "active",
      hireDate: "2021-05-10",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao",
      birthDate: "1990-08-22",
      nif: "234567890",
      bankAccount: "PT50 2345 6789 0123 4567 8901 2",
      emergencyContact: "Maria Santos: +351 924 567 890",
      manager: "Ana Silva",
      contractType: "Sem Termo",
      education: "Licenciatura em Economia",
      skills: ["Análise Financeira", "Excel Avançado", "SAP", "Contabilidade"],
      companyId: "1",
    },
    {
      id: "3",
      name: "Maria Costa",
      email: "maria.costa@empresa.pt",
      department: "Tecnologia",
      position: "Desenvolvedora",
      status: "active",
      hireDate: "2022-01-20",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      companyId: "1",
    },
  ],
  "2": [
    {
      id: "4",
      name: "Pedro Oliveira",
      email: "pedro.oliveira@outraempresa.pt",
      department: "Vendas",
      position: "Gerente de Vendas",
      status: "active",
      hireDate: "2019-11-05",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
      companyId: "2",
    },
    {
      id: "5",
      name: "Sofia Martins",
      email: "sofia.martins@outraempresa.pt",
      department: "Marketing",
      position: "Especialista em Marketing",
      status: "active",
      hireDate: "2020-07-15",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia",
      companyId: "2",
    },
    {
      id: "6",
      name: "Carlos Ferreira",
      email: "carlos.ferreira@outraempresa.pt",
      department: "Financeiro",
      position: "Diretor Financeiro",
      status: "active",
      hireDate: "2018-03-10",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
      companyId: "2",
    },
  ],
};

const defaultEmployees: Employee[] = employeesByCompany["1"];

const getStatusBadge = (status: Employee["status"]) => {
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

const EmployeeList = () => {
  const navigate = useNavigate();
  const { currentCompany } = useCompany();
  const [employees, setEmployees] = useState<Employee[]>(defaultEmployees);

  // Atualizar a lista de funcionários quando a empresa mudar
  useEffect(() => {
    // @ts-ignore - Ignorando o erro de índice para simplificar
    const companyEmployees = employeesByCompany[currentCompany.id] || [];
    setEmployees(companyEmployees);
  }, [currentCompany.id]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [employeeToTransfer, setEmployeeToTransfer] = useState<Employee | null>(
    null,
  );

  const filteredEmployees = employees.filter((employee) => {
    // Filtro de pesquisa
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtro de departamento
    const matchesDepartment =
      departmentFilter === "Todos" || employee.department === departmentFilter;

    // Filtro de status
    const matchesStatus =
      statusFilter === "Todos" ||
      (statusFilter === "Ativo" && employee.status === "active") ||
      (statusFilter === "Inativo" && employee.status === "inactive") ||
      (statusFilter === "Ausente" && employee.status === "on_leave");

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleDeleteEmployee = (id: string) => {
    setEmployees(employees.filter((employee) => employee.id !== id));
  };

  const handleTransferEmployee = (
    employeeId: string,
    targetCompanyId: string,
    notes: string,
  ) => {
    // Em um cenário real, você enviaria esta informação para o backend
    console.log(
      `Transferindo funcionário ${employeeId} para empresa ${targetCompanyId}`,
    );
    console.log(`Notas: ${notes}`);

    // Remover o funcionário da lista atual
    setEmployees(employees.filter((employee) => employee.id !== employeeId));
  };

  const handleAddEmployee = (data: NewEmployeeFormData) => {
    const newEmployee: Employee = {
      id: `${employees.length + 1}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      department: data.department,
      position: data.position,
      status: data.status,
      hireDate: data.hireDate.toISOString().split("T")[0],
      birthDate: data.birthDate.toISOString().split("T")[0],
      nif: data.nif,
      bankAccount: data.bankAccount,
      emergencyContact: data.emergencyContact,
      avatarUrl:
        data.avatarUrl ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name.replace(" ", "")}`,
      manager: data.manager,
      contractType: data.contractType,
      education: data.education,
      skills: data.skills,
      companyId: currentCompany.id, // Associar o funcionário à empresa atual
    };

    setEmployees([...employees, newEmployee]);
    setIsAddDialogOpen(false);
  };

  const handleEditEmployee = (data: any) => {
    if (!selectedEmployee) return;

    const updatedEmployees = employees.map((emp) => {
      if (emp.id === selectedEmployee.id) {
        return {
          ...emp,
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          department: data.department,
          position: data.position,
          status: data.status,
          hireDate: data.hireDate.toISOString().split("T")[0],
          birthDate: data.birthDate.toISOString().split("T")[0],
          nif: data.nif,
          bankAccount: data.bankAccount,
          emergencyContact: data.emergencyContact,
          avatarUrl: data.avatarUrl || emp.avatarUrl,
          manager: data.manager,
          contractType: data.contractType,
          education: data.education,
          skills: data.skills,
        };
      }
      return emp;
    });

    setEmployees(updatedEmployees);
    setIsEditDialogOpen(false);
    setSelectedEmployee(null);
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Funcionários</h1>
        <Button
          className="flex items-center gap-2"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <UserPlus className="h-4 w-4" />
          <span>Adicionar Funcionário</span>
        </Button>
      </div>

      <EmployeeFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        departmentFilter={departmentFilter}
        onDepartmentFilterChange={setDepartmentFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data de Contratação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={employee.avatarUrl}
                          alt={employee.name}
                        />
                        <AvatarFallback>
                          {employee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p
                          className="font-medium cursor-pointer hover:text-blue-600"
                          onClick={() => navigate(`/employees/${employee.id}`)}
                        >
                          {employee.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {employee.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{getStatusBadge(employee.status)}</TableCell>
                  <TableCell>
                    {new Date(employee.hireDate).toLocaleDateString("pt-PT")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate(`/employees/${employee.id}`)}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          <span>Ver Detalhes</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setEmployeeToTransfer(employee);
                            setIsTransferDialogOpen(true);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 h-4 w-4"
                          >
                            <path d="M17 3L22 7L17 11" />
                            <path d="M22 7H8" />
                            <path d="M7 21L2 17L7 13" />
                            <path d="M2 17H16" />
                          </svg>
                          <span>Transferir</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteEmployee(employee.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Remover</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Employee Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Funcionário</DialogTitle>
            <DialogDescription>
              Preencha os dados do novo funcionário para adicioná-lo ao sistema.
            </DialogDescription>
          </DialogHeader>
          <AddEmployeeForm
            onSubmit={handleAddEmployee}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Transfer Employee Dialog */}
      {employeeToTransfer && (
        <TransferEmployeeDialog
          open={isTransferDialogOpen}
          onOpenChange={setIsTransferDialogOpen}
          employee={employeeToTransfer}
          onTransfer={handleTransferEmployee}
        />
      )}

      {/* Edit Employee Dialog */}
      {selectedEmployee && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Funcionário</DialogTitle>
              <DialogDescription>
                Atualize as informações do funcionário {selectedEmployee.name}.
              </DialogDescription>
            </DialogHeader>
            <EditEmployeeForm
              employee={{
                ...selectedEmployee,
                hireDate: new Date(selectedEmployee.hireDate),
                birthDate: selectedEmployee.birthDate
                  ? new Date(selectedEmployee.birthDate)
                  : new Date(),
                skills: selectedEmployee.skills || [],
              }}
              onSubmit={handleEditEmployee}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedEmployee(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EmployeeList;
