import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { Users, Clock, DollarSign, Plus, Edit, Trash2, UserCheck, UserX } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Employee {
  id: number;
  name: string;
  position: string;
  salary: number;
  status: "active" | "inactive";
  hireDate: string;
}

interface Attendance {
  id: number;
  employeeId: number;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  workHours?: number;
}

interface Payroll {
  id: number;
  employeeId: number;
  employeeName: string;
  month: string;
  baseSalary: number;
  bonus: number;
  deduction: number;
  netSalary: number;
  status: "pending" | "paid";
}

export default function HRM() {
  const { language } = useLanguage();
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [payrollModalOpen, setPayrollModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [employees, setEmployees] = useState<Employee[]>([
    { id: 1, name: "สมชาย ใจดี", position: "พนักงานครัว", salary: 15000, status: "active", hireDate: "2023-01-15" },
    { id: 2, name: "สมหญิง รักงาน", position: "พนักงานเสิร์ฟ", salary: 12000, status: "active", hireDate: "2023-03-20" },
    { id: 3, name: "วิชัย มีสุข", position: "แคชเชียร์", salary: 13000, status: "active", hireDate: "2023-05-10" },
  ]);

  const [attendances, setAttendances] = useState<Attendance[]>([
    { id: 1, employeeId: 1, employeeName: "สมชาย ใจดี", date: "2024-01-15", checkIn: "08:00", checkOut: "17:00", workHours: 9 },
    { id: 2, employeeId: 2, employeeName: "สมหญิง รักงาน", date: "2024-01-15", checkIn: "09:00", checkOut: "18:00", workHours: 9 },
    { id: 3, employeeId: 3, employeeName: "วิชัย มีสุข", date: "2024-01-15", checkIn: "10:00" },
  ]);

  const [payrolls, setPayrolls] = useState<Payroll[]>([
    { id: 1, employeeId: 1, employeeName: "สมชาย ใจดี", month: "2024-01", baseSalary: 15000, bonus: 2000, deduction: 500, netSalary: 16500, status: "paid" },
    { id: 2, employeeId: 2, employeeName: "สมหญิง รักงาน", month: "2024-01", baseSalary: 12000, bonus: 1000, deduction: 300, netSalary: 12700, status: "paid" },
    { id: 3, employeeId: 3, employeeName: "วิชัย มีสุข", month: "2024-01", baseSalary: 13000, bonus: 1500, deduction: 400, netSalary: 14100, status: "pending" },
  ]);

  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    position: "",
    salary: "",
    hireDate: "",
  });

  const [attendanceForm, setAttendanceForm] = useState({
    employeeId: "",
    date: new Date().toISOString().split('T')[0],
    checkIn: "",
    checkOut: "",
  });

  const [payrollForm, setPayrollForm] = useState({
    employeeId: "",
    month: "",
    bonus: "",
    deduction: "",
  });

  const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);
  const activeEmployees = employees.filter(emp => emp.status === "active").length;
  const avgWorkHours = attendances.filter(a => a.workHours).reduce((sum, a) => sum + (a.workHours || 0), 0) / attendances.filter(a => a.workHours).length || 0;

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setEmployeeForm({ name: "", position: "", salary: "", hireDate: "" });
    setEmployeeModalOpen(true);
  };

  const handleEditEmployee = (emp: Employee) => {
    setEditingEmployee(emp);
    setEmployeeForm({
      name: emp.name,
      position: emp.position,
      salary: emp.salary.toString(),
      hireDate: emp.hireDate,
    });
    setEmployeeModalOpen(true);
  };

  const handleSaveEmployee = () => {
    if (!employeeForm.name || !employeeForm.position || !employeeForm.salary) {
      toast.error(language === "th" ? "กรุณากรอกข้อมูลให้ครบ" : "Please fill all required fields");
      return;
    }

    if (editingEmployee) {
      setEmployees(employees.map(emp => emp.id === editingEmployee.id ? {
        ...emp,
        name: employeeForm.name,
        position: employeeForm.position,
        salary: parseFloat(employeeForm.salary),
        hireDate: employeeForm.hireDate,
      } : emp));
      toast.success(language === "th" ? "แก้ไขพนักงานสำเร็จ" : "Employee updated");
    } else {
      const newEmployee: Employee = {
        id: employees.length + 1,
        name: employeeForm.name,
        position: employeeForm.position,
        salary: parseFloat(employeeForm.salary),
        status: "active",
        hireDate: employeeForm.hireDate || new Date().toISOString().split('T')[0],
      };
      setEmployees([...employees, newEmployee]);
      toast.success(language === "th" ? "เพิ่มพนักงานสำเร็จ" : "Employee added");
    }
    setEmployeeModalOpen(false);
  };

  const handleDeleteEmployee = (id: number) => {
    setEmployees(employees.filter(emp => emp.id !== id));
    toast.success(language === "th" ? "ลบพนักงานแล้ว" : "Employee deleted");
  };

  const handleCheckIn = () => {
    if (!attendanceForm.employeeId || !attendanceForm.checkIn) {
      toast.error(language === "th" ? "กรุณาเลือกพนักงานและระบุเวลา" : "Please select employee and time");
      return;
    }

    const employee = employees.find(emp => emp.id === parseInt(attendanceForm.employeeId));
    if (!employee) return;

    const newAttendance: Attendance = {
      id: attendances.length + 1,
      employeeId: employee.id,
      employeeName: employee.name,
      date: attendanceForm.date,
      checkIn: attendanceForm.checkIn,
    };
    setAttendances([...attendances, newAttendance]);
    setAttendanceModalOpen(false);
    setAttendanceForm({ employeeId: "", date: new Date().toISOString().split('T')[0], checkIn: "", checkOut: "" });
    toast.success(language === "th" ? "ลงชื่อเข้างานสำเร็จ" : "Check-in successful");
  };

  const handleCheckOut = (id: number) => {
    const checkOutTime = new Date().toTimeString().split(' ')[0].substring(0, 5);
    setAttendances(attendances.map(att => {
      if (att.id === id && !att.checkOut) {
        const checkInHour = parseInt(att.checkIn.split(':')[0]);
        const checkInMin = parseInt(att.checkIn.split(':')[1]);
        const checkOutHour = parseInt(checkOutTime.split(':')[0]);
        const checkOutMin = parseInt(checkOutTime.split(':')[1]);
        const workHours = (checkOutHour - checkInHour) + (checkOutMin - checkInMin) / 60;
        return { ...att, checkOut: checkOutTime, workHours: Math.round(workHours * 10) / 10 };
      }
      return att;
    }));
    toast.success(language === "th" ? "ลงชื่อออกงานสำเร็จ" : "Check-out successful");
  };

  const handleGeneratePayroll = () => {
    if (!payrollForm.employeeId || !payrollForm.month) {
      toast.error(language === "th" ? "กรุณาเลือกพนักงานและเดือน" : "Please select employee and month");
      return;
    }

    const employee = employees.find(emp => emp.id === parseInt(payrollForm.employeeId));
    if (!employee) return;

    const bonus = parseFloat(payrollForm.bonus) || 0;
    const deduction = parseFloat(payrollForm.deduction) || 0;
    const netSalary = employee.salary + bonus - deduction;

    const newPayroll: Payroll = {
      id: payrolls.length + 1,
      employeeId: employee.id,
      employeeName: employee.name,
      month: payrollForm.month,
      baseSalary: employee.salary,
      bonus,
      deduction,
      netSalary,
      status: "pending",
    };
    setPayrolls([...payrolls, newPayroll]);
    setPayrollModalOpen(false);
    setPayrollForm({ employeeId: "", month: "", bonus: "", deduction: "" });
    toast.success(language === "th" ? "สร้างเงินเดือนสำเร็จ" : "Payroll generated");
  };

  const handlePayPayroll = (id: number) => {
    setPayrolls(payrolls.map(p => p.id === id ? { ...p, status: "paid" as const } : p));
    toast.success(language === "th" ? "จ่ายเงินเดือนสำเร็จ" : "Payroll paid");
  };

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
              <div className="text-2xl font-bold">{activeEmployees}</div>
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
              <div className="text-2xl font-bold">{avgWorkHours.toFixed(1)} {language === "th" ? "ชม." : "hrs"}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="employees" className="space-y-4">
          <TabsList>
            <TabsTrigger value="employees">{language === "th" ? "พนักงาน" : "Employees"}</TabsTrigger>
            <TabsTrigger value="attendance">{language === "th" ? "ลงชื่อเข้า-ออก" : "Attendance"}</TabsTrigger>
            <TabsTrigger value="payroll">{language === "th" ? "เงินเดือน" : "Payroll"}</TabsTrigger>
          </TabsList>

          <TabsContent value="employees" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={handleAddEmployee}>
                <Plus className="h-4 w-4 mr-2" />
                {language === "th" ? "เพิ่มพนักงาน" : "Add Employee"}
              </Button>
            </div>

            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === "th" ? "ชื่อ" : "Name"}</TableHead>
                      <TableHead>{language === "th" ? "ตำแหน่ง" : "Position"}</TableHead>
                      <TableHead>{language === "th" ? "เงินเดือน" : "Salary"}</TableHead>
                      <TableHead>{language === "th" ? "วันที่เริ่มงาน" : "Hire Date"}</TableHead>
                      <TableHead>{language === "th" ? "สถานะ" : "Status"}</TableHead>
                      <TableHead>{language === "th" ? "จัดการ" : "Actions"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map(emp => (
                      <TableRow key={emp.id}>
                        <TableCell className="font-medium">{emp.name}</TableCell>
                        <TableCell>{emp.position}</TableCell>
                        <TableCell>฿{emp.salary.toLocaleString()}</TableCell>
                        <TableCell>{new Date(emp.hireDate).toLocaleDateString('th-TH')}</TableCell>
                        <TableCell>
                          <Badge variant={emp.status === "active" ? "default" : "secondary"}>
                            {emp.status === "active" ? (language === "th" ? "ทำงานอยู่" : "Active") : (language === "th" ? "ลาออก" : "Inactive")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="icon" variant="ghost" onClick={() => handleEditEmployee(emp)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDeleteEmployee(emp.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setAttendanceModalOpen(true)}>
                <UserCheck className="h-4 w-4 mr-2" />
                {language === "th" ? "ลงชื่อเข้างาน" : "Check In"}
              </Button>
            </div>

            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === "th" ? "วันที่" : "Date"}</TableHead>
                      <TableHead>{language === "th" ? "พนักงาน" : "Employee"}</TableHead>
                      <TableHead>{language === "th" ? "เข้างาน" : "Check In"}</TableHead>
                      <TableHead>{language === "th" ? "ออกงาน" : "Check Out"}</TableHead>
                      <TableHead>{language === "th" ? "ชั่วโมง" : "Hours"}</TableHead>
                      <TableHead>{language === "th" ? "จัดการ" : "Actions"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendances.map(att => (
                      <TableRow key={att.id}>
                        <TableCell>{new Date(att.date).toLocaleDateString('th-TH')}</TableCell>
                        <TableCell className="font-medium">{att.employeeName}</TableCell>
                        <TableCell>{att.checkIn}</TableCell>
                        <TableCell>{att.checkOut || "-"}</TableCell>
                        <TableCell>{att.workHours ? `${att.workHours} ${language === "th" ? "ชม." : "hrs"}` : "-"}</TableCell>
                        <TableCell>
                          {!att.checkOut && (
                            <Button size="sm" variant="outline" onClick={() => handleCheckOut(att.id)}>
                              <UserX className="h-4 w-4 mr-1" />
                              {language === "th" ? "ออกงาน" : "Check Out"}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payroll" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setPayrollModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {language === "th" ? "สร้างเงินเดือน" : "Generate Payroll"}
              </Button>
            </div>

            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === "th" ? "เดือน" : "Month"}</TableHead>
                      <TableHead>{language === "th" ? "พนักงาน" : "Employee"}</TableHead>
                      <TableHead>{language === "th" ? "เงินเดือนฐาน" : "Base Salary"}</TableHead>
                      <TableHead>{language === "th" ? "โบนัส" : "Bonus"}</TableHead>
                      <TableHead>{language === "th" ? "หัก" : "Deduction"}</TableHead>
                      <TableHead>{language === "th" ? "สุทธิ" : "Net"}</TableHead>
                      <TableHead>{language === "th" ? "สถานะ" : "Status"}</TableHead>
                      <TableHead>{language === "th" ? "จัดการ" : "Actions"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payrolls.map(payroll => (
                      <TableRow key={payroll.id}>
                        <TableCell>{payroll.month}</TableCell>
                        <TableCell className="font-medium">{payroll.employeeName}</TableCell>
                        <TableCell>฿{payroll.baseSalary.toLocaleString()}</TableCell>
                        <TableCell className="text-green-600">+฿{payroll.bonus.toLocaleString()}</TableCell>
                        <TableCell className="text-red-600">-฿{payroll.deduction.toLocaleString()}</TableCell>
                        <TableCell className="font-bold">฿{payroll.netSalary.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={payroll.status === "paid" ? "default" : "secondary"}>
                            {payroll.status === "paid" ? (language === "th" ? "จ่ายแล้ว" : "Paid") : (language === "th" ? "รอจ่าย" : "Pending")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {payroll.status === "pending" && (
                            <Button size="sm" onClick={() => handlePayPayroll(payroll.id)}>
                              {language === "th" ? "จ่ายเงิน" : "Pay"}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Employee Modal */}
        <Dialog open={employeeModalOpen} onOpenChange={setEmployeeModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingEmployee ? (language === "th" ? "แก้ไขพนักงาน" : "Edit Employee") : (language === "th" ? "เพิ่มพนักงาน" : "Add Employee")}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>{language === "th" ? "ชื่อ-นามสกุล" : "Full Name"}</Label>
                <Input value={employeeForm.name} onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{language === "th" ? "ตำแหน่ง" : "Position"}</Label>
                <Input value={employeeForm.position} onChange={(e) => setEmployeeForm({ ...employeeForm, position: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{language === "th" ? "เงินเดือน" : "Salary"}</Label>
                <Input type="number" value={employeeForm.salary} onChange={(e) => setEmployeeForm({ ...employeeForm, salary: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{language === "th" ? "วันที่เริ่มงาน" : "Hire Date"}</Label>
                <Input type="date" value={employeeForm.hireDate} onChange={(e) => setEmployeeForm({ ...employeeForm, hireDate: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEmployeeModalOpen(false)}>
                {language === "th" ? "ยกเลิก" : "Cancel"}
              </Button>
              <Button onClick={handleSaveEmployee}>
                {language === "th" ? "บันทึก" : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Attendance Modal */}
        <Dialog open={attendanceModalOpen} onOpenChange={setAttendanceModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{language === "th" ? "ลงชื่อเข้างาน" : "Check In"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>{language === "th" ? "เลือกพนักงาน" : "Select Employee"}</Label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={attendanceForm.employeeId}
                  onChange={(e) => setAttendanceForm({ ...attendanceForm, employeeId: e.target.value })}
                >
                  <option value="">{language === "th" ? "เลือกพนักงาน" : "Select Employee"}</option>
                  {employees.filter(emp => emp.status === "active").map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>{language === "th" ? "วันที่" : "Date"}</Label>
                <Input type="date" value={attendanceForm.date} onChange={(e) => setAttendanceForm({ ...attendanceForm, date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{language === "th" ? "เวลาเข้างาน" : "Check In Time"}</Label>
                <Input type="time" value={attendanceForm.checkIn} onChange={(e) => setAttendanceForm({ ...attendanceForm, checkIn: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAttendanceModalOpen(false)}>
                {language === "th" ? "ยกเลิก" : "Cancel"}
              </Button>
              <Button onClick={handleCheckIn}>
                {language === "th" ? "ลงชื่อเข้างาน" : "Check In"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Payroll Modal */}
        <Dialog open={payrollModalOpen} onOpenChange={setPayrollModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{language === "th" ? "สร้างเงินเดือน" : "Generate Payroll"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>{language === "th" ? "เลือกพนักงาน" : "Select Employee"}</Label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={payrollForm.employeeId}
                  onChange={(e) => setPayrollForm({ ...payrollForm, employeeId: e.target.value })}
                >
                  <option value="">{language === "th" ? "เลือกพนักงาน" : "Select Employee"}</option>
                  {employees.filter(emp => emp.status === "active").map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} - ฿{emp.salary.toLocaleString()}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>{language === "th" ? "เดือน" : "Month"}</Label>
                <Input type="month" value={payrollForm.month} onChange={(e) => setPayrollForm({ ...payrollForm, month: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{language === "th" ? "โบนัส" : "Bonus"}</Label>
                <Input type="number" placeholder="0" value={payrollForm.bonus} onChange={(e) => setPayrollForm({ ...payrollForm, bonus: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{language === "th" ? "หัก" : "Deduction"}</Label>
                <Input type="number" placeholder="0" value={payrollForm.deduction} onChange={(e) => setPayrollForm({ ...payrollForm, deduction: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPayrollModalOpen(false)}>
                {language === "th" ? "ยกเลิก" : "Cancel"}
              </Button>
              <Button onClick={handleGeneratePayroll}>
                {language === "th" ? "สร้างเงินเดือน" : "Generate"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
