import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users } from "lucide-react";
import { useOrders, useInventory, useEmployees } from "@/hooks/useSupabase";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { language } = useLanguage();
  const { orders, loading: ordersLoading } = useOrders('completed');
  const { inventory, loading: inventoryLoading } = useInventory();
  const { employees, loading: employeesLoading } = useEmployees();

  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    inventoryValue: 0,
    activeEmployees: 0,
  });

  useEffect(() => {
    if (!ordersLoading && orders) {
      const totalSales = orders.reduce((sum, order) => sum + Number(order.net_amount || 0), 0);
      setStats(prev => ({ ...prev, totalSales, totalOrders: orders.length }));
    }
  }, [orders, ordersLoading]);

  useEffect(() => {
    if (!inventoryLoading && inventory) {
      const inventoryValue = inventory.reduce((sum, item) => 
        sum + (Number(item.quantity || 0) * Number(item.cost_per_unit || 0)), 0
      );
      setStats(prev => ({ ...prev, inventoryValue }));
    }
  }, [inventory, inventoryLoading]);

  useEffect(() => {
    if (!employeesLoading && employees) {
      const activeEmployees = employees.filter(emp => emp.status === 'active').length;
      setStats(prev => ({ ...prev, activeEmployees }));
    }
  }, [employees, employeesLoading]);

  const kpiData = [
    {
      title: language === "th" ? "ยอดขายทั้งหมด" : "Total Sales",
      value: `฿${stats.totalSales.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: "+12.5%",
      trend: "up",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: language === "th" ? "จำนวนออเดอร์" : "Total Orders",
      value: stats.totalOrders.toString(),
      change: "+8.1%",
      trend: "up",
      icon: <ShoppingCart className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: language === "th" ? "มูลค่าสินค้าคงเหลือ" : "Inventory Value",
      value: `฿${stats.inventoryValue.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: "-2.1%",
      trend: "down",
      icon: <Package className="h-5 w-5" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: language === "th" ? "พนักงานทำงาน" : "Active Employees",
      value: stats.activeEmployees.toString(),
      change: "0%",
      trend: "up",
      icon: <Users className="h-5 w-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard P&L</h2>
          <p className="text-muted-foreground">
            {language === "th" ? "รายงานกำไรขาดทุนแบบเรียลไทม์" : "Real-time Profit & Loss Report"}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpiData.map((kpi, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <div className={`${kpi.bgColor} p-2 rounded-lg`}>
                  <div className={kpi.color}>{kpi.icon}</div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className={`text-xs ${kpi.trend === "up" ? "text-green-600" : "text-red-600"} flex items-center gap-1 mt-1`}>
                  {kpi.trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {kpi.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{language === "th" ? "ออเดอร์ล่าสุด" : "Recent Orders"}</CardTitle>
              <CardDescription>
                {language === "th" ? "รายการออเดอร์ที่เพิ่งเสร็จสมบูรณ์" : "Recently completed orders"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {ordersLoading ? (
                <p className="text-sm text-muted-foreground">{language === "th" ? "กำลังโหลด..." : "Loading..."}</p>
              ) : recentOrders.length === 0 ? (
                <p className="text-sm text-muted-foreground">{language === "th" ? "ยังไม่มีออเดอร์" : "No orders yet"}</p>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="font-medium">{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.table_number ? `${language === "th" ? "โต๊ะ" : "Table"} ${order.table_number}` : "-"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">฿{Number(order.net_amount).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</p>
                        <p className="text-xs text-muted-foreground">{order.payment_method || "-"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{language === "th" ? "สต็อกต่ำ" : "Low Stock Items"}</CardTitle>
              <CardDescription>
                {language === "th" ? "สินค้าที่ใกล้หมด" : "Items running low"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {inventoryLoading ? (
                <p className="text-sm text-muted-foreground">{language === "th" ? "กำลังโหลด..." : "Loading..."}</p>
              ) : (
                <div className="space-y-3">
                  {inventory
                    .filter(item => Number(item.quantity) <= Number(item.min_stock))
                    .slice(0, 5)
                    .map((item) => (
                      <div key={item.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">{language === "th" ? item.name_th : item.name_en}</p>
                          <p className="text-sm text-muted-foreground">{item.unit}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-600">{Number(item.quantity).toFixed(1)}</p>
                          <p className="text-xs text-muted-foreground">
                            {language === "th" ? "ขั้นต่ำ" : "Min"}: {Number(item.min_stock).toFixed(1)}
                          </p>
                        </div>
                      </div>
                    ))}
                  {inventory.filter(item => Number(item.quantity) <= Number(item.min_stock)).length === 0 && (
                    <p className="text-sm text-muted-foreground">{language === "th" ? "สต็อกเพียงพอทั้งหมด" : "All items in stock"}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{language === "th" ? "สรุปภาพรวม" : "Overview Summary"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{language === "th" ? "ยอดขายเฉลี่ยต่อออเดอร์" : "Average Order Value"}</p>
                <p className="text-2xl font-bold">
                  ฿{stats.totalOrders > 0 ? (stats.totalSales / stats.totalOrders).toLocaleString('th-TH', { minimumFractionDigits: 2 }) : '0.00'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{language === "th" ? "รายการสินค้าทั้งหมด" : "Total Inventory Items"}</p>
                <p className="text-2xl font-bold">{inventory.length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{language === "th" ? "พนักงานทั้งหมด" : "Total Employees"}</p>
                <p className="text-2xl font-bold">{employees.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

