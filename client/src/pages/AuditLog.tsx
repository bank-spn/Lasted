import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AuditLog() {
  const { language } = useLanguage();

  const logs = [
    { id: 1, timestamp: "2024-01-15 14:30:25", user: "Admin", action: "create_order", entity: "Order", entityId: "ORD-001", details: "สร้างออเดอร์ใหม่" },
    { id: 2, timestamp: "2024-01-15 14:25:10", user: "Cashier1", action: "open_shift", entity: "CashierShift", entityId: "SHIFT-001", details: "เปิดกะทำงาน" },
    { id: 3, timestamp: "2024-01-15 14:20:05", user: "Admin", action: "update_menu", entity: "MenuItem", entityId: "MENU-001", details: "แก้ไขราคาเมนู" },
    { id: 4, timestamp: "2024-01-15 14:15:00", user: "Admin", action: "update_inventory", entity: "Inventory", entityId: "INV-001", details: "เพิ่มสต็อกสินค้า" },
  ];

  const actionColors: Record<string, string> = {
    create_order: "bg-green-100 text-green-800",
    open_shift: "bg-blue-100 text-blue-800",
    update_menu: "bg-yellow-100 text-yellow-800",
    update_inventory: "bg-purple-100 text-purple-800",
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {language === "th" ? "บันทึกการทำงาน" : "Audit Log"}
          </h2>
          <p className="text-muted-foreground">
            {language === "th" ? "ติดตามและตรวจสอบการทำงานทั้งระบบ" : "Track and monitor all system activities"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{language === "th" ? "บันทึกล่าสุด" : "Recent Logs"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === "th" ? "เวลา" : "Timestamp"}</TableHead>
                  <TableHead>{language === "th" ? "ผู้ใช้" : "User"}</TableHead>
                  <TableHead>{language === "th" ? "การกระทำ" : "Action"}</TableHead>
                  <TableHead>{language === "th" ? "เอนทิตี้" : "Entity"}</TableHead>
                  <TableHead>{language === "th" ? "รายละเอียด" : "Details"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                    <TableCell className="font-medium">{log.user}</TableCell>
                    <TableCell>
                      <Badge className={actionColors[log.action] || "bg-gray-100 text-gray-800"}>
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{log.entity} #{log.entityId}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{log.details}</TableCell>
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
