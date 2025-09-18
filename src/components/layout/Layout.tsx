import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              {children}
            </div>
          </main>
          <footer className="border-t border-border bg-card text-card-foreground p-4">
            <div className="text-center text-sm text-muted-foreground">
              © 2025 Gestão Padaria SA - Desenvolvido por{' '}
              <span className="font-semibold text-primary">Isaque Santos Desenvolvedor Full Stack</span>
            </div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}