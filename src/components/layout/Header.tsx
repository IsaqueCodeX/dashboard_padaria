import { Bell, LogOut, User, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/auth";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle("light");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left side - Sidebar trigger */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="hover:bg-accent hover:text-accent-foreground" />
          <div className="hidden md:flex items-center gap-3">
            <img
              src="/favicon.png"
              alt="Padaria SA"
              className="w-8 h-8 object-contain"
            />
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                Gestão Padaria SA
              </h1>
              <p className="text-sm text-muted-foreground">
                Sistema de gestão empresarial
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="w-9 h-9 p-0"
          >
            <Sun className="w-4 h-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute w-4 h-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative w-9 h-9 p-0">
            <Bell className="w-4 h-4" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs flex items-center justify-center"
            >
              3
            </Badge>
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-3 h-9"
              >
                <Avatar className="w-7 h-7">
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                    {user?.name?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:inline text-sm font-medium">
                  {user?.name || "Usuário"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center gap-3 p-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.name?.charAt(0) || "A"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {user?.name || "Usuário"}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user?.role || "admin"}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="w-4 h-4 mr-2" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
