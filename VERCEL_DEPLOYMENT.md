# 🚀 نشر على Vercel - دليل سريع

## الطرق المتاحة

### الطريقة 1: عبر GitHub (الأسهل والموصى به)

#### الخطوة 1: رفع المشروع على GitHub
```bash
# إنشاء مستودع جديد على GitHub ثم:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/car-rental-erp.git
git push -u origin main
```

#### الخطوة 2: ربط مع Vercel
1. اذهب إلى https://vercel.com
2. اضغط "New Project"
3. اختر "Import Git Repository"
4. ابحث عن مستودعك (car-rental-erp)
5. اضغط "Import"

#### الخطوة 3: إعدادات البناء
في صفحة الإعدادات:
- **Framework**: Vite
- **Build Command**: npm run build
- **Output Directory**: dist
- **Install Command**: npm install

#### الخطوة 4: متغيرات البيئة
أضف في "Environment Variables":
```
VITE_FIREBASE_API_KEY=your-value
VITE_FIREBASE_AUTH_DOMAIN=your-value
VITE_FIREBASE_PROJECT_ID=your-value
VITE_FIREBASE_STORAGE_BUCKET=your-value
VITE_FIREBASE_MESSAGING_SENDER_ID=your-value
VITE_FIREBASE_APP_ID=your-value
VITE_SUPABASE_URL=your-value
VITE_SUPABASE_ANON_KEY=your-value
```

#### الخطوة 5: ابدأ النشر!
اضغط "Deploy" وسيتم نشر التطبيق تلقائياً

---

### الطريقة 2: عبر Vercel CLI (البديل)

```bash
# 1. الدخول إلى Vercel
vercel login

# 2. النشر
vercel --prod

# 3. اتبع التعليمات التفاعلية
```

---

### الطريقة 3: ربط Auto Deploy

بعد النشر الأول:
- كل push إلى main سيُطلق نشر تلقائي
- ستحصل على preview URL لكل Pull Request

---

## ⚙️ إعدادات Vercel.json الموجودة

الملف الحالي يعيد توجيه جميع الطلبات إلى index.html (لـ React Router):

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

---

## 📋 متطلبات النشر

✅ الملفات المبنية موجودة في `dist/`
✅ ملف `vercel.json` معد بشكل صحيح
✅ `package.json` يحتوي على scripts الصحيحة

---

## 🌐 بعد النشر

ستحصل على:
- **Production URL**: مثل `https://car-rental-erp.vercel.app`
- **Preview URLs**: لكل branch
- **Analytics**: تحليل الأداء والسرعة
- **Logs**: تحقق من الأخطاء الأخطاء المحتملة

---

## 🔧 استكشاف الأخطاء

إذا حدثت مشاكل:

1. تحقق من **Build Logs** في Vercel
2. تأكد من **Environment Variables**
3. تحقق من **Output Directory** (يجب أن يكون `dist`)
4. جرّب بناء محلي: `npm run build`

---

## 💡 نصائح

- استخدم GitHub للـ Auto Deploy
- اختبر محلياً قبل push
- استخدم `.env.local` للبيانات الحساسة
- راقب Logs في Vercel Dashboard

---

**اختر الطريقة المناسبة وابدأ النشر! 🎉**
