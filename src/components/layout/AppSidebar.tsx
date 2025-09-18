import {
  BarChart3,
  Package,
  Users,
  Receipt,
  FileText,
  Settings,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import bakeryIcon from "@/assets/bakery-icon.png";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
    description: "Visão geral do negócio",
  },
  {
    title: "Produtos",
    url: "/produtos",
    icon: Package,
    description: "Gestão do estoque",
  },
  {
    title: "Fornecedores",
    url: "/fornecedores",
    icon: Users,
    description: "Gestão de parceiros",
  },
  {
    title: "Despesas",
    url: "/despesas",
    icon: Receipt,
    description: "Controle financeiro",
  },
  {
    title: "Relatórios",
    url: "/relatorios",
    icon: FileText,
    description: "Análises e exportações",
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar
      className="bg-gradient-sidebar border-sidebar-border"
      collapsible="icon"
    >
      <SidebarContent className="p-0">
        {/* Logo Section */}
        <div className="flex items-center gap-3 p-6 border-b border-sidebar-border">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-primary shadow-primary">
            <img
              src="/favicon.png"
              alt="Padaria SA"
              className="w-8 h-8 object-contain"
            />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="text-xl font-bold text-sidebar-foreground">
                Padaria SA
              </h2>
              <p className="text-sm text-sidebar-foreground/70">
                Sistema de Gestão
              </p>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <SidebarGroup className="px-4 py-6">
          <SidebarGroupLabel
            className={`text-sidebar-foreground/60 text-xs font-medium uppercase tracking-wider mb-4 ${
              isCollapsed ? "hidden" : ""
            }`}
          >
            Navegação
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`
                      relative rounded-xl transition-all duration-200 group min-h-[60px]
                      ${
                        isActive(item.url)
                          ? "bg-primary text-primary-foreground shadow-primary hover:bg-primary-hover"
                          : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }
                    `}
                  >
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-4 px-4 py-4"
                    >
                      <item.icon
                        className={`w-6 h-6 transition-colors ${
                          isActive(item.url) ? "text-primary-foreground" : ""
                        }`}
                      />
                      {!isCollapsed && (
                        <div className="flex-1">
                          <span className="font-semibold text-base">
                            {item.title}
                          </span>
                          <p className="text-sm opacity-70 mt-1">
                            {item.description}
                          </p>
                        </div>
                      )}
                      {/* Active indicator */}
                      {isActive(item.url) && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-foreground rounded-r" />
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings at bottom */}
        {!isCollapsed && (
          <div className="mt-auto p-4 border-t border-sidebar-border">
            <SidebarMenuButton
              asChild
              className="w-full text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-xl min-h-[50px]"
            >
              <NavLink
                to="/configuracoes"
                className="flex items-center gap-3 px-2"
              >
                <Settings className="w-6 h-6" />
                <span className="text-base font-medium">Configurações</span>
              </NavLink>
            </SidebarMenuButton>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
