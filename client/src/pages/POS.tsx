import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { Plus, Minus, Trash2, Grid3x3, List, LayoutGrid, Search, ShoppingCart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function POS() {
  const { language } = useLanguage();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [tableNumber, setTableNumber] = useState("");
  const [discount, setDiscount] = useState(0);

  const menuCategories = [
    { id: 1, name: language === "th" ? "อาหารจานหลัก" : "Main Dishes" },
    { id: 2, name: language === "th" ? "เครื่องดื่ม" : "Beverages" },
    { id: 3, name: language === "th" ? "ของหวาน" : "Desserts" },
  ];

  const menuItems = [
    { id: 1, categoryId: 1, name: "ผัดไทย", nameEn: "Pad Thai", price: 60, image: "🍜" },
    { id: 2, categoryId: 1, name: "ข้าวผัด", nameEn: "Fried Rice", price: 50, image: "🍚" },
    { id: 3, categoryId: 1, name: "ต้มยำกุ้ง", nameEn: "Tom Yum Goong", price: 120, image: "🍲" },
    { id: 4, categoryId: 2, name: "น้ำส้ม", nameEn: "Orange Juice", price: 30, image: "🍊" },
    { id: 5, categoryId: 2, name: "กาแฟ", nameEn: "Coffee", price: 40, image: "☕" },
    { id: 6, categoryId: 3, name: "ไอศกรีม", nameEn: "Ice Cream", price: 35, image: "🍦" },
  ];

  const addToCart = (item: typeof menuItems[0]) => {
    const existing = cartItems.find(i => i.id === item.id);
    if (existing) {
      setCartItems(cartItems.map(i => 
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setCartItems([...cartItems, { 
        id: item.id, 
        name: language === "th" ? item.name : item.nameEn, 
        price: item.price, 
        quantity: 1 
      }]);
    }
  };

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
    ).filter(item => item.quantity > 0));
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.07);
  const total = subtotal + tax - discount;

  return (
    <DashboardLayout>
      <div className="flex gap-4 h-[calc(100vh-8rem)]">
        <div className="flex-1 space-y-4 overflow-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">POS - {language === "th" ? "ขายหน้าร้าน" : "Point of Sale"}</h2>
            <div className="flex gap-2">
              <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" onClick={() => setViewMode("grid")}>
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" onClick={() => setViewMode("list")}>
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder={language === "th" ? "ค้นหาเมนู..." : "Search menu..."} className="pl-10" />
          </div>

          <Tabs defaultValue="1">
            <TabsList>
              {menuCategories.map(cat => (
                <TabsTrigger key={cat.id} value={cat.id.toString()}>{cat.name}</TabsTrigger>
              ))}
            </TabsList>

            {menuCategories.map(cat => (
              <TabsContent key={cat.id} value={cat.id.toString()}>
                <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" : "space-y-2"}>
                  {menuItems.filter(item => item.categoryId === cat.id).map(item => (
                    <Card key={item.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => addToCart(item)}>
                      <CardContent className={viewMode === "grid" ? "p-4 text-center" : "p-4 flex items-center gap-4"}>
                        <div className={viewMode === "grid" ? "text-4xl mb-2" : "text-3xl"}>{item.image}</div>
                        <div className={viewMode === "grid" ? "" : "flex-1"}>
                          <h3 className="font-semibold">{language === "th" ? item.name : item.nameEn}</h3>
                          <p className="text-sm text-muted-foreground">฿{item.price}</p>
                        </div>
                        {viewMode === "list" && (
                          <Button size="sm"><Plus className="h-4 w-4" /></Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <Card className="w-96 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              {language === "th" ? "ตะกร้าสินค้า" : "Cart"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-4">
            <div className="space-y-2">
              <Label>{language === "th" ? "หมายเลขโต๊ะ" : "Table Number"}</Label>
              <Input value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} placeholder="A1" />
            </div>

            <div className="flex-1 overflow-auto space-y-2">
              {cartItems.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  {language === "th" ? "ไม่มีรายการในตะกร้า" : "Cart is empty"}
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-2 p-2 border rounded">
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">฿{item.price}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQuantity(item.id, -1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQuantity(item.id, 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => removeItem(item.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span>{language === "th" ? "ยอดรวม" : "Subtotal"}</span>
                <span>฿{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{language === "th" ? "ภาษี (7%)" : "Tax (7%)"}</span>
                <span>฿{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>{language === "th" ? "ส่วนลด" : "Discount"}</span>
                <Input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="w-24 h-8 text-right" />
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>{language === "th" ? "ยอดชำระ" : "Total"}</span>
                <span>฿{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => setCartItems([])}>{language === "th" ? "ล้าง" : "Clear"}</Button>
              <Button disabled={cartItems.length === 0}>{language === "th" ? "ชำระเงิน" : "Checkout"}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
