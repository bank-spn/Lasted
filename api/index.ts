// api/index.ts
import express from "express";

// ✅ สร้าง instance ของ express app
const app = express();

// ✅ ทดสอบ endpoint แรก
app.get("/", (_, res) => {
  res.send("✅ Server is running");
});

// ✅ เพิ่ม health check route (เผื่อเช็กในอนาคต)
app.get("/api/health", (_, res) => {
  res.json({ ok: true, message: "Server alive" });
});

// ✅ export app เป็น default — Vercel ต้องการตรงนี้
export default app;
