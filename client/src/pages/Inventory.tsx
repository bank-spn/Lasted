import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { AlertTriangle, Package, TrendingDown, TrendingUp } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Inventory() {
  const { language } = useLanguage();

  const inventoryItems = [
    { id: 1, name: "ข้าว", unit: "กก.", current: 50, min: 20, cost: 25, status: "ok" },
    { id: 2, name: "น้ำมัน", unit: "ลิตร", current: 15, min: 10, cost: 45, status: "ok" },
    { id: 3, name: "กุ้ง", unit: "กก.", current: 5, min: 8, cost: 350, status: "low" },
    { id: 4, name: "ผัก", unit: "กก.", current: 12, min: 15, cost: 30, status: "low" },
    { id: 5, name: "เนื้อหมู", unit: "กก.", current: 25, min: 10, cost: 180, status: "ok" },
  ];

  const lowStockItems = inventoryItems.filter(item => item.status === "low");
  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.current * item.cost), 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {language === "th" ? "จัดการคลังสินค้า" : "Inventory Management"}
          </h2>
          <p className="text-muted-foreground">
            {language === "th" ? "ติดตามและจัดการสต็อกสินค้า" : "Track and manage stock levels"}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "th" ? "มูลค่าสินค้าคงเหลือ" : "Total Inventory Value"}
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">฿{totalValue.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "th" ? "รายการสินค้า" : "Total Items"}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventoryItems.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "th" ? "สินค้าใกล้หมด" : "Low Stock Items"}
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{lowStockItems.length}</div>
            </CardContent>
          </Card>
        </div>

        {lowStockItems.length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                {language === "th" ? "แจ้งเตือน: สินค้าใกล้หมด" : "Alert: Low Stock Items"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {lowStockItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span>{item.name}</span>
                    <Badge variant="destructive">
                      {item.current}/{item.min} {item.unit}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>{language === "th" ? "รายการสินค้าทั้งหมด" : "All Inventory Items"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === "th" ? "ชื่อสินค้า" : "Item Name"}</TableHead>
                  <TableHead>{language === "th" ? "หน่วย" : "Unit"}</TableHead>
                  <TableHead>{language === "th" ? "สต็อกปัจจุบัน" : "Current Stock"}</TableHead>
                  <TableHead>{language === "th" ? "สต็อกขั้นต่ำ" : "Min Stock"}</TableHead>
                  <TableHead>{language === "th" ? "ต้นทุน/หน่วย" : "Cost/Unit"}</TableHead>
                  <TableHead>{language === "th" ? "มูลค่ารวม" : "Total Value"}</TableHead>
                  <TableHead>{language === "th" ? "สถานะ" : "Status"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryItems.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>{item.current}</TableCell>
                    <TableCell>{item.min}</TableCell>
                    <TableCell>฿{item.cost}</TableCell>
                    <TableCell>฿{(item.current * item.cost).toLocaleString()}</TableCell>
                    <TableCell>
                      {item.status === "low" ? (
                        <Badge variant="destructive">{language === "th" ? "ใกล้หมด" : "Low Stock"}</Badge>
                      ) : (
                        <Badge variant="default">{language === "th" ? "ปกติ" : "Normal"}</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
