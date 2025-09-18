import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuthStore();
  const { toast } = useToast();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = login(username, password);

      if (success) {
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao sistema de gestão.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro no login",
          description: "Usuário ou senha incorretos.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro interno do sistema.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary shadow-elevated">
              <img
                src="/favicon.png"
                alt="Padaria SA"
                className="w-10 h-10 object-contain"
              />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Gestão Padaria SA
            </h1>
            <p className="text-muted-foreground">
              Sistema de gestão empresarial
            </p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader className="space-y-1 text-center pb-4">
            <h2 className="text-xl font-semibold">Acesse sua conta</h2>
            <p className="text-sm text-muted-foreground">
              Entre com suas credenciais para continuar
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Usuário
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Digite seu usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 h-11 bg-background"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 bg-background"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-primary hover:bg-primary-hover text-primary-foreground font-medium shadow-primary"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border/50">
              <p className="text-xs text-muted-foreground mb-2 font-medium">
                Credenciais de demonstração:
              </p>
              <div className="space-y-1 text-xs">
                <p>
                  <span className="font-medium">Usuário:</span> admin
                </p>
                <p>
                  <span className="font-medium">Senha:</span> padaria123
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          © 2024 Gestão Padaria SA. Todos os direitos reservados.
        </div>
      </div>
    </div>
  );
}
