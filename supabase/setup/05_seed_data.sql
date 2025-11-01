-- ============================================
-- PART 5: Seed Data
-- ============================================
-- Run this last to populate initial data

-- Insert Categories
INSERT INTO categories (name_th, name_en, icon, display_order, active) VALUES
('อาหารจานหลัก', 'Main Dishes', '🍛', 1, true),
('เครื่องดื่ม', 'Beverages', '🥤', 2, true),
('ของหวาน', 'Desserts', '🍰', 3, true),
('อาหารว่าง', 'Snacks', '🍟', 4, true)
ON CONFLICT DO NOTHING;

-- Insert Menu Items (using category names to find IDs)
INSERT INTO menu_items (category_id, name_th, name_en, description_th, description_en, price, cost, active)
SELECT 
  c.id,
  'ข้าวผัดกุ้ง',
  'Shrimp Fried Rice',
  'ข้าวผัดกุ้งสดใหญ่ พร้อมผักสด',
  'Fresh shrimp fried rice with vegetables',
  120.00,
  45.00,
  true
FROM categories c WHERE c.name_en = 'Main Dishes'
ON CONFLICT DO NOTHING;

INSERT INTO menu_items (category_id, name_th, name_en, description_th, description_en, price, cost, active)
SELECT 
  c.id,
  'น้ำส้มคั้น',
  'Fresh Orange Juice',
  'น้ำส้มคั้นสดใหม่ 100%',
  '100% fresh squeezed orange juice',
  45.00,
  15.00,
  true
FROM categories c WHERE c.name_en = 'Beverages'
ON CONFLICT DO NOTHING;

-- Insert Suppliers
INSERT INTO suppliers (name, contact_person, phone, email, address, active) VALUES
('บริษัท อาหารสด จำกัด', 'คุณสมชาย', '02-123-4567', 'somchai@freshfood.com', '123 ถนนสุขุมวิท กรุงเทพฯ', true),
('ร้านผักสด', 'คุณสมหญิง', '02-234-5678', 'somying@veggies.com', '456 ถนนพระราม 4 กรุงเทพฯ', true)
ON CONFLICT DO NOTHING;

-- Insert Inventory Items
INSERT INTO inventory (name_th, name_en, quantity, unit, min_stock, cost_per_unit)
VALUES
('ข้าวสาร', 'Rice', 50.00, 'kg', 20.00, 35.00),
('น้ำมันพืช', 'Vegetable Oil', 15.00, 'L', 10.00, 45.00),
('ไข่ไก่', 'Chicken Eggs', 100.00, 'pcs', 50.00, 5.00),
('เนื้อหมู', 'Pork', 25.00, 'kg', 15.00, 180.00),
('ผักกาด', 'Chinese Kale', 8.00, 'kg', 10.00, 25.00),
('มะเขือเทศ', 'Tomato', 12.00, 'kg', 10.00, 40.00)
ON CONFLICT DO NOTHING;

-- Insert Employees
INSERT INTO employees (name, position, salary, status, hire_date) VALUES
('สมชาย ใจดี', 'Chef', 25000.00, 'active', CURRENT_DATE),
('สมหญิง รักงาน', 'Cashier', 18000.00, 'active', CURRENT_DATE),
('วิชัย ขยัน', 'Waiter', 15000.00, 'active', CURRENT_DATE),
('นภา สวยงาม', 'Server', 15000.00, 'active', CURRENT_DATE),
('ประยุทธ์ มานะ', 'Kitchen Staff', 14000.00, 'active', CURRENT_DATE)
ON CONFLICT DO NOTHING;

-- Insert Sample Orders
INSERT INTO orders (order_number, table_number, total_amount, tax, discount, net_amount, payment_method, status, completed_at) VALUES
('ORD-001', 'T-01', 450.00, 31.50, 0.00, 481.50, 'cash', 'completed', NOW()),
('ORD-002', 'T-02', 680.00, 47.60, 0.00, 727.60, 'credit', 'completed', NOW()),
('ORD-003', 'T-03', 320.00, 22.40, 0.00, 342.40, 'qr', 'completed', NOW()),
('ORD-004', 'T-04', 550.00, 38.50, 0.00, 588.50, 'cash', 'completed', NOW()),
('ORD-005', 'T-05', 280.00, 19.60, 0.00, 299.60, 'cash', 'pending', NULL),
('ORD-006', 'T-06', 890.00, 62.30, 0.00, 952.30, 'credit', 'completed', NOW()),
('ORD-007', 'T-07', 420.00, 29.40, 0.00, 449.40, 'qr', 'completed', NOW())
ON CONFLICT DO NOTHING;

-- Insert Cash Drawer
INSERT INTO cash_drawer (shift_date, opening_balance, closing_balance, total_cash_in, total_cash_out, status, opened_at) VALUES
(CURRENT_DATE, 5000.00, NULL, 3841.30, 450.00, 'open', NOW() - INTERVAL '2 hours')
ON CONFLICT DO NOTHING;

-- Insert Accounting Transactions
INSERT INTO accounting_transactions (date, type, category, amount, description) VALUES
(CURRENT_DATE, 'expense', 'Utilities', 1200.00, 'ค่าไฟฟ้าประจำเดือน'),
(CURRENT_DATE, 'expense', 'Supplies', 850.00, 'ซื้อวัตถุดิบ'),
(CURRENT_DATE, 'income', 'Sales', 3841.30, 'รายได้จากการขาย')
ON CONFLICT DO NOTHING;

-- Insert System Settings
INSERT INTO system_settings (key, value, description) VALUES
('restaurant_name', 'SPN Restaurant', 'Restaurant name'),
('tax_rate', '0.07', 'VAT tax rate (7%)'),
('currency', 'THB', 'Currency code'),
('timezone', 'Asia/Bangkok', 'Timezone')
ON CONFLICT DO NOTHING;

