// Types for Gestão Padaria SA ERP System

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  costPrice: number;
  sellPrice: number;
  stock: number;
  unit: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  createdAt: Date;
  updatedAt: Date;
}

export interface Supplier {
  id: string;
  name: string;
  contact: {
    phone: string;
    email: string;
  };
  cnpj: string;
  products: string[];
  paymentTerms: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Expense {
  id: string;
  type: 'fixed' | 'variable';
  category: string;
  description: string;
  amount: number;
  date: Date;
  supplierId?: string;
  createdAt: Date;
}

export interface Sale {
  id: string;
  products: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
  total: number;
  date: Date;
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'manager' | 'employee';
}

export interface KPI {
  totalSales: number;
  totalExpenses: number;
  profit: number;
  bestSellingProducts: {
    productId: string;
    name: string;
    quantity: number;
    revenue: number;
  }[];
}

export interface StockAlert {
  productId: string;
  productName: string;
  currentStock: number;
  minStock: number;
  severity: 'low' | 'critical';
}