import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { TrendingUp, ShoppingCart, Users, Clock, Wallet, Package } from "lucide-react";
import { useOrders, useInventory, useEmployees, useCashDrawer, useAccountingTransactions } from "@/hooks/useSupabase";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useMemo } from "react";

export default function Dashboard() {
  const { language } = useLanguage();
  const { orders, loading: ordersLoading } = useOrders();
  const { inventory, loading: inventoryLoading } = useInventory();
  const { employees, loading: employeesLoading } = useEmployees();
  const { cashDrawer, loading: cashDrawerLoading } = useCashDrawer();
  const { accountingTransactions, loading: accountingLoading } = useAccountingTransactions();

  // Calculate today's data
  const todayData = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    
    const todayOrders = orders.filter(o => o.created_at?.startsWith(today));
    const todaySales = todayOrders.reduce((sum, o) => sum + Number(o.net_amount || 0), 0);
    
    const todayExpenses = accountingTransactions
      .filter(t => t.date?.startsWith(today) && t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);
    
    const todayProfit = todaySales - todayExpenses;
    
    return {
      sales: todaySales,
      orders: todayOrders.length,
      expenses: todayExpenses,
      profit: todayProfit
    };
  }, [orders, accountingTransactions]);

  // Calculate cash in drawer (latest open drawer)
  const cashInDrawer = useMemo(() => {
    const openDrawer = cashDrawer.find(d => d.status === 'open');
    if (!openDrawer) return 0;
    
    const opening = Number(openDrawer.opening_balance || 0);
    const sales = Number(openDrawer.total_cash_in || 0);
    const expenses = Number(openDrawer.total_cash_out || 0);
    
    return opening + sales - expenses;
  }, [cashDrawer]);

  // Low stock items
  const lowStockItems = useMemo(() => {
    return inventory.filter(item => Number(item.quantity) <= Number(item.min_stock));
  }, [inventory]);

  // Monthly performance data (last 6 months)
  const monthlyData = useMemo(() => {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = date.toISOString().substring(0, 7); // YYYY-MM
      
      const monthOrders = orders.filter(o => o.created_at?.startsWith(monthStr));
      const revenue = monthOrders.reduce((sum, o) => sum + Number(o.net_amount || 0), 0);
      
      const monthExpenses = accountingTransactions
        .filter(t => t.date?.startsWith(monthStr) && t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);
      
      months.push({
        month: language === 'th' 
          ? date.toLocaleDateString('th-TH', { month: 'short' })
          : date.toLocaleDateString('en-US', { month: 'short' }),
        revenue,
        expenses: monthExpenses,
        profit: revenue - monthExpenses
      });
    }
    
    return months;
  }, [orders, accountingTransactions, language]);

  // Today's bar chart data
  const todayBarData = [
    {
      name: language === 'th' ? 'ยอดขาย' : 'Sales',
      value: todayData.sales
    },
    {
      name: language === 'th' ? 'ค่าใช้จ่าย' : 'Expenses',
      value: todayData.expenses
    },
    {
      name: language === 'th' ? 'กำไร' : 'Profit',
      value: todayData.profit
    }
  ];

  const isLoading = ordersLoading || inventoryLoading || employeesLoading || cashDrawerLoading || accountingLoading;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {language === "th" ? "ยินดีต้อนรับสู่ SPN rOS" : "Welcome to SPN rOS"}
          </h2>
          <p className="text-muted-foreground">
            {language === "th" ? "ระบบ ERP สำหรับร้านอาหาร" : "Restaurant ERP System"}
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "th" ? "ยอดขายวันนี้" : "Today's Sales"}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : `฿${todayData.sales.toLocaleString()}`}
              </div>
              <p className="text-xs text-muted-foreground">
                {language === "th" ? `${todayData.orders} ออเดอร์` : `${todayData.orders} orders`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "th" ? "เงินสดในลิ้นชัก" : "Cash in Drawer"}
              </CardTitle>
              <Wallet className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : `฿${cashInDrawer.toLocaleString()}`}
              </div>
              <p className="text-xs text-muted-foreground">
                {language === "th" ? "อัพเดทแบบเรียลไทม์" : "Real-time update"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "th" ? "จำนวนสต็อก" : "Inventory Items"}
              </CardTitle>
              <Package className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : inventory.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {language === "th" 
                  ? `${lowStockItems.length} รายการใกล้หมด` 
                  : `${lowStockItems.length} low stock`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "th" ? "พนักงานทั้งหมด" : "Total Employees"}
              </CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "..." : employees.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {language === "th" ? "พนักงานทำงาน" : "Active employees"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Monthly Performance Line Chart */}
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "th" ? "ผลประกอบการรายเดือน" : "Monthly Performance"}
              </CardTitle>
              <CardDescription>
                {language === "th" ? "รายได้และกำไรย้อนหลัง 6 เดือน" : "Revenue and profit for last 6 months"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `฿${value.toLocaleString()}`} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    name={language === "th" ? "รายได้" : "Revenue"}
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#3b82f6" 
                    name={language === "th" ? "กำไร" : "Profit"}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Today's Performance Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>
                {language === "th" ? "สรุปผลประกอบการวันนี้" : "Today's Summary"}
              </CardTitle>
              <CardDescription>
                {language === "th" ? "ยอดขาย, ค่าใช้จ่าย และกำไร" : "Sales, expenses, and profit"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={todayBarData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `฿${value.toLocaleString()}`} />
                  <Bar dataKey="value" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Quick Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Navigation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <a href="/pos" className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-accent transition-colors">
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-3">
                  <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-medium">{language === "th" ? "ขายหน้าร้าน" : "POS"}</span>
              </a>
              
              <a href="/inventory" className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-accent transition-colors">
                <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center mb-3">
                  <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <span className="font-medium">{language === "th" ? "คลังสินค้า" : "Inventory"}</span>
              </a>
              
              <a href="/accounting" className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-accent transition-colors">
                <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-3">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="font-medium">{language === "th" ? "บัญชีการเงิน" : "Accounting"}</span>
              </a>
              
              <a href="/settings" className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-accent transition-colors">
                <div className="h-12 w-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                  <Clock className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                </div>
                <span className="font-medium">{language === "th" ? "ตั้งค่าระบบ" : "Settings"}</span>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <Card className="border-orange-200 dark:border-orange-900">
            <CardHeader>
              <CardTitle className="text-orange-600 dark:text-orange-400">
                {language === "th" ? "แจ้งเตือนสต็อกใกล้หมด" : "Low Stock Alert"}
              </CardTitle>
              <CardDescription>
                {language === "th" 
                  ? "รายการที่ต้องสั่งซื้อเพิ่ม" 
                  : "Items that need to be restocked"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lowStockItems.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                    <span className="font-medium">
                      {language === "th" ? item.name_th : item.name_en}
                    </span>
                    <span className="text-sm text-orange-600 dark:text-orange-400">
                      {language === "th" 
                        ? `เหลือ ${item.quantity} ${item.unit}` 
                        : `${item.quantity} ${item.unit} left`}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
