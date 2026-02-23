'use strict';

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use("/uploads", express.static(uploadsDir));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: "طلبات كثيرة جداً، يرجى المحاولة لاحقاً" },
});
app.use("/api/", apiLimiter);

const adminRouter = require("./routes/admin");
const productsRouter = require("./routes/products");
const ordersRouter = require("./routes/orders");
const paymentsRouter = require("./routes/payments");
const telegramRouter = require("./routes/telegram");
const checkoutRouter = require("./routes/checkout");

app.use("/api/admin", adminRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/telegram", telegramRouter);
app.use("/api/checkout", checkoutRouter);

app.get("/api/health", (_req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "خطأ داخلي في الخادم" });
});

// دالة إنشاء المنتجات الافتراضية
async function seedDefaultProducts() {
  try {
    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient();
    
    const products = [
      { id: 1, name: "سبيكة 36 جرام", price: 100000, weight: 36, karat: 24, description: "سبيكة ذهب خالص عيار 24 قيراط بوزن 36 جرام", isDefault: true, order: 0 },
      { id: 2, name: "سبيكة 8 جرام", price: 10000, weight: 8, karat: 24, description: "سبيكة ذهب خالص عيار 24 قيراط بوزن 8 جرام", isDefault: true, order: 1 },
      { id: 3, name: "سبيكة 14 جرام", price: 22000, weight: 14, karat: 24, description: "سبيكة ذهب خالص عيار 24 قيراط بوزن 14 جرام", isDefault: true, order: 2 },
      { id: 4, name: "سبيكة 4 جرام", price: 12420, weight: 4, karat: 24, description: "سبيكة ذهب خالص عيار 24 قيراط بوزن 4 جرام", isDefault: true, order: 3 },
    ];
    
    for (const p of products) {
      await prisma.product.upsert({
        where: { id: p.id },
        update: {},
        create: p,
      });
    }
    console.log("Default products seeded successfully");
    
    await prisma.$disconnect();
  } catch (error) {
    console.error("Error seeding products:", error.message);
  }
}

// دالة إنشاء الأدمن الافتراضي
async function ensureAdminExists() {
  try {
    const { PrismaClient } = require("@prisma/client");
    const bcrypt = require("bcryptjs");
    const prisma = new PrismaClient();
    
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    
    const existingAdmin = await prisma.admin.findUnique({
      where: { username: adminUsername },
    });
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await prisma.admin.create({
        data: {
          username: adminUsername,
          password: hashedPassword,
        },
      });
      console.log("Default admin created");
    } else {
      console.log("Admin already exists");
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error("Error creating admin:", error.message);
  }
}

app.listen(PORT, async () => {
  console.log("Backend server running on port " + PORT);
  require("./services/telegram").init();
  
  // تشغيل الـ seeding
  await seedDefaultProducts();
  await ensureAdminExists();
});
