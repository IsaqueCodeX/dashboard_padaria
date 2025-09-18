import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Building, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAppStore } from '@/store';
import { useToast } from '@/hooks/use-toast';

const supplierSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  cnpj: z.string()
    .min(14, 'CNPJ deve ter 14 dígitos')
    .max(18, 'CNPJ inválido')
    .regex(/^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/, 'CNPJ inválido'),
  contact: z.object({
    phone: z.string().min(10, 'Telefone inválido'),
    email: z.string().email('Email inválido'),
  }),
  paymentTerms: z.string().min(1, 'Condições de pagamento são obrigatórias'),
});

type SupplierFormData = z.infer<typeof supplierSchema>;

export function AddSupplierModal() {
  const [open, setOpen] = useState(false);
  const [newProduct, setNewProduct] = useState('');
  const [products, setProducts] = useState<string[]>([]);
  const { addSupplier } = useAppStore();
  const { toast } = useToast();

  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: '',
      cnpj: '',
      contact: {
        phone: '',
        email: '',
      },
      paymentTerms: '',
    },
  });

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  };

  const addProduct = () => {
    if (newProduct.trim() && !products.includes(newProduct.trim())) {
      setProducts([...products, newProduct.trim()]);
      setNewProduct('');
    }
  };

  const removeProduct = (productToRemove: string) => {
    setProducts(products.filter(product => product !== productToRemove));
  };

  const onSubmit = async (data: SupplierFormData) => {
    if (products.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um produto fornecido.",
        variant: "destructive"
      });
      return;
    }

    try {
      await addSupplier({
        ...data,
        products,
      });
      
      toast({
        title: "Fornecedor adicionado",
        description: `${data.name} foi adicionado com sucesso.`,
      });
      
      form.reset();
      setProducts([]);
      setOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o fornecedor.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary hover:bg-primary-hover text-primary-foreground shadow-primary">
          <Plus className="w-4 h-4 mr-2" />
          Novo Fornecedor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Adicionar Novo Fornecedor
          </DialogTitle>
          <DialogDescription>
            Cadastre um novo fornecedor para sua empresa
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Empresa</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Padaria do João Ltda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cnpj"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CNPJ</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="00.000.000/0000-00"
                      {...field}
                      onChange={(e) => {
                        const formatted = formatCNPJ(e.target.value);
                        field.onChange(formatted);
                      }}
                      maxLength={18}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contact.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="(11) 99999-9999"
                        {...field}
                        onChange={(e) => {
                          const formatted = formatPhone(e.target.value);
                          field.onChange(formatted);
                        }}
                        maxLength={15}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contact.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="contato@empresa.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="paymentTerms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condições de Pagamento</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: 30 dias, À vista, 15/30 dias"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormLabel>Produtos Fornecidos</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="Digite o nome do produto"
                  value={newProduct}
                  onChange={(e) => setNewProduct(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addProduct())}
                />
                <Button 
                  type="button" 
                  onClick={addProduct}
                  size="sm"
                >
                  Adicionar
                </Button>
              </div>
              
              {products.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {products.map((product, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {product}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeProduct(product)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
              
              {products.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Adicione pelo menos um produto que este fornecedor oferece
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Adicionar Fornecedor
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}