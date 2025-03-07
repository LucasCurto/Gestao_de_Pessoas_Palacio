import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import {
  Bell,
  Search,
  Settings,
  HelpCircle,
  Menu,
  X,
  Calendar,
  MessageSquare,
} from "lucide-react";
import CompanySelector from "@/components/company/CompanySelector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  onToggleSidebar?: () => void;
  className?: string;
  user?: {
    name: string;
    email: string;
    avatar: string;
  };
  notifications?: {
    id: string;
    title: string;
    description: string;
    time: string;
    read: boolean;
  }[];
}

const Header = ({
  onToggleSidebar = () => {},
  className,
  user = {
    name: "Admin Usuário",
    email: "admin@empresa.pt",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
  },
  notifications = [
    {
      id: "1",
      title: "Processamento de Pagamentos",
      description: "O processamento de pagamentos de Maio foi concluído",
      time: "há 5 minutos",
      read: false,
    },
    {
      id: "2",
      title: "Nova Regra Criada",
      description: "A regra 'Subsídio de Férias 2023' foi criada",
      time: "há 2 horas",
      read: false,
    },
    {
      id: "3",
      title: "Atualização do Sistema",
      description: "Uma nova versão do sistema está disponível",
      time: "há 1 dia",
      read: true,
    },
  ],
}: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const unreadNotificationsCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  return (
    <header
      className={cn(
        "h-20 bg-white border-b border-slate-200 flex items-center px-4 sticky top-0 z-30",
        className,
      )}
    >
      <div className="flex items-center justify-between w-full">
        {/* Left section with mobile menu toggle */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2"
            onClick={onToggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Company Selector */}
          <div className="mr-4">
            <CompanySelector />
          </div>

          {/* Search - Collapsible on mobile */}
          <div
            className={cn(
              "transition-all duration-200 ease-in-out",
              isSearchExpanded
                ? "w-full absolute left-0 top-0 h-20 bg-white px-4 flex items-center z-40"
                : "relative hidden md:block w-64",
            )}
          >
            {isSearchExpanded && (
              <Button
                variant="ghost"
                size="icon"
                className="mr-2"
                onClick={() => setIsSearchExpanded(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            )}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Pesquisar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full bg-slate-50 border-slate-200 focus:bg-white"
              />
            </div>
          </div>

          {!isSearchExpanded && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSearchExpanded(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Right section with actions */}
        <div className="flex items-center space-x-1 md:space-x-3">
          {/* Quick Actions */}
          <div className="hidden md:flex space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-600"
                  >
                    <Calendar className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Calendário</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-600"
                  >
                    <MessageSquare className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mensagens</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      {unreadNotificationsCount > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                          {unreadNotificationsCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notificações</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notificações</span>
                {unreadNotificationsCount > 0 && (
                  <Badge variant="outline" className="ml-2">
                    {unreadNotificationsCount} não lidas
                  </Badge>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <div className="py-4 text-center text-sm text-slate-500">
                  Não há notificações
                </div>
              ) : (
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="flex flex-col items-start p-3 cursor-pointer"
                    >
                      <div className="flex items-start w-full">
                        <div
                          className={cn(
                            "w-2 h-2 rounded-full mt-1.5 mr-2 flex-shrink-0",
                            notification.read ? "bg-slate-300" : "bg-blue-500",
                          )}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {notification.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {notification.description}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-sm font-medium text-primary">
                Ver todas as notificações
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Help */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Ajuda</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Settings */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Configurações</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="pl-2 pr-3 py-1.5 h-auto">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{user.email}</p>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/profile" className="flex w-full">
                  Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/settings" className="flex w-full">
                  Configurações
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500 focus:text-red-500 focus:bg-red-50">
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
