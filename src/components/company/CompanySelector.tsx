import React, { useState } from "react";
import { useCompany } from "@/context/CompanyContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Building, ChevronDown, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CompanySelectorProps {}

const CompanySelector = ({}: CompanySelectorProps) => {
  const { currentCompany, companies, setCurrentCompany, addCompany } =
    useCompany();
  const [isNewCompanyDialogOpen, setIsNewCompanyDialogOpen] = useState(false);
  const [newCompany, setNewCompany] = useState<Omit<Company, "id">>({
    name: "",
    nif: "",
    logo: "",
  });

  const handleCreateCompany = () => {
    addCompany(newCompany);
    setNewCompany({ name: "", nif: "", logo: "" });
    setIsNewCompanyDialogOpen(false);
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Avatar className="h-6 w-6 mr-1">
              {currentCompany.logo ? (
                <AvatarImage
                  src={currentCompany.logo}
                  alt={currentCompany.name}
                />
              ) : (
                <AvatarFallback>
                  <Building className="h-4 w-4" />
                </AvatarFallback>
              )}
            </Avatar>
            <span className="max-w-[150px] truncate">
              {currentCompany.name}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Empresas</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {companies.map((company) => (
            <DropdownMenuItem
              key={company.id}
              onClick={() => setCurrentCompany(company)}
              className={company.id === currentCompany.id ? "bg-slate-100" : ""}
            >
              <div className="flex items-center w-full">
                <Avatar className="h-6 w-6 mr-2">
                  {company.logo ? (
                    <AvatarImage src={company.logo} alt={company.name} />
                  ) : (
                    <AvatarFallback>
                      <Building className="h-3 w-3" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="flex-1 truncate">{company.name}</span>
              </div>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <Dialog
            open={isNewCompanyDialogOpen}
            onOpenChange={setIsNewCompanyDialogOpen}
          >
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Plus className="mr-2 h-4 w-4" />
                <span>Adicionar Nova Empresa</span>
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Nova Empresa</DialogTitle>
                <DialogDescription>
                  Preencha os dados básicos para adicionar uma nova empresa ao
                  sistema.
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
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsNewCompanyDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateCompany}
                  disabled={!newCompany.name || !newCompany.nif}
                >
                  Criar Empresa
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CompanySelector;
