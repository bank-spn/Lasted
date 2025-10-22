import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Users, Clock, DollarSign } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function HRM() {
  const { language } = useLanguage();

  const employees = [
    { id: 1, name: "สมชาย ใจดี", position: "พนักงานครัว", salary: 15000, status: "active", workHours: 160 },
    { id: 2, name: "สมหญิง รักงาน", position: "พนักงานเสิร์ฟ", salary: 12000, status: "active", workHours: 155 },
    { id: 3, name: "วิชัย มีสุข", position: "แคชเชียร์", salary: 13000, status: "active", workHours: 160 },
  ];

  const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {language === "th" ? "จัดการทรัพยากรบุคคล" : "Human Resource Management"}
          </h2>
          <p className="text-muted-foreground">
            {language === "th" ? "จัดการพนักงาน เงินเดือน และเวลาทำงาน" : "Manage employees, salaries, and work hours"}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "th" ? "พนักงานทั้งหมด" : "Total Employees"}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employees.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "th" ? "เงินเดือนรวม" : "Total Salary"}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">฿{totalSalary.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "th" ? "ชั่วโมงทำงานเฉลี่ย" : "Avg Work Hours"}
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(employees.reduce((sum, emp) => sum + emp.workHours, 0) / employees.length)} {language === "th" ? "ชม." : "hrs"}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{language === "th" ? "รายชื่อพนักงาน" : "Employee List"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === "th" ? "ชื่อ" : "Name"}</TableHead>
                  <TableHead>{language === "th" ? "ตำแหน่ง" : "Position"}</TableHead>
                  <TableHead>{language === "th" ? "เงินเดือน" : "Salary"}</TableHead>
                  <TableHead>{language === "th" ? "ชั่วโมงทำงาน" : "Work Hours"}</TableHead>
                  <TableHead>{language === "th" ? "สถานะ" : "Status"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map(emp => (
                  <TableRow key={emp.id}>
                    <TableCell className="font-medium">{emp.name}</TableCell>
                    <TableCell>{emp.position}</TableCell>
                    <TableCell>฿{emp.salary.toLocaleString()}</TableCell>
                    <TableCell>{emp.workHours} {language === "th" ? "ชม." : "hrs"}</TableCell>
                    <TableCell>
                      <Badge variant="default">
                        {emp.status === "active" ? (language === "th" ? "ทำงานอยู่" : "Active") : (language === "th" ? "ลาออก" : "Inactive")}
                      </Badge>
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
