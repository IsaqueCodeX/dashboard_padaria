import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Calendar } from "lucide-react";
import { useAppStore } from "@/store";
import { Expense } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface EditExpenseModalProps {
  expense: Expense;
}

const expenseCategories = [
  "Matéria Prima",
  "Energia Elétrica",
  "Água",
  "Gás",
  "Aluguel",
  "Salários",
  "Marketing",
  "Manutenção",
  "Transporte",
  "Equipamentos",
  "Impostos",
  "Outros",
];

export function EditExpenseModal({ expense }: EditExpenseModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: expense.type,
    category: expense.category,
    description: expense.description,
    amount: expense.amount.toString(),
    date: format(new Date(expense.date), "yyyy-MM-dd"),
    supplierId: expense.supplierId || "",
  });

  // Reset form when expense changes
  React.useEffect(() => {
    setFormData({
      type: expense.type,
      category: expense.category,
      description: expense.description,
      amount: expense.amount.toString(),
      date: format(new Date(expense.date), "yyyy-MM-dd"),
      supplierId: expense.supplierId || "",
    });
  }, [expense]);

  const { updateExpense, suppliers } = useAppStore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting expense update:", formData);

    // Validation
    if (!formData.description.trim()) {
      toast({
        title: "Erro",
        description: "A descrição é obrigatória.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.category.trim()) {
      toast({
        title: "Erro",
        description: "A categoria é obrigatória.",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Erro",
        description: "O valor deve ser maior que zero.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateExpense(expense.id, {
        type: formData.type as "fixed" | "variable",
        category: formData.category.trim(),
        description: formData.description.trim(),
        amount: amount,
        date: new Date(formData.date),
        supplierId: formData.supplierId || undefined,
      });
      console.log("Expense updated successfully");

      setOpen(false);
      toast({
        title: "Despesa atualizada",
        description: "A despesa foi atualizada com sucesso.",
      });
    } catch (error) {
      console.error("Error updating expense:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar a despesa.",
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
          <DialogTitle>Editar Despesa</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "fixed" | "variable") =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixa</SelectItem>
                  <SelectItem value="variable">Variável</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {expenseCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Descrição da despesa"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({ ...prev, amount: value }));
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Data *</Label>
              <div className="relative">
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="pl-10"
                  required
                />
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplierId">Fornecedor (Opcional)</Label>
            <Select
              value={formData.supplierId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, supplierId: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um fornecedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Nenhum fornecedor</SelectItem>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-primary hover:bg-primary-hover text-primary-foreground"
            >
              Atualizar Despesa
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
