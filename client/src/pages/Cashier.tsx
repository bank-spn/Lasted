import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { DollarSign, Clock } from "lucide-react";

export default function Cashier() {
  const { language } = useLanguage();
  const [shiftOpen, setShiftOpen] = useState(false);
  const [openingCash, setOpeningCash] = useState(0);
  const [closingCash, setClosingCash] = useState(0);
  const [expectedCash, setExpectedCash] = useState(5000);

  const handleOpenShift = () => {
    setShiftOpen(true);
  };

  const handleCloseShift = () => {
    setShiftOpen(false);
    setOpeningCash(0);
    setClosingCash(0);
  };

  const difference = closingCash - expectedCash;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {language === "th" ? "เปิด-ปิดกะ" : "Cashier Shift"}
          </h2>
          <p className="text-muted-foreground">
            {language === "th" ? "จัดการกะการทำงานและเงินสด" : "Manage work shifts and cash"}
          </p>
        </div>

        {!shiftOpen ? (
          <Card>
            <CardHeader>
              <CardTitle>{language === "th" ? "เปิดกะใหม่" : "Open New Shift"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>{language === "th" ? "เงินทอนเริ่มต้น" : "Opening Cash"}</Label>
                <Input 
                  type="number" 
                  value={openingCash} 
                  onChange={(e) => setOpeningCash(Number(e.target.value))}
                  placeholder="0.00"
                />
              </div>
              <Button onClick={handleOpenShift} className="w-full">
                {language === "th" ? "เปิดกะ" : "Open Shift"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {language === "th" ? "เงินทอนเริ่มต้น" : "Opening Cash"}
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">฿{openingCash.toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {language === "th" ? "เวลาเปิดกะ" : "Shift Started"}
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {language === "th" ? "สถานะ" : "Status"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {language === "th" ? "เปิดอยู่" : "Open"}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{language === "th" ? "ปิดกะ" : "Close Shift"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>{language === "th" ? "เงินสดที่นับได้" : "Counted Cash"}</Label>
                  <Input 
                    type="number" 
                    value={closingCash} 
                    onChange={(e) => setClosingCash(Number(e.target.value))}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>{language === "th" ? "เงินสดที่ควรมี" : "Expected Cash"}</Label>
                  <Input 
                    type="number" 
                    value={expectedCash} 
                    onChange={(e) => setExpectedCash(Number(e.target.value))}
                    placeholder="0.00"
                  />
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{language === "th" ? "ผลต่าง" : "Difference"}</span>
                    <span className={`text-xl font-bold ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {difference >= 0 ? '+' : ''}฿{difference.toLocaleString()}
                    </span>
                  </div>
                </div>
                <Button onClick={handleCloseShift} variant="destructive" className="w-full">
                  {language === "th" ? "ปิดกะ" : "Close Shift"}
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
