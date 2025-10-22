import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { DollarSign, TrendingUp, TrendingDown, CreditCard } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Accounting() {
  const { language } = useLanguage();

  const transactions = [
    { id: 1, date: "2024-01-15", type: "income", category: "ยอดขาย", amount: 12450, ref: "ORD-001" },
    { id: 2, date: "2024-01-15", type: "expense", category: "ซื้อวัตถุดิบ", amount: 3500, ref: "PO-001" },
    { id: 3, date: "2024-01-14", type: "expense", category: "ค่าเช่า", amount: 15000, ref: "RENT-JAN" },
    { id: 4, date: "2024-01-14", type: "income", category: "ยอดขาย", amount: 8900, ref: "ORD-002" },
  ];

  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpense;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {language === "th" ? "บัญชีและการเงิน" : "Accounting & Finance"}
          </h2>
          <p className="text-muted-foreground">
            {language === "th" ? "ติดตามรายรับ-รายจ่าย และสถานะทางการเงิน" : "Track income, expenses, and financial status"}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "th" ? "รายรับทั้งหมด" : "Total Income"}
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">฿{totalIncome.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "th" ? "รายจ่ายทั้งหมด" : "Total Expenses"}
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">฿{totalExpense.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "th" ? "กำไรสุทธิ" : "Net Profit"}
              </CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                ฿{netProfit.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{language === "th" ? "รายการธุรกรรมล่าสุด" : "Recent Transactions"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === "th" ? "วันที่" : "Date"}</TableHead>
                  <TableHead>{language === "th" ? "ประเภท" : "Type"}</TableHead>
                  <TableHead>{language === "th" ? "หมวดหมู่" : "Category"}</TableHead>
                  <TableHead>{language === "th" ? "เลขที่อ้างอิง" : "Reference"}</TableHead>
                  <TableHead className="text-right">{language === "th" ? "จำนวนเงิน" : "Amount"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map(tx => (
                  <TableRow key={tx.id}>
                    <TableCell>{new Date(tx.date).toLocaleDateString('th-TH')}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${
                        tx.type === "income" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {tx.type === "income" ? (language === "th" ? "รายรับ" : "Income") : (language === "th" ? "รายจ่าย" : "Expense")}
                      </span>
                    </TableCell>
                    <TableCell>{tx.category}</TableCell>
                    <TableCell className="font-mono text-sm">{tx.ref}</TableCell>
                    <TableCell className={`text-right font-semibold ${
                      tx.type === "income" ? "text-green-600" : "text-red-600"
                    }`}>
                      {tx.type === "income" ? "+" : "-"}฿{tx.amount.toLocaleString()}
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
