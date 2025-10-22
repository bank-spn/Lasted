import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ShoppingCart, FileText, Package, Settings, TrendingUp, DollarSign, Users as UsersIcon, Clock } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { t } = useLanguage();

  const todayStats = [
    { label: "ยอดขายวันนี้", value: "฿12,450", icon: <TrendingUp className="h-5 w-5" />, color: "text-green-600" },
    { label: "จำนวนออเดอร์", value: "45", icon: <ShoppingCart className="h-5 w-5" />, color: "text-blue-600" },
    { label: "พนักงานทำงาน", value: "8", icon: <UsersIcon className="h-5 w-5" />, color: "text-purple-600" },
    { label: "เวลาเฉลี่ย/ออเดอร์", value: "12 นาที", icon: <Clock className="h-5 w-5" />, color: "text-orange-600" },
  ];

  const quickActions = [
    { label: t("pos"), path: "/pos", icon: <ShoppingCart className="h-6 w-6" />, color: "bg-blue-500" },
    { label: t("inventory"), path: "/inventory", icon: <Package className="h-6 w-6" />, color: "bg-green-500" },
    { label: t("auditLog"), path: "/audit-log", icon: <FileText className="h-6 w-6" />, color: "bg-purple-500" },
    { label: t("systemSettings"), path: "/settings", icon: <Settings className="h-6 w-6" />, color: "bg-gray-500" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">ยินดีต้อนรับสู่ SPN rOS</h2>
          <p className="text-muted-foreground">ระบบ ERP สำหรับร้านอาหาร</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {todayStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <div className={stat.color}>{stat.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Navigation</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.path}>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="flex flex-col items-center justify-center p-6 space-y-2">
                    <div className={`${action.color} text-white p-3 rounded-lg`}>
                      {action.icon}
                    </div>
                    <span className="font-medium">{action.label}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>ออเดอร์ล่าสุด</CardTitle>
            <CardDescription>รายการออเดอร์ที่เพิ่งสร้างล่าสุด</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">ยังไม่มีออเดอร์</div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
