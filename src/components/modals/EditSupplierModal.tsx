import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit } from 'lucide-react';
import { useAppStore } from '@/store';
import { Supplier } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface EditSupplierModalProps {
  supplier: Supplier;
}

export function EditSupplierModal({ supplier }: EditSupplierModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: supplier.name,
    phone: supplier.contact.phone,
    email: supplier.contact.email,
    cnpj: supplier.cnpj,
    products: supplier.products.join(', '),
    paymentTerms: supplier.paymentTerms,
  });
  
  const { updateSupplier } = useAppStore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateSupplier(supplier.id, {
        name: formData.name,
        contact: {
          phone: formData.phone,
          email: formData.email,
        },
        cnpj: formData.cnpj,
        products: formData.products.split(',').map(p => p.trim()).filter(p => p),
        paymentTerms: formData.paymentTerms,
      });
      
      setOpen(false);
      toast({
        title: "Fornecedor atualizado",
        description: "O fornecedor foi atualizado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o fornecedor.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
          <Edit className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Fornecedor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Empresa *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ *</Label>
            <Input
              id="cnpj"
              value={formData.cnpj}
              onChange={(e) => setFormData(prev => ({ ...prev, cnpj: e.target.value }))}
              placeholder="00.000.000/0000-00"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="(11) 99999-9999"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="contato@empresa.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="products">Produtos Fornecidos</Label>
            <Textarea
              id="products"
              value={formData.products}
              onChange={(e) => setFormData(prev => ({ ...prev, products: e.target.value }))}
              placeholder="Farinha, Açúcar, Ovos (separados por vírgula)"
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Digite os produtos separados por vírgula
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentTerms">Condições de Pagamento *</Label>
            <Input
              id="paymentTerms"
              value={formData.paymentTerms}
              onChange={(e) => setFormData(prev => ({ ...prev, paymentTerms: e.target.value }))}
              placeholder="30 dias, À vista, etc."
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-primary hover:bg-primary-hover text-primary-foreground">
              Atualizar Fornecedor
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}