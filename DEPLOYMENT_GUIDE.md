# دليل النشر الشامل – مؤسسة حسين إبراهيم للمجوهرات الذهبية

## نظرة عامة على المنظومة

```
Frontend (Netlify)  ──►  Backend (Render)  ──►  PostgreSQL (Render)
                                │
                                ├──►  Tamara API
                                ├──►  Tabby API
                                └──►  Telegram Bot
```

---

## أولاً: نشر Backend على Render

### 1. إنشاء حساب
1. توجه إلى [render.com](https://render.com) وأنشئ حساباً
2. اربط حسابك بـ GitHub

### 2. إنشاء قاعدة بيانات PostgreSQL
1. من لوحة Render انقر **New** → **PostgreSQL**
2. اختر اسماً مثل `gold-jewelry-db`
3. اختر الخطة المجانية أو المدفوعة
4. بعد الإنشاء، انسخ **Internal Database URL**

### 3. إنشاء Web Service
1. من لوحة Render انقر **New** → **Web Service**
2. اربط المستودع من GitHub
3. اضبط الإعدادات:
   - **Name**: `gold-jewelry-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy`
   - **Start Command**: `node server.js`

### 4. إضافة متغيرات البيئة
في قسم **Environment Variables** أضف:

| المتغير | القيمة |
|---------|--------|
| `DATABASE_URL` | رابط قاعدة البيانات من الخطوة السابقة |
| `JWT_SECRET` | نص عشوائي آمن (مثال: `openssl rand -hex 32`) |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | كلمة مرور قوية |
| `TELEGRAM_BOT_TOKEN` | توكن البوت من BotFather |
| `TELEGRAM_CHAT_ID` | Chat ID للمالك |
| `BACKEND_URL` | رابط الـ Backend على Render (بعد النشر) |
| `FRONTEND_URL` | رابط الـ Frontend على Netlify |
| `TAMARA_API_URL` | `https://api-sandbox.tamara.co` (تجربة) أو `https://api.tamara.co` (إنتاج) |
| `TAMARA_API_KEY` | مفتاح API من Tamara |
| `TAMARA_NOTIFICATION_KEY` | مفتاح الإشعارات من Tamara |
| `TABBY_API_URL` | `https://api.tabby.ai` |
| `TABBY_API_KEY` | مفتاح API من Tabby |
| `TABBY_MERCHANT_CODE` | كود التاجر من Tabby |
| `NODE_ENV` | `production` |
| `PORT` | `4000` |

### 5. تشغيل الـ Migrations
بعد النشر مباشرة، توجه إلى **Shell** في Render وشغّل:
```bash
npx prisma migrate deploy
```

### 6. إضافة المنتجات الافتراضية (اختياري)
```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const products = [
    { name: 'سبيكة 36 جرام', price: 100000, weight: 36, karat: 24, description: 'سبيكة ذهب خالص عيار 24 قيراط بوزن 36 جرام', isDefault: true, order: 0 },
    { name: 'سبيكة 8 جرام', price: 10000, weight: 8, karat: 24, description: 'سبيكة ذهب خالص عيار 24 قيراط بوزن 8 جرام', isDefault: true, order: 1 },
    { name: 'سبيكة 14 جرام', price: 22000, weight: 14, karat: 24, description: 'سبيكة ذهب خالص عيار 24 قيراط بوزن 14 جرام', isDefault: true, order: 2 },
    { name: 'سبيكة 4 جرام ذهب عيار 24', price: 12420, weight: 4, karat: 24, description: 'سبيكة ذهب خالص عيار 24 قيراط بوزن 4 جرام', isDefault: true, order: 3 },
  ];
  for (const p of products) {
    await prisma.product.upsert({ where: { id: products.indexOf(p) + 1 }, create: p, update: {} });
  }
  console.log('Done!');
  await prisma.\$disconnect();
}
main().catch(console.error);
"
```

---

## ثانياً: نشر Frontend على Netlify

### 1. إعداد الملفات
تأكد من وجود ملف `public/_redirects` بالمحتوى:
```
/*  /index.html  200
```

### 2. نشر على Netlify
1. توجه إلى [netlify.com](https://netlify.com)
2. انقر **Add new site** → **Import an existing project**
3. اربط المستودع من GitHub
4. اضبط الإعدادات:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

### 3. إضافة متغيرات البيئة
في **Site settings** → **Environment variables**:

| المتغير | القيمة |
|---------|--------|
| `VITE_API_URL` | رابط الـ Backend على Render |
| `VITE_ADMIN_USERNAME` | `admin` (للوضع بدون backend) |
| `VITE_ADMIN_PASSWORD` | `admin123` (للوضع بدون backend) |

### 4. إعادة النشر
بعد إضافة المتغيرات، انقر **Trigger deploy**

---

## ثالثاً: إعداد Telegram Bot

### 1. إنشاء البوت
1. افتح Telegram وابحث عن `@BotFather`
2. أرسل `/newbot`
3. اختر اسماً (مثال: `مجوهرات حسين إبراهيم`)
4. اختر username ينتهي بـ `bot` (مثال: `hussein_jewelry_bot`)
5. **انسخ الـ Bot Token** المُرسَل لك

### 2. معرفة Chat ID للمالك
1. افتح Telegram وابحث عن `@userinfobot`
2. أرسل `/start`
3. **انسخ الـ ID** الخاص بك

### 3. إعداد Webhook (للإنتاج)
بعد نشر الـ Backend، شغّل في المتصفح:
```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://your-backend.onrender.com/api/telegram/webhook
```
يجب أن تحصل على: `{"ok":true,"result":true,...}`

### 4. اختبار البوت
1. افتح المحادثة مع البوت
2. أرسل `/start`
3. يجب أن تصل رسالة ترحيبية

---

## رابعاً: إعداد Tamara

### 1. إنشاء حساب تاجر
1. توجه إلى [merchants.tamara.co](https://merchants.tamara.co)
2. سجّل حساباً كتاجر
3. أكمل التحقق من الهوية والعمل التجاري

### 2. الحصول على API Keys
1. من لوحة التحكم → **Settings** → **API Keys**
2. انسخ **API Token** (Sandbox للاختبار، Production للإنتاج)
3. انسخ **Notification Key**

### 3. إعداد Webhooks
في إعدادات Tamara:
- **Notification URL**: `https://your-backend.onrender.com/api/payments/tamara/callback`

### 4. إضافة النطاقات
في إعدادات Tamara أضف:
- `https://your-frontend.netlify.app`
- `https://your-backend.onrender.com`

### 5. التبديل للإنتاج
- غيّر `TAMARA_API_URL` إلى `https://api.tamara.co`
- استخدم مفتاح Production API

---

## خامساً: إعداد Tabby

### 1. إنشاء حساب تاجر
1. توجه إلى [merchants.tabby.ai](https://merchants.tabby.ai)
2. سجّل حساباً وأكمل التحقق

### 2. الحصول على API Keys
1. من لوحة Tabby → **Settings** → **API Integration**
2. انسخ **Public Key** و **Secret Key**
3. الـ Secret Key هو ما يستخدمه الـ Backend

### 3. إعداد Webhooks
- **Webhook URL**: `https://your-backend.onrender.com/api/payments/tabby/webhook`

### 4. إضافة النطاقات
أضف في إعدادات Tabby:
- `https://your-frontend.netlify.app`

### 5. تفعيل Live Mode
بعد الاختبار، طلب تفعيل الإنتاج من Tabby

---

## سادساً: الاختبار المحلي

```bash
# 1. نسخ ملف البيئة
cp backend/.env.example backend/.env
# عدّل القيم في backend/.env

# 2. تشغيل Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
node server.js

# 3. في terminal آخر - تشغيل Frontend
cd ..
npm install
echo "VITE_API_URL=http://localhost:4000" > .env.local
npm run dev
```

---

## سابعاً: استكشاف الأخطاء

### مشكلة CORS
إضافة دومين الـ Frontend في `backend/server.js`:
```js
app.use(cors({
  origin: ['https://your-frontend.netlify.app', 'http://localhost:5173'],
  credentials: true,
}));
```

### مشكلة صور المنتجات
- تأكد أن `BACKEND_URL` صحيح في متغيرات Render
- الصور مخزّنة في مجلد `backend/uploads/` – على Render هذا مؤقت، استخدم خدمة مثل Cloudinary للإنتاج

### مشكلة Telegram Webhook
- تحقق أن الـ HTTPS يعمل على Render
- يجب أن يكون `BACKEND_URL` بدون `/` في النهاية
- شغّل: `https://api.telegram.org/bot<TOKEN>/getWebhookInfo` للتحقق

### مشكلة الدفع من Tamara
- تأكد أن `TAMARA_API_URL` صحيح (sandbox vs production)
- تأكد أن رقم الهاتف بتنسيق سعودي: `+9665XXXXXXXX`

### مشكلة الدفع من Tabby
- تأكد أن `TABBY_MERCHANT_CODE` صحيح
- الاختبار يتطلب بيانات sandbox خاصة من Tabby

### مشكلة قاعدة البيانات
```bash
# إعادة تشغيل migrations
npx prisma migrate reset
npx prisma migrate deploy
```

### مشكلة JWT
إذا انتهت الجلسة:
- تسجيل الخروج والدخول مجدداً
- التأكد أن `JWT_SECRET` لم يتغير

---

## API Endpoints المتاحة

| الطريقة | المسار | الوصف |
|---------|--------|-------|
| GET | `/api/health` | فحص حالة الخادم |
| GET | `/api/products` | جميع المنتجات |
| GET | `/api/products/:id` | تفاصيل منتج |
| POST | `/api/orders` | إنشاء طلب |
| GET | `/api/orders/:id` | تفاصيل طلب |
| POST | `/api/admin/login` | دخول المدير |
| GET | `/api/admin/stats` | إحصائيات (Admin) |
| GET | `/api/admin/orders` | الطلبات (Admin) |
| PATCH | `/api/admin/orders/:id/status` | تغيير حالة (Admin) |
| POST | `/api/admin/products` | إضافة منتج (Admin) |
| PUT | `/api/admin/products/:id` | تعديل منتج (Admin) |
| DELETE | `/api/admin/products/:id` | حذف منتج (Admin) |
| PATCH | `/api/admin/products/:id/reorder` | ترتيب منتج (Admin) |
| GET | `/api/admin/users` | المستخدمون (Admin) |
| POST | `/api/payments/tamara/checkout` | بدء دفع تمارا |
| POST | `/api/payments/tamara/callback` | Webhook تمارا |
| POST | `/api/payments/tamara/authorize` | تفويض تمارا |
| POST | `/api/payments/tamara/capture` | صرف تمارا |
| POST | `/api/payments/tabby/checkout` | بدء دفع تابي |
| POST | `/api/payments/tabby/webhook` | Webhook تابي |
| POST | `/api/payments/tabby/authorize` | تفويض تابي |
| POST | `/api/telegram/webhook` | Webhook التلغرام |

---

## أوامر Telegram Bot

| الأمر | الوصف |
|-------|-------|
| `/start` | رسالة ترحيبية |
| `/orders` | آخر 10 طلبات |
| `/orders pending` | الطلبات المعلقة |
| `/orders approved` | الطلبات الموافق عليها |
| `/orders rejected` | الطلبات المرفوضة |
| `/order <id>` | تفاصيل طلب محدد |
| `/approve <id>` | الموافقة على طلب |
| `/reject <id>` | رفض طلب |
| `/stats` | إحصائيات عامة |
| `/stats today` | إحصائيات اليوم |
| `/stats month` | إحصائيات الشهر |
| `/help` | عرض المساعدة |
