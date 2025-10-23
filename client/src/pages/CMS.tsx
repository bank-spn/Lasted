import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import { useCategories, useMenuItems } from "@/hooks/useSupabase";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { toast } from "sonner";

export default function CMS() {
  const { language } = useLanguage();
  const { categories, loading: categoriesLoading, refetch: refetchCategories } = useCategories();
  const { menuItems, loading: menuItemsLoading, refetch: refetchMenuItems } = useMenuItems();

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [menuDialogOpen, setMenuDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editingMenu, setEditingMenu] = useState<any>(null);

  // Category Form
  const [categoryForm, setCategoryForm] = useState({
    name_th: "",
    name_en: "",
    icon: "",
    display_order: 0,
  });

  // Menu Form
  const [menuForm, setMenuForm] = useState({
    category_id: "",
    name_th: "",
    name_en: "",
    description_th: "",
    description_en: "",
    price: 0,
    cost: 0,
    image_url: "",
  });

  // Category Handlers
  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ name_th: "", name_en: "", icon: "", display_order: 0 });
    setCategoryDialogOpen(true);
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setCategoryForm({
      name_th: category.name_th,
      name_en: category.name_en,
      icon: category.icon || "",
      display_order: category.display_order,
    });
    setCategoryDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    try {
      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update(categoryForm)
          .eq('id', editingCategory.id);
        if (error) throw error;
        toast.success(language === "th" ? "อัพเดทหมวดหมู่สำเร็จ" : "Category updated successfully");
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([categoryForm]);
        if (error) throw error;
        toast.success(language === "th" ? "เพิ่มหมวดหมู่สำเร็จ" : "Category added successfully");
      }
      setCategoryDialogOpen(false);
      refetchCategories();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm(language === "th" ? "ต้องการลบหมวดหมู่นี้?" : "Delete this category?")) return;
    
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success(language === "th" ? "ลบหมวดหมู่สำเร็จ" : "Category deleted successfully");
      refetchCategories();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Menu Handlers
  const handleAddMenu = () => {
    setEditingMenu(null);
    setMenuForm({
      category_id: categories[0]?.id || "",
      name_th: "",
      name_en: "",
      description_th: "",
      description_en: "",
      price: 0,
      cost: 0,
      image_url: "",
    });
    setMenuDialogOpen(true);
  };

  const handleEditMenu = (menu: any) => {
    setEditingMenu(menu);
    setMenuForm({
      category_id: menu.category_id,
      name_th: menu.name_th,
      name_en: menu.name_en,
      description_th: menu.description_th || "",
      description_en: menu.description_en || "",
      price: Number(menu.price),
      cost: Number(menu.cost),
      image_url: menu.image_url || "",
    });
    setMenuDialogOpen(true);
  };

  const handleSaveMenu = async () => {
    try {
      if (editingMenu) {
        const { error } = await supabase
          .from('menu_items')
          .update(menuForm)
          .eq('id', editingMenu.id);
        if (error) throw error;
        toast.success(language === "th" ? "อัพเดทเมนูสำเร็จ" : "Menu updated successfully");
      } else {
        const { error } = await supabase
          .from('menu_items')
          .insert([menuForm]);
        if (error) throw error;
        toast.success(language === "th" ? "เพิ่มเมนูสำเร็จ" : "Menu added successfully");
      }
      setMenuDialogOpen(false);
      refetchMenuItems();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteMenu = async (id: string) => {
    if (!confirm(language === "th" ? "ต้องการลบเมนูนี้?" : "Delete this menu item?")) return;
    
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast.success(language === "th" ? "ลบเมนูสำเร็จ" : "Menu deleted successfully");
      refetchMenuItems();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {language === "th" ? "จัดการเมนูอาหาร" : "Menu Management"}
          </h2>
          <p className="text-muted-foreground">
            {language === "th" ? "จัดการหมวดหมู่และรายการเมนูอาหาร" : "Manage categories and menu items"}
          </p>
        </div>

        <Tabs defaultValue="menu" className="space-y-4">
          <TabsList>
            <TabsTrigger value="menu">{language === "th" ? "เมนูอาหาร" : "Menu Items"}</TabsTrigger>
            <TabsTrigger value="categories">{language === "th" ? "หมวดหมู่" : "Categories"}</TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{language === "th" ? "รายการเมนู" : "Menu Items"}</h3>
              <Dialog open={menuDialogOpen} onOpenChange={setMenuDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleAddMenu}>
                    <Plus className="h-4 w-4 mr-2" />
                    {language === "th" ? "เพิ่มเมนู" : "Add Menu"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingMenu 
                        ? (language === "th" ? "แก้ไขเมนู" : "Edit Menu")
                        : (language === "th" ? "เพิ่มเมนูใหม่" : "Add New Menu")}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>{language === "th" ? "หมวดหมู่" : "Category"}</Label>
                      <Select value={menuForm.category_id} onValueChange={(value) => setMenuForm({...menuForm, category_id: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {language === "th" ? cat.name_th : cat.name_en}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>{language === "th" ? "ชื่อ (ไทย)" : "Name (Thai)"}</Label>
                        <Input value={menuForm.name_th} onChange={(e) => setMenuForm({...menuForm, name_th: e.target.value})} />
                      </div>
                      <div className="grid gap-2">
                        <Label>{language === "th" ? "ชื่อ (English)" : "Name (English)"}</Label>
                        <Input value={menuForm.name_en} onChange={(e) => setMenuForm({...menuForm, name_en: e.target.value})} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>{language === "th" ? "คำอธิบาย (ไทย)" : "Description (Thai)"}</Label>
                        <Input value={menuForm.description_th} onChange={(e) => setMenuForm({...menuForm, description_th: e.target.value})} />
                      </div>
                      <div className="grid gap-2">
                        <Label>{language === "th" ? "คำอธิบาย (English)" : "Description (English)"}</Label>
                        <Input value={menuForm.description_en} onChange={(e) => setMenuForm({...menuForm, description_en: e.target.value})} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>{language === "th" ? "ราคา (฿)" : "Price (฿)"}</Label>
                        <Input type="number" value={menuForm.price} onChange={(e) => setMenuForm({...menuForm, price: Number(e.target.value)})} />
                      </div>
                      <div className="grid gap-2">
                        <Label>{language === "th" ? "ต้นทุน (฿)" : "Cost (฿)"}</Label>
                        <Input type="number" value={menuForm.cost} onChange={(e) => setMenuForm({...menuForm, cost: Number(e.target.value)})} />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>{language === "th" ? "URL รูปภาพ" : "Image URL"}</Label>
                      <Input value={menuForm.image_url} onChange={(e) => setMenuForm({...menuForm, image_url: e.target.value})} placeholder="https://..." />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setMenuDialogOpen(false)}>
                      {language === "th" ? "ยกเลิก" : "Cancel"}
                    </Button>
                    <Button onClick={handleSaveMenu}>
                      {language === "th" ? "บันทึก" : "Save"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {menuItemsLoading ? (
                <p>{language === "th" ? "กำลังโหลด..." : "Loading..."}</p>
              ) : menuItems.length === 0 ? (
                <p className="text-muted-foreground">{language === "th" ? "ยังไม่มีเมนู" : "No menu items yet"}</p>
              ) : (
                menuItems.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{language === "th" ? item.name_th : item.name_en}</CardTitle>
                          <CardDescription>{language === "th" ? item.description_th : item.description_en}</CardDescription>
                        </div>
                        {item.image_url && (
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">{language === "th" ? "ราคา" : "Price"}:</span>
                          <span className="font-bold">฿{Number(item.price).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">{language === "th" ? "ต้นทุน" : "Cost"}:</span>
                          <span>฿{Number(item.cost).toFixed(2)}</span>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm" onClick={() => handleEditMenu(item)} className="flex-1">
                            <Edit className="h-3 w-3 mr-1" />
                            {language === "th" ? "แก้ไข" : "Edit"}
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteMenu(item.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{language === "th" ? "หมวดหมู่" : "Categories"}</h3>
              <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleAddCategory}>
                    <Plus className="h-4 w-4 mr-2" />
                    {language === "th" ? "เพิ่มหมวดหมู่" : "Add Category"}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingCategory 
                        ? (language === "th" ? "แก้ไขหมวดหมู่" : "Edit Category")
                        : (language === "th" ? "เพิ่มหมวดหมู่ใหม่" : "Add New Category")}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>{language === "th" ? "ชื่อ (ไทย)" : "Name (Thai)"}</Label>
                      <Input value={categoryForm.name_th} onChange={(e) => setCategoryForm({...categoryForm, name_th: e.target.value})} />
                    </div>
                    <div className="grid gap-2">
                      <Label>{language === "th" ? "ชื่อ (English)" : "Name (English)"}</Label>
                      <Input value={categoryForm.name_en} onChange={(e) => setCategoryForm({...categoryForm, name_en: e.target.value})} />
                    </div>
                    <div className="grid gap-2">
                      <Label>{language === "th" ? "ไอคอน (Emoji)" : "Icon (Emoji)"}</Label>
                      <Input value={categoryForm.icon} onChange={(e) => setCategoryForm({...categoryForm, icon: e.target.value})} placeholder="🍽️" />
                    </div>
                    <div className="grid gap-2">
                      <Label>{language === "th" ? "ลำดับการแสดง" : "Display Order"}</Label>
                      <Input type="number" value={categoryForm.display_order} onChange={(e) => setCategoryForm({...categoryForm, display_order: Number(e.target.value)})} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>
                      {language === "th" ? "ยกเลิก" : "Cancel"}
                    </Button>
                    <Button onClick={handleSaveCategory}>
                      {language === "th" ? "บันทึก" : "Save"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categoriesLoading ? (
                <p>{language === "th" ? "กำลังโหลด..." : "Loading..."}</p>
              ) : categories.length === 0 ? (
                <p className="text-muted-foreground">{language === "th" ? "ยังไม่มีหมวดหมู่" : "No categories yet"}</p>
              ) : (
                categories.map((category) => (
                  <Card key={category.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{category.icon}</span>
                          <div>
                            <CardTitle>{language === "th" ? category.name_th : category.name_en}</CardTitle>
                            <CardDescription>{language === "th" ? "ลำดับ" : "Order"}: {category.display_order}</CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditCategory(category)} className="flex-1">
                          <Edit className="h-3 w-3 mr-1" />
                          {language === "th" ? "แก้ไข" : "Edit"}
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteCategory(category.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
