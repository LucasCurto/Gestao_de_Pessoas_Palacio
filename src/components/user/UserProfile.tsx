import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { User, Mail, Phone, Lock, Bell, Shield, Save } from "lucide-react";

interface UserProfileProps {
  user?: {
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    role?: string;
    department?: string;
  };
  onSave?: (userData: any) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  user = {
    name: "Admin Usuário",
    email: "admin@empresa.pt",
    phone: "+351 912 345 678",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    role: "Administrador",
    department: "Tecnologia",
  },
  onSave = () => {},
}) => {
  const [activeTab, setActiveTab] = useState("general");
  const [userData, setUserData] = useState(user);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    weeklyReport: true,
    newFeatures: true,
    securityAlerts: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleNotificationChange = (key: string, checked: boolean) => {
    setNotifications({ ...notifications, [key]: checked });
  };

  const handleSave = () => {
    onSave({ ...userData, notifications });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Perfil do Usuário</h2>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e preferências
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="md:w-1/3">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback>
                  {userData.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-lg font-medium">{userData.name}</h3>
                <p className="text-sm text-muted-foreground">{userData.role}</p>
                <p className="text-sm text-muted-foreground">
                  {userData.department}
                </p>
              </div>
              <Button variant="outline" className="w-full">
                Alterar Foto
              </Button>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{userData.email}</span>
              </div>
              {userData.phone && (
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{userData.phone}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">
                <User className="mr-2 h-4 w-4" />
                Geral
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="mr-2 h-4 w-4" />
                Notificações
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="mr-2 h-4 w-4" />
                Segurança
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        name="name"
                        value={userData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={userData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={userData.phone || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Departamento</Label>
                      <Input
                        id="department"
                        name="department"
                        value={userData.department || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Preferências de Notificação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">
                      Canais de Notificação
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-notifications">Email</Label>
                          <p className="text-sm text-muted-foreground">
                            Receber notificações por email
                          </p>
                        </div>
                        <Switch
                          id="email-notifications"
                          checked={notifications.email}
                          onCheckedChange={(checked) =>
                            handleNotificationChange("email", checked)
                          }
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="push-notifications">
                            Notificações Push
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Receber notificações no navegador
                          </p>
                        </div>
                        <Switch
                          id="push-notifications"
                          checked={notifications.push}
                          onCheckedChange={(checked) =>
                            handleNotificationChange("push", checked)
                          }
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="sms-notifications">SMS</Label>
                          <p className="text-sm text-muted-foreground">
                            Receber notificações por SMS
                          </p>
                        </div>
                        <Switch
                          id="sms-notifications"
                          checked={notifications.sms}
                          onCheckedChange={(checked) =>
                            handleNotificationChange("sms", checked)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">
                      Tipos de Notificação
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="weekly-report">
                            Relatório Semanal
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Receber resumo semanal de atividades
                          </p>
                        </div>
                        <Switch
                          id="weekly-report"
                          checked={notifications.weeklyReport}
                          onCheckedChange={(checked) =>
                            handleNotificationChange("weeklyReport", checked)
                          }
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="new-features">Novos Recursos</Label>
                          <p className="text-sm text-muted-foreground">
                            Ser notificado sobre novos recursos
                          </p>
                        </div>
                        <Switch
                          id="new-features"
                          checked={notifications.newFeatures}
                          onCheckedChange={(checked) =>
                            handleNotificationChange("newFeatures", checked)
                          }
                        />
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="security-alerts">
                            Alertas de Segurança
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Receber alertas de segurança importantes
                          </p>
                        </div>
                        <Switch
                          id="security-alerts"
                          checked={notifications.securityAlerts}
                          onCheckedChange={(checked) =>
                            handleNotificationChange("securityAlerts", checked)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Segurança da Conta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Alterar Senha</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Senha Atual</Label>
                        <div className="relative">
                          <Input id="current-password" type="password" />
                          <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Nova Senha</Label>
                        <div className="relative">
                          <Input id="new-password" type="password" />
                          <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">
                          Confirmar Nova Senha
                        </Label>
                        <div className="relative">
                          <Input id="confirm-password" type="password" />
                          <Lock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      <Button className="mt-2">Atualizar Senha</Button>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">
                      Autenticação de Dois Fatores
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Ativar 2FA</Label>
                        <p className="text-sm text-muted-foreground">
                          Proteja sua conta com autenticação de dois fatores
                        </p>
                      </div>
                      <Switch id="2fa" />
                    </div>
                    <Button variant="outline" className="mt-2" disabled>
                      Configurar 2FA
                    </Button>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Sessões Ativas</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                        <div>
                          <p className="font-medium">Este Dispositivo</p>
                          <p className="text-sm text-muted-foreground">
                            Última atividade: Agora
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Encerrar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
