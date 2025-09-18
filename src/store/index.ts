import { create } from "zustand";
import { Product, Supplier, Expense, Sale } from "@/types";
import {
  mockProducts,
  mockSuppliers,
  mockExpenses,
  mockSales,
  initializeMockData,
} from "@/lib/mock-data";

interface AppState {
  products: Product[];
  suppliers: Supplier[];
  expenses: Expense[];
  sales: Sale[];
  loading: boolean;

  // Product actions
  fetchProducts: () => Promise<void>;
  addProduct: (
    product: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Supplier actions
  fetchSuppliers: () => Promise<void>;
  addSupplier: (
    supplier: Omit<Supplier, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => Promise<void>;
  deleteSupplier: (id: string) => Promise<void>;

  // Expense actions
  fetchExpenses: () => Promise<void>;
  addExpense: (expense: Omit<Expense, "id" | "createdAt">) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;

  // Sale actions
  fetchSales: () => Promise<void>;
  addSale: (sale: Omit<Sale, "id">) => Promise<void>;

  // Initialize data
  initializeData: () => Promise<void>;
}

const getStockStatus = (stock: number): Product["status"] => {
  if (stock === 0) return "out_of_stock";
  if (stock < 10) return "low_stock";
  return "in_stock";
};

// Helper functions for localStorage
const saveToStorage = (key: string, data: unknown) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const loadFromStorage = <T>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

export const useAppStore = create<AppState>((set, get) => ({
  products: [],
  suppliers: [],
  expenses: [],
  sales: [],
  loading: false,

  // Product actions
  fetchProducts: async () => {
    try {
      set({ loading: true });
      const products = loadFromStorage("products", mockProducts);
      set({ products });
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      set({ loading: false });
    }
  },

  addProduct: async (productData) => {
    try {
      const newProduct: Product = {
        ...productData,
        id: Date.now().toString(),
        status: getStockStatus(productData.stock),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const products = [...get().products, newProduct];
      set({ products });
      saveToStorage("products", products);
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const updateData = { ...productData, updatedAt: new Date() };
      if (productData.stock !== undefined) {
        updateData.status = getStockStatus(productData.stock);
      }

      const products = get().products.map((p) =>
        p.id === id ? { ...p, ...updateData } : p
      );
      set({ products });
      saveToStorage("products", products);
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      const products = get().products.filter((p) => p.id !== id);
      set({ products });
      saveToStorage("products", products);
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },

  // Supplier actions
  fetchSuppliers: async () => {
    try {
      set({ loading: true });
      const suppliers = loadFromStorage("suppliers", mockSuppliers);
      set({ suppliers });
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    } finally {
      set({ loading: false });
    }
  },

  addSupplier: async (supplierData) => {
    try {
      const newSupplier: Supplier = {
        ...supplierData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const suppliers = [...get().suppliers, newSupplier];
      set({ suppliers });
      saveToStorage("suppliers", suppliers);
    } catch (error) {
      console.error("Error adding supplier:", error);
      throw error;
    }
  },

  updateSupplier: async (id, supplierData) => {
    try {
      const updateData = { ...supplierData, updatedAt: new Date() };
      const suppliers = get().suppliers.map((s) =>
        s.id === id ? { ...s, ...updateData } : s
      );
      set({ suppliers });
      saveToStorage("suppliers", suppliers);
    } catch (error) {
      console.error("Error updating supplier:", error);
      throw error;
    }
  },

  deleteSupplier: async (id) => {
    try {
      const suppliers = get().suppliers.filter((s) => s.id !== id);
      set({ suppliers });
      saveToStorage("suppliers", suppliers);
    } catch (error) {
      console.error("Error deleting supplier:", error);
      throw error;
    }
  },

  // Expense actions
  fetchExpenses: async () => {
    try {
      set({ loading: true });
      const expenses = loadFromStorage("expenses", mockExpenses);
      set({ expenses });
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      set({ loading: false });
    }
  },

  addExpense: async (expenseData) => {
    try {
      console.log("Adding expense:", expenseData);
      const newExpense: Expense = {
        ...expenseData,
        id: Date.now().toString(),
        createdAt: new Date(),
      };

      const expenses = [...get().expenses, newExpense];
      set({ expenses });
      saveToStorage("expenses", expenses);
      console.log("Expense added to store:", newExpense);
    } catch (error) {
      console.error("Error adding expense:", error);
      throw error;
    }
  },

  updateExpense: async (id, expenseData) => {
    try {
      console.log("Updating expense:", id, expenseData);
      const expenses = get().expenses.map((e) =>
        e.id === id ? { ...e, ...expenseData } : e
      );
      set({ expenses });
      saveToStorage("expenses", expenses);
      console.log("Expense updated in store");
    } catch (error) {
      console.error("Error updating expense:", error);
      throw error;
    }
  },

  deleteExpense: async (id) => {
    try {
      const expenses = get().expenses.filter((e) => e.id !== id);
      set({ expenses });
      saveToStorage("expenses", expenses);
    } catch (error) {
      console.error("Error deleting expense:", error);
      throw error;
    }
  },

  // Sale actions
  fetchSales: async () => {
    try {
      set({ loading: true });
      const sales = loadFromStorage("sales", mockSales);
      set({ sales });
    } catch (error) {
      console.error("Error fetching sales:", error);
    } finally {
      set({ loading: false });
    }
  },

  addSale: async (saleData) => {
    try {
      const newSale: Sale = {
        ...saleData,
        id: Date.now().toString(),
      };

      const sales = [...get().sales, newSale];
      set({ sales });
      saveToStorage("sales", sales);
    } catch (error) {
      console.error("Error adding sale:", error);
      throw error;
    }
  },

  // Initialize data
  initializeData: async () => {
    initializeMockData();
    await Promise.all([
      get().fetchProducts(),
      get().fetchSuppliers(),
      get().fetchExpenses(),
      get().fetchSales(),
    ]);
  },
}));
