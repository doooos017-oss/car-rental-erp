# إعداد قاعدة البيانات Supabase

## الخطوات:

### 1. إنشاء حساب Supabase
- اذهب إلى https://supabase.com
- اضغط "Start your project"
- اختر Google أو GitHub للدخول
- أنشئ مشروع جديد

### 2. الحصول على مفاتيح API
بعد إنشاء المشروع:
1. اذهب إلى **Settings** -> **API**
2. انسخ:
   - **Project URL** (VITE_SUPABASE_URL)
   - **anon public** key (VITE_SUPABASE_ANON_KEY)

### 3. إضافة المفاتيح إلى `.env.local`
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. إنشاء الجداول
1. في Supabase Dashboard، اذهب إلى **SQL Editor**
2. انسخ وألصق محتوى ملف `supabase-schema.sql`
3. شغّل الـ SQL (Execute)

### 5. تثبيت Supabase Client
```bash
npm install @supabase/supabase-js
```

### 6. استخدام Supabase في التطبيق
```javascript
import { supabase } from './lib/supabase'

// جلب البيانات
const { data, error } = await supabase
  .from('cars')
  .select('*')

// إضافة بيانات جديدة
const { data, error } = await supabase
  .from('cars')
  .insert([{ plate: 'ABC123', model: 'BMW' }])
```

### 7. تفعيل الحماية (RLS)
للأمان الأفضل:
1. اذهب إلى **Authentication** في Supabase
2. فعّل **SQL Server** authentication
3. اتبع إرشادات Row Level Security

## الفوائد:
✅ مجاني (500MB من اللتخزين)
✅ قاعدة بيانات PostgreSQL قوية
✅ مدمجة مع React بسهولة
✅ لا حاجة لخادم خلفي منفصل
✅ مدمjni للمصادقة والتخزين

استمتع! 🚀
