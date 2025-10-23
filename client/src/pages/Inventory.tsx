import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { Package, AlertTriangle, Plus, Edit, Trash2, Users } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface InventoryItem {
  id: number;
  name: string;
  nameEn: string;
  quantity: number;
  unit: string;
  minStock: number;
  supplierId: number;
}

interface Supplier {
  id: number;
  name: string;
  contact: string;
  phone: string;
  email: string;
}

export default function Inventory() {
  const { language } = useLanguage();
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [supplierModalOpen, setSupplierModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const [items, setItems] = useState<InventoryItem[]>([
    { id: 1, name: "กุ้ง", nameEn: "Shrimp", quantity: 50, unit: "kg", minStock: 20, supplierId: 1 },
    { id: 2, name: "ข้าว", nameEn: "Rice", quantity: 100, unit: "kg", minStock: 50, supplierId: 1 },
    { id: 3, name: "น้ำมัน", nameEn: "Oil", quantity: 15, unit: "L", minStock: 10, supplierId: 2 },
    { id: 4, name: "ผักสด", nameEn: "Vegetables", quantity: 8, unit: "kg", minStock: 15, supplierId: 2 },
  ]);

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: 1, name: "บริษัท อาหารทะเล จำกัด", contact: "สมชาย", phone: "081-234-5678", email: "seafood@example.com" },
    { id: 2, name: "ร้านผักสดใหม่", contact: "สมหญิง", phone: "082-345-6789", email: "veggies@example.com" },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    nameEn: "",
    quantity: "",
    unit: "",
    minStock: "",
    supplierId: "",
  });

  const [supplierFormData, setSupplierFormData] = useState({
    name: "",
    contact: "",
    phone: "",
    email: "",
  });

  const lowStockItems = items.filter(item => item.quantity < item.minStock);
  const totalItems = items.length;
  const totalValue = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleAddItem = () => {
    setEditingItem(null);
    setFormData({ name: "", nameEn: "", quantity: "", unit: "", minStock: "", supplierId: "" });
    setItemModalOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      nameEn: item.nameEn,
      quantity: item.quantity.toString(),
      unit: item.unit,
      minStock: item.minStock.toString(),
      supplierId: item.supplierId.toString(),
    });
    setItemModalOpen(true);
  };

  const handleSaveItem = () => {
    if (!formData.name || !formData.quantity || !formData.unit) {
      toast.error(language === "th" ? "กรุณากรอกข้อมูลให้ครบ" : "Please fill all required fields");
      return;
    }

    if (editingItem) {
      setItems(items.map(item => item.id === editingItem.id ? {
        ...item,
        name: formData.name,
        nameEn: formData.nameEn,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        minStock: parseFloat(formData.minStock),
        supplierId: parseInt(formData.supplierId),
      } : item));
      toast.success(language === "th" ? "แก้ไขสินค้าสำเร็จ" : "Item updated");
    } else {
      const newItem: InventoryItem = {
        id: items.length + 1,
        name: formData.name,
        nameEn: formData.nameEn,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        minStock: parseFloat(formData.minStock),
        supplierId: parseInt(formData.supplierId),
      };
      setItems([...items, newItem]);
      toast.success(language === "th" ? "เพิ่มสินค้าสำเร็จ" : "Item added");
    }
    setItemModalOpen(false);
  };

  const handleDeleteItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
    toast.success(language === "th" ? "ลบสินค้าแล้ว" : "Item deleted");
  };

  const handleAddSupplier = () => {
    setEditingSupplier(null);
    setSupplierFormData({ name: "", contact: "", phone: "", email: "" });
    setSupplierModalOpen(true);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setSupplierFormData({
      name: supplier.name,
      contact: supplier.contact,
      phone: supplier.phone,
      email: supplier.email,
    });
    setSupplierModalOpen(true);
  };

  const handleSaveSupplier = () => {
    if (!supplierFormData.name || !supplierFormData.contact) {
      toast.error(language === "th" ? "กรุณากรอกข้อมูลให้ครบ" : "Please fill all required fields");
      return;
    }

    if (editingSupplier) {
      setSuppliers(suppliers.map(s => s.id === editingSupplier.id ? {
        ...s,
        ...supplierFormData,
      } : s));
      toast.success(language === "th" ? "แก้ไขซัพพลายเออร์สำเร็จ" : "Supplier updated");
    } else {
      const newSupplier: Supplier = {
        id: suppliers.length + 1,
        ...supplierFormData,
      };
      setSuppliers([...suppliers, newSupplier]);
      toast.success(language === "th" ? "เพิ่มซัพพลายเออร์สำเร็จ" : "Supplier added");
    }
    setSupplierModalOpen(false);
  };

  const handleDeleteSupplier = (id: number) => {
    setSuppliers(suppliers.filter(s => s.id !== id));
    toast.success(language === "th" ? "ลบซัพพลายเออร์แล้ว" : "Supplier deleted");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {language === "th" ? "คลังสินค้า" : "Inventory"}
          </h2>
          <p className="text-muted-foreground">
            {language === "th" ? "จัดการสต็อกสินค้าและซัพพลายเออร์" : "Manage stock and suppliers"}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "th" ? "รายการสินค้า" : "Total Items"}
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "th" ? "สินค้าใกล้หมด" : "Low Stock"}
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{lowStockItems.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {language === "th" ? "ซัพพลายเออร์" : "Suppliers"}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{suppliers.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="inventory" className="space-y-4">
          <TabsList>
            <TabsTrigger value="inventory">{language === "th" ? "คลังสินค้า" : "Inventory"}</TabsTrigger>
            <TabsTrigger value="suppliers">{language === "th" ? "ซัพพลายเออร์" : "Suppliers"}</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={handleAddItem}>
                <Plus className="h-4 w-4 mr-2" />
                {language === "th" ? "เพิ่มสินค้า" : "Add Item"}
              </Button>
            </div>

            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === "th" ? "ชื่อสินค้า" : "Item Name"}</TableHead>
                      <TableHead>{language === "th" ? "จำนวน" : "Quantity"}</TableHead>
                      <TableHead>{language === "th" ? "หน่วย" : "Unit"}</TableHead>
                      <TableHead>{language === "th" ? "สต็อกขั้นต่ำ" : "Min Stock"}</TableHead>
                      <TableHead>{language === "th" ? "สถานะ" : "Status"}</TableHead>
                      <TableHead>{language === "th" ? "จัดการ" : "Actions"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {language === "th" ? item.name : item.nameEn}
                        </TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>{item.minStock}</TableCell>
                        <TableCell>
                          {item.quantity < item.minStock ? (
                            <Badge variant="destructive">{language === "th" ? "ใกล้หมด" : "Low Stock"}</Badge>
                          ) : (
                            <Badge variant="default">{language === "th" ? "ปกติ" : "Normal"}</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="icon" variant="ghost" onClick={() => handleEditItem(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDeleteItem(item.id)}>
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

          <TabsContent value="suppliers" className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={handleAddSupplier}>
                <Plus className="h-4 w-4 mr-2" />
                {language === "th" ? "เพิ่มซัพพลายเออร์" : "Add Supplier"}
              </Button>
            </div>

            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === "th" ? "ชื่อบริษัท" : "Company Name"}</TableHead>
                      <TableHead>{language === "th" ? "ผู้ติดต่อ" : "Contact Person"}</TableHead>
                      <TableHead>{language === "th" ? "เบอร์โทร" : "Phone"}</TableHead>
                      <TableHead>{language === "th" ? "อีเมล" : "Email"}</TableHead>
                      <TableHead>{language === "th" ? "จัดการ" : "Actions"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suppliers.map(supplier => (
                      <TableRow key={supplier.id}>
                        <TableCell className="font-medium">{supplier.name}</TableCell>
                        <TableCell>{supplier.contact}</TableCell>
                        <TableCell>{supplier.phone}</TableCell>
                        <TableCell>{supplier.email}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="icon" variant="ghost" onClick={() => handleEditSupplier(supplier)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDeleteSupplier(supplier.id)}>
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
        </Tabs>

        {/* Item Modal */}
        <Dialog open={itemModalOpen} onOpenChange={setItemModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem ? (language === "th" ? "แก้ไขสินค้า" : "Edit Item") : (language === "th" ? "เพิ่มสินค้า" : "Add Item")}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{language === "th" ? "ชื่อสินค้า (ไทย)" : "Name (Thai)"}</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>{language === "th" ? "ชื่อสินค้า (EN)" : "Name (EN)"}</Label>
                  <Input value={formData.nameEn} onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{language === "th" ? "จำนวน" : "Quantity"}</Label>
                  <Input type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>{language === "th" ? "หน่วย" : "Unit"}</Label>
                  <Input value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{language === "th" ? "สต็อกขั้นต่ำ" : "Minimum Stock"}</Label>
                <Input type="number" value={formData.minStock} onChange={(e) => setFormData({ ...formData, minStock: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setItemModalOpen(false)}>
                {language === "th" ? "ยกเลิก" : "Cancel"}
              </Button>
              <Button onClick={handleSaveItem}>
                {language === "th" ? "บันทึก" : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Supplier Modal */}
        <Dialog open={supplierModalOpen} onOpenChange={setSupplierModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSupplier ? (language === "th" ? "แก้ไขซัพพลายเออร์" : "Edit Supplier") : (language === "th" ? "เพิ่มซัพพลายเออร์" : "Add Supplier")}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>{language === "th" ? "ชื่อบริษัท" : "Company Name"}</Label>
                <Input value={supplierFormData.name} onChange={(e) => setSupplierFormData({ ...supplierFormData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{language === "th" ? "ผู้ติดต่อ" : "Contact Person"}</Label>
                <Input value={supplierFormData.contact} onChange={(e) => setSupplierFormData({ ...supplierFormData, contact: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{language === "th" ? "เบอร์โทร" : "Phone"}</Label>
                <Input value={supplierFormData.phone} onChange={(e) => setSupplierFormData({ ...supplierFormData, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>{language === "th" ? "อีเมล" : "Email"}</Label>
                <Input type="email" value={supplierFormData.email} onChange={(e) => setSupplierFormData({ ...supplierFormData, email: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSupplierModalOpen(false)}>
                {language === "th" ? "ยกเลิก" : "Cancel"}
              </Button>
              <Button onClick={handleSaveSupplier}>
                {language === "th" ? "บันทึก" : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
