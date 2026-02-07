# دليل Supabase لنظام إدارة تأجير السيارات

## 🚀 البدء السريع

### 1. إنشاء حساب Supabase
```
1. اذهب إلى https://supabase.com
2. اختر "Create a new project"
3. أدخل اسم المشروع واختر المنطقة
4. انتظر إنشاء قاعدة البيانات
```

### 2. الحصول على بيانات الاتصال
```
في لوحة التحكم Supabase:
- اذهب إلى Settings > API
- انسخ Project URL
- انسخ anon public key
```

### 3. تحديث ملف `.env.local`
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### 4. تثبيت الاعتماديات
```bash
npm install @supabase/supabase-js
```

### 5. إنشاء الجداول
```
1. في Supabase Dashboard، اذهب إلى SQL Editor
2. انسخ محتوى supabase-schema.sql
3. شغّل الـ SQL
```

## 📝 استخدام الخدمات

### جلب البيانات
```javascript
import { getCars, getCustomers } from '@/lib/supabase-service'

const cars = await getCars()
const customers = await getCustomers()
```

### إضافة بيانات
```javascript
import { addCar } from '@/lib/supabase-service'

const newCar = await addCar({
  plate: 'ABC-123',
  model: 'BMW',
  make: '3 Series',
  year: 2023,
  daily_rate: 100,
  status: 'Available'
})
```

### تحديث البيانات
```javascript
import { updateCar } from '@/lib/supabase-service'

await updateCar('car-id', {
  status: 'Rented',
  daily_rate: 120
})
```

### الاستشتراك في التغييرات (Real-time)
```javascript
import { subscribeToChanges } from '@/lib/supabase-service'

subscribeToChanges('cars', (payload) => {
  console.log('تغيير في البيانات:', payload)
})
```

## 🔐 الأمان (Row Level Security)

### تفعيل RLS
```sql
-- تفعيل RLS على الجدول
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- السماح للمستخدمين المصرح لهم فقط
CREATE POLICY "Users can view all cars"
  ON cars FOR SELECT
  USING (auth.role() IN ('authenticated'));

CREATE POLICY "Admins can update cars"
  ON cars FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');
```

## 📊 أمثلة الاستخدام

### عرض قائمة السيارات
```javascript
import { useEffect, useState } from 'react'
import { getCars } from '@/lib/supabase-service'

export default function CarsPage() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await getCars()
        setCars(data)
      } finally {
        setLoading(false)
      }
    }
    fetchCars()
  }, [])

  if (loading) return <div>جاري التحميل...</div>

  return (
    <div>
      {cars.map(car => (
        <div key={car.id}>
          <h3>{car.make} {car.model}</h3>
          <p>اللوحة: {car.plate}</p>
          <p>السعر اليومي: {car.daily_rate} ريال</p>
        </div>
      ))}
    </div>
  )
}
```

### إنشاء عقد جديد
```javascript
import { addContract } from '@/lib/supabase-service'

const createContract = async (customerId, carId, days) => {
  const startDate = new Date()
  const endDate = new Date(startDate.getTime() + days * 24 * 60 * 60 * 1000)
  const dailyRate = 100
  const total = dailyRate * days * 1.15 // مع الضريبة

  const contract = await addContract({
    customer_id: customerId,
    car_id: carId,
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString(),
    daily_rate: dailyRate,
    vat_rate: 15,
    vat_amount: (dailyRate * days * 0.15),
    total: total,
    status: 'Active'
  })

  return contract
}
```

## 🎯 الخطوات التالية

1. ✅ إعداد قاعدة البيانات
2. ✅ تفعيل المصادقة (Firebase أو Supabase Auth)
3. ✅ إضافة Row Level Security (RLS)
4. ✅ استخدام Real-time Subscriptions
5. ✅ تفعيل Backups والنسخ الاحتياطية

## 📚 المراجع
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript API](https://supabase.com/docs/reference/javascript)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## ✨ الميزات المدعومة
✅ CRUD Operations
✅ Real-time Subscriptions  
✅ Row Level Security (RLS)
✅ PostgreSQL Queries
✅ Storage for Files
✅ Built-in Authentication
✅ Database Functions & Triggers

استمتع بـ Supabase! 🚀
