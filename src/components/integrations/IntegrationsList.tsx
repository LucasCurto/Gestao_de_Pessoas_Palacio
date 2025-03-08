import React, { useState, useEffect } from "react";
import { useCompany } from "@/context/CompanyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  RefreshCw,
  ExternalLink,
  Key,
  Lock,
  Database,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Globe,
  Webhook,
  FileSpreadsheet,
  FileJson,
  FileCode,
  Upload,
  Search,
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  type: "api" | "webhook" | "database" | "file-import";
  status: "active" | "inactive" | "error";
  lastSync?: Date;
  description: string;
  config: Record<string, any>;
  companyId: string;
}

const IntegrationsList: React.FC = () => {
  const { currentCompany } = useCompany();
  const [activeTab, setActiveTab] = useState("all");
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] =
    useState<Integration | null>(null);
  const [newIntegration, setNewIntegration] = useState<Partial<Integration>>({
    name: "",
    type: "api",
    description: "",
    status: "inactive",
    config: {},
  });

  // Dados de exemplo por empresa
  const integrationsByCompany: Record<string, Integration[]> = {
    "1": [
      {
        id: "int-1",
        name: "API de Contabilidade",
        type: "api",
        status: "active",
        lastSync: new Date("2023-05-15T10:30:00"),
        description: "Integração com o sistema de contabilidade Primavera",
        config: {
          apiKey: "sk_test_abc123",
          baseUrl: "https://api.primavera.com/v1",
          syncInterval: "daily",
        },
        companyId: "1",
      },
      {
        id: "int-2",
        name: "Webhook de Pagamentos",
        type: "webhook",
        status: "active",
        lastSync: new Date("2023-05-20T14:45:00"),
        description: "Webhook para notificações de pagamentos processados",
        config: {
          url: "https://empresa1.example.com/webhooks/payments",
          secret: "whsec_xyz789",
          events: ["payment.processed", "payment.failed"],
        },
        companyId: "1",
      },
      {
        id: "int-3",
        name: "Importação de Funcionários (CSV)",
        type: "file-import",
        status: "inactive",
        lastSync: new Date("2023-04-10T09:15:00"),
        description: "Importação de dados de funcionários via CSV",
        config: {
          fileType: "csv",
          delimiter: ",",
          mapping: {
            Nome: "name",
            Email: "email",
            Departamento: "department",
            Salário: "salary",
          },
        },
        companyId: "1",
      },
      {
        id: "int-4",
        name: "Banco de Dados Legado",
        type: "database",
        status: "error",
        lastSync: new Date("2023-05-18T16:20:00"),
        description: "Conexão com o banco de dados SQL Server legado",
        config: {
          host: "192.168.1.100",
          port: 1433,
          database: "legacy_hr",
          username: "db_user",
          password: "********",
        },
        companyId: "1",
      },
    ],
    "2": [
      {
        id: "int-5",
        name: "API de CRM",
        type: "api",
        status: "active",
        lastSync: new Date("2023-05-19T11:30:00"),
        description: "Integração com o CRM Salesforce",
        config: {
          apiKey: "sf_api_key_456",
          baseUrl: "https://api.salesforce.com/v2",
          syncInterval: "hourly",
        },
        companyId: "2",
      },
      {
        id: "int-6",
        name: "Importação de Vendas (XML)",
        type: "file-import",
        status: "active",
        lastSync: new Date("2023-05-21T08:45:00"),
        description: "Importação de dados de vendas via XML",
        config: {
          fileType: "xml",
          rootElement: "Sales",
          itemElement: "Sale",
          mapping: {
            SaleID: "id",
            Amount: "amount",
            Date: "date",
            EmployeeID: "employeeId",
          },
        },
        companyId: "2",
      },
    ],
  };

  // Carregar integrações quando a empresa mudar
  useEffect(() => {
    // @ts-ignore - Ignorando o erro de índice para simplificar
    const companyIntegrations = integrationsByCompany[currentCompany.id] || [];
    setIntegrations(companyIntegrations);
  }, [currentCompany.id]);

  // Filtrar integrações com base na aba ativa
  const filteredIntegrations = integrations.filter((integration) => {
    if (activeTab === "all") return true;
    return integration.type === activeTab;
  });

  const handleAddIntegration = () => {
    const newIntegrationWithId: Integration = {
      ...(newIntegration as Integration),
      id: `int-${Date.now()}`,
      companyId: currentCompany.id,
      status: "inactive",
      lastSync: undefined,
    };

    setIntegrations([...integrations, newIntegrationWithId]);
    setIsAddDialogOpen(false);
    resetNewIntegration();
  };

  const handleEditIntegration = () => {
    if (!selectedIntegration) return;

    const updatedIntegrations = integrations.map((integration) =>
      integration.id === selectedIntegration.id
        ? selectedIntegration
        : integration,
    );

    setIntegrations(updatedIntegrations);
    setIsEditDialogOpen(false);
    setSelectedIntegration(null);
  };

  const handleDeleteIntegration = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta integração?")) {
      setIntegrations(
        integrations.filter((integration) => integration.id !== id),
      );
    }
  };

  const handleToggleStatus = (
    id: string,
    currentStatus: "active" | "inactive" | "error",
  ) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    const updatedIntegrations = integrations.map((integration) =>
      integration.id === id
        ? { ...integration, status: newStatus }
        : integration,
    );

    setIntegrations(updatedIntegrations);
  };

  const handleSyncNow = (id: string) => {
    // Simulação de sincronização
    alert(`Iniciando sincronização para a integração ${id}...`);

    // Em uma implementação real, isso chamaria uma API ou iniciaria um processo de sincronização
    setTimeout(() => {
      const updatedIntegrations = integrations.map((integration) =>
        integration.id === id
          ? { ...integration, lastSync: new Date() }
          : integration,
      );

      setIntegrations(updatedIntegrations);
    }, 2000);
  };

  const resetNewIntegration = () => {
    setNewIntegration({
      name: "",
      type: "api",
      description: "",
      status: "inactive",
      config: {},
    });
  };

  const getStatusBadge = (status: Integration["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case "inactive":
        return <Badge variant="outline">Inativo</Badge>;
      case "error":
        return <Badge variant="destructive">Erro</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getTypeIcon = (type: Integration["type"]) => {
    switch (type) {
      case "api":
        return <Globe className="h-5 w-5 text-blue-500" />;
      case "webhook":
        return <Webhook className="h-5 w-5 text-purple-500" />;
      case "database":
        return <Database className="h-5 w-5 text-amber-500" />;
      case "file-import":
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
      default:
        return <Globe className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeName = (type: Integration["type"]) => {
    switch (type) {
      case "api":
        return "API";
      case "webhook":
        return "Webhook";
      case "database":
        return "Banco de Dados";
      case "file-import":
        return "Importação de Arquivos";
      default:
        return "Desconhecido";
    }
  };

  const renderConfigFields = () => {
    const type = selectedIntegration?.type || newIntegration.type;

    switch (type) {
      case "api":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="api-key">Chave de API</Label>
              <Input
                id="api-key"
                value={
                  selectedIntegration?.config?.apiKey ||
                  newIntegration.config?.apiKey ||
                  ""
                }
                onChange={(e) => {
                  if (selectedIntegration) {
                    setSelectedIntegration({
                      ...selectedIntegration,
                      config: {
                        ...selectedIntegration.config,
                        apiKey: e.target.value,
                      },
                    });
                  } else {
                    setNewIntegration({
                      ...newIntegration,
                      config: {
                        ...newIntegration.config,
                        apiKey: e.target.value,
                      },
                    });
                  }
                }}
                placeholder="sk_test_..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="base-url">URL Base</Label>
              <Input
                id="base-url"
                value={
                  selectedIntegration?.config?.baseUrl ||
                  newIntegration.config?.baseUrl ||
                  ""
                }
                onChange={(e) => {
                  if (selectedIntegration) {
                    setSelectedIntegration({
                      ...selectedIntegration,
                      config: {
                        ...selectedIntegration.config,
                        baseUrl: e.target.value,
                      },
                    });
                  } else {
                    setNewIntegration({
                      ...newIntegration,
                      config: {
                        ...newIntegration.config,
                        baseUrl: e.target.value,
                      },
                    });
                  }
                }}
                placeholder="https://api.example.com/v1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sync-interval">Intervalo de Sincronização</Label>
              <select
                id="sync-interval"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={
                  selectedIntegration?.config?.syncInterval ||
                  newIntegration.config?.syncInterval ||
                  "daily"
                }
                onChange={(e) => {
                  if (selectedIntegration) {
                    setSelectedIntegration({
                      ...selectedIntegration,
                      config: {
                        ...selectedIntegration.config,
                        syncInterval: e.target.value,
                      },
                    });
                  } else {
                    setNewIntegration({
                      ...newIntegration,
                      config: {
                        ...newIntegration.config,
                        syncInterval: e.target.value,
                      },
                    });
                  }
                }}
              >
                <option value="hourly">A cada hora</option>
                <option value="daily">Diariamente</option>
                <option value="weekly">Semanalmente</option>
                <option value="monthly">Mensalmente</option>
              </select>
            </div>
          </>
        );
      case "webhook":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="webhook-url">URL do Webhook</Label>
              <Input
                id="webhook-url"
                value={
                  selectedIntegration?.config?.url ||
                  newIntegration.config?.url ||
                  ""
                }
                onChange={(e) => {
                  if (selectedIntegration) {
                    setSelectedIntegration({
                      ...selectedIntegration,
                      config: {
                        ...selectedIntegration.config,
                        url: e.target.value,
                      },
                    });
                  } else {
                    setNewIntegration({
                      ...newIntegration,
                      config: { ...newIntegration.config, url: e.target.value },
                    });
                  }
                }}
                placeholder="https://seu-dominio.com/webhooks/endpoint"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhook-secret">Segredo do Webhook</Label>
              <Input
                id="webhook-secret"
                value={
                  selectedIntegration?.config?.secret ||
                  newIntegration.config?.secret ||
                  ""
                }
                onChange={(e) => {
                  if (selectedIntegration) {
                    setSelectedIntegration({
                      ...selectedIntegration,
                      config: {
                        ...selectedIntegration.config,
                        secret: e.target.value,
                      },
                    });
                  } else {
                    setNewIntegration({
                      ...newIntegration,
                      config: {
                        ...newIntegration.config,
                        secret: e.target.value,
                      },
                    });
                  }
                }}
                placeholder="whsec_..."
              />
            </div>
            <div className="space-y-2">
              <Label>Eventos</Label>
              <div className="space-y-2">
                {[
                  "payment.processed",
                  "payment.failed",
                  "employee.created",
                  "employee.updated",
                ].map((event) => (
                  <div key={event} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`event-${event}`}
                      checked={
                        selectedIntegration
                          ? selectedIntegration.config.events?.includes(event)
                          : newIntegration.config.events?.includes(event)
                      }
                      onChange={(e) => {
                        const currentEvents = selectedIntegration
                          ? [...(selectedIntegration.config.events || [])]
                          : [...(newIntegration.config.events || [])];

                        if (e.target.checked) {
                          if (!currentEvents.includes(event)) {
                            currentEvents.push(event);
                          }
                        } else {
                          const index = currentEvents.indexOf(event);
                          if (index !== -1) {
                            currentEvents.splice(index, 1);
                          }
                        }

                        if (selectedIntegration) {
                          setSelectedIntegration({
                            ...selectedIntegration,
                            config: {
                              ...selectedIntegration.config,
                              events: currentEvents,
                            },
                          });
                        } else {
                          setNewIntegration({
                            ...newIntegration,
                            config: {
                              ...newIntegration.config,
                              events: currentEvents,
                            },
                          });
                        }
                      }}
                      className="h-4 w-4"
                    />
                    <Label
                      htmlFor={`event-${event}`}
                      className="cursor-pointer"
                    >
                      {event}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </>
        );
      case "database":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="db-host">Host</Label>
              <Input
                id="db-host"
                value={
                  selectedIntegration?.config?.host ||
                  newIntegration.config?.host ||
                  ""
                }
                onChange={(e) => {
                  if (selectedIntegration) {
                    setSelectedIntegration({
                      ...selectedIntegration,
                      config: {
                        ...selectedIntegration.config,
                        host: e.target.value,
                      },
                    });
                  } else {
                    setNewIntegration({
                      ...newIntegration,
                      config: {
                        ...newIntegration.config,
                        host: e.target.value,
                      },
                    });
                  }
                }}
                placeholder="localhost ou endereço IP"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="db-port">Porta</Label>
              <Input
                id="db-port"
                type="number"
                value={
                  selectedIntegration?.config?.port ||
                  newIntegration.config?.port ||
                  ""
                }
                onChange={(e) => {
                  if (selectedIntegration) {
                    setSelectedIntegration({
                      ...selectedIntegration,
                      config: {
                        ...selectedIntegration.config,
                        port: parseInt(e.target.value),
                      },
                    });
                  } else {
                    setNewIntegration({
                      ...newIntegration,
                      config: {
                        ...newIntegration.config,
                        port: parseInt(e.target.value),
                      },
                    });
                  }
                }}
                placeholder="3306"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="db-name">Nome do Banco de Dados</Label>
              <Input
                id="db-name"
                value={
                  selectedIntegration?.config?.database ||
                  newIntegration.config?.database ||
                  ""
                }
                onChange={(e) => {
                  if (selectedIntegration) {
                    setSelectedIntegration({
                      ...selectedIntegration,
                      config: {
                        ...selectedIntegration.config,
                        database: e.target.value,
                      },
                    });
                  } else {
                    setNewIntegration({
                      ...newIntegration,
                      config: {
                        ...newIntegration.config,
                        database: e.target.value,
                      },
                    });
                  }
                }}
                placeholder="nome_do_banco"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="db-username">Usuário</Label>
              <Input
                id="db-username"
                value={
                  selectedIntegration?.config?.username ||
                  newIntegration.config?.username ||
                  ""
                }
                onChange={(e) => {
                  if (selectedIntegration) {
                    setSelectedIntegration({
                      ...selectedIntegration,
                      config: {
                        ...selectedIntegration.config,
                        username: e.target.value,
                      },
                    });
                  } else {
                    setNewIntegration({
                      ...newIntegration,
                      config: {
                        ...newIntegration.config,
                        username: e.target.value,
                      },
                    });
                  }
                }}
                placeholder="usuário do banco"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="db-password">Senha</Label>
              <Input
                id="db-password"
                type="password"
                value={
                  selectedIntegration?.config?.password ||
                  newIntegration.config?.password ||
                  ""
                }
                onChange={(e) => {
                  if (selectedIntegration) {
                    setSelectedIntegration({
                      ...selectedIntegration,
                      config: {
                        ...selectedIntegration.config,
                        password: e.target.value,
                      },
                    });
                  } else {
                    setNewIntegration({
                      ...newIntegration,
                      config: {
                        ...newIntegration.config,
                        password: e.target.value,
                      },
                    });
                  }
                }}
                placeholder="senha"
              />
            </div>
          </>
        );
      case "file-import":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="file-type">Tipo de Arquivo</Label>
              <select
                id="file-type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={
                  selectedIntegration?.config?.fileType ||
                  newIntegration.config?.fileType ||
                  "csv"
                }
                onChange={(e) => {
                  if (selectedIntegration) {
                    setSelectedIntegration({
                      ...selectedIntegration,
                      config: {
                        ...selectedIntegration.config,
                        fileType: e.target.value,
                      },
                    });
                  } else {
                    setNewIntegration({
                      ...newIntegration,
                      config: {
                        ...newIntegration.config,
                        fileType: e.target.value,
                      },
                    });
                  }
                }}
              >
                <option value="csv">CSV</option>
                <option value="xml">XML</option>
                <option value="json">JSON</option>
                <option value="excel">Excel</option>
              </select>
            </div>

            {(selectedIntegration?.config?.fileType === "csv" ||
              newIntegration.config?.fileType === "csv") && (
              <div className="space-y-2">
                <Label htmlFor="delimiter">Delimitador</Label>
                <Input
                  id="delimiter"
                  value={
                    selectedIntegration?.config?.delimiter ||
                    newIntegration.config?.delimiter ||
                    ","
                  }
                  onChange={(e) => {
                    if (selectedIntegration) {
                      setSelectedIntegration({
                        ...selectedIntegration,
                        config: {
                          ...selectedIntegration.config,
                          delimiter: e.target.value,
                        },
                      });
                    } else {
                      setNewIntegration({
                        ...newIntegration,
                        config: {
                          ...newIntegration.config,
                          delimiter: e.target.value,
                        },
                      });
                    }
                  }}
                  placeholder=","
                />
              </div>
            )}

            {(selectedIntegration?.config?.fileType === "xml" ||
              newIntegration.config?.fileType === "xml") && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="root-element">Elemento Raiz</Label>
                  <Input
                    id="root-element"
                    value={
                      selectedIntegration?.config?.rootElement ||
                      newIntegration.config?.rootElement ||
                      ""
                    }
                    onChange={(e) => {
                      if (selectedIntegration) {
                        setSelectedIntegration({
                          ...selectedIntegration,
                          config: {
                            ...selectedIntegration.config,
                            rootElement: e.target.value,
                          },
                        });
                      } else {
                        setNewIntegration({
                          ...newIntegration,
                          config: {
                            ...newIntegration.config,
                            rootElement: e.target.value,
                          },
                        });
                      }
                    }}
                    placeholder="Root"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item-element">Elemento de Item</Label>
                  <Input
                    id="item-element"
                    value={
                      selectedIntegration?.config?.itemElement ||
                      newIntegration.config?.itemElement ||
                      ""
                    }
                    onChange={(e) => {
                      if (selectedIntegration) {
                        setSelectedIntegration({
                          ...selectedIntegration,
                          config: {
                            ...selectedIntegration.config,
                            itemElement: e.target.value,
                          },
                        });
                      } else {
                        setNewIntegration({
                          ...newIntegration,
                          config: {
                            ...newIntegration.config,
                            itemElement: e.target.value,
                          },
                        });
                      }
                    }}
                    placeholder="Item"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label>Mapeamento de Campos</Label>
              <div className="border rounded-md p-3 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Label className="text-xs text-center">
                    Campo no Arquivo
                  </Label>
                  <Label className="text-xs text-center">
                    Campo no Sistema
                  </Label>
                </div>

                {/* Campos de mapeamento dinâmicos */}
                {Object.entries(
                  selectedIntegration?.config?.mapping ||
                    newIntegration.config?.mapping ||
                    {},
                ).map(([fileField, systemField], index) => (
                  <div key={index} className="grid grid-cols-2 gap-2">
                    <Input
                      value={fileField}
                      onChange={(e) => {
                        const oldMapping = selectedIntegration
                          ? { ...selectedIntegration.config.mapping }
                          : { ...newIntegration.config.mapping };

                        const newMapping = {};
                        Object.entries(oldMapping).forEach(([key, value]) => {
                          if (key === fileField) {
                            newMapping[e.target.value] = value;
                          } else {
                            newMapping[key] = value;
                          }
                        });

                        if (selectedIntegration) {
                          setSelectedIntegration({
                            ...selectedIntegration,
                            config: {
                              ...selectedIntegration.config,
                              mapping: newMapping,
                            },
                          });
                        } else {
                          setNewIntegration({
                            ...newIntegration,
                            config: {
                              ...newIntegration.config,
                              mapping: newMapping,
                            },
                          });
                        }
                      }}
                      placeholder="Campo no arquivo"
                    />
                    <Input
                      value={systemField as string}
                      onChange={(e) => {
                        const newMapping = selectedIntegration
                          ? { ...selectedIntegration.config.mapping }
                          : { ...newIntegration.config.mapping };

                        newMapping[fileField] = e.target.value;

                        if (selectedIntegration) {
                          setSelectedIntegration({
                            ...selectedIntegration,
                            config: {
                              ...selectedIntegration.config,
                              mapping: newMapping,
                            },
                          });
                        } else {
                          setNewIntegration({
                            ...newIntegration,
                            config: {
                              ...newIntegration.config,
                              mapping: newMapping,
                            },
                          });
                        }
                      }}
                      placeholder="Campo no sistema"
                    />
                  </div>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newMapping = selectedIntegration
                      ? { ...selectedIntegration.config.mapping, "": "" }
                      : { ...newIntegration.config.mapping, "": "" };

                    if (selectedIntegration) {
                      setSelectedIntegration({
                        ...selectedIntegration,
                        config: {
                          ...selectedIntegration.config,
                          mapping: newMapping,
                        },
                      });
                    } else {
                      setNewIntegration({
                        ...newIntegration,
                        config: {
                          ...newIntegration.config,
                          mapping: newMapping,
                        },
                      });
                    }
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Campo
                </Button>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Integrações</h2>
          <p className="text-gray-500">
            Gerencie conexões com sistemas externos e importação de dados
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Integração
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="api">APIs</TabsTrigger>
          <TabsTrigger value="webhook">Webhooks</TabsTrigger>
          <TabsTrigger value="database">Bancos de Dados</TabsTrigger>
          <TabsTrigger value="file-import">Importação de Arquivos</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredIntegrations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="rounded-full bg-gray-100 p-3 mb-4">
                  {activeTab === "all" ? (
                    <Globe className="h-8 w-8 text-gray-400" />
                  ) : activeTab === "api" ? (
                    <Globe className="h-8 w-8 text-gray-400" />
                  ) : activeTab === "webhook" ? (
                    <Webhook className="h-8 w-8 text-gray-400" />
                  ) : activeTab === "database" ? (
                    <Database className="h-8 w-8 text-gray-400" />
                  ) : (
                    <FileSpreadsheet className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <p className="text-gray-500 mb-2">
                  Nenhuma integração encontrada
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  Adicione uma nova integração para começar
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Integração
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Tipo</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Última Sincronização</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredIntegrations.map((integration) => (
                        <TableRow key={integration.id}>
                          <TableCell>
                            <div className="flex items-center justify-center">
                              {getTypeIcon(integration.type)}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {integration.name}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {integration.description}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getStatusBadge(integration.status)}
                              <Switch
                                checked={integration.status === "active"}
                                onCheckedChange={() =>
                                  handleToggleStatus(
                                    integration.id,
                                    integration.status,
                                  )
                                }
                                disabled={integration.status === "error"}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            {integration.lastSync ? (
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-gray-400" />
                                <span>
                                  {integration.lastSync.toLocaleDateString(
                                    "pt-PT",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    },
                                  )}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">
                                Nunca
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleSyncNow(integration.id)}
                                disabled={integration.status !== "active"}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setSelectedIntegration(integration);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Opções</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleSyncNow(integration.id)
                                    }
                                    disabled={integration.status !== "active"}
                                  >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Sincronizar Agora
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedIntegration(integration);
                                      setIsEditDialogOpen(true);
                                    }}
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() =>
                                      handleDeleteIntegration(integration.id)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add Integration Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Integração</DialogTitle>
            <DialogDescription>
              Configure uma nova integração para o sistema.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="integration-name">Nome da Integração</Label>
              <Input
                id="integration-name"
                value={newIntegration.name}
                onChange={(e) =>
                  setNewIntegration({ ...newIntegration, name: e.target.value })
                }
                placeholder="Ex: API de Contabilidade"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="integration-type">Tipo de Integração</Label>
              <select
                id="integration-type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newIntegration.type}
                onChange={(e) =>
                  setNewIntegration({
                    ...newIntegration,
                    type: e.target.value as
                      | "api"
                      | "webhook"
                      | "database"
                      | "file-import",
                    config: {},
                  })
                }
              >
                <option value="api">API</option>
                <option value="webhook">Webhook</option>
                <option value="database">Banco de Dados</option>
                <option value="file-import">Importação de Arquivos</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="integration-description">Descrição</Label>
              <Input
                id="integration-description"
                value={newIntegration.description}
                onChange={(e) =>
                  setNewIntegration({
                    ...newIntegration,
                    description: e.target.value,
                  })
                }
                placeholder="Descreva o propósito desta integração"
              />
            </div>

            <div className="space-y-4">
              <Label>Configuração</Label>
              {renderConfigFields()}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleAddIntegration}
              disabled={!newIntegration.name || !newIntegration.description}
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Integration Dialog */}
      {selectedIntegration && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Integração</DialogTitle>
              <DialogDescription>
                Modifique as configurações da integração.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-integration-name">
                  Nome da Integração
                </Label>
                <Input
                  id="edit-integration-name"
                  value={selectedIntegration.name}
                  onChange={(e) =>
                    setSelectedIntegration({
                      ...selectedIntegration,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-integration-description">Descrição</Label>
                <Input
                  id="edit-integration-description"
                  value={selectedIntegration.description}
                  onChange={(e) =>
                    setSelectedIntegration({
                      ...selectedIntegration,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-4">
                <Label>Configuração</Label>
                {renderConfigFields()}
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
                onClick={handleEditIntegration}
                disabled={
                  !selectedIntegration.name || !selectedIntegration.description
                }
              >
                Salvar Alterações
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default IntegrationsList;
