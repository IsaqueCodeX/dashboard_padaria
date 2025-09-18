import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Receipt, Calendar, DollarSign, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/store';
import { AddExpenseModal } from '@/components/modals/AddExpenseModal';
import { EditExpenseModal } from '@/components/modals/EditExpenseModal';
import { Expense } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Expenses() {
  const { expenses, suppliers, initializeData, deleteExpense } = useAppStore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'fixed' | 'variable'>('all');

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Filter expenses
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || expense.type === selectedType;
    return matchesSearch && matchesType;
  });

  // Calculate totals
  const totals = {
    all: expenses.reduce((sum, exp) => sum + exp.amount, 0),
    fixed: expenses.filter(exp => exp.type === 'fixed').reduce((sum, exp) => sum + exp.amount, 0),
    variable: expenses.filter(exp => exp.type === 'variable').reduce((sum, exp) => sum + exp.amount, 0)
  };

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);

  const getTypeColor = (type: Expense['type']) => {
    return type === 'fixed' ? 'destructive' : 'secondary';
  };

  const getSupplierName = (supplierId?: string) => {
    if (!supplierId) return null;
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier?.name || 'Fornecedor não encontrado';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Despesas</h1>
          <p className="text-muted-foreground">
            Controle suas despesas fixas e variáveis
          </p>
        </div>
        <AddExpenseModal />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Geral</CardTitle>
            <DollarSign className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(totals.all)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas Fixas</CardTitle>
            <Receipt className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(totals.fixed)}
            </div>
            <p className="text-xs text-muted-foreground">
              {totals.all > 0 ? ((totals.fixed / totals.all) * 100).toFixed(1) : 0}% do total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas Variáveis</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totals.variable)}
            </div>
            <p className="text-xs text-muted-foreground">
              {totals.all > 0 ? ((totals.variable / totals.all) * 100).toFixed(1) : 0}% do total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar despesas por descrição ou categoria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Badge
                variant={selectedType === 'all' ? 'default' : 'secondary'}
                className={`cursor-pointer transition-colors ${
                  selectedType === 'all' 
                    ? 'bg-primary text-primary-foreground hover:bg-primary-hover' 
                    : 'hover:bg-secondary'
                }`}
                onClick={() => setSelectedType('all')}
              >
                Todas
              </Badge>
              <Badge
                variant={selectedType === 'fixed' ? 'default' : 'secondary'}
                className={`cursor-pointer transition-colors ${
                  selectedType === 'fixed' 
                    ? 'bg-primary text-primary-foreground hover:bg-primary-hover' 
                    : 'hover:bg-secondary'
                }`}
                onClick={() => setSelectedType('fixed')}
              >
                Fixas
              </Badge>
              <Badge
                variant={selectedType === 'variable' ? 'default' : 'secondary'}
                className={`cursor-pointer transition-colors ${
                  selectedType === 'variable' 
                    ? 'bg-primary text-primary-foreground hover:bg-primary-hover' 
                    : 'hover:bg-secondary'
                }`}
                onClick={() => setSelectedType('variable')}
              >
                Variáveis
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expenses List */}
      {filteredExpenses.length > 0 ? (
        <div className="space-y-3">
          {filteredExpenses
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((expense) => (
            <Card key={expense.id} className="bg-gradient-card border-border/50 shadow-card hover:shadow-elevated transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-destructive/20 text-destructive">
                      <Receipt className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg truncate">
                          {expense.description}
                        </h3>
                        <Badge variant={getTypeColor(expense.type)}>
                          {expense.type === 'fixed' ? 'Fixa' : 'Variável'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Tag className="w-4 h-4" />
                          <span>{expense.category}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(expense.date), "dd/MM/yyyy", { locale: ptBR })}</span>
                        </div>
                      </div>

                      {expense.supplierId && (
                        <p className="text-xs text-muted-foreground">
                          Fornecedor: {getSupplierName(expense.supplierId)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-destructive">
                        {formatCurrency(expense.amount)}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <EditExpenseModal expense={expense} />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir a despesa "{expense.description}"? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={async () => {
                                try {
                                  await deleteExpense(expense.id);
                                  toast({
                                    title: "Despesa excluída",
                                    description: "A despesa foi excluída com sucesso.",
                                  });
                                } catch (error) {
                                  toast({
                                    title: "Erro",
                                    description: "Ocorreu um erro ao excluir a despesa.",
                                    variant: "destructive",
                                  });
                                }
                              }}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Receipt className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm || selectedType !== 'all' 
                ? 'Nenhuma despesa encontrada' 
                : 'Nenhuma despesa cadastrada'
              }
            </h3>
            <p className="text-muted-foreground text-center mb-6">
              {searchTerm || selectedType !== 'all'
                ? 'Tente ajustar os filtros de busca para encontrar despesas.'
                : 'Comece cadastrando sua primeira despesa para controlar os gastos.'
              }
            </p>
            {(!searchTerm && selectedType === 'all') && (
              <Button className="bg-gradient-primary hover:bg-primary-hover text-primary-foreground shadow-primary">
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Primeira Despesa
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}