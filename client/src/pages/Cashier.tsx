import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, Clock, Plus, Minus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface CashTransaction {
  id: number;
  type: "in" | "out";
  amount: number;
  method: "cash" | "credit" | "qr";
  timestamp: string;
  note?: string;
}

export default function Cashier() {
  const { language } = useLanguage();
  const [shiftOpen, setShiftOpen] = useState(false);
  const [openingBalance, setOpeningBalance] = useState(5000);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawNote, setWithdrawNote] = useState("");

  const [transactions, setTransactions] = useState<CashTransaction[]>([
    { id: 1, type: "in", amount: 350, method: "cash", timestamp: "2024-01-15 10:30:00" },
    { id: 2, type: "in", amount: 450, method: "credit", timestamp: "2024-01-15 11:15:00" },
    { id: 3, type: "in", amount: 280, method: "qr", timestamp: "2024-01-15 11:45:00" },
    { id: 4, type: "out", amount: 500, method: "cash", timestamp: "2024-01-15 12:00:00", note: "เบิกเงินซื้อวัตถุดิบ" },
  ]);

  const cashIn = transactions.filter(t => t.type === "in" && t.method === "cash").reduce((sum, t) => sum + t.amount, 0);
  const cashOut = transactions.filter(t => t.type === "out").reduce((sum, t) => sum + t.amount, 0);
  const creditIn = transactions.filter(t => t.type === "in" && t.method === "credit").reduce((sum, t) => sum + t.amount, 0);
  const qrIn = transactions.filter(t => t.type === "in" && t.method === "qr").reduce((sum, t) => sum + t.amount, 0);
  const currentCash = openingBalance + cashIn - cashOut;
  const totalRevenue = cashIn + creditIn + qrIn;

  const handleOpenShift = () => {
    setShiftOpen(true);
    toast.success(language === "th" ? "เปิดกะทำงานแล้ว" : "Shift opened");
  };

  const handleCloseShift = () => {
    setShiftOpen(false);
    toast.success(language === "th" ? "ปิดกะทำงานแล้ว" : "Shift closed");
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      toast.error(language === "th" ? "กรุณาระบุจำนวนเงิน" : "Please enter amount");
      return;
    }
    if (amount > currentCash) {
      toast.error(language === "th" ? "เงินในลิ้นชักไม่เพียงพอ" : "Insufficient cash in drawer");
      return;
    }
    
    const newTransaction: CashTransaction = {
      id: transactions.length + 1,
      type: "out",
      amount,
      method: "cash",
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      note: withdrawNote || undefined,
    };
    
    setTransactions([...transactions, newTransaction]);
    setWithdrawModalOpen(false);
    setWithdrawAmount("");
    setWithdrawNote("");
    toast.success(language === "th" ? "เบิกเงินสำเร็จ" : "Cash withdrawn successfully");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {language === "th" ? "เปิด-ปิดกะ" : "Cashier Shift"}
            </h2>
            <p className="text-muted-foreground">
              {language === "th" ? "จัดการลิ้นชักเก็บเงินและเบิกเงินสด" : "Manage cash drawer and withdrawals"}
            </p>
          </div>
          <div className="flex gap-2">
            {!shiftOpen ? (
              <Button onClick={handleOpenShift}>
                <Clock className="h-4 w-4 mr-2" />
                {language === "th" ? "เปิดกะ" : "Open Shift"}
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setWithdrawModalOpen(true)}>
                  <Minus className="h-4 w-4 mr-2" />
                  {language === "th" ? "เบิกเงิน" : "Withdraw"}
                </Button>
                <Button variant="destructive" onClick={handleCloseShift}>
                  {language === "th" ? "ปิดกะ" : "Close Shift"}
                </Button>
              </>
            )}
          </div>
        </div>

        {shiftOpen && (
          <>
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {language === "th" ? "ยอดเปิดกะ" : "Opening Balance"}
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">฿{openingBalance.toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {language === "th" ? "เงินสดในลิ้นชัก" : "Cash in Drawer"}
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">฿{currentCash.toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {language === "th" ? "รายรับทั้งหมด" : "Total Revenue"}
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">฿{totalRevenue.toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {language === "th" ? "เบิกเงินแล้ว" : "Cash Withdrawn"}
                  </CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">฿{cashOut.toLocaleString()}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{language === "th" ? "รายการธุรกรรม" : "Transactions"}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === "th" ? "เวลา" : "Time"}</TableHead>
                      <TableHead>{language === "th" ? "ประเภท" : "Type"}</TableHead>
                      <TableHead>{language === "th" ? "วิธีชำระ" : "Method"}</TableHead>
                      <TableHead>{language === "th" ? "หมายเหตุ" : "Note"}</TableHead>
                      <TableHead className="text-right">{language === "th" ? "จำนวนเงิน" : "Amount"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map(tx => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-mono text-sm">{tx.timestamp}</TableCell>
                        <TableCell>
                          <Badge variant={tx.type === "in" ? "default" : "destructive"}>
                            {tx.type === "in" ? (language === "th" ? "รับเงิน" : "In") : (language === "th" ? "จ่ายเงิน" : "Out")}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize">{tx.method}</TableCell>
                        <TableCell className="text-muted-foreground">{tx.note || "-"}</TableCell>
                        <TableCell className={`text-right font-semibold ${tx.type === "in" ? "text-green-600" : "text-red-600"}`}>
                          {tx.type === "in" ? "+" : "-"}฿{tx.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}

        {!shiftOpen && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Clock className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {language === "th" ? "ยังไม่ได้เปิดกะ" : "Shift Not Started"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {language === "th" ? "กดปุ่ม 'เปิดกะ' เพื่อเริ่มต้นการทำงาน" : "Click 'Open Shift' to start working"}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Withdraw Modal */}
        <Dialog open={withdrawModalOpen} onOpenChange={setWithdrawModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{language === "th" ? "เบิกเงินสด" : "Withdraw Cash"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">{language === "th" ? "เงินในลิ้นชักปัจจุบัน" : "Current Cash in Drawer"}</p>
                <p className="text-2xl font-bold">฿{currentCash.toLocaleString()}</p>
              </div>
              
              <div className="space-y-2">
                <Label>{language === "th" ? "จำนวนเงินที่ต้องการเบิก" : "Withdrawal Amount"}</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>{language === "th" ? "หมายเหตุ" : "Note"}</Label>
                <Textarea
                  placeholder={language === "th" ? "ระบุเหตุผลในการเบิกเงิน..." : "Specify reason for withdrawal..."}
                  value={withdrawNote}
                  onChange={(e) => setWithdrawNote(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setWithdrawModalOpen(false)}>
                {language === "th" ? "ยกเลิก" : "Cancel"}
              </Button>
              <Button onClick={handleWithdraw}>
                {language === "th" ? "ยืนยันเบิกเงิน" : "Confirm Withdrawal"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
