-- ============================================
-- PART 3: Row Level Security (RLS) Policies
-- ============================================
-- Run this after creating tables and indexes

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

-- Create policies for public access (for development)
-- NOTE: For production, replace these with proper authentication-based policies

-- Categories policies
DROP POLICY IF EXISTS "Allow public read access on categories" ON categories;
CREATE POLICY "Allow public read access on categories" ON categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert on categories" ON categories;
CREATE POLICY "Allow public insert on categories" ON categories FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update on categories" ON categories;
CREATE POLICY "Allow public update on categories" ON categories FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Allow public delete on categories" ON categories;
CREATE POLICY "Allow public delete on categories" ON categories FOR DELETE USING (true);

-- Menu items policies
DROP POLICY IF EXISTS "Allow public read access on menu_items" ON menu_items;
CREATE POLICY "Allow public read access on menu_items" ON menu_items FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert on menu_items" ON menu_items;
CREATE POLICY "Allow public insert on menu_items" ON menu_items FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update on menu_items" ON menu_items;
CREATE POLICY "Allow public update on menu_items" ON menu_items FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Allow public delete on menu_items" ON menu_items;
CREATE POLICY "Allow public delete on menu_items" ON menu_items FOR DELETE USING (true);

-- Inventory policies
DROP POLICY IF EXISTS "Allow public read access on inventory" ON inventory;
CREATE POLICY "Allow public read access on inventory" ON inventory FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert on inventory" ON inventory;
CREATE POLICY "Allow public insert on inventory" ON inventory FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update on inventory" ON inventory;
CREATE POLICY "Allow public update on inventory" ON inventory FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Allow public delete on inventory" ON inventory;
CREATE POLICY "Allow public delete on inventory" ON inventory FOR DELETE USING (true);

-- Suppliers policies
DROP POLICY IF EXISTS "Allow public read access on suppliers" ON suppliers;
CREATE POLICY "Allow public read access on suppliers" ON suppliers FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert on suppliers" ON suppliers;
CREATE POLICY "Allow public insert on suppliers" ON suppliers FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update on suppliers" ON suppliers;
CREATE POLICY "Allow public update on suppliers" ON suppliers FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Allow public delete on suppliers" ON suppliers;
CREATE POLICY "Allow public delete on suppliers" ON suppliers FOR DELETE USING (true);

-- Orders policies
DROP POLICY IF EXISTS "Allow public read access on orders" ON orders;
CREATE POLICY "Allow public read access on orders" ON orders FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert on orders" ON orders;
CREATE POLICY "Allow public insert on orders" ON orders FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update on orders" ON orders;
CREATE POLICY "Allow public update on orders" ON orders FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Allow public delete on orders" ON orders;
CREATE POLICY "Allow public delete on orders" ON orders FOR DELETE USING (true);

-- Order items policies
DROP POLICY IF EXISTS "Allow public read access on order_items" ON order_items;
CREATE POLICY "Allow public read access on order_items" ON order_items FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert on order_items" ON order_items;
CREATE POLICY "Allow public insert on order_items" ON order_items FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update on order_items" ON order_items;
CREATE POLICY "Allow public update on order_items" ON order_items FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Allow public delete on order_items" ON order_items;
CREATE POLICY "Allow public delete on order_items" ON order_items FOR DELETE USING (true);

-- Employees policies
DROP POLICY IF EXISTS "Allow public read access on employees" ON employees;
CREATE POLICY "Allow public read access on employees" ON employees FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert on employees" ON employees;
CREATE POLICY "Allow public insert on employees" ON employees FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update on employees" ON employees;
CREATE POLICY "Allow public update on employees" ON employees FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Allow public delete on employees" ON employees;
CREATE POLICY "Allow public delete on employees" ON employees FOR DELETE USING (true);

-- Attendance policies
DROP POLICY IF EXISTS "Allow public read access on attendance" ON attendance;
CREATE POLICY "Allow public read access on attendance" ON attendance FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert on attendance" ON attendance;
CREATE POLICY "Allow public insert on attendance" ON attendance FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update on attendance" ON attendance;
CREATE POLICY "Allow public update on attendance" ON attendance FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Allow public delete on attendance" ON attendance;
CREATE POLICY "Allow public delete on attendance" ON attendance FOR DELETE USING (true);

-- Payroll policies
DROP POLICY IF EXISTS "Allow public read access on payroll" ON payroll;
CREATE POLICY "Allow public read access on payroll" ON payroll FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert on payroll" ON payroll;
CREATE POLICY "Allow public insert on payroll" ON payroll FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update on payroll" ON payroll;
CREATE POLICY "Allow public update on payroll" ON payroll FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Allow public delete on payroll" ON payroll;
CREATE POLICY "Allow public delete on payroll" ON payroll FOR DELETE USING (true);

-- Cash drawer policies
DROP POLICY IF EXISTS "Allow public read access on cash_drawer" ON cash_drawer;
CREATE POLICY "Allow public read access on cash_drawer" ON cash_drawer FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert on cash_drawer" ON cash_drawer;
CREATE POLICY "Allow public insert on cash_drawer" ON cash_drawer FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update on cash_drawer" ON cash_drawer;
CREATE POLICY "Allow public update on cash_drawer" ON cash_drawer FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Allow public delete on cash_drawer" ON cash_drawer;
CREATE POLICY "Allow public delete on cash_drawer" ON cash_drawer FOR DELETE USING (true);

-- Cash transactions policies
DROP POLICY IF EXISTS "Allow public read access on cash_transactions" ON cash_transactions;
CREATE POLICY "Allow public read access on cash_transactions" ON cash_transactions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert on cash_transactions" ON cash_transactions;
CREATE POLICY "Allow public insert on cash_transactions" ON cash_transactions FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update on cash_transactions" ON cash_transactions;
CREATE POLICY "Allow public update on cash_transactions" ON cash_transactions FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Allow public delete on cash_transactions" ON cash_transactions;
CREATE POLICY "Allow public delete on cash_transactions" ON cash_transactions FOR DELETE USING (true);

-- Accounting transactions policies
DROP POLICY IF EXISTS "Allow public read access on accounting_transactions" ON accounting_transactions;
CREATE POLICY "Allow public read access on accounting_transactions" ON accounting_transactions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert on accounting_transactions" ON accounting_transactions;
CREATE POLICY "Allow public insert on accounting_transactions" ON accounting_transactions FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update on accounting_transactions" ON accounting_transactions;
CREATE POLICY "Allow public update on accounting_transactions" ON accounting_transactions FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Allow public delete on accounting_transactions" ON accounting_transactions;
CREATE POLICY "Allow public delete on accounting_transactions" ON accounting_transactions FOR DELETE USING (true);

-- Budgets policies
DROP POLICY IF EXISTS "Allow public read access on budgets" ON budgets;
CREATE POLICY "Allow public read access on budgets" ON budgets FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert on budgets" ON budgets;
CREATE POLICY "Allow public insert on budgets" ON budgets FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update on budgets" ON budgets;
CREATE POLICY "Allow public update on budgets" ON budgets FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Allow public delete on budgets" ON budgets;
CREATE POLICY "Allow public delete on budgets" ON budgets FOR DELETE USING (true);

-- Audit log policies
DROP POLICY IF EXISTS "Allow public read access on audit_log" ON audit_log;
CREATE POLICY "Allow public read access on audit_log" ON audit_log FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert on audit_log" ON audit_log;
CREATE POLICY "Allow public insert on audit_log" ON audit_log FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update on audit_log" ON audit_log;
CREATE POLICY "Allow public update on audit_log" ON audit_log FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Allow public delete on audit_log" ON audit_log;
CREATE POLICY "Allow public delete on audit_log" ON audit_log FOR DELETE USING (true);

-- System settings policies
DROP POLICY IF EXISTS "Allow public read access on system_settings" ON system_settings;
CREATE POLICY "Allow public read access on system_settings" ON system_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public insert on system_settings" ON system_settings;
CREATE POLICY "Allow public insert on system_settings" ON system_settings FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Allow public update on system_settings" ON system_settings;
CREATE POLICY "Allow public update on system_settings" ON system_settings FOR UPDATE USING (true);
DROP POLICY IF EXISTS "Allow public delete on system_settings" ON system_settings;
CREATE POLICY "Allow public delete on system_settings" ON system_settings FOR DELETE USING (true);

