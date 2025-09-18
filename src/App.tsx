import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";
import { Layout } from "@/components/layout/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Suppliers from "./pages/Suppliers";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Layout>{children}</Layout>;
};

const App = () => {
  const { user, isAuthenticated } = useAuthStore();

  // Initialize authentication from localStorage on app start
  useEffect(() => {
    const storedAuth = localStorage.getItem('auth-storage');
    if (storedAuth && !isAuthenticated) {
      try {
        const { user: storedUser, isAuthenticated: storedIsAuth } = JSON.parse(storedAuth);
        if (storedIsAuth && storedUser) {
          useAuthStore.setState({ user: storedUser, isAuthenticated: true });
        }
      } catch (error) {
        console.error('Failed to parse auth data from localStorage');
        localStorage.removeItem('auth-storage');
      }
    }
  }, [isAuthenticated]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/produtos" element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            } />
            <Route path="/fornecedores" element={
              <ProtectedRoute>
                <Suppliers />
              </ProtectedRoute>
            } />
            <Route path="/despesas" element={
              <ProtectedRoute>
                <Expenses />
              </ProtectedRoute>
            } />
            <Route path="/relatorios" element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="/configuracoes" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
