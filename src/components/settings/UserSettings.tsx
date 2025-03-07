import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
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
  MoreVertical,
  Edit,
  Trash2,
  Lock,
  UserPlus,
  Mail,
  Shield,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "user" | "accountant";
  status: "active" | "inactive" | "pending";
  lastLogin?: string;
  avatar?: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Ana Silva",
    email: "ana.silva@empresa.pt",
    role: "admin",
    status: "active",
    lastLogin: "2023-06-15T10:30:00Z",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
  },
  {
    id: "2",
    name: "João Santos",
    email: "joao.santos@empresa.pt",
    role: "manager",
    status: "active",
    lastLogin: "2023-06-14T14:45:00Z",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joao",
  },
  {
    id: "3",
    name: "Maria Costa",
    email: "maria.costa@empresa.pt",
    role: "user",
    status: "active",
    lastLogin: "2023-06-10T09:15:00Z",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
  },
  {
    id: "4",
    name: "Pedro Oliveira",
    email: "pedro.oliveira@empresa.pt",
    role: "accountant",
    status: "inactive",
    lastLogin: "2023-05-28T11:20:00Z",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
  },
  {
    id: "5",
    name: "Sofia Martins",
    email: "sofia.martins@empresa.pt",
    role: "user",
    status: "pending",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia",
  },
];

const mockRoles: Role[] = [
  {
    id: "admin",
    name: "Administrador",
    description: "Acesso completo a todas as funcionalidades do sistema",
    permissions: [
      "users.view",
      "users.create",
      "users.edit",
      "users.delete",
      "payments.view",
      "payments.create",
      "payments.edit",
      "payments.delete",
      "settings.view",
      "settings.edit",
      "reports.view",
      "reports.create",
      "rules.view",
      "rules.create",
      "rules.edit",
      "rules.delete",
    ],
  },
  {
    id: "manager",
    name: "Gestor",
    description: "Acesso à gestão de funcionários e pagamentos",
    permissions: [
      "users.view",
      "users.create",
      "users.edit",
      "payments.view",
      "payments.create",
      "payments.edit",
      "reports.view",
      "reports.create",
    ],
  },
  {
    id: "user",
    name: "Utilizador",
    description: "Acesso básico ao sistema",
    permissions: ["users.view", "payments.view", "reports.view"],
  },
  {
    id: "accountant",
    name: "Contabilista",
    description: "Acesso a funcionalidades financeiras e relatórios",
    permissions: [
      "payments.view",
      "payments.create",
      "payments.edit",
      "reports.view",
      "reports.create",
    ],
  },
];

const getStatusBadge = (status: User["status"]) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
    case "inactive":
      return <Badge variant="destructive">Inativo</Badge>;
    case "pending":
      return (
        <Badge variant="outline" className="text-amber-600 border-amber-300">
          Pendente
        </Badge>
      );
    default:
      return <Badge variant="outline">Desconhecido</Badge>;
  }
};

const getRoleBadge = (role: User["role"]) => {
  switch (role) {
    case "admin":
      return <Badge className="bg-purple-100 text-purple-800">Admin</Badge>;
    case "manager":
      return <Badge className="bg-blue-100 text-blue-800">Gestor</Badge>;
    case "accountant":
      return <Badge className="bg-cyan-100 text-cyan-800">Contabilista</Badge>;
    case "user":
      return <Badge className="bg-gray-100 text-gray-800">Utilizador</Badge>;
    default:
      return <Badge variant="outline">Desconhecido</Badge>;
  }
};

const UserSettings = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [activeTab, setActiveTab] = useState<"users" | "roles">("users");

  const [newUser, setNewUser] = useState<Omit<User, "id" | "status">>({
    name: "",
    email: "",
    role: "user",
  });

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddUser = () => {
    const newUserObj: User = {
      id: `user-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: "pending",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.name.replace(" ", "")}`,
    };

    setUsers([...users, newUserObj]);
    setNewUser({ name: "", email: "", role: "user" });
    setIsAddUserDialogOpen(false);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm("Tem certeza que deseja remover este utilizador?")) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  const handleToggleUserStatus = (id: string) => {
    setUsers(
      users.map((user) => {
        if (user.id === id) {
          return {
            ...user,
            status: user.status === "active" ? "inactive" : "active",
          };
        }
        return user;
      }),
    );
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsEditRoleDialogOpen(true);
  };

  const handleUpdateRole = () => {
    if (!selectedRole) return;

    setRoles(
      roles.map((role) => {
        if (role.id === selectedRole.id) {
          return selectedRole;
        }
        return role;
      }),
    );

    setIsEditRoleDialogOpen(false);
    setSelectedRole(null);
  };

  const handleTogglePermission = (permission: string) => {
    if (!selectedRole) return;

    const hasPermission = selectedRole.permissions.includes(permission);
    const updatedPermissions = hasPermission
      ? selectedRole.permissions.filter((p) => p !== permission)
      : [...selectedRole.permissions, permission];

    setSelectedRole({
      ...selectedRole,
      permissions: updatedPermissions,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Utilizadores</h2>
          <p className="text-gray-500">
            Gerencie utilizadores e perfis de acesso ao sistema
          </p>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button
          variant={activeTab === "users" ? "default" : "outline"}
          onClick={() => setActiveTab("users")}
        >
          Utilizadores
        </Button>
        <Button
          variant={activeTab === "roles" ? "default" : "outline"}
          onClick={() => setActiveTab("roles")}
        >
          Perfis de Acesso
        </Button>
      </div>

      {activeTab === "users" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Utilizadores do Sistema</CardTitle>
            <Button onClick={() => setIsAddUserDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Adicionar Utilizador
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Pesquisar utilizadores..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilizador</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleString("pt-PT", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })
                        : "Nunca"}
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
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            <span>Enviar Email</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Lock className="mr-2 h-4 w-4" />
                            <span>Redefinir Senha</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleUserStatus(user.id)}
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            <span>
                              {user.status === "active"
                                ? "Desativar"
                                : "Ativar"}
                            </span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteUser(user.id)}
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
      )}

      {activeTab === "roles" && (
        <Card>
          <CardHeader>
            <CardTitle>Perfis de Acesso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className="p-4 border rounded-md hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-lg">{role.name}</h3>
                      <p className="text-gray-500">{role.description}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditRole(role)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar Permissões
                    </Button>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Permissões:</h4>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((permission) => (
                        <Badge key={permission} variant="secondary">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Utilizador</DialogTitle>
            <DialogDescription>
              Preencha os dados para adicionar um novo utilizador ao sistema.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Perfil de Acesso</Label>
              <Select
                value={newUser.role}
                onValueChange={(value) =>
                  setNewUser({
                    ...newUser,
                    role: value as "admin" | "manager" | "user" | "accountant",
                  })
                }
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Selecione um perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="manager">Gestor</SelectItem>
                  <SelectItem value="accountant">Contabilista</SelectItem>
                  <SelectItem value="user">Utilizador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddUserDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddUser}
              disabled={!newUser.name || !newUser.email}
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog
        open={isEditRoleDialogOpen}
        onOpenChange={setIsEditRoleDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Perfil: {selectedRole?.name}</DialogTitle>
            <DialogDescription>
              Configure as permissões para este perfil de acesso.
            </DialogDescription>
          </DialogHeader>

          {selectedRole && (
            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="role-name">Nome do Perfil</Label>
                  <Input
                    id="role-name"
                    value={selectedRole.name}
                    onChange={(e) =>
                      setSelectedRole({
                        ...selectedRole,
                        name: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="role-description">Descrição</Label>
                  <Input
                    id="role-description"
                    value={selectedRole.description}
                    onChange={(e) =>
                      setSelectedRole({
                        ...selectedRole,
                        description: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>

                <Separator className="my-4" />

                <div>
                  <h4 className="text-sm font-medium mb-3">Permissões</h4>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Utilizadores</h5>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="users-view"
                            checked={selectedRole.permissions.includes(
                              "users.view",
                            )}
                            onCheckedChange={() =>
                              handleTogglePermission("users.view")
                            }
                          />
                          <Label htmlFor="users-view">Visualizar</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="users-create"
                            checked={selectedRole.permissions.includes(
                              "users.create",
                            )}
                            onCheckedChange={() =>
                              handleTogglePermission("users.create")
                            }
                          />
                          <Label htmlFor="users-create">Criar</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="users-edit"
                            checked={selectedRole.permissions.includes(
                              "users.edit",
                            )}
                            onCheckedChange={() =>
                              handleTogglePermission("users.edit")
                            }
                          />
                          <Label htmlFor="users-edit">Editar</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="users-delete"
                            checked={selectedRole.permissions.includes(
                              "users.delete",
                            )}
                            onCheckedChange={() =>
                              handleTogglePermission("users.delete")
                            }
                          />
                          <Label htmlFor="users-delete">Remover</Label>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Pagamentos</h5>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="payments-view"
                            checked={selectedRole.permissions.includes(
                              "payments.view",
                            )}
                            onCheckedChange={() =>
                              handleTogglePermission("payments.view")
                            }
                          />
                          <Label htmlFor="payments-view">Visualizar</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="payments-create"
                            checked={selectedRole.permissions.includes(
                              "payments.create",
                            )}
                            onCheckedChange={() =>
                              handleTogglePermission("payments.create")
                            }
                          />
                          <Label htmlFor="payments-create">Criar</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="payments-edit"
                            checked={selectedRole.permissions.includes(
                              "payments.edit",
                            )}
                            onCheckedChange={() =>
                              handleTogglePermission("payments.edit")
                            }
                          />
                          <Label htmlFor="payments-edit">Editar</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="payments-delete"
                            checked={selectedRole.permissions.includes(
                              "payments.delete",
                            )}
                            onCheckedChange={() =>
                              handleTogglePermission("payments.delete")
                            }
                          />
                          <Label htmlFor="payments-delete">Remover</Label>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Configurações</h5>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="settings-view"
                            checked={selectedRole.permissions.includes(
                              "settings.view",
                            )}
                            onCheckedChange={() =>
                              handleTogglePermission("settings.view")
                            }
                          />
                          <Label htmlFor="settings-view">Visualizar</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="settings-edit"
                            checked={selectedRole.permissions.includes(
                              "settings.edit",
                            )}
                            onCheckedChange={() =>
                              handleTogglePermission("settings.edit")
                            }
                          />
                          <Label htmlFor="settings-edit">Editar</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditRoleDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleUpdateRole}>Guardar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserSettings;
