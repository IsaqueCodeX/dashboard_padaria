-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  cost_price DECIMAL(10,2) NOT NULL,
  sell_price DECIMAL(10,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('in_stock', 'low_stock', 'out_of_stock')) DEFAULT 'in_stock',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create suppliers table
CREATE TABLE public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  cnpj TEXT NOT NULL,
  products TEXT[] NOT NULL DEFAULT '{}',
  payment_terms TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create expenses table
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('fixed', 'variable')),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  supplier_id UUID REFERENCES public.suppliers(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sales table
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  products JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since no authentication yet)
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Products are insertable by everyone" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Products are updatable by everyone" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Products are deletable by everyone" ON public.products FOR DELETE USING (true);

CREATE POLICY "Suppliers are viewable by everyone" ON public.suppliers FOR SELECT USING (true);
CREATE POLICY "Suppliers are insertable by everyone" ON public.suppliers FOR INSERT WITH CHECK (true);
CREATE POLICY "Suppliers are updatable by everyone" ON public.suppliers FOR UPDATE USING (true);
CREATE POLICY "Suppliers are deletable by everyone" ON public.suppliers FOR DELETE USING (true);

CREATE POLICY "Expenses are viewable by everyone" ON public.expenses FOR SELECT USING (true);
CREATE POLICY "Expenses are insertable by everyone" ON public.expenses FOR INSERT WITH CHECK (true);
CREATE POLICY "Expenses are updatable by everyone" ON public.expenses FOR UPDATE USING (true);
CREATE POLICY "Expenses are deletable by everyone" ON public.expenses FOR DELETE USING (true);

CREATE POLICY "Sales are viewable by everyone" ON public.sales FOR SELECT USING (true);
CREATE POLICY "Sales are insertable by everyone" ON public.sales FOR INSERT WITH CHECK (true);
CREATE POLICY "Sales are updatable by everyone" ON public.sales FOR UPDATE USING (true);
CREATE POLICY "Sales are deletable by everyone" ON public.sales FOR DELETE USING (true);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON public.suppliers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();