import DashboardLayout from "@/components/DashboardLayout";

export default function AuditLog() {
  return (
    <DashboardLayout>
      <div>
        <h2 className="text-2xl font-bold">Audit Log</h2>
        <p className="text-muted-foreground">บันทึกการทำงานทั้งระบบ</p>
      </div>
    </DashboardLayout>
  );
}
