import { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  Download,
  Upload,
  Moon,
  Sun,
  Monitor,
  Save,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/store/auth';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [notifications, setNotifications] = useState({
    stockAlerts: true,
    expenseAlerts: true,
    salesReports: false,
    systemUpdates: true
  });

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    
    if (newTheme === 'system') {
      // Remove both classes to use system preference
      document.documentElement.classList.remove('light', 'dark');
    } else {
      // Remove both classes first, then add the selected one
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(newTheme);
    }
    
    toast({
      title: "Tema alterado",
      description: `Tema ${newTheme === 'light' ? 'claro' : newTheme === 'dark' ? 'escuro' : 'automático'} aplicado com sucesso.`
    });
  };

  const handleSaveProfile = () => {
    toast({
      title: "Perfil salvo",
      description: "Suas alterações foram salvas com sucesso."
    });
  };

  const handleExportData = () => {
    toast({
      title: "Exportação iniciada",
      description: "Seus dados estão sendo preparados para download."
    });
  };

  const handleImportData = () => {
    toast({
      title: "Importação disponível",
      description: "Funcionalidade disponível em breve."
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie suas preferências e configurações do sistema
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="w-4 h-4" />
            Aparência
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="data" className="gap-2">
            <Database className="w-4 h-4" />
            Dados
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="w-4 h-4" />
            Segurança
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações do Perfil
              </CardTitle>
              <CardDescription>
                Atualize suas informações pessoais e de conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input 
                    id="name" 
                    defaultValue={user?.name || ''} 
                    placeholder="Seu nome completo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Nome de usuário</Label>
                  <Input 
                    id="username" 
                    defaultValue={user?.username || ''} 
                    placeholder="Seu nome de usuário"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Função</Label>
                <Select defaultValue={user?.role || 'admin'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione sua função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="manager">Gerente</SelectItem>
                    <SelectItem value="employee">Funcionário</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} className="gap-2">
                  <Save className="w-4 h-4" />
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Tema e Aparência
              </CardTitle>
              <CardDescription>
                Personalize a aparência da interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Tema do Sistema</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    onClick={() => handleThemeChange('light')}
                    className="gap-2 h-16 flex-col"
                  >
                    <Sun className="w-5 h-5" />
                    Claro
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    onClick={() => handleThemeChange('dark')}
                    className="gap-2 h-16 flex-col"
                  >
                    <Moon className="w-5 h-5" />
                    Escuro
                  </Button>
                  <Button
                    variant={theme === 'system' ? 'default' : 'outline'}
                    onClick={() => handleThemeChange('system')}
                    className="gap-2 h-16 flex-col"
                  >
                    <Monitor className="w-5 h-5" />
                    Sistema
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Densidade da Interface</Label>
                <Select defaultValue="normal">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compact">Compacta</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="comfortable">Confortável</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Preferências de Notificação
              </CardTitle>
              <CardDescription>
                Configure quando e como você deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Alertas de Estoque</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificar quando produtos estiverem com estoque baixo
                    </p>
                  </div>
                  <Switch
                    checked={notifications.stockAlerts}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, stockAlerts: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Alertas de Despesas</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificar sobre despesas próximas ao vencimento
                    </p>
                  </div>
                  <Switch
                    checked={notifications.expenseAlerts}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, expenseAlerts: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Relatórios de Vendas</Label>
                    <p className="text-sm text-muted-foreground">
                      Receber relatórios automáticos de vendas
                    </p>
                  </div>
                  <Switch
                    checked={notifications.salesReports}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, salesReports: checked }))
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Atualizações do Sistema</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificar sobre novas funcionalidades e atualizações
                    </p>
                  </div>
                  <Switch
                    checked={notifications.systemUpdates}
                    onCheckedChange={(checked) => 
                      setNotifications(prev => ({ ...prev, systemUpdates: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Management */}
        <TabsContent value="data" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-card border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Exportar Dados
                </CardTitle>
                <CardDescription>
                  Baixe uma cópia de todos os seus dados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Exporte produtos, despesas, fornecedores e histórico de vendas em formato JSON.
                </p>
                <Button onClick={handleExportData} className="w-full gap-2">
                  <Download className="w-4 h-4" />
                  Exportar Todos os Dados
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Importar Dados
                </CardTitle>
                <CardDescription>
                  Restaure dados de um backup anterior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Importe dados previamente exportados para restaurar informações.
                </p>
                <Button onClick={handleImportData} variant="outline" className="w-full gap-2">
                  <Upload className="w-4 h-4" />
                  Selecionar Arquivo
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-card border-border/50 shadow-card border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="w-5 h-5" />
                Zona de Perigo
              </CardTitle>
              <CardDescription>
                Ações irreversíveis que afetam permanentemente seus dados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-destructive">Limpar Todos os Dados</h4>
                  <p className="text-sm text-muted-foreground">
                    Remove permanentemente todos os produtos, despesas, fornecedores e histórico.
                  </p>
                </div>
                <Button variant="destructive" className="gap-2">
                  <Trash2 className="w-4 h-4" />
                  Limpar Dados
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Segurança da Conta
              </CardTitle>
              <CardDescription>
                Gerencie a segurança e acesso da sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha atual</Label>
                  <Input 
                    id="current-password" 
                    type="password" 
                    placeholder="Digite sua senha atual"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova senha</Label>
                  <Input 
                    id="new-password" 
                    type="password" 
                    placeholder="Digite sua nova senha"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    placeholder="Confirme sua nova senha"
                  />
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button className="gap-2">
                  <Save className="w-4 h-4" />
                  Alterar Senha
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}