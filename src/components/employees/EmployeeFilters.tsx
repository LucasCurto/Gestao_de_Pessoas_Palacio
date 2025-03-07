import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Filter } from "lucide-react";
import { useCompany } from "@/context/CompanyContext";

interface EmployeeFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  departmentFilter: string;
  onDepartmentFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({
  searchTerm,
  onSearchChange,
  departmentFilter,
  onDepartmentFilterChange,
  statusFilter,
  onStatusFilterChange,
}) => {
  const { currentCompany } = useCompany();

  // Departamentos disponíveis por empresa
  const departmentsByCompany = {
    "1": [
      "Todos",
      "Recursos Humanos",
      "Financeiro",
      "Tecnologia",
      "Vendas",
      "Marketing",
    ],
    "2": [
      "Todos",
      "Financeiro",
      "Vendas",
      "Marketing",
      "Operações",
      "Administrativo",
    ],
  };

  // @ts-ignore - Ignorando o erro de índice para simplificar
  const availableDepartments =
    departmentsByCompany[currentCompany.id] || departmentsByCompany["1"];

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Pesquisar funcionários..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>Filtros</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {departmentFilter === "Todos" ? "Departamento" : departmentFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {availableDepartments.map((dept) => (
              <DropdownMenuItem
                key={dept}
                onClick={() => onDepartmentFilterChange(dept)}
                className={departmentFilter === dept ? "bg-slate-100" : ""}
              >
                {dept}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {statusFilter === "Todos" ? "Status" : statusFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => onStatusFilterChange("Todos")}
              className={statusFilter === "Todos" ? "bg-slate-100" : ""}
            >
              Todos
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusFilterChange("Ativo")}
              className={statusFilter === "Ativo" ? "bg-slate-100" : ""}
            >
              Ativo
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusFilterChange("Inativo")}
              className={statusFilter === "Inativo" ? "bg-slate-100" : ""}
            >
              Inativo
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusFilterChange("Ausente")}
              className={statusFilter === "Ausente" ? "bg-slate-100" : ""}
            >
              Ausente
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default EmployeeFilters;
