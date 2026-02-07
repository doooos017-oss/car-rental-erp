# 🚗 نظام إدارة تأجير السيارات - Supabase Edition

## ✨ الميزات

- ✅ إدارة السيارات وحالتها
- ✅ إدارة العملاء والعقود
- ✅ نظام الفواتير والمدفوعات
- ✅ تتبع الصيانة والمهام
- ✅ خريطة GPS للسيارات
- ✅ تقارير شاملة

## 🚀 البدء السريع

```bash
# 1. تثبيت الاعتماديات
npm install

# 2. تكوين البيئة
# انسخ .env.local وأضف بيانات Supabase

# 3. تشغيل البرنامج
npm run dev

# 4. فتح المتصفح
# http://localhost:5173
```

## 🗄️ إعداد قاعدة البيانات

### الخيار 1: استخدام Supabase (الموصى به)
```bash
1. اذهب إلى https://supabase.com
2. أنشئ مشروع جديد
3. انسخ Project URL و Anon Key إلى .env.local
4. شغّل SQL من supabase-schema.sql
```

### الخيار 2: استخدام قاعدة البيانات المحلية
البرنامج يأتي مع قاعدة SQLite محلية جاهزة للاستخدام على port 3000

## 📚 الملفات المهمة

```
├── src/
│   ├── lib/
│   │   ├── supabase.js          # إعدادات Supabase
│   │   └── supabase-service.js  # خدمات قاعدة البيانات
│   ├── pages/                    # صفحات التطبيق
│   ├── components/               # المكونات
│   └── store/                    # إدارة الحالة
├── server/                       # الخادم الخلفي
├── supabase-schema.sql           # تصميم قاعدة البيانات
├── SUPABASE_SETUP.md             # تعليمات الإعداد
└── SUPABASE_GUIDE.md             # دليل الاستخدام
```

## 🔑 بيانات الاختبار

```
📧 Admin:
   البريد: admin@test.com
   كلمة المرور: admin123

📧 User:
   البريد: user@test.com
   كلمة المرور: user123
```

## 🌐 الخوادم

| الخادم | الرابط | المنفذ |
|--------|--------|--------|
| Frontend (Vite) | http://localhost:5173 | 5173 |
| Backend API | http://localhost:3000 | 3000 |
| Supabase API | https://your-project.supabase.co | - |

## 📋 متطلبات النظام

- Node.js >= 16
- npm >= 8
- متصفح حديث

## 🛠️ الأدوات المستخدمة

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL via Supabase
- **Backend**: Express.js
- **Authentication**: Firebase / Supabase Auth
- **State Management**: Zustand
- **Routing**: React Router

## 📖 المراجع والدروس

- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com)

## 🤝 المساهمة

لتحسين البرنامج:
1. اعمل على نسخة (fork)
2. أنشئ فرع للميزة الجديدة
3. أرسل طلب دمج (PR)

## 📝 الترخيص

هذا المشروع مرخص تحت MIT License

---

**تم إنشاؤه بـ ❤️ لتسهيل إدارة تأجير السيارات**

آخر تحديث: 7 فبراير 2026
