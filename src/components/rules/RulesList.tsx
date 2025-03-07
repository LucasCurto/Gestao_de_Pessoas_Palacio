import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  Power,
  Eye,
  ArrowUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Rule {
  id: string;
  name: string;
  description: string;
  category: string;
  status: "active" | "inactive" | "draft";
  lastModified: string;
  createdBy: string;
}

interface RulesListProps {
  rules?: Rule[];
  onRuleSelect?: (ruleId: string) => void;
  onCreateRule?: () => void;
  onEditRule?: (ruleId: string) => void;
  onDeleteRule?: (ruleId: string) => void;
  onDuplicateRule?: (ruleId: string) => void;
  onToggleRuleStatus?: (ruleId: string, status: "active" | "inactive") => void;
  className?: string;
}

const RulesList = ({
  rules = [
    {
      id: "rule-1",
      name: "Cálculo de Subsídio de Férias",
      description:
        "Regra para calcular o subsídio de férias baseado no tempo de serviço",
      category: "Subsídios",
      status: "active",
      lastModified: "2023-06-15T10:30:00Z",
      createdBy: "João Silva",
    },
    {
      id: "rule-2",
      name: "Bónus de Produtividade",
      description: "Cálculo de bónus baseado em métricas de desempenho",
      category: "Bónus",
      status: "active",
      lastModified: "2023-06-10T14:20:00Z",
      createdBy: "Maria Santos",
    },
    {
      id: "rule-3",
      name: "Subsídio de Alimentação",
      description: "Regra para calcular o subsídio de alimentação diário",
      category: "Subsídios",
      status: "inactive",
      lastModified: "2023-05-22T09:15:00Z",
      createdBy: "António Costa",
    },
    {
      id: "rule-4",
      name: "Cálculo de Horas Extraordinárias",
      description: "Regra para calcular pagamento de horas extraordinárias",
      category: "Horas Extra",
      status: "draft",
      lastModified: "2023-06-18T16:45:00Z",
      createdBy: "João Silva",
    },
    {
      id: "rule-5",
      name: "Subsídio de Natal",
      description: "Regra para calcular o subsídio de Natal",
      category: "Subsídios",
      status: "active",
      lastModified: "2023-04-30T11:20:00Z",
      createdBy: "Maria Santos",
    },
  ],
  onRuleSelect = () => {},
  onCreateRule = () => {},
  onEditRule = () => {},
  onDeleteRule = () => {},
  onDuplicateRule = () => {},
  onToggleRuleStatus = () => {},
  className = "",
}: RulesListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("lastModified");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);

  // Extract unique categories for filter dropdown
  const categories = ["all", ...new Set(rules.map((rule) => rule.category))];

  // Filter and sort rules
  const filteredRules = rules
    .filter((rule) => {
      const matchesSearch =
        rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || rule.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" || rule.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;

      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "category") {
        comparison = a.category.localeCompare(b.category);
      } else if (sortBy === "lastModified") {
        comparison =
          new Date(a.lastModified).getTime() -
          new Date(b.lastModified).getTime();
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

  const handleRuleClick = (ruleId: string) => {
    setSelectedRuleId(ruleId);
    onRuleSelect(ruleId);
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            Ativo
          </Badge>
        );
      case "inactive":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200"
          >
            Inativo
          </Badge>
        );
      case "draft":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200"
          >
            Rascunho
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className={cn("w-full bg-white border-gray-200", className)}>
      <CardHeader className="border-b pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Regras de Cálculo</CardTitle>
          <Button onClick={onCreateRule}>
            <Plus className="mr-2 h-4 w-4" /> Nova Regra
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Pesquisar regras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "Todas as Categorias" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Estados</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="draft">Rascunho</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="text-left py-3 px-4 font-medium text-sm text-slate-600">
                  <button
                    className="flex items-center gap-1"
                    onClick={() => toggleSort("name")}
                  >
                    Nome
                    <ArrowUpDown
                      className={cn(
                        "h-3 w-3",
                        sortBy === "name" ? "opacity-100" : "opacity-40",
                      )}
                    />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium text-sm text-slate-600">
                  <button
                    className="flex items-center gap-1"
                    onClick={() => toggleSort("category")}
                  >
                    Categoria
                    <ArrowUpDown
                      className={cn(
                        "h-3 w-3",
                        sortBy === "category" ? "opacity-100" : "opacity-40",
                      )}
                    />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium text-sm text-slate-600">
                  Estado
                </th>
                <th className="text-left py-3 px-4 font-medium text-sm text-slate-600">
                  <button
                    className="flex items-center gap-1"
                    onClick={() => toggleSort("lastModified")}
                  >
                    Última Modificação
                    <ArrowUpDown
                      className={cn(
                        "h-3 w-3",
                        sortBy === "lastModified"
                          ? "opacity-100"
                          : "opacity-40",
                      )}
                    />
                  </button>
                </th>
                <th className="text-left py-3 px-4 font-medium text-sm text-slate-600">
                  Criado Por
                </th>
                <th className="text-right py-3 px-4 font-medium text-sm text-slate-600">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRules.length > 0 ? (
                filteredRules.map((rule) => (
                  <tr
                    key={rule.id}
                    className={cn(
                      "border-b hover:bg-slate-50 cursor-pointer transition-colors",
                      selectedRuleId === rule.id &&
                        "bg-blue-50 hover:bg-blue-50",
                    )}
                    onClick={() => handleRuleClick(rule.id)}
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium">{rule.name}</div>
                      <div className="text-sm text-slate-500 truncate max-w-xs">
                        {rule.description}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="bg-slate-50">
                        {rule.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(rule.status)}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {formatDate(rule.lastModified)}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {rule.createdBy}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="flex justify-end"
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => onRuleSelect(rule.id)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onEditRule(rule.id)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onDuplicateRule(rule.id)}
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                onToggleRuleStatus(
                                  rule.id,
                                  rule.status === "active"
                                    ? "inactive"
                                    : "active",
                                )
                              }
                            >
                              <Power className="mr-2 h-4 w-4" />
                              {rule.status === "active"
                                ? "Desativar"
                                : "Ativar"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => onDeleteRule(rule.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    {searchTerm ||
                    categoryFilter !== "all" ||
                    statusFilter !== "all" ? (
                      <>
                        <p className="font-medium">Nenhuma regra encontrada</p>
                        <p className="text-sm mt-1">
                          Tente ajustar os filtros ou termos de pesquisa
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium">Nenhuma regra definida</p>
                        <p className="text-sm mt-1">
                          Clique em "Nova Regra" para criar sua primeira regra
                        </p>
                      </>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RulesList;
