import React, { useState, useEffect } from "react";
import { useCompany } from "@/context/CompanyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Tag,
  Users,
  Briefcase,
  Save,
} from "lucide-react";

interface EmployeeCategory {
  id: string;
  name: string;
  description: string;
  type: "department" | "position" | "contract";
  employeeCount: number;
  color?: string;
  companyId: string;
}

const EmployeeCategories: React.FC = () => {
  const { currentCompany } = useCompany();
  const [categories, setCategories] = useState<EmployeeCategory[]>([]);
  const [activeType, setActiveType] = useState<
    "department" | "position" | "contract"
  >("department");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<EmployeeCategory | null>(null);
  const [newCategory, setNewCategory] = useState<Partial<EmployeeCategory>>({
    name: "",
    description: "",
    type: "department",
    color: "#3b82f6",
  });

  // Dados de exemplo por empresa
  const categoriesByCompany: Record<string, EmployeeCategory[]> = {
    "1": [
      {
        id: "cat-1",
        name: "Recursos Humanos",
        description: "Departamento de RH",
        type: "department",
        employeeCount: 5,
        color: "#3b82f6",
        companyId: "1",
      },
      {
        id: "cat-2",
        name: "Financeiro",
        description: "Departamento Financeiro",
        type: "department",
        employeeCount: 8,
        color: "#10b981",
        companyId: "1",
      },
      {
        id: "cat-3",
        name: "Tecnologia",
        description: "Departamento de TI",
        type: "department",
        employeeCount: 12,
        color: "#6366f1",
        companyId: "1",
      },
      {
        id: "cat-4",
        name: "Gerente",
        description: "Cargo de gerência",
        type: "position",
        employeeCount: 6,
        color: "#f59e0b",
        companyId: "1",
      },
      {
        id: "cat-5",
        name: "Analista",
        description: "Cargo de analista",
        type: "position",
        employeeCount: 15,
        color: "#ec4899",
        companyId: "1",
      },
      {
        id: "cat-6",
        name: "Desenvolvedor",
        description: "Cargo de desenvolvedor",
        type: "position",
        employeeCount: 10,
        color: "#8b5cf6",
        companyId: "1",
      },
      {
        id: "cat-7",
        name: "CLT",
        description: "Contrato CLT",
        type: "contract",
        employeeCount: 25,
        color: "#14b8a6",
        companyId: "1",
      },
      {
        id: "cat-8",
        name: "PJ",
        description: "Contrato PJ",
        type: "contract",
        employeeCount: 8,
        color: "#f43f5e",
        companyId: "1",
      },
    ],
    "2": [
      {
        id: "cat-9",
        name: "Vendas",
        description: "Departamento de Vendas",
        type: "department",
        employeeCount: 10,
        color: "#ef4444",
        companyId: "2",
      },
      {
        id: "cat-10",
        name: "Marketing",
        description: "Departamento de Marketing",
        type: "department",
        employeeCount: 6,
        color: "#8b5cf6",
        companyId: "2",
      },
      {
        id: "cat-11",
        name: "Vendedor",
        description: "Cargo de vendedor",
        type: "position",
        employeeCount: 8,
        color: "#f59e0b",
        companyId: "2",
      },
      {
        id: "cat-12",
        name: "Temporário",
        description: "Contrato temporário",
        type: "contract",
        employeeCount: 5,
        color: "#6366f1",
        companyId: "2",
      },
    ],
  };

  // Carregar categorias quando a empresa ou tipo ativo mudar
  useEffect(() => {
    // @ts-ignore - Ignorando o erro de índice para simplificar
    const companyCategories = categoriesByCompany[currentCompany.id] || [];
    const filteredCategories = companyCategories.filter(
      (cat) => cat.type === activeType,
    );
    setCategories(filteredCategories);
  }, [currentCompany.id, activeType]);

  const handleAddCategory = () => {
    const newCategoryWithId: EmployeeCategory = {
      ...(newCategory as EmployeeCategory),
      id: `cat-${Date.now()}`,
      companyId: currentCompany.id,
      employeeCount: 0,
    };

    // @ts-ignore - Ignorando o erro de índice para simplificar
    const companyCategories = categoriesByCompany[currentCompany.id] || [];
    const updatedCategories = [...companyCategories, newCategoryWithId];
    // @ts-ignore - Ignorando o erro de índice para simplificar
    categoriesByCompany[currentCompany.id] = updatedCategories;

    // Atualizar a lista de categorias exibida
    const filteredCategories = updatedCategories.filter(
      (cat) => cat.type === activeType,
    );
    setCategories(filteredCategories);
    setIsAddDialogOpen(false);
    resetNewCategory();
  };

  const handleEditCategory = () => {
    if (!selectedCategory) return;

    // @ts-ignore - Ignorando o erro de índice para simplificar
    const companyCategories = categoriesByCompany[currentCompany.id] || [];
    const updatedCategories = companyCategories.map((category) =>
      category.id === selectedCategory.id ? selectedCategory : category,
    );
    // @ts-ignore - Ignorando o erro de índice para simplificar
    categoriesByCompany[currentCompany.id] = updatedCategories;

    // Atualizar a lista de categorias exibida
    const filteredCategories = updatedCategories.filter(
      (cat) => cat.type === activeType,
    );
    setCategories(filteredCategories);
    setIsEditDialogOpen(false);
    setSelectedCategory(null);
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta categoria?")) {
      // @ts-ignore - Ignorando o erro de índice para simplificar
      const companyCategories = categoriesByCompany[currentCompany.id] || [];
      const updatedCategories = companyCategories.filter(
        (category) => category.id !== id,
      );
      // @ts-ignore - Ignorando o erro de índice para simplificar
      categoriesByCompany[currentCompany.id] = updatedCategories;

      // Atualizar a lista de categorias exibida
      const filteredCategories = updatedCategories.filter(
        (cat) => cat.type === activeType,
      );
      setCategories(filteredCategories);
    }
  };

  const resetNewCategory = () => {
    setNewCategory({
      name: "",
      description: "",
      type: activeType,
      color: "#3b82f6",
    });
  };

  const getTypeIcon = (type: "department" | "position" | "contract") => {
    switch (type) {
      case "department":
        return <Users className="h-5 w-5" />;
      case "position":
        return <Briefcase className="h-5 w-5" />;
      case "contract":
        return <Tag className="h-5 w-5" />;
      default:
        return <Tag className="h-5 w-5" />;
    }
  };

  const getTypeName = (type: "department" | "position" | "contract") => {
    switch (type) {
      case "department":
        return "Departamento";
      case "position":
        return "Cargo";
      case "contract":
        return "Tipo de Contrato";
      default:
        return "Categoria";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Categorias de Funcionários</h2>
          <p className="text-gray-500">
            Gerencie departamentos, cargos e tipos de contrato
          </p>
        </div>
        <Button
          onClick={() => {
            setNewCategory({ ...newCategory, type: activeType });
            setIsAddDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      <div className="flex space-x-2 mb-6">
        <Button
          variant={activeType === "department" ? "default" : "outline"}
          onClick={() => setActiveType("department")}
          className="flex items-center"
        >
          <Users className="h-4 w-4 mr-2" />
          Departamentos
        </Button>
        <Button
          variant={activeType === "position" ? "default" : "outline"}
          onClick={() => setActiveType("position")}
          className="flex items-center"
        >
          <Briefcase className="h-4 w-4 mr-2" />
          Cargos
        </Button>
        <Button
          variant={activeType === "contract" ? "default" : "outline"}
          onClick={() => setActiveType("contract")}
          className="flex items-center"
        >
          <Tag className="h-4 w-4 mr-2" />
          Tipos de Contrato
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {getTypeIcon(activeType)}
            <span className="ml-2">{getTypeName(activeType)}s</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Nenhum {getTypeName(activeType).toLowerCase()} encontrado</p>
              <p className="text-sm mt-1">
                Clique no botão "Nova Categoria" para adicionar
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Cor</TableHead>
                  <TableHead>Funcionários</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span>{category.color}</span>
                      </div>
                    </TableCell>
                    <TableCell>{category.employeeCount}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedCategory(category);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo {getTypeName(activeType)}</DialogTitle>
            <DialogDescription>
              Preencha as informações para criar um novo{" "}
              {getTypeName(activeType).toLowerCase()}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category-name">Nome</Label>
              <Input
                id="category-name"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                placeholder={`Ex: ${activeType === "department" ? "Recursos Humanos" : activeType === "position" ? "Gerente" : "CLT"}`}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category-description">Descrição</Label>
              <Input
                id="category-description"
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    description: e.target.value,
                  })
                }
                placeholder="Descrição breve"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category-color">Cor</Label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  id="category-color"
                  value={newCategory.color}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, color: e.target.value })
                  }
                  className="w-10 h-10 rounded border p-1"
                />
                <Input
                  value={newCategory.color}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, color: e.target.value })
                  }
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddCategory} disabled={!newCategory.name}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      {selectedCategory && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Editar {getTypeName(selectedCategory.type)}
              </DialogTitle>
              <DialogDescription>
                Modifique as informações do{" "}
                {getTypeName(selectedCategory.type).toLowerCase()}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-category-name">Nome</Label>
                <Input
                  id="edit-category-name"
                  value={selectedCategory.name}
                  onChange={(e) =>
                    setSelectedCategory({
                      ...selectedCategory,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category-description">Descrição</Label>
                <Input
                  id="edit-category-description"
                  value={selectedCategory.description}
                  onChange={(e) =>
                    setSelectedCategory({
                      ...selectedCategory,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category-color">Cor</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    id="edit-category-color"
                    value={selectedCategory.color}
                    onChange={(e) =>
                      setSelectedCategory({
                        ...selectedCategory,
                        color: e.target.value,
                      })
                    }
                    className="w-10 h-10 rounded border p-1"
                  />
                  <Input
                    value={selectedCategory.color}
                    onChange={(e) =>
                      setSelectedCategory({
                        ...selectedCategory,
                        color: e.target.value,
                      })
                    }
                    className="flex-1"
                  />
                </div>
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
                onClick={handleEditCategory}
                disabled={!selectedCategory.name}
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

export default EmployeeCategories;
