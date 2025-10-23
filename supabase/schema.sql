-- SPN rOS - Restaurant ERP System
-- Complete Database Schema with RLS Policies

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_th TEXT NOT NULL,
  name_en TEXT NOT NULL,
  icon TEXT,
  display_order INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  name_th TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_th TEXT,
  description_en TEXT,
  price DECIMAL(10,2) NOT NULL,
  cost DECIMAL(10,2) DEFAULT 0,
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory Table
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_th TEXT NOT NULL,
  name_en TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  min_stock DECIMAL(10,2) DEFAULT 0,
  supplier_id UUID REFERENCES suppliers(id),
  cost_per_unit DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  table_number TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  net_amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('cash', 'credit', 'qr')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  cashier_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id),
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employees Table
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  hire_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  check_in TIME NOT NULL,
  check_out TIME,
  work_hours DECIMAL(4,1),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, date, check_in)
);

-- Payroll Table
CREATE TABLE IF NOT EXISTS payroll (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  base_salary DECIMAL(10,2) NOT NULL,
  bonus DECIMAL(10,2) DEFAULT 0,
  deduction DECIMAL(10,2) DEFAULT 0,
  net_salary DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, month)
);

-- Cash Drawer Table
CREATE TABLE IF NOT EXISTS cash_drawer (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shift_date DATE NOT NULL,
  opening_balance DECIMAL(10,2) NOT NULL,
  closing_balance DECIMAL(10,2),
  total_cash_in DECIMAL(10,2) DEFAULT 0,
  total_cash_out DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  opened_by UUID,
  closed_by UUID,
  opened_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ
);

-- Cash Transactions Table
CREATE TABLE IF NOT EXISTS cash_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  drawer_id UUID REFERENCES cash_drawer(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('in', 'out')),
  amount DECIMAL(10,2) NOT NULL,
  method TEXT CHECK (method IN ('cash', 'credit', 'qr')),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Accounting Transactions Table
CREATE TABLE IF NOT EXISTS accounting_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Budgets Table
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL,
  month TEXT NOT NULL,
  budget_amount DECIMAL(10,2) NOT NULL,
  spent_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category, month)
);

-- Audit Log Table
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  user_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_menu_items_category ON menu_items(category_id);
CREATE INDEX idx_menu_items_active ON menu_items(active);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_inventory_supplier ON inventory(supplier_id);
CREATE INDEX idx_attendance_employee ON attendance(employee_id);
CREATE INDEX idx_attendance_date ON attendance(date DESC);
CREATE INDEX idx_payroll_employee ON payroll(employee_id);
CREATE INDEX idx_cash_transactions_drawer ON cash_transactions(drawer_id);
CREATE INDEX idx_accounting_date ON accounting_transactions(date DESC);
CREATE INDEX idx_audit_log_created ON audit_log(created_at DESC);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);

-- ============================================
-- RLS POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_drawer ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounting_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for categories and menu items
CREATE POLICY "Public can read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can read menu items" ON menu_items FOR SELECT USING (true);

-- Authenticated users can manage all data
CREATE POLICY "Authenticated can manage categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can manage menu items" ON menu_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can manage inventory" ON inventory FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can manage suppliers" ON suppliers FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can manage orders" ON orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can manage order items" ON order_items FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can manage employees" ON employees FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can manage attendance" ON attendance FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can manage payroll" ON payroll FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can manage cash drawer" ON cash_drawer FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can manage cash transactions" ON cash_transactions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can manage accounting" ON accounting_transactions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can manage budgets" ON budgets FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can read audit log" ON audit_log FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can manage settings" ON system_settings FOR ALL USING (auth.role() = 'authenticated');

-- Service role can insert audit logs
CREATE POLICY "Service can insert audit log" ON audit_log FOR INSERT WITH CHECK (true);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suppliers_updated_at BEFORE UPDATE ON suppliers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA
-- ============================================

-- Insert default categories
INSERT INTO categories (name_th, name_en, icon, display_order) VALUES
  ('อาหารจานหลัก', 'Main Dishes', '🍽️', 1),
  ('เครื่องดื่ม', 'Beverages', '🥤', 2),
  ('ของหวาน', 'Desserts', '🍰', 3),
  ('อาหารว่าง', 'Appetizers', '🥗', 4)
ON CONFLICT DO NOTHING;

-- Insert sample menu items
INSERT INTO menu_items (category_id, name_th, name_en, price, cost) 
SELECT 
  c.id,
  'ข้าวผัดกุ้ง',
  'Shrimp Fried Rice',
  120.00,
  45.00
FROM categories c WHERE c.name_en = 'Main Dishes' LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO menu_items (category_id, name_th, name_en, price, cost) 
SELECT 
  c.id,
  'น้ำส้มคั้น',
  'Fresh Orange Juice',
  60.00,
  20.00
FROM categories c WHERE c.name_en = 'Beverages' LIMIT 1
ON CONFLICT DO NOTHING;

-- Insert default system settings
INSERT INTO system_settings (key, value) VALUES
  ('restaurant_name', '{"th": "ร้านอาหาร SPN", "en": "SPN Restaurant"}'),
  ('tax_rate', '{"value": 7}'),
  ('currency', '{"code": "THB", "symbol": "฿"}')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- REALTIME SETUP
-- ============================================

-- Enable realtime for critical tables
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE order_items;
ALTER PUBLICATION supabase_realtime ADD TABLE inventory;
ALTER PUBLICATION supabase_realtime ADD TABLE audit_log;
ALTER PUBLICATION supabase_realtime ADD TABLE cash_drawer;

