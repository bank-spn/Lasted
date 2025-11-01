-- ============================================
-- PART 2: Indexes for Performance
-- ============================================
-- Run this after creating tables (01_create_tables.sql)

-- Indexes for categories
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(active);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order);

-- Indexes for menu_items
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_active ON menu_items(active);

-- Indexes for inventory
CREATE INDEX IF NOT EXISTS idx_inventory_supplier ON inventory(supplier_id);
CREATE INDEX IF NOT EXISTS idx_inventory_low_stock ON inventory(quantity, min_stock);

-- Indexes for orders
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_payment_method ON orders(payment_method);
CREATE INDEX IF NOT EXISTS idx_orders_cashier ON orders(cashier_id);

-- Indexes for order_items
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_menu_item ON order_items(menu_item_id);

-- Indexes for employees
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_position ON employees(position);

-- Indexes for attendance
CREATE INDEX IF NOT EXISTS idx_attendance_employee ON attendance(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);

-- Indexes for payroll
CREATE INDEX IF NOT EXISTS idx_payroll_employee ON payroll(employee_id);
CREATE INDEX IF NOT EXISTS idx_payroll_month ON payroll(month);

-- Indexes for cash_drawer
CREATE INDEX IF NOT EXISTS idx_cash_drawer_status ON cash_drawer(status);
CREATE INDEX IF NOT EXISTS idx_cash_drawer_shift_date ON cash_drawer(shift_date);

-- Indexes for cash_transactions
CREATE INDEX IF NOT EXISTS idx_cash_transactions_drawer ON cash_transactions(drawer_id);
CREATE INDEX IF NOT EXISTS idx_cash_transactions_type ON cash_transactions(type);

-- Indexes for accounting_transactions
CREATE INDEX IF NOT EXISTS idx_accounting_date ON accounting_transactions(date);
CREATE INDEX IF NOT EXISTS idx_accounting_type ON accounting_transactions(type);
CREATE INDEX IF NOT EXISTS idx_accounting_category ON accounting_transactions(category);

-- Indexes for budgets
CREATE INDEX IF NOT EXISTS idx_budgets_month ON budgets(month);
CREATE INDEX IF NOT EXISTS idx_budgets_category ON budgets(category);

-- Indexes for audit_log
CREATE INDEX IF NOT EXISTS idx_audit_log_table ON audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at);

-- Indexes for system_settings
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON system_settings(key);

