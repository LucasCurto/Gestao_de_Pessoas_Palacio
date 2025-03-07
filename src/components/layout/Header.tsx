import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Search, Settings, User, LogOut, Menu } from "lucide-react";

interface HeaderProps {
  title?: string;
  onMenuToggle?: () => void;
  notifications?: Array<{ id: string; content: string; read: boolean }>;
  userName?: string;
  userAvatar?: string;
}

const Header = ({
  title = "Dashboard",
  onMenuToggle = () => {},
  notifications = [
    { id: "1", content: "Pagamento pendente para aprovação", read: false },
    { id: "2", content: "Novo funcionário adicionado", read: false },
    { id: "3", content: "Relatório mensal disponível", read: true },
  ],
  userName = "João Silva",
  userAvatar = "",
}: HeaderProps) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="bg-white border-b border-gray-200 h-[72px] w-full px-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Pesquisar..."
            className="pl-8 h-9 w-full bg-gray-50 border-gray-200 focus:bg-white"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              <>
                {notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="py-2 px-4 cursor-pointer"
                  >
                    <div className="flex items-start gap-2 w-full">
                      {!notification.read && (
                        <div className="h-2 w-2 mt-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                      )}
                      <span
                        className={`text-sm ${!notification.read ? "font-medium" : "text-gray-600"}`}
                      >
                        {notification.content}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-blue-600 hover:text-blue-700"
                  >
                    Ver todas
                  </Button>
                </DropdownMenuItem>
              </>
            ) : (
              <div className="py-4 text-center text-gray-500">
                Nenhuma notificação
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5 text-gray-600" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 pl-2 pr-3"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden md:inline">
                {userName}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
