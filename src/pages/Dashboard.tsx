import { useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  AlertTriangle,
  Target,
  Users,
  ShoppingCart
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Dashboard() {
  const { products, expenses, sales, initializeData } = useAppStore();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const profit = totalSales - totalExpenses;
    const profitMargin = totalSales > 0 ? (profit / totalSales) * 100 : 0;

    // Best selling products
    const productSales = new Map<string, { name: string; quantity: number; revenue: number }>();
    
    sales.forEach(sale => {
      sale.products.forEach(saleProduct => {
        const product = products.find(p => p.id === saleProduct.productId);
        if (product) {
          const existing = productSales.get(product.id) || { name: product.name, quantity: 0, revenue: 0 };
          existing.quantity += saleProduct.quantity;
          existing.revenue += saleProduct.quantity * saleProduct.unitPrice;
          productSales.set(product.id, existing);
        }
      });
    });

    const bestSelling = Array.from(productSales.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Stock alerts
    const stockAlerts = products.filter(product => 
      product.status === 'low_stock' || product.status === 'out_of_stock'
    );

    return {
      totalSales,
      totalExpenses,
      profit,
      profitMargin,
      bestSelling,
      stockAlerts,
      totalProducts: products.length,
      activeSuppliers: 2 // Mock for now
    };
  }, [products, expenses, sales]);

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'out_of_stock': return 'destructive' as const;
      case 'low_stock': return 'secondary' as const;
      default: return 'default' as const;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'out_of_stock': return 'Fora de Estoque';
      case 'low_stock': return 'Estoque Baixo';
      default: return 'Em Estoque';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do desempenho da sua padaria em {format(new Date(), "MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Sales */}
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Totais</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {formatCurrency(kpis.totalSales)}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +12.5% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        {/* Total Expenses */}
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas Totais</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(kpis.totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-destructive" />
              +5.2% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        {/* Profit */}
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro</CardTitle>
            <Target className={`h-4 w-4 ${kpis.profit >= 0 ? 'text-success' : 'text-destructive'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${kpis.profit >= 0 ? 'text-success' : 'text-destructive'}`}>
              {formatCurrency(kpis.profit)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Margem: {kpis.profitMargin.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        {/* Products */}
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpis.totalProducts}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {kpis.stockAlerts.length} com estoque baixo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Selling Products */}
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Produtos Mais Vendidos
            </CardTitle>
            <CardDescription>
              Ranking por faturamento no período
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {kpis.bestSelling.length > 0 ? (
              kpis.bestSelling.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.quantity} vendidos
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-success">
                      {formatCurrency(product.revenue)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma venda registrada ainda
              </p>
            )}
          </CardContent>
        </Card>

        {/* Stock Alerts */}
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Alertas de Estoque
            </CardTitle>
            <CardDescription>
              Produtos que precisam de reposição
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {kpis.stockAlerts.length > 0 ? (
              kpis.stockAlerts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Estoque atual: {product.stock} {product.unit}
                    </p>
                  </div>
                  <Badge variant={getStatusColor(product.status)}>
                    {getStatusText(product.status)}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Todos os produtos estão com estoque adequado!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Financial Health Tips */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Dicas de Saúde Financeira
          </CardTitle>
          <CardDescription>
            Insights automáticos para melhorar seu negócio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {kpis.profitMargin < 20 && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-warning-muted border border-warning/20">
              <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
              <div>
                <p className="font-medium text-warning">Margem de lucro baixa</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Sua margem de lucro está em {kpis.profitMargin.toFixed(1)}%. 
                  Considere revisar os preços ou reduzir custos.
                </p>
              </div>
            </div>
          )}
          
          {kpis.stockAlerts.length > 0 && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-warning-muted border border-warning/20">
              <Package className="h-5 w-5 text-warning mt-0.5" />
              <div>
                <p className="font-medium text-warning">Atenção ao estoque</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Você tem {kpis.stockAlerts.length} produto(s) com estoque baixo ou zerado.
                </p>
              </div>
            </div>
          )}
          
          {kpis.profit > 0 && kpis.profitMargin >= 20 && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-success-muted border border-success/20">
              <TrendingUp className="h-5 w-5 text-success mt-0.5" />
              <div>
                <p className="font-medium text-success">Excelente desempenho!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Parabéns! Sua padaria está com uma boa margem de lucro e performance positiva.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}