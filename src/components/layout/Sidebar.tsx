import React from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import {
  Home,
  Users,
  Settings,
  FileText,
  BarChart2,
  LogOut,
  Bell,
  HelpCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps = {}) => {
  return (
    <div
      className={cn(
        "flex flex-col h-full w-[280px] bg-slate-900 text-white p-4",
        className,
      )}
    >
      {/* Logo */}
      <div className="flex items-center mb-8 px-2">
        <div className="w-10 h-10 rounded-md bg-primary mr-3 flex items-center justify-center">
          <span className="font-bold text-xl text-white">GP</span>
        </div>
        <h1 className="text-xl font-bold">PaySystem</h1>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1">
        <ul className="space-y-2">
          <NavItem icon={<Home size={20} />} label="Dashboard" to="/" active />
          <NavItem
            icon={<Users size={20} />}
            label="Funcionários"
            to="/employees"
          />
          <NavItem
            icon={<BarChart2 size={20} />}
            label="Motor de Regras"
            to="/rules"
          />
          <NavItem
            icon={<FileText size={20} />}
            label="Relatórios"
            to="/reports"
          />
          <NavItem
            icon={<Settings size={20} />}
            label="Configurações"
            to="/settings"
          />
        </ul>
      </nav>

      {/* Help Section */}
      <div className="mb-6">
        <div className="rounded-lg bg-slate-800 p-4">
          <div className="flex items-center mb-3">
            <HelpCircle size={18} className="mr-2 text-primary" />
            <h3 className="font-medium">Precisa de ajuda?</h3>
          </div>
          <p className="text-sm text-slate-300 mb-3">
            Acesse nosso centro de suporte para obter assistência.
          </p>
          <button className="w-full py-2 px-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-md text-sm font-medium transition-colors">
            Centro de Suporte
          </button>
        </div>
      </div>

      {/* User Profile */}
      <div className="border-t border-slate-700 pt-4">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
              alt="Avatar"
            />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin Usuário</p>
            <p className="text-xs text-slate-400 truncate">admin@empresa.pt</p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="p-1 rounded-md hover:bg-slate-800">
                  <LogOut size={18} className="text-slate-400" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Sair</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
}

const NavItem = ({ icon, label, to, active = false }: NavItemProps) => {
  return (
    <li>
      <Link
        to={to}
        className={cn(
          "flex items-center py-2 px-3 rounded-md transition-colors",
          active
            ? "bg-primary text-white font-medium"
            : "text-slate-300 hover:bg-slate-800 hover:text-white",
        )}
      >
        <span className="mr-3">{icon}</span>
        <span>{label}</span>
      </Link>
    </li>
  );
};

export default Sidebar;
