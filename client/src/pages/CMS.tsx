import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { Plus, Edit, Trash2, Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function CMS() {
  const { language } = useLanguage();
  const [categories, setCategories] = useState([
    { id: 1, nameTh: "อาหารจานหลัก", nameEn: "Main Dishes", active: true },
    { id: 2, nameTh: "เครื่องดื่ม", nameEn: "Beverages", active: true },
    { id: 3, nameTh: "ของหวาน", nameEn: "Desserts", active: true },
  ]);

  const [menuItems, setMenuItems] = useState([
    { id: 1, categoryId: 1, nameTh: "ผัดไทย", nameEn: "Pad Thai", price: 60, cost: 35, available: true },
    { id: 2, categoryId: 1, nameTh: "ข้าวผัด", nameEn: "Fried Rice", price: 50, cost: 25, available: true },
    { id: 3, categoryId: 1, nameTh: "ต้มยำกุ้ง", nameEn: "Tom Yum Goong", price: 120, cost: 70, available: true },
    { id: 4, categoryId: 2, nameTh: "น้ำส้ม", nameEn: "Orange Juice", price: 30, cost: 15, available: true },
    { id: 5, categoryId: 2, nameTh: "กาแฟ", nameEn: "Coffee", price: 40, cost: 20, available: true },
    { id: 6, categoryId: 3, nameTh: "ไอศกรีม", nameEn: "Ice Cream", price: 35, cost: 18, available: true },
  ]);

  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    categoryId: 1,
    nameTh: "",
    nameEn: "",
    price: 0,
    cost: 0,
  });

  const handleAddMenuItem = () => {
    const id = Math.max(...menuItems.map(i => i.id), 0) + 1;
    setMenuItems([...menuItems, { ...newItem, id, available: true }]);
    setNewItem({ categoryId: 1, nameTh: "", nameEn: "", price: 0, cost: 0 });
    setIsAddMenuOpen(false);
  };

  const toggleAvailability = (id: number) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, available: !item.available } : item
    ));
  };

  const deleteMenuItem = (id: number) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {language === "th" ? "จัดการเมนูอาหาร" : "Menu Management"}
            </h2>
            <p className="text-muted-foreground">
              {language === "th" ? "เพิ่ม แก้ไข และจัดการเมนูอาหาร" : "Add, edit, and manage menu items"}
            </p>
          </div>
          <Dialog open={isAddMenuOpen} onOpenChange={setIsAddMenuOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {language === "th" ? "เพิ่มเมนู" : "Add Menu"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{language === "th" ? "เพิ่มเมนูใหม่" : "Add New Menu Item"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>{language === "th" ? "หมวดหมู่" : "Category"}</Label>
                  <select 
                    className="w-full border rounded p-2"
                    value={newItem.categoryId}
                    onChange={(e) => setNewItem({ ...newItem, categoryId: Number(e.target.value) })}
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {language === "th" ? cat.nameTh : cat.nameEn}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>{language === "th" ? "ชื่อเมนู (ไทย)" : "Name (Thai)"}</Label>
                  <Input value={newItem.nameTh} onChange={(e) => setNewItem({ ...newItem, nameTh: e.target.value })} />
                </div>
                <div>
                  <Label>{language === "th" ? "ชื่อเมนู (อังกฤษ)" : "Name (English)"}</Label>
                  <Input value={newItem.nameEn} onChange={(e) => setNewItem({ ...newItem, nameEn: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{language === "th" ? "ราคาขาย" : "Price"}</Label>
                    <Input type="number" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })} />
                  </div>
                  <div>
                    <Label>{language === "th" ? "ต้นทุน" : "Cost"}</Label>
                    <Input type="number" value={newItem.cost} onChange={(e) => setNewItem({ ...newItem, cost: Number(e.target.value) })} />
                  </div>
                </div>
                <Button onClick={handleAddMenuItem} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  {language === "th" ? "บันทึก" : "Save"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{language === "th" ? "รายการเมนูทั้งหมด" : "All Menu Items"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{language === "th" ? "หมวดหมู่" : "Category"}</TableHead>
                  <TableHead>{language === "th" ? "ชื่อเมนู" : "Name"}</TableHead>
                  <TableHead>{language === "th" ? "ราคา" : "Price"}</TableHead>
                  <TableHead>{language === "th" ? "ต้นทุน" : "Cost"}</TableHead>
                  <TableHead>{language === "th" ? "กำไร" : "Profit"}</TableHead>
                  <TableHead>{language === "th" ? "สถานะ" : "Status"}</TableHead>
                  <TableHead>{language === "th" ? "จัดการ" : "Actions"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menuItems.map(item => {
                  const category = categories.find(c => c.id === item.categoryId);
                  const profit = item.price - item.cost;
                  const profitPercent = ((profit / item.price) * 100).toFixed(1);
                  
                  return (
                    <TableRow key={item.id}>
                      <TableCell>{language === "th" ? category?.nameTh : category?.nameEn}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{language === "th" ? item.nameTh : item.nameEn}</div>
                          <div className="text-xs text-muted-foreground">{language === "th" ? item.nameEn : item.nameTh}</div>
                        </div>
                      </TableCell>
                      <TableCell>฿{item.price}</TableCell>
                      <TableCell>฿{item.cost}</TableCell>
                      <TableCell className="text-green-600">฿{profit} ({profitPercent}%)</TableCell>
                      <TableCell>
                        <Button 
                          variant={item.available ? "default" : "secondary"} 
                          size="sm"
                          onClick={() => toggleAvailability(item.id)}
                        >
                          {item.available ? (language === "th" ? "พร้อมขาย" : "Available") : (language === "th" ? "ไม่พร้อม" : "Unavailable")}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="icon" onClick={() => deleteMenuItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{language === "th" ? "หมวดหมู่เมนู" : "Menu Categories"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {categories.map(cat => (
                <Card key={cat.id}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{language === "th" ? cat.nameTh : cat.nameEn}</h3>
                    <p className="text-sm text-muted-foreground">
                      {menuItems.filter(i => i.categoryId === cat.id).length} {language === "th" ? "รายการ" : "items"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
