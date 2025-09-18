import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Users, Phone, Mail, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AddSupplierModal } from '@/components/modals/AddSupplierModal';
import { EditSupplierModal } from '@/components/modals/EditSupplierModal';
import { useAppStore } from '@/store';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function Suppliers() {
  const { suppliers, initializeData, deleteSupplier } = useAppStore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Filter suppliers
  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.cnpj.includes(searchTerm)
  );

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fornecedores</h1>
          <p className="text-muted-foreground">
            Gerencie seus parceiros comerciais e fornecedores
          </p>
        </div>
        <AddSupplierModal />
      </div>

      {/* Search */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar fornecedores por nome, email ou CNPJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Suppliers Grid */}
      {filteredSuppliers.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSuppliers.map((supplier) => (
            <Card key={supplier.id} className="bg-gradient-card border-border/50 shadow-card hover:shadow-elevated transition-all duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 text-primary">
                      <Building className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{supplier.name}</CardTitle>
                      <p className="text-sm text-muted-foreground font-mono">
                        CNPJ: {formatCNPJ(supplier.cnpj)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <EditSupplierModal supplier={supplier} />
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
                            Tem certeza que deseja excluir o fornecedor "{supplier.name}"? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={async () => {
                              try {
                                await deleteSupplier(supplier.id);
                                toast({
                                  title: "Fornecedor excluído",
                                  description: "O fornecedor foi excluído com sucesso.",
                                });
                              } catch (error) {
                                toast({
                                  title: "Erro",
                                  description: "Ocorreu um erro ao excluir o fornecedor.",
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
                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{formatPhone(supplier.contact.phone)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{supplier.contact.email}</span>
                  </div>
                </div>

                {/* Products Supplied */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Produtos Fornecidos
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {supplier.products.map((product, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Payment Terms */}
                <div className="pt-3 border-t border-border">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                    Condições de Pagamento
                  </p>
                  <p className="text-sm font-medium">{supplier.paymentTerms}</p>
                </div>

                {/* Last Updated */}
                <div className="text-xs text-muted-foreground">
                  Atualizado em {new Date(supplier.updatedAt).toLocaleDateString('pt-BR')}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm 
                ? 'Nenhum fornecedor encontrado' 
                : 'Nenhum fornecedor cadastrado'
              }
            </h3>
            <p className="text-muted-foreground text-center mb-6">
              {searchTerm
                ? 'Tente ajustar o termo de busca para encontrar fornecedores.'
                : 'Comece cadastrando seu primeiro fornecedor para gerenciar parcerias comerciais.'
              }
            </p>
            {!searchTerm && (
              <Button className="bg-gradient-primary hover:bg-primary-hover text-primary-foreground shadow-primary">
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar Primeiro Fornecedor
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}