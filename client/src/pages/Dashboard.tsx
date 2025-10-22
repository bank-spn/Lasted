import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Package, Users } from "lucide-react";

export default function Dashboard() {
  const { language } = useLanguage();

  const kpiData = [
    {
      title: language === "th" ? "ยอดขายทั้งหมด" : "Total Sales",
      value: "฿283,090.94",
      change: "+12.5%",
      trend: "up",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: language === "th" ? "ค่าใช้จ่ายทั้งหมด" : "Total Expenses",
      value: "฿66,791.14",
      change: "+5.2%",
      trend: "up",
      icon: <TrendingDown className="h-5 w-5" />,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: language === "th" ? "กำไรสุทธิ" : "Net Profit",
      value: "฿216,699.80",
      change: "+18.3%",
      trend: "up",
      icon: <DollarSign className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: language === "th" ? "มูลค่าสินค้าคงเหลือ" : "Inventory Value",
      value: "฿2,874,103.07",
      change: "-2.1%",
      trend: "down",
      icon: <Package className="h-5 w-5" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const cogData = [
    { label: "COG (ต้นทุนสินค้า)", items: [
      { name: "Cost of Goods", value: "฿400.00", percent: "0.53%" },
      { name: "ต้นทุนสินค้าที่ซื้อมา", value: "฿3,943.16" },
    ]},
    { label: "COG (ต้นทุนแรงงาน)", items: [
      { name: "Cost of Labor", value: "", percent: "22.46%" },
      { name: "ค่าจ้างพนักงาน", value: "฿53,000.00" },
    ]},
  ];

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
              <CardTitle className="text-green-600">กำไร</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">฿104.67</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">ขาดทุน</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">฿19,816.37</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>ยอดขายรวมทั้งหมด</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-64">
                <div className="relative">
                  <svg className="w-48 h-48" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="20" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#f97316" strokeWidth="20" strokeDasharray="75 251" transform="rotate(-90 50 50)" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="20" strokeDasharray="50 251" strokeDashoffset="-75" transform="rotate(-90 50 50)" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#ec4899" strokeWidth="20" strokeDasharray="50 251" strokeDashoffset="-125" transform="rotate(-90 50 50)" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="20" strokeDasharray="76 251" strokeDashoffset="-175" transform="rotate(-90 50 50)" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold">฿216,299.80</div>
                    <div className="text-sm text-muted-foreground">กำไรสุทธิ</div>
                    <div className="text-xs text-green-600">+76.41%</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-xs">ยอดขาย</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-xs">COG</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                  <span className="text-xs">COL</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs">EXPENSE</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>รายละเอียดต้นทุนและค่าใช้จ่าย</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-96 overflow-y-auto">
              {cogData.map((section, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="font-semibold text-sm">{section.label}</h4>
                  {section.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex justify-between text-sm pl-4">
                      <span className="text-muted-foreground">{item.name}</span>
                      <div className="flex gap-4">
                        {item.value && <span>{item.value}</span>}
                        {item.percent && <span className="text-muted-foreground">{item.percent}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
