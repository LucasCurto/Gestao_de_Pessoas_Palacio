import React, { useState, useEffect } from "react";
import { useCompany } from "@/context/CompanyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import {
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Users,
  ChevronRight,
  ChevronDown,
  User,
  Save,
} from "lucide-react";

interface Department {
  id: string;
  name: string;
  managerId?: string;
  managerName?: string;
  employeeCount: number;
  parentId?: string;
  children: Department[];
  companyId: string;
}

const OrganizationalStructure: React.FC = () => {
  const { currentCompany } = useCompany();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [expandedDepartments, setExpandedDepartments] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [newDepartment, setNewDepartment] = useState<Partial<Department>>({
    name: "",
    managerName: "",
    employeeCount: 0,
    children: [],
  });
  const [parentDepartmentId, setParentDepartmentId] = useState<
    string | undefined
  >(undefined);

  // Dados de exemplo por empresa
  const departmentsByCompany: Record<string, Department[]> = {
    "1": [
      {
        id: "dept-1",
        name: "Direção Geral",
        managerName: "António Ferreira",
        employeeCount: 3,
        children: [
          {
            id: "dept-2",
            name: "Recursos Humanos",
            managerName: "Margarida Sousa",
            employeeCount: 5,
            parentId: "dept-1",
            children: [],
            companyId: "1",
          },
          {
            id: "dept-3",
            name: "Financeiro",
            managerName: "Ricardo Almeida",
            employeeCount: 8,
            parentId: "dept-1",
            children: [
              {
                id: "dept-4",
                name: "Contabilidade",
                managerName: "Rui Pereira",
                employeeCount: 4,
                parentId: "dept-3",
                children: [],
                companyId: "1",
              },
              {
                id: "dept-5",
                name: "Controladoria",
                managerName: "Ana Ribeiro",
                employeeCount: 3,
                parentId: "dept-3",
                children: [],
                companyId: "1",
              },
            ],
            companyId: "1",
          },
          {
            id: "dept-6",
            name: "Tecnologia",
            managerName: "Catarina Lopes",
            employeeCount: 12,
            parentId: "dept-1",
            children: [
              {
                id: "dept-7",
                name: "Desenvolvimento",
                managerName: "Marta Silva",
                employeeCount: 8,
                parentId: "dept-6",
                children: [],
                companyId: "1",
              },
              {
                id: "dept-8",
                name: "Infraestrutura",
                managerName: "Pedro Costa",
                employeeCount: 3,
                parentId: "dept-6",
                children: [],
                companyId: "1",
              },
            ],
            companyId: "1",
          },
        ],
        companyId: "1",
      },
    ],
    "2": [
      {
        id: "dept-9",
        name: "Direção",
        managerName: "Carlos Santos",
        employeeCount: 2,
        children: [
          {
            id: "dept-10",
            name: "Vendas",
            managerName: "Miguel Santos",
            employeeCount: 10,
            parentId: "dept-9",
            children: [],
            companyId: "2",
          },
          {
            id: "dept-11",
            name: "Marketing",
            managerName: "Inês Costa",
            employeeCount: 6,
            parentId: "dept-9",
            children: [],
            companyId: "2",
          },
        ],
        companyId: "2",
      },
    ],
  };

  // Carregar departamentos quando a empresa mudar
  useEffect(() => {
    // @ts-ignore - Ignorando o erro de índice para simplificar
    const companyDepartments = departmentsByCompany[currentCompany.id] || [];
    setDepartments(companyDepartments);
    // Expandir o primeiro nível por padrão
    const firstLevelIds = companyDepartments.map((dept) => dept.id);
    setExpandedDepartments(firstLevelIds);
  }, [currentCompany.id]);

  const toggleDepartmentExpansion = (departmentId: string) => {
    setExpandedDepartments((prev) =>
      prev.includes(departmentId)
        ? prev.filter((id) => id !== departmentId)
        : [...prev, departmentId],
    );
  };

  const getAllDepartmentsFlat = (
    depts: Department[] = departments,
  ): Department[] => {
    let result: Department[] = [];
    depts.forEach((dept) => {
      result.push(dept);
      if (dept.children && dept.children.length > 0) {
        result = [...result, ...getAllDepartmentsFlat(dept.children)];
      }
    });
    return result;
  };

  const findDepartmentById = (
    id: string,
    depts: Department[] = departments,
  ): Department | null => {
    for (const dept of depts) {
      if (dept.id === id) return dept;
      if (dept.children && dept.children.length > 0) {
        const found = findDepartmentById(id, dept.children);
        if (found) return found;
      }
    }
    return null;
  };

  const addDepartmentToTree = (
    newDept: Department,
    parentId?: string,
    depts: Department[] = [...departments],
  ) => {
    if (!parentId) {
      return [...depts, newDept];
    }

    return depts.map((dept) => {
      if (dept.id === parentId) {
        return {
          ...dept,
          children: [...dept.children, newDept],
        };
      }
      if (dept.children && dept.children.length > 0) {
        return {
          ...dept,
          children: addDepartmentToTree(newDept, parentId, dept.children),
        };
      }
      return dept;
    });
  };

  const updateDepartmentInTree = (
    updatedDept: Department,
    depts: Department[] = [...departments],
  ) => {
    return depts.map((dept) => {
      if (dept.id === updatedDept.id) {
        return {
          ...updatedDept,
          children: dept.children, // Manter os filhos existentes
        };
      }
      if (dept.children && dept.children.length > 0) {
        return {
          ...dept,
          children: updateDepartmentInTree(updatedDept, dept.children),
        };
      }
      return dept;
    });
  };

  const removeDepartmentFromTree = (
    departmentId: string,
    depts: Department[] = [...departments],
  ) => {
    return depts
      .filter((dept) => dept.id !== departmentId)
      .map((dept) => ({
        ...dept,
        children:
          dept.children && dept.children.length > 0
            ? removeDepartmentFromTree(departmentId, dept.children)
            : [],
      }));
  };

  const handleAddDepartment = () => {
    const newDepartmentWithId: Department = {
      ...(newDepartment as Department),
      id: `dept-${Date.now()}`,
      companyId: currentCompany.id,
      parentId: parentDepartmentId,
      children: [],
    };

    const updatedDepartments = addDepartmentToTree(
      newDepartmentWithId,
      parentDepartmentId,
    );
    setDepartments(updatedDepartments);
    // @ts-ignore - Ignorando o erro de índice para simplificar
    departmentsByCompany[currentCompany.id] = updatedDepartments;

    // Expandir o departamento pai para mostrar o novo departamento
    if (
      parentDepartmentId &&
      !expandedDepartments.includes(parentDepartmentId)
    ) {
      setExpandedDepartments((prev) => [...prev, parentDepartmentId]);
    }

    setIsAddDialogOpen(false);
    resetNewDepartment();
  };

  const handleEditDepartment = () => {
    if (!selectedDepartment) return;

    const updatedDepartments = updateDepartmentInTree(selectedDepartment);
    setDepartments(updatedDepartments);
    // @ts-ignore - Ignorando o erro de índice para simplificar
    departmentsByCompany[currentCompany.id] = updatedDepartments;

    setIsEditDialogOpen(false);
    setSelectedDepartment(null);
  };

  const handleDeleteDepartment = (departmentId: string) => {
    const departmentToDelete = findDepartmentById(departmentId);
    if (!departmentToDelete) return;

    // Verificar se o departamento tem subdepartamentos
    if (departmentToDelete.children && departmentToDelete.children.length > 0) {
      alert(
        "Não é possível excluir um departamento que contém subdepartamentos. Remova os subdepartamentos primeiro.",
      );
      return;
    }

    if (confirm("Tem certeza que deseja excluir este departamento?")) {
      const updatedDepartments = removeDepartmentFromTree(departmentId);
      setDepartments(updatedDepartments);
      // @ts-ignore - Ignorando o erro de índice para simplificar
      departmentsByCompany[currentCompany.id] = updatedDepartments;
    }
  };

  const resetNewDepartment = () => {
    setNewDepartment({
      name: "",
      managerName: "",
      employeeCount: 0,
      children: [],
    });
    setParentDepartmentId(undefined);
  };

  const renderDepartmentTree = (depts: Department[], level = 0) => {
    return depts.map((dept) => (
      <React.Fragment key={dept.id}>
        <div
          className={`flex items-center p-3 ${level > 0 ? "border-t" : ""} hover:bg-gray-50`}
          style={{ paddingLeft: `${level * 24 + 12}px` }}
        >
          <div className="flex-1 flex items-center">
            {dept.children && dept.children.length > 0 ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 mr-2"
                onClick={() => toggleDepartmentExpansion(dept.id)}
              >
                {expandedDepartments.includes(dept.id) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            ) : (
              <div className="w-8"></div>
            )}
            <div>
              <div className="font-medium">{dept.name}</div>
              <div className="text-sm text-gray-500 flex items-center">
                <User className="h-3 w-3 mr-1" />
                {dept.managerName || "Sem gestor"}
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {dept.employeeCount} funcionários
          </div>
          <div className="ml-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setParentDepartmentId(dept.id);
                    setIsAddDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Subdepartamento
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedDepartment(dept);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => handleDeleteDepartment(dept.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {expandedDepartments.includes(dept.id) &&
          dept.children &&
          dept.children.length > 0 &&
          renderDepartmentTree(dept.children, level + 1)}
      </React.Fragment>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Estrutura Organizacional</h2>
          <p className="text-gray-500">
            Gerencie a hierarquia de departamentos da empresa
          </p>
        </div>
        <Button
          onClick={() => {
            resetNewDepartment();
            setIsAddDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Departamento
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Hierarquia de Departamentos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="border rounded-md">
            {departments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Nenhum departamento encontrado</p>
                <p className="text-sm mt-1">
                  Clique no botão "Novo Departamento" para adicionar
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {renderDepartmentTree(departments)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Department Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {parentDepartmentId
                ? "Adicionar Subdepartamento"
                : "Adicionar Novo Departamento"}
            </DialogTitle>
            <DialogDescription>
              {parentDepartmentId
                ? `Adicionar um novo subdepartamento a ${findDepartmentById(parentDepartmentId)?.name || ""}`
                : "Preencha as informações para criar um novo departamento."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="department-name">Nome do Departamento</Label>
              <Input
                id="department-name"
                value={newDepartment.name}
                onChange={(e) =>
                  setNewDepartment({ ...newDepartment, name: e.target.value })
                }
                placeholder="Ex: Recursos Humanos"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department-manager">Gestor</Label>
              <Input
                id="department-manager"
                value={newDepartment.managerName}
                onChange={(e) =>
                  setNewDepartment({
                    ...newDepartment,
                    managerName: e.target.value,
                  })
                }
                placeholder="Ex: João Silva"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department-employees">
                Número de Funcionários
              </Label>
              <Input
                id="department-employees"
                type="number"
                min="0"
                value={newDepartment.employeeCount}
                onChange={(e) =>
                  setNewDepartment({
                    ...newDepartment,
                    employeeCount: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            {!parentDepartmentId && (
              <div className="grid gap-2">
                <Label htmlFor="parent-department">Departamento Superior</Label>
                <select
                  id="parent-department"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={parentDepartmentId || ""}
                  onChange={(e) =>
                    setParentDepartmentId(e.target.value || undefined)
                  }
                >
                  <option value="">Nenhum (Departamento de Topo)</option>
                  {getAllDepartmentsFlat().map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAddDepartment}
              disabled={!newDepartment.name}
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Department Dialog */}
      {selectedDepartment && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Departamento</DialogTitle>
              <DialogDescription>
                Modifique as informações do departamento.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-department-name">
                  Nome do Departamento
                </Label>
                <Input
                  id="edit-department-name"
                  value={selectedDepartment.name}
                  onChange={(e) =>
                    setSelectedDepartment({
                      ...selectedDepartment,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-department-manager">Gestor</Label>
                <Input
                  id="edit-department-manager"
                  value={selectedDepartment.managerName || ""}
                  onChange={(e) =>
                    setSelectedDepartment({
                      ...selectedDepartment,
                      managerName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-department-employees">
                  Número de Funcionários
                </Label>
                <Input
                  id="edit-department-employees"
                  type="number"
                  min="0"
                  value={selectedDepartment.employeeCount}
                  onChange={(e) =>
                    setSelectedDepartment({
                      ...selectedDepartment,
                      employeeCount: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleEditDepartment}
                disabled={!selectedDepartment.name}
              >
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default OrganizationalStructure;
