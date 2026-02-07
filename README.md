# نظام إدارة تأجير السيارات الشامل (Car Rental ERP)

نظام متكامل ومتقدم لإدارة شركات تأجير السيارات، مبني باستخدام Firebase مع واجهة عربية بالكامل ودعم RTL.

## 🚀 المميزات الرئيسية

### 🔐 نظام المصادقة المتقدم
- تسجيل الدخول بالبريد الإلكتروني وكلمة المرور
- تسجيل الدخول عبر Google و Facebook
- أدوار متعددة (مدير، موظف، عميل)
- حماية متقدمة للصفحات

### 📊 لوحة التحكم التحليلية
- إحصائيات فورية للإيرادات والسيارات والعملاء
- رسوم بيانية تفاعلية باستخدام Recharts
- تقارير مفصلة باللغة العربية
- مؤشرات أداء رئيسية (KPIs)

### 🚗 إدارة الأسطول المتقدمة
- إضافة وتعديل وحذف السيارات
- تتبع حالة السيارات (متاح، مؤجر، صيانة، محجوز)
- معلومات شاملة للسيارات (رقم VIN، المسافة، التكاليف)
- فلترة وبحث متقدم

### 📝 إدارة العقود
- إنشاء وإدارة عقود التأجير
- تتبع حالة العقود
- حسابات تلقائية للتكاليف
- تاريخ شامل للعقود

### 🔧 إدارة الصيانة
- جدولة الصيانة الدورية
- تتبع تكاليف الصيانة
- سجل كامل لأعمال الصيانة
- تنبيهات للصيانة المستحقة

### 👥 إدارة العملاء
- سجل شامل للعملاء
- تتبع تاريخ التأجير
- معلومات الاتصال والتفاصيل
- تصنيف العملاء

### 💳 معالجة المدفوعات
- دمج مع Stripe و PayPal
- تتبع المدفوعات المعلقة
- فواتير تلقائية
- تقارير مالية مفصلة

### 📈 التقارير والتحليلات الشاملة
- تقارير إيرادات شاملة
- تحليل أداء الفروع
- تقارير الصيانة
- تصدير التقارير (PDF, Excel)
- رسوم بيانية تفاعلية

### 🗺️ تتبع GPS
- تتبع السيارات في الوقت الفعلي
- تاريخ الحركة
- تنبيهات الموقع
- خرائط تفاعلية

## 🛠️ التقنيات المستخدمة

### الواجهة الأمامية
- **React 18** - إطار العمل الرئيسي
- **Vite** - أداة البناء السريع
- **Tailwind CSS** - إطار التصميم
- **Lucide React** - الأيقونات
- **Recharts** - الرسوم البيانية
- **React Router** - التوجيه

### الخلفية والتخزين
- **Firebase Firestore** - قاعدة البيانات NoSQL
- **Firebase Authentication** - المصادقة الآمنة
- **Firebase Storage** - تخزين الملفات
- **Firebase Functions** - الوظائف السحابية

### إدارة الحالة
- **Zustand** - إدارة الحالة البسيطة
- **React Firebase Hooks** - خطافات Firebase

## 📋 المتطلبات الأساسية

- Node.js 18 أو أحدث
- npm أو yarn
- حساب Firebase
- Git

## 🚀 التثبيت والإعداد

### 1. استنساخ المشروع
```bash
git clone <repository-url>
cd car-rental-erp
```

### 2. تثبيت الاعتماديات
```bash
npm install
```

### 3. إعداد Firebase
1. أنشئ مشروع جديد في [Firebase Console](https://console.firebase.google.com/)
2. فعّل الخدمات التالية:
   - Authentication (Email/Password, Google, Facebook)
   - Firestore Database
   - Storage
   - Functions
3. انسخ ملف `.env.example` إلى `.env`
4. أضف بيانات مشروع Firebase في ملف `.env`:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
VITE_PAYPAL_CLIENT_ID=your_paypal_client_id
```

### 4. نشر قواعد Firestore
```bash
firebase deploy --only firestore:rules
```

### 5. تشغيل المشروع
```bash
# للتطوير المحلي
npm run dev

# للبناء
npm run build

# للمعاينة
npm run preview

# للنشر على Firebase
npm run deploy:firebase
```

## 📁 هيكل المشروع

```
car-rental-erp/
├── public/                 # الملفات العامة
├── src/
│   ├── components/        # المكونات القابلة لإعادة الاستخدام
│   │   └── ui/           # مكونات الواجهة الأساسية
│   ├── firebase/          # إعدادات وخدمات Firebase
│   ├── layouts/           # تخطيطات الصفحات
│   ├── pages/             # صفحات التطبيق
│   ├── store/             # إدارة الحالة
│   └── utils/             # وظائف مساعدة
├── firebase.json         # إعدادات Firebase
├── firestore.rules       # قواعد أمان Firestore
├── .env.example         # متغيرات البيئة النموذجية
├── tailwind.config.js    # إعدادات Tailwind
└── vite.config.js       # إعدادات Vite
```

## 🔧 التخصيص

### إضافة لغات جديدة
1. أنشئ ملفات الترجمة في `src/locales/`
2. حدّث إعدادات i18n
3. استخدم خطاف الترجمة في المكونات

### تعديل الألوان والثيم
عدّل متغيرات CSS في `src/index.css` أو `tailwind.config.js`

### إضافة حقول جديدة
1. حدّث نموذج البيانات في Firestore
2. عدّل المكونات ذات الصلة
3. حدّث قواعد الأمان إذا لزم الأمر

## 📱 التوافق

- **متصفحات حديثة**: Chrome, Firefox, Safari, Edge
- **أجهزة محمولة**: iOS 12+, Android 8+
- **شاشات**: متجاوب بالكامل من 320px إلى 4K

## 🔒 الأمان

- مصادقة Firebase آمنة
- قواعد أمان Firestore صارمة
- حماية CSRF
- تحقق من صحة البيانات
- HTTPS إلزامي في الإنتاج

## 🚀 النشر

### على Firebase Hosting (موصى به)
```bash
npm run build
firebase deploy
```

### على Vercel
1. اربط المستودع بـ Vercel
2. أضف متغيرات البيئة
3. انشر تلقائياً مع كل دفعة

### على Netlify
1. اربط المستودع بـ Netlify
2. أضف متغيرات البيئة
3. اضبط أمر البناء `npm run build`

## 📞 الدعم

للحصول على الدعم أو الاستفسارات:
- البريد الإلكتروني: support@carrental-erp.com
- الوثائق: [Documentation](https://docs.carrental-erp.com)
- المشاكل: [GitHub Issues](https://github.com/your-repo/issues)

## 📄 الترخيص

هذا المشروع مرخص تحت ترخيص MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

## 🙏 الشكر والتقدير

- فريق Firebase للخدمات السحابية الممتازة
- مجتمع React للمساهمات القيمة
- مصممي Tailwind CSS على إطار العمل الرائع

---

**ملاحظة**: هذا المشروع نظام احترافي ويجب اختباره جيداً قبل الاستخدام في بيئة الإنتاج.
