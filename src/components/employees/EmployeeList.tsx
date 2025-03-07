import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  PlusCircle,
  MoreVertical,
  Edit,
  Trash2,
  FileText,
  UserPlus,
  Filter,
} from "lucide-react";

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  status: "active" | "inactive" | "on_leave";
  hireDate: string;
  avatarUrl?: string;
}

const defaultEmployees: Employee[] = [
  {
    id: "1",
    name: "Ana Silva",
    email: "ana.silva@empresa.pt",
    department: "Recursos Humanos",
    position: "Gerente de RH",
    status: "active",
    hireDate: "2020-03-15",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
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
  },
  {
    id: "4",
    name: "Pedro Oliveira",
    email: "pedro.oliveira@empresa.pt",
    department: "Vendas",
    position: "Gerente de Vendas",
    status: "on_leave",
    hireDate: "2019-11-05",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
  },
  {
    id: "5",
    name: "Sofia Martins",
    email: "sofia.martins@empresa.pt",
    department: "Marketing",
    position: "Especialista em Marketing",
    status: "inactive",
    hireDate: "2020-07-15",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia",
  },
];

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
  const [employees, setEmployees] = useState<Employee[]>(defaultEmployees);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDeleteEmployee = (id: string) => {
    setEmployees(employees.filter((employee) => employee.id !== id));
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Funcionários</h1>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          <span>Adicionar Funcionário</span>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Pesquisar funcionários..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filtros</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Departamento</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Todos</DropdownMenuItem>
              <DropdownMenuItem>Recursos Humanos</DropdownMenuItem>
              <DropdownMenuItem>Financeiro</DropdownMenuItem>
              <DropdownMenuItem>Tecnologia</DropdownMenuItem>
              <DropdownMenuItem>Vendas</DropdownMenuItem>
              <DropdownMenuItem>Marketing</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Status</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Todos</DropdownMenuItem>
              <DropdownMenuItem>Ativo</DropdownMenuItem>
              <DropdownMenuItem>Inativo</DropdownMenuItem>
              <DropdownMenuItem>Ausente</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

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
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Editar</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate(`/employees/${employee.id}`)}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          <span>Ver Detalhes</span>
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
    </div>
  );
};

export default EmployeeList;
