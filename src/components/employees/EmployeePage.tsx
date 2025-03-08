import React, { useState } from "react";
import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";
import EmployeeList from "./EmployeeList";
import EmployeeCategories from "./EmployeeCategories";
import OrganizationalStructure from "./OrganizationalStructure";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Plus, Search, Filter } from "lucide-react";
import AddEmployeeForm from "./AddEmployeeForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EmployeePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar className={`${isSidebarOpen ? "block" : "hidden"} md:block`} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header title="Gestão de Funcionários" onMenuToggle={toggleSidebar} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Funcionários</h1>
              {activeTab === "list" && (
                <Button onClick={() => setIsAddEmployeeOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Adicionar Funcionário
                </Button>
              )}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="list">Listar Funcionários</TabsTrigger>
                <TabsTrigger value="categories">Categorias</TabsTrigger>
                <TabsTrigger value="structure">
                  Estrutura Organizacional
                </TabsTrigger>
              </TabsList>

              <TabsContent value="list">
                <div className="mt-6 space-y-6">
                  {/* Inline Filters */}
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4">
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
                        <Select
                          value={departmentFilter}
                          onValueChange={setDepartmentFilter}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Departamento" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Todos">Todos</SelectItem>
                            <SelectItem value="Recursos Humanos">
                              Recursos Humanos
                            </SelectItem>
                            <SelectItem value="Financeiro">
                              Financeiro
                            </SelectItem>
                            <SelectItem value="Tecnologia">
                              Tecnologia
                            </SelectItem>
                            <SelectItem value="Vendas">Vendas</SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={statusFilter}
                          onValueChange={setStatusFilter}
                        >
                          <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Todos">Todos</SelectItem>
                            <SelectItem value="Ativo">Ativo</SelectItem>
                            <SelectItem value="Inativo">Inativo</SelectItem>
                            <SelectItem value="Ausente">Ausente</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Employee List */}
                  <div className="w-full">
                    <EmployeeList />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="categories">
                <div className="mt-6">
                  <EmployeeCategories />
                </div>
              </TabsContent>

              <TabsContent value="structure">
                <div className="mt-6">
                  <OrganizationalStructure />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Add Employee Modal */}
      <AddEmployeeForm
        isOpen={isAddEmployeeOpen}
        onClose={() => setIsAddEmployeeOpen(false)}
      />
    </div>
  );
};

export default EmployeePage;
