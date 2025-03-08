import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  Settings,
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "info" | "warning" | "success" | "error";
  read: boolean;
}

interface NotificationsPanelProps {
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onClearAll?: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  notifications: propNotifications,
  onMarkAsRead = () => {},
  onMarkAllAsRead = () => {},
  onClearAll = () => {},
}) => {
  const defaultNotifications: Notification[] = [
    {
      id: "1",
      title: "Processamento de Pagamentos",
      message:
        "O processamento de pagamentos de Maio foi concluído com sucesso.",
      time: "há 5 minutos",
      type: "success",
      read: false,
    },
    {
      id: "2",
      title: "Nova Regra Criada",
      message: "A regra 'Subsídio de Férias 2023' foi criada e está ativa.",
      time: "há 2 horas",
      type: "info",
      read: false,
    },
    {
      id: "3",
      title: "Atualização do Sistema",
      message:
        "Uma nova versão do sistema está disponível. Atualize para acessar os novos recursos.",
      time: "há 1 dia",
      type: "info",
      read: true,
    },
    {
      id: "4",
      title: "Erro no Processamento",
      message:
        "Ocorreu um erro ao processar os pagamentos para 2 funcionários.",
      time: "há 3 dias",
      type: "error",
      read: true,
    },
    {
      id: "5",
      title: "Lembrete de Aprovação",
      message: "Existem 5 solicitações de férias pendentes de aprovação.",
      time: "há 1 semana",
      type: "warning",
      read: true,
    },
  ];

  const [notifications, setNotifications] = useState<Notification[]>(
    propNotifications || defaultNotifications,
  );
  const [activeTab, setActiveTab] = useState("all");

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
    onMarkAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true })),
    );
    onMarkAllAsRead();
  };

  const handleClearAll = () => {
    setNotifications([]);
    onClearAll();
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.read;
    return notification.type === activeTab;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Notificações
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-primary">{unreadCount}</Badge>
            )}
          </CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" title="Configurações">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="px-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="unread">
                Não lidas {unreadCount > 0 && `(${unreadCount})`}
              </TabsTrigger>
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="warning">Alertas</TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-2 px-4 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {filteredNotifications.length} notificações
            </p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={handleMarkAllAsRead}
                disabled={!unreadCount}
              >
                Marcar todas como lidas
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={handleClearAll}
                disabled={notifications.length === 0}
              >
                Limpar todas
              </Button>
            </div>
          </div>

          <Separator className="my-2" />

          <div className="max-h-[400px] overflow-y-auto">
            <TabsContent value={activeTab} className="m-0">
              {filteredNotifications.length > 0 ? (
                <div className="divide-y">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-muted/50 transition-colors ${!notification.read ? "bg-muted/20" : ""}`}
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-medium">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <Badge
                                variant="outline"
                                className="ml-2 h-1.5 w-1.5 rounded-full bg-primary p-0"
                              />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center mt-2 text-xs text-muted-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            {notification.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <Bell className="h-10 w-10 text-muted-foreground mb-4" />
                  <h3 className="text-sm font-medium">Nenhuma notificação</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Você não tem notificações{" "}
                    {activeTab !== "all" && "nesta categoria"}
                  </p>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default NotificationsPanel;
