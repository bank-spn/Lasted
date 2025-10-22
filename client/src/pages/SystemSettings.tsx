import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { Save } from "lucide-react";

export default function SystemSettings() {
  const { language } = useLanguage();
  const [settings, setSettings] = useState({
    restaurantName: "SPN Restaurant",
    address: "123 ถนนสุขุมวิท กรุงเทพฯ 10110",
    phone: "02-123-4567",
    email: "info@spnrestaurant.com",
    taxRate: 7,
    currency: "THB",
  });

  const handleSave = () => {
    alert(language === "th" ? "บันทึกการตั้งค่าเรียบร้อย" : "Settings saved successfully");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {language === "th" ? "ตั้งค่าระบบ" : "System Settings"}
          </h2>
          <p className="text-muted-foreground">
            {language === "th" ? "จัดการการตั้งค่าทั่วไปของระบบ" : "Manage general system settings"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{language === "th" ? "ข้อมูลร้านอาหาร" : "Restaurant Information"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{language === "th" ? "ชื่อร้าน" : "Restaurant Name"}</Label>
              <Input 
                value={settings.restaurantName} 
                onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })}
              />
            </div>
            <div>
              <Label>{language === "th" ? "ที่อยู่" : "Address"}</Label>
              <Input 
                value={settings.address} 
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{language === "th" ? "เบอร์โทรศัพท์" : "Phone"}</Label>
                <Input 
                  value={settings.phone} 
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                />
              </div>
              <div>
                <Label>{language === "th" ? "อีเมล" : "Email"}</Label>
                <Input 
                  type="email"
                  value={settings.email} 
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{language === "th" ? "การตั้งค่าทางการเงิน" : "Financial Settings"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{language === "th" ? "อัตราภาษี (%)" : "Tax Rate (%)"}</Label>
                <Input 
                  type="number"
                  value={settings.taxRate} 
                  onChange={(e) => setSettings({ ...settings, taxRate: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>{language === "th" ? "สกุลเงิน" : "Currency"}</Label>
                <Input 
                  value={settings.currency} 
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          {language === "th" ? "บันทึกการตั้งค่า" : "Save Settings"}
        </Button>
      </div>
    </DashboardLayout>
  );
}
