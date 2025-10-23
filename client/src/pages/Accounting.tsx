import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Plus, FileText, PieChart } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Transaction {
  id: number;
  date: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  description: string;
  ref?: string;
}

interface Budget {
  id: number;
  category: string;
  budgetAmount: number;
  spentAmount: number;
  month: string;
}

export default function Accounting() {
  const { language } = useLanguage();
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, date: "2024-01-15", type: "income", category: "ยอดขาย", amount: 12450, description: "ยอดขายประจำวัน", ref: "POS-001" },
    { id: 2, date: "2024-01-15", type: "expense", category: "วัตถุดิบ", amount: 3500, description: "ซื้อวัตถุดิบ", ref: "PO-001" },
    { id: 3, date: "2024-01-14", type: "expense", category: "ค่าเช่า", amount: 15000, description: "ค่าเช่าร้านเดือนมกราคม", ref: "RENT-JAN" },
    { id: 4, date: "2024-01-14", type: "income", category: "ยอดขาย", amount: 8900, description: "ยอดขายประจำวัน", ref: "POS-002" },
    { id: 5, date: "2024-01-13", type: "expense", category: "เงินเดือน", amount: 40000, description: "จ่ายเงินเดือนพนักงาน", ref: "PAY-JAN" },
    { id: 6, date: "2024-01-13", type: "expense", category: "สาธารณูปโภค", amount: 2500, description: "ค่าไฟ-น้ำ", ref: "UTIL-JAN" },
  ]);

  const [budgets, setBudgets] = useState<Budget[]>([
    { id: 1, category: "วัตถุดิบ", budgetAmount: 50000, spentAmount: 35000, month: "2024-01" },
    { id: 2, category: "เงินเดือน", budgetAmount: 40000, spentAmount: 40000, month: "2024-01" },
    { id: 3, category: "ค่าเช่า", budgetAmount: 15000, spentAmount: 15000, month: "2024-01" },
    { id: 4, category: "สาธารณูปโภค", budgetAmount: 5000, spentAmount: 2500, month: "2024-01" },
  ]);

  const [transactionForm, setTransactionForm] = useState({
    date: new Date().toISOString().split('T')[0],
    type: "expense" as "income" | "expense",
    category: "",
    amount: "",
    description: "",
    ref: "",
  });

  const [budgetForm, setBudgetForm] = useState({
    category: "",
    budgetAmount: "",
    month: "",
  });

  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpense;
  const profitMargin = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : "0.0";

  const expenseByCategory = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const handleAddTransaction = () => {
    if (!transactionForm.category || !transactionForm.amount) {
      toast.error(language === "th" ? "กรุณากรอกข้อมูลให้ครบ" : "Please fill all required fields");
      return;
    }

    const newTransaction: Transaction = {
      id: transactions.length + 1,
      date: transactionForm.date,
      type: transactionForm.type,
      category: transactionForm.category,
      amount: parseFloat(transactionForm.amount),
      description: transactionForm.description,
      ref: transactionForm.ref || undefined,
    };

    setTransactions([newTransaction, ...transactions]);
    setTransactionModalOpen(false);
    setTransactionForm({
      date: new Date().toISOString().split('T')[0],
      type: "expense",
      category: "",
      amount: "",
      description: "",
      ref: "",
    });
    toast.success(language === "th" ? "เพิ่มรายการสำเร็จ" : "Transaction added");
  };

  const handleAddBudget = () => {
    if (!budgetForm.category || !budgetForm.budgetAmount || !budgetForm.month) {
      toast.error(language === "th" ? "กรุณากรอกข้อมูลให้ครบ" : "Please fill all required fields");
      return;
    }

    const newBudget: Budget = {
      id: budgets.length + 1,
      category: budgetForm.category,
      budgetAmount: parseFloat(budgetForm.budgetAmount),
      spentAmount: 0,
      month: budgetForm.month,
    };

    setBudgets([...budgets, newBudget]);
    setBudgetModalOpen(false);
    setBudgetForm({ category: "", budgetAmount: "", month: "" });
    toast.success(language === "th" ? "เพิ่มงบประมาณสำเร็จ" : "Budget added");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {language === "th" ? "บัญชีและการเงิน" : "Accounting & Finance"}
          </h2>
          <p className="text-muted-foreground">
            {language === "th" ? "จัดการบัญชี รายรับ-รายจ่าย และงบประมาณ" : "Manage accounts, income, expenses, and budgets"}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "th" ? "อัตรากำไร" : "Profit Margin"}
              </CardTitle>
              <PieChart className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{profitMargin}%</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="transactions">{language === "th" ? "รายการธุรกรรม" : "Transactions"}</TabsTrigger>
            <TabsTrigger value="budget">{language === "th" ? "งบประมาณ" : "Budget"}</TabsTrigger>
            <TabsTrigger value="reports">{language === "th" ? "รายงาน" : "Reports"}</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setTransactionModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {language === "th" ? "เพิ่มรายการ" : "Add Transaction"}
              </Button>
            </div>

            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === "th" ? "วันที่" : "Date"}</TableHead>
                      <TableHead>{language === "th" ? "ประเภท" : "Type"}</TableHead>
                      <TableHead>{language === "th" ? "หมวดหมู่" : "Category"}</TableHead>
                      <TableHead>{language === "th" ? "รายละเอียด" : "Description"}</TableHead>
                      <TableHead>{language === "th" ? "เลขที่อ้างอิง" : "Reference"}</TableHead>
                      <TableHead className="text-right">{language === "th" ? "จำนวนเงิน" : "Amount"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map(tx => (
                      <TableRow key={tx.id}>
                        <TableCell>{new Date(tx.date).toLocaleDateString('th-TH')}</TableCell>
                        <TableCell>
                          <Badge variant={tx.type === "income" ? "default" : "destructive"}>
                            {tx.type === "income" ? (language === "th" ? "รายรับ" : "Income") : (language === "th" ? "รายจ่าย" : "Expense")}
                          </Badge>
                        </TableCell>
                        <TableCell>{tx.category}</TableCell>
                        <TableCell className="text-muted-foreground">{tx.description}</TableCell>
                        <TableCell className="font-mono text-sm">{tx.ref || "-"}</TableCell>
                        <TableCell className={`text-right font-semibold ${tx.type === "income" ? "text-green-600" : "text-red-600"}`}>
                          {tx.type === "income" ? "+" : "-"}฿{tx.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budget" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={() => setBudgetModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {language === "th" ? "เพิ่มงบประมาณ" : "Add Budget"}
              </Button>
            </div>

            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === "th" ? "หมวดหมู่" : "Category"}</TableHead>
                      <TableHead>{language === "th" ? "เดือน" : "Month"}</TableHead>
                      <TableHead>{language === "th" ? "งบประมาณ" : "Budget"}</TableHead>
                      <TableHead>{language === "th" ? "ใช้ไป" : "Spent"}</TableHead>
                      <TableHead>{language === "th" ? "คงเหลือ" : "Remaining"}</TableHead>
                      <TableHead>{language === "th" ? "สถานะ" : "Status"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {budgets.map(budget => {
                      const remaining = budget.budgetAmount - budget.spentAmount;
                      const percentage = (budget.spentAmount / budget.budgetAmount) * 100;
                      return (
                        <TableRow key={budget.id}>
                          <TableCell className="font-medium">{budget.category}</TableCell>
                          <TableCell>{budget.month}</TableCell>
                          <TableCell>฿{budget.budgetAmount.toLocaleString()}</TableCell>
                          <TableCell>฿{budget.spentAmount.toLocaleString()}</TableCell>
                          <TableCell>฿{remaining.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${percentage >= 100 ? 'bg-red-600' : percentage >= 80 ? 'bg-orange-600' : 'bg-green-600'}`}
                                  style={{ width: `${Math.min(percentage, 100)}%` }}
                                />
                              </div>
                              <span className="text-sm text-muted-foreground">{percentage.toFixed(0)}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{language === "th" ? "รายจ่ายตามหมวดหมู่" : "Expenses by Category"}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(expenseByCategory).map(([category, amount]) => {
                    const percentage = (amount / totalExpense) * 100;
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{category}</span>
                          <span className="text-muted-foreground">฿{amount.toLocaleString()} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{language === "th" ? "สรุปรายรับ-รายจ่าย" : "Income vs Expenses"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{language === "th" ? "รายรับ" : "Income"}</span>
                      <span className="text-lg font-bold text-green-600">฿{totalIncome.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{language === "th" ? "รายจ่าย" : "Expenses"}</span>
                      <span className="text-lg font-bold text-red-600">฿{totalExpense.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-4 flex justify-between items-center">
                      <span className="font-medium">{language === "th" ? "กำไรสุทธิ" : "Net Profit"}</span>
                      <span className={`text-xl font-bold ${netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                        ฿{netProfit.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{language === "th" ? "อัตราส่วนทางการเงิน" : "Financial Ratios"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{language === "th" ? "อัตรากำไร" : "Profit Margin"}</span>
                      <span className="text-lg font-bold">{profitMargin}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{language === "th" ? "อัตราส่วนรายจ่าย" : "Expense Ratio"}</span>
                      <span className="text-lg font-bold">{totalIncome > 0 ? ((totalExpense / totalIncome) * 100).toFixed(1) : "0.0"}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{language === "th" ? "จำนวนรายการ" : "Total Transactions"}</span>
                      <span className="text-lg font-bold">{transactions.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Transaction Modal */}
        <Dialog open={transactionModalOpen} onOpenChange={setTransactionModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{language === "th" ? "เพิ่มรายการธุรกรรม" : "Add Transaction"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{language === "th" ? "วันที่" : "Date"}</Label>
                  <Input type="date" value={transactionForm.date} onChange={(e) => setTransactionForm({ ...transactionForm, date: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>{language === "th" ? "ประเภท" : "Type"}</Label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={transactionForm.type}
                    onChange={(e) => setTransactionForm({ ...transactionForm, type: e.target.value as "income" | "expense" })}
                  >
                    <option value="income">{language === "th" ? "รายรับ" : "Income"}</option>
                    <option value="expense">{language === "th" ? "รายจ่าย" : "Expense"}</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{language === "th" ? "หมวดหมู่" : "Category"}</Label>
                <Input value={transactionForm.category} onChange={(e) => setTransactionForm({ ...transactionForm, category: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{language === "th" ? "จำนวนเงิน" : "Amount"}</Label>
                <Input type="number" value={transactionForm.amount} onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{language === "th" ? "รายละเอียด" : "Description"}</Label>
                <Textarea value={transactionForm.description} onChange={(e) => setTransactionForm({ ...transactionForm, description: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{language === "th" ? "เลขที่อ้างอิง" : "Reference"}</Label>
                <Input value={transactionForm.ref} onChange={(e) => setTransactionForm({ ...transactionForm, ref: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setTransactionModalOpen(false)}>
                {language === "th" ? "ยกเลิก" : "Cancel"}
              </Button>
              <Button onClick={handleAddTransaction}>
                {language === "th" ? "เพิ่มรายการ" : "Add"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Budget Modal */}
        <Dialog open={budgetModalOpen} onOpenChange={setBudgetModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{language === "th" ? "เพิ่มงบประมาณ" : "Add Budget"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>{language === "th" ? "หมวดหมู่" : "Category"}</Label>
                <Input value={budgetForm.category} onChange={(e) => setBudgetForm({ ...budgetForm, category: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{language === "th" ? "จำนวนงบประมาณ" : "Budget Amount"}</Label>
                <Input type="number" value={budgetForm.budgetAmount} onChange={(e) => setBudgetForm({ ...budgetForm, budgetAmount: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{language === "th" ? "เดือน" : "Month"}</Label>
                <Input type="month" value={budgetForm.month} onChange={(e) => setBudgetForm({ ...budgetForm, month: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setBudgetModalOpen(false)}>
                {language === "th" ? "ยกเลิก" : "Cancel"}
              </Button>
              <Button onClick={handleAddBudget}>
                {language === "th" ? "เพิ่มงบประมาณ" : "Add Budget"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
