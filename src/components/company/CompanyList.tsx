import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCompany } from "@/context/CompanyContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Building,
  Check,
} from "lucide-react";

interface Company {
  id: string;
  name: string;
  nif: string;
  city: string;
  active: boolean;
  isDefault?: boolean;
  logo?: string;
  createdAt: string;
}

const CompanyList = () => {
  const {
    companies: contextCompanies,
    currentCompany,
    setCurrentCompany,
    addCompany,
  } = useCompany();
  const [companies, setCompanies] = useState<Company[]>(contextCompanies);

  // Sincronizar com o contexto quando as empresas mudarem
  useEffect(() => {
    setCompanies(contextCompanies);
  }, [contextCompanies]);

  // Dados de exemplo para referência
  const mockCompanies = [
    {
      id: "1",
      name: "Empresa Exemplo, Lda.",
      nif: "123456789",
      city: "Lisboa",
      active: true,
      isDefault: true,
      createdAt: "2023-01-15T10:30:00Z",
    },
    {
      id: "2",
      name: "Outra Empresa, S.A.",
      nif: "987654321",
      city: "Porto",
      active: true,
      isDefault: false,
      createdAt: "2023-03-22T14:45:00Z",
    },
    {
      id: "3",
      name: "Empresa Inativa, Lda.",
      nif: "456789123",
      city: "Faro",
      active: false,
      isDefault: false,
      createdAt: "2022-11-05T09:15:00Z",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddCompanyDialogOpen, setIsAddCompanyDialogOpen] = useState(false);
  const [newCompany, setNewCompany] = useState<
    Omit<Company, "id" | "createdAt" | "active" | "isDefault">
  >({
    name: "",
    nif: "",
    city: "",
    logo: "",
  });

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.nif.includes(searchTerm) ||
      company.city.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddCompany = () => {
    const newCompanyObj: Company = {
      id: `company-${Date.now()}`,
      name: newCompany.name,
      nif: newCompany.nif,
      city: newCompany.city,
      logo: newCompany.logo,
      active: true,
      isDefault: companies.length === 0, // First company becomes default
      createdAt: new Date().toISOString(),
    };

    // Adicionar ao estado local e ao contexto global
    setCompanies([...companies, newCompanyObj]);
    addCompany({
      name: newCompany.name,
      nif: newCompany.nif,
      logo: newCompany.logo,
    });

    setNewCompany({ name: "", nif: "", city: "", logo: "" });
    setIsAddCompanyDialogOpen(false);
  };

  const handleDeleteCompany = (id: string) => {
    if (confirm("Tem certeza que deseja remover esta empresa?")) {
      setCompanies(companies.filter((company) => company.id !== id));
    }
  };

  const handleToggleCompanyStatus = (id: string) => {
    setCompanies(
      companies.map((company) => {
        if (company.id === id) {
          return { ...company, active: !company.active };
        }
        return company;
      }),
    );
  };

  const handleSetDefaultCompany = (id: string) => {
    // Atualizar o estado local
    setCompanies(
      companies.map((company) => ({
        ...company,
        isDefault: company.id === id,
      })),
    );

    // Definir como empresa atual no contexto global
    const selectedCompany = companies.find((company) => company.id === id);
    if (selectedCompany) {
      setCurrentCompany({
        id: selectedCompany.id,
        name: selectedCompany.name,
        nif: selectedCompany.nif,
        logo: selectedCompany.logo,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Empresas</h2>
          <p className="text-gray-500">
            Gerencie as empresas cadastradas no sistema
          </p>
        </div>
        <Button onClick={() => setIsAddCompanyDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Empresa
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Empresas Cadastradas</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Pesquisar empresas..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead>NIF</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Padrão</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          {company.logo ? (
                            <AvatarImage
                              src={company.logo}
                              alt={company.name}
                            />
                          ) : (
                            <AvatarFallback>
                              <Building className="h-4 w-4" />
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium">{company.name}</p>
                          <p className="text-sm text-gray-500">
                            Criada em{" "}
                            {new Date(company.createdAt).toLocaleDateString(
                              "pt-PT",
                            )}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{company.nif}</TableCell>
                    <TableCell>{company.city}</TableCell>
                    <TableCell>
                      {company.active ? (
                        <Badge className="bg-green-100 text-green-800">
                          Ativa
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Inativa</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {company.isDefault ? (
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-800 border-blue-200"
                        >
                          Padrão
                        </Badge>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
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
                          {!company.isDefault && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleSetDefaultCompany(company.id)
                              }
                            >
                              <Check className="mr-2 h-4 w-4" />
                              <span>Definir como Padrão</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() =>
                              handleToggleCompanyStatus(company.id)
                            }
                          >
                            <Building className="mr-2 h-4 w-4" />
                            <span>
                              {company.active ? "Desativar" : "Ativar"}
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteCompany(company.id)}
                            disabled={company.isDefault}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Remover</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >
                    {searchTerm ? (
                      <>
                        <p className="font-medium">
                          Nenhuma empresa encontrada
                        </p>
                        <p className="text-sm mt-1">
                          Tente outro termo de pesquisa
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium">
                          Nenhuma empresa cadastrada
                        </p>
                        <p className="text-sm mt-1">
                          Clique em "Adicionar Empresa" para cadastrar sua
                          primeira empresa
                        </p>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Company Dialog */}
      <Dialog
        open={isAddCompanyDialogOpen}
        onOpenChange={setIsAddCompanyDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Empresa</DialogTitle>
            <DialogDescription>
              Preencha os dados para adicionar uma nova empresa ao sistema.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="company-name">Nome da Empresa</Label>
              <Input
                id="company-name"
                value={newCompany.name}
                onChange={(e) =>
                  setNewCompany({ ...newCompany, name: e.target.value })
                }
                placeholder="Ex: Minha Empresa, Lda."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="company-nif">NIF</Label>
              <Input
                id="company-nif"
                value={newCompany.nif}
                onChange={(e) =>
                  setNewCompany({ ...newCompany, nif: e.target.value })
                }
                placeholder="Ex: 123456789"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="company-city">Cidade</Label>
              <Input
                id="company-city"
                value={newCompany.city}
                onChange={(e) =>
                  setNewCompany({ ...newCompany, city: e.target.value })
                }
                placeholder="Ex: Lisboa"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddCompanyDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddCompany}
              disabled={!newCompany.name || !newCompany.nif || !newCompany.city}
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanyList;
