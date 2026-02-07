# متغيرات البيئة المطلوبة للنشر على Vercel

## 1️⃣ متغيرات Firebase (اختياري - للمصادقة السحابية)

```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=car-rental-erp.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=car-rental-erp
VITE_FIREBASE_STORAGE_BUCKET=car-rental-erp.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123...
VITE_FIREBASE_USE_EMULATOR=false
```

**كيفية الحصول عليها:**
1. اذهب إلى https://console.firebase.google.com
2. أنشئ مشروع جديد (أو استخدم موجود)
3. أضف تطبيق ويب
4. انسخ القيم من الإعدادات

---

## 2️⃣ متغيرات Supabase (اختياري - لقاعدة البيانات)

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_USE_EMULATOR=false
```

**كيفية الحصول عليها:**
1. اذهب إلى https://supabase.com
2. أنشئ مشروع جديد
3. في Settings > API > Project URL و anon key
4. اختياري: استيراد SQL schema من `supabase-schema.sql`

---

## 3️⃣ إضافة المتغيرات في Vercel

### الطريقة الأولى: عبر Dashboard
1. اذهب إلى https://vercel.com/dashboard
2. اختر المشروع
3. Settings > Environment Variables
4. أضف كل متغير واحداً تلو الآخر

### الطريقة الثانية: عبر CLI
```bash
vercel env add VITE_SUPABASE_URL
# ثم أدخل القيمة
```

---

## ⚠️ تنبيهات أمان مهمة

❌ **لا تضع أبداً:**
- قيم Firebase API الحقيقية (عرضة للإساءة)
- مفاتيح قاعدة البيانات الحساسة في الكود
- بيانات المستخدمين الشخصية

✅ **الطريقة الآمنة:**
- استخدم Vercel Environment Variables فقط
- استخدم `.env.local` للتطوير المحلي
- أضف `.env.local` إلى `.gitignore`

---

## 🔐 الخيار الآمن: استخدام المتغيرات الافتراضية

التطبيق يعمل بدون متغيرات! يمكنك:

1. **تطويري بدون قاعدة بيانات خارجية:**
   - استخدام SQLite محلي (يعمل على الكمبيوتر فقط)
   - استخدام Mock Authentication (admin@test.com / admin123)

2. **إنتاجي مع Supabase:**
   - أضف متغيرات Supabase
   - استيرد Schema
   - سيعمل تلقائياً

3. **مع Firebase (اختياري):**
   - أضف متغيرات Firebase
   - ستحل محل الـ Mock Authentication

---

## 📝 ملف `.env.example` للتطوير

نسخ هذا الملف إلى `.env.local` محلياً:

```env
# Firebase (development)
VITE_FIREBASE_API_KEY=AIzaSyDemo123_FOR_DEVELOPMENT_ONLY
VITE_FIREBASE_AUTH_DOMAIN=car-rental-erp.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=car-rental-erp
VITE_FIREBASE_STORAGE_BUCKET=car-rental-erp.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:demo123
VITE_FIREBASE_USE_EMULATOR=false

# Supabase (development)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SUPABASE_USE_EMULATOR=false
```

---

## ✅ التحقق من الإعدادات

بعد النشر على Vercel، تحقق من:

```bash
# 1. تطبيقك يحمل بدون أخطاء
curl -s https://car-rental-erp.vercel.app | grep "<title>"

# 2. لا توجد أخطاء في Console
# (افتح DevTools: F12 > Console)

# 3. تحقق من الـ Logs في Vercel Dashboard
# Settings > Logs > Deployments
```

---

**🎉 جاهز للنشر! اختر متغيراتك وابدأ!**
