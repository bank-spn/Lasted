import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, QrCode, X, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface MenuItem {
  id: number;
  name: string;
  nameEn: string;
  price: number;
  category: string;
  image?: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

export default function POS() {
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "credit" | "qr">("cash");
  const [receivedAmount, setReceivedAmount] = useState("");
  const [cartCollapsed, setCartCollapsed] = useState(false);

  const menuItems: MenuItem[] = [
    { id: 1, name: "ข้าวผัดกุ้ง", nameEn: "Shrimp Fried Rice", price: 120, category: "main" },
    { id: 2, name: "ผัดไทย", nameEn: "Pad Thai", price: 100, category: "main" },
    { id: 3, name: "ต้มยำกุ้ง", nameEn: "Tom Yum Goong", price: 150, category: "soup" },
    { id: 4, name: "ส้มตำ", nameEn: "Som Tam", price: 80, category: "salad" },
    { id: 5, name: "น้ำเปล่า", nameEn: "Water", price: 20, category: "beverage" },
    { id: 6, name: "โค้ก", nameEn: "Coke", price: 30, category: "beverage" },
  ];

  const categories = [
    { id: "all", name: "ทั้งหมด", nameEn: "All" },
    { id: "main", name: "จานหลัก", nameEn: "Main" },
    { id: "soup", name: "ซุป", nameEn: "Soup" },
    { id: "salad", name: "สลัด", nameEn: "Salad" },
    { id: "beverage", name: "เครื่องดื่ม", nameEn: "Beverage" },
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success(language === "th" ? `เพิ่ม ${item.name} แล้ว` : `Added ${item.nameEn}`);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
    ).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
    toast.info(language === "th" ? "ลบรายการแล้ว" : "Item removed");
  };

  const clearCart = () => {
    setCart([]);
    toast.info(language === "th" ? "ล้างตะกร้าแล้ว" : "Cart cleared");
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.07;
  const total = subtotal + tax;

  const handlePayment = () => {
    if (cart.length === 0) {
      toast.error(language === "th" ? "ตะกร้าว่างเปล่า" : "Cart is empty");
      return;
    }
    setPaymentModalOpen(true);
  };

  const confirmPayment = () => {
    if (paymentMethod === "cash" && parseFloat(receivedAmount) < total) {
      toast.error(language === "th" ? "จำนวนเงินไม่เพียงพอ" : "Insufficient amount");
      return;
    }
    toast.success(language === "th" ? "ชำระเงินสำเร็จ" : "Payment successful");
    setCart([]);
    setPaymentModalOpen(false);
    setReceivedAmount("");
  };

  const change = paymentMethod === "cash" ? Math.max(0, parseFloat(receivedAmount || "0") - total) : 0;

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-4rem)] gap-4">
        {/* Main Content */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${cartCollapsed ? 'mr-16' : 'mr-0'}`}>
          <div className="mb-4">
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              {language === "th" ? "ขายหน้าร้าน" : "Point of Sale"}
            </h2>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={language === "th" ? "ค้นหาเมนู..." : "Search menu..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {categories.map(cat => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
              >
                {language === "th" ? cat.name : cat.nameEn}
              </Button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredItems.map(item => (
                <Card key={item.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => addToCart(item)}>
                  <CardContent className="p-4">
                    <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center">
                      <span className="text-4xl">🍽️</span>
                    </div>
                    <h3 className="font-semibold mb-1 truncate">{language === "th" ? item.name : item.nameEn}</h3>
                    <p className="text-lg font-bold text-primary">฿{item.price}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Cart Sidebar */}
        <div className={`fixed right-0 top-0 h-screen bg-background border-l transition-all duration-300 z-50 ${
          cartCollapsed ? 'w-16' : 'w-96'
        }`}>
          <div className="flex flex-col h-full">
            {/* Cart Header */}
            <div className="p-4 border-b flex items-center justify-between">
              {!cartCollapsed && (
                <h3 className="font-semibold">{language === "th" ? "ตะกร้า" : "Cart"} ({cart.length})</h3>
              )}
              <Button variant="ghost" size="icon" onClick={() => setCartCollapsed(!cartCollapsed)}>
                {cartCollapsed ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              </Button>
            </div>

            {!cartCollapsed && (
              <>
                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {cart.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      {language === "th" ? "ตะกร้าว่างเปล่า" : "Cart is empty"}
                    </p>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} className="flex gap-3 p-3 bg-muted rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{language === "th" ? item.name : item.nameEn}</h4>
                          <p className="text-sm text-muted-foreground">฿{item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQuantity(item.id, -1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQuantity(item.id, 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => removeFromCart(item.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Cart Summary */}
                <div className="border-t p-4 space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{language === "th" ? "ยอดรวม" : "Subtotal"}</span>
                      <span>฿{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{language === "th" ? "ภาษี (7%)" : "Tax (7%)"}</span>
                      <span>฿{tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>{language === "th" ? "ยอดชำระ" : "Total"}</span>
                      <span>฿{total.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={clearCart} disabled={cart.length === 0}>
                      {language === "th" ? "ล้าง" : "Clear"}
                    </Button>
                    <Button className="flex-1" onClick={handlePayment} disabled={cart.length === 0}>
                      {language === "th" ? "ชำระเงิน" : "Pay"}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Payment Modal */}
        <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{language === "th" ? "ชำระเงิน" : "Payment"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="text-center py-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">{language === "th" ? "ยอดชำระ" : "Total Amount"}</p>
                <p className="text-3xl font-bold">฿{total.toFixed(2)}</p>
              </div>

              <div className="space-y-3">
                <Label>{language === "th" ? "วิธีชำระเงิน" : "Payment Method"}</Label>
                <RadioGroup value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-accent" onClick={() => setPaymentMethod("cash")}>
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Banknote className="h-5 w-5" />
                      {language === "th" ? "เงินสด" : "Cash"}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-accent" onClick={() => setPaymentMethod("credit")}>
                    <RadioGroupItem value="credit" id="credit" />
                    <Label htmlFor="credit" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5" />
                      {language === "th" ? "บัตรเครดิต" : "Credit Card"}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-accent" onClick={() => setPaymentMethod("qr")}>
                    <RadioGroupItem value="qr" id="qr" />
                    <Label htmlFor="qr" className="flex items-center gap-2 cursor-pointer flex-1">
                      <QrCode className="h-5 w-5" />
                      {language === "th" ? "QR Code" : "QR Code"}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {paymentMethod === "cash" && (
                <div className="space-y-2">
                  <Label>{language === "th" ? "จำนวนเงินที่รับ" : "Received Amount"}</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={receivedAmount}
                    onChange={(e) => setReceivedAmount(e.target.value)}
                  />
                  {receivedAmount && parseFloat(receivedAmount) >= total && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        {language === "th" ? "เงินทอน" : "Change"}: <span className="font-bold">฿{change.toFixed(2)}</span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {paymentMethod === "qr" && (
                <div className="flex justify-center py-4">
                  <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                    <QrCode className="h-24 w-24 text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPaymentModalOpen(false)}>
                {language === "th" ? "ยกเลิก" : "Cancel"}
              </Button>
              <Button onClick={confirmPayment}>
                {language === "th" ? "ยืนยันการชำระเงิน" : "Confirm Payment"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
