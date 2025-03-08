import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileBarChart,
  Settings,
  Link2,
  ChevronRight,
  ChevronLeft,
  LogOut,
  HelpCircle,
} from "lucide-react";

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

interface NavItem {
  title: string;
  icon: React.ReactNode;
  path: string;
  badge?: {
    count: number;
    variant: "default" | "secondary" | "destructive" | "outline";
  };
}

const Sidebar = ({
  collapsed = false,
  onToggleCollapse = () => {},
  className = "",
}: SidebarProps) => {
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard size={collapsed ? 20 : 18} />,
      path: "/",
    },
    {
      title: "Gestão de Funcionários",
      icon: <Users size={collapsed ? 20 : 18} />,
      path: "/employees",
      badge: { count: 2, variant: "secondary" },
    },
    {
      title: "Motor de Regras",
      icon: <BookOpen size={collapsed ? 20 : 18} />,
      path: "/rules",
    },
    {
      title: "Sistema de Relatórios",
      icon: <FileBarChart size={collapsed ? 20 : 18} />,
      path: "/reports",
    },
    {
      title: "Configurações",
      icon: <Settings size={collapsed ? 20 : 18} />,
      path: "/settings",
    },
    {
      title: "Integrações",
      icon: <Link2 size={collapsed ? 20 : 18} />,
      path: "/integrations",
      badge: { count: 1, variant: "destructive" },
    },
  ];

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  return (
    <aside
      className={cn(
        "bg-white border-r border-gray-200 h-full transition-all duration-300 flex flex-col",
        collapsed ? "w-[70px]" : "w-[280px]",
        className,
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center">
            <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <h2 className="ml-2 font-semibold text-gray-800 truncate">
              PayManager
            </h2>
          </div>
        )}
        {collapsed && (
          <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-lg">P</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
          onClick={onToggleCollapse}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center px-3 py-2 rounded-md text-sm transition-colors",
                        isActive(item.path)
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100",
                        collapsed && "justify-center",
                      )}
                    >
                      <span className={cn("mr-3", collapsed && "mr-0")}>
                        {item.icon}
                      </span>
                      {!collapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                      {item.badge && !collapsed && (
                        <span
                          className={cn(
                            "ml-auto flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium",
                            item.badge.variant === "destructive"
                              ? "bg-red-100 text-red-600"
                              : "bg-blue-100 text-blue-600",
                          )}
                        >
                          {item.badge.count}
                        </span>
                      )}
                    </Link>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right">{item.title}</TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto border-t border-gray-200 p-4">
        <div className="space-y-3">
          {!collapsed && (
            <div className="bg-blue-50 rounded-md p-3">
              <p className="text-xs text-blue-700 font-medium">
                Precisa de ajuda?
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Acesse nosso centro de suporte para obter assistência.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 bg-white border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                <HelpCircle size={14} className="mr-1" />
                Centro de Suporte
              </Button>
            </div>
          )}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full flex items-center text-red-600 hover:bg-red-50 hover:text-red-700",
                    collapsed && "justify-center",
                  )}
                >
                  <LogOut size={collapsed ? 20 : 16} className="mr-2" />
                  {!collapsed && <span>Sair</span>}
                </Button>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">Sair</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
