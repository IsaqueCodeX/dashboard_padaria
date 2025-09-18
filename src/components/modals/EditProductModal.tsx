import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit } from 'lucide-react';
import { useAppStore } from '@/store';
import { Product } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface EditProductModalProps {
  product: Product;
}

const categories = [
  'Pães',
  'Bolos',
  'Salgados',
  'Doces',
  'Bebidas',
  'Insumos',
  'Embalagens',
  'Outros'
];

const units = [
  'un', 'kg', 'g', 'L', 'ml', 'pacote', 'caixa', 'dúzia'
];

export function EditProductModal({ product }: EditProductModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: product.name,
    category: product.category,
    description: product.description,
    costPrice: product.costPrice.toString(),
    sellPrice: product.sellPrice.toString(),
    stock: product.stock.toString(),
    unit: product.unit,
  });
  
  const { updateProduct } = useAppStore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProduct(product.id, {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        costPrice: parseFloat(formData.costPrice),
        sellPrice: parseFloat(formData.sellPrice),
        stock: parseInt(formData.stock),
        unit: formData.unit,
      });
      
      setOpen(false);
      toast({
        title: "Produto atualizado",
        description: "O produto foi atualizado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o produto.",
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
          <DialogTitle>Editar Produto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Produto *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="costPrice">Preço de Custo (R$) *</Label>
              <Input
                id="costPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.costPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, costPrice: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sellPrice">Preço de Venda (R$) *</Label>
              <Input
                id="sellPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.sellPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, sellPrice: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stock">Estoque Atual *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unidade *</Label>
              <Select value={formData.unit} onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma unidade" />
                </SelectTrigger>
                <SelectContent>
                  {units.map(unit => (
                    <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-primary hover:bg-primary-hover text-primary-foreground">
              Atualizar Produto
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}