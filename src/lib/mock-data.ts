import { Product, Supplier, Expense, Sale, User } from '@/types';

export const mockUser: User = {
  id: '1',
  username: 'admin',
  name: 'Administrador',
  role: 'admin'
};

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Pão Francês',
    category: 'Pães',
    description: 'Pão francês tradicional',
    costPrice: 0.15,
    sellPrice: 0.35,
    stock: 150,
    unit: 'unidade',
    status: 'in_stock',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Croissant',
    category: 'Pães',
    description: 'Croissant de manteiga',
    costPrice: 1.20,
    sellPrice: 3.50,
    stock: 8,
    unit: 'unidade',
    status: 'low_stock',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '3',
    name: 'Torta de Frango',
    category: 'Salgados',
    description: 'Torta de frango com catupiry',
    costPrice: 3.80,
    sellPrice: 8.90,
    stock: 0,
    unit: 'fatia',
    status: 'out_of_stock',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '4',
    name: 'Bolo de Chocolate',
    category: 'Doces',
    description: 'Bolo de chocolate com cobertura',
    costPrice: 12.00,
    sellPrice: 35.00,
    stock: 5,
    unit: 'unidade',
    status: 'low_stock',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '5',
    name: 'Café Expresso',
    category: 'Bebidas',
    description: 'Café expresso tradicional',
    costPrice: 0.80,
    sellPrice: 3.00,
    stock: 200,
    unit: 'xícara',
    status: 'in_stock',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  }
];

export const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Moinho São Paulo',
    contact: {
      phone: '(11) 1234-5678',
      email: 'vendas@moinhosp.com.br'
    },
    cnpj: '12.345.678/0001-90',
    products: ['farinha', 'fermento', 'açúcar'],
    paymentTerms: '30 dias',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Laticínios Aurora',
    contact: {
      phone: '(11) 9876-5432',
      email: 'pedidos@aurora.com.br'
    },
    cnpj: '98.765.432/0001-10',
    products: ['leite', 'manteiga', 'queijo'],
    paymentTerms: '15 dias',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  }
];

export const mockExpenses: Expense[] = [
  {
    id: '1',
    type: 'fixed',
    category: 'Aluguel',
    description: 'Aluguel da padaria',
    amount: 3500.00,
    date: new Date('2024-01-01'),
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    type: 'variable',
    category: 'Ingredientes',
    description: 'Compra de farinha e fermento',
    amount: 850.00,
    date: new Date('2024-01-15'),
    supplierId: '1',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '3',
    type: 'fixed',
    category: 'Energia',
    description: 'Conta de luz',
    amount: 680.00,
    date: new Date('2024-01-10'),
    createdAt: new Date('2024-01-10')
  }
];

export const mockSales: Sale[] = [
  {
    id: '1',
    products: [
      { productId: '1', quantity: 20, unitPrice: 0.35 },
      { productId: '5', quantity: 5, unitPrice: 3.00 }
    ],
    total: 22.00,
    date: new Date('2024-01-15')
  },
  {
    id: '2',
    products: [
      { productId: '2', quantity: 3, unitPrice: 3.50 },
      { productId: '4', quantity: 1, unitPrice: 35.00 }
    ],
    total: 45.50,
    date: new Date('2024-01-15')
  }
];

// Initialize localStorage with mock data if empty
export const initializeMockData = () => {
  if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(mockProducts));
  }
  if (!localStorage.getItem('suppliers')) {
    localStorage.setItem('suppliers', JSON.stringify(mockSuppliers));
  }
  if (!localStorage.getItem('expenses')) {
    localStorage.setItem('expenses', JSON.stringify(mockExpenses));
  }
  if (!localStorage.getItem('sales')) {
    localStorage.setItem('sales', JSON.stringify(mockSales));
  }
};