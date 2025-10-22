import DashboardLayout from "@/components/DashboardLayout";

export default function Inventory() {
  return (
    <DashboardLayout>
      <div>
        <h2 className="text-2xl font-bold">Inventory</h2>
        <p className="text-muted-foreground">จัดการคลังสินค้า</p>
      </div>
    </DashboardLayout>
  );
}
