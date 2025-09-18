import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/store';
import { AddProductModal } from '@/components/modals/AddProductModal';
import { EditProductModal } from '@/components/modals/EditProductModal';
import { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function Products() {
  const { products, initializeData, deleteProduct } = useAppStore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'out_of_stock': return 'destructive' as const;
      case 'low_stock': return 'secondary' as const;
      default: return 'default' as const;
    }
  };

  const getStatusText = (status: Product['status']) => {
    switch (status) {
      case 'out_of_stock': return 'Fora de Estoque';
      case 'low_stock': return 'Estoque Baixo';
      default: return 'Em Estoque';
    }
  };

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground">
            Gerencie seu estoque e catálogo de produtos
          </p>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary-hover text-primary-foreground shadow-primary">
          <AddProductModal />
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-2 flex-wrap">
                {categories.map(category => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'secondary'}
                    className={`cursor-pointer transition-colors ${
                      selectedCategory === category 
                        ? 'bg-primary text-primary-foreground hover:bg-primary-hover' 
                        : 'hover:bg-secondary'
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === 'all' ? 'Todos' : category}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="bg-gradient-card border-border/50 shadow-card hover:shadow-elevated transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 text-primary">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <Badge variant="outline" className="text-xs mt-1">
                        {product.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <EditProductModal product={product} />
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
                            Tem certeza que deseja excluir o produto "{product.name}"? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={async () => {
                              try {
                                await deleteProduct(product.id);
                                toast({
                                  title: "Produto excluído",
                                  description: "O produto foi excluído com sucesso.",
                                });
                              } catch (error) {
                                toast({
                                  title: "Erro",
                                  description: "Ocorreu um erro ao excluir o produto.",
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
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {product.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Preço de Custo
                    </p>
                    <p className="text-sm font-medium text-destructive">
                      {formatCurrency(product.costPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Preço de Venda
                    </p>
                    <p className="text-sm font-medium text-success">
                      {formatCurrency(product.sellPrice)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Estoque
                    </p>
                    <p className="text-sm font-medium">
                      {product.stock} {product.unit}
                    </p>
                  </div>
                  <Badge variant={getStatusColor(product.status)}>
                    {getStatusText(product.status)}
                  </Badge>
                </div>

                <div className="text-xs text-muted-foreground">
                  Margem: {(((product.sellPrice - product.costPrice) / product.sellPrice) * 100).toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Nenhum produto encontrado' 
                : 'Nenhum produto cadastrado'
              }
            </h3>
            <p className="text-muted-foreground text-center mb-6">
              {searchTerm || selectedCategory !== 'all'
                ? 'Tente ajustar os filtros de busca para encontrar produtos.'
                : 'Comece cadastrando seu primeiro produto para gerenciar o estoque.'
              }
            </p>
            {(!searchTerm && selectedCategory === 'all') && (
              <Button className="bg-gradient-primary hover:bg-primary-hover text-primary-foreground shadow-primary">
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Primeiro Produto
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}