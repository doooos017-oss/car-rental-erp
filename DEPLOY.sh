#!/bin/bash

# 📋 Vercel Deployment Quick Guide
# نسخ والصق هذه الأوامر واحداً تلو الآخر

echo "🚀 شروع نشر التطبيق على Vercel"
echo "================================"

# الخطوة 1: تهيئة Git
echo ""
echo "✅ الخطوة 1: تهيئة Git"
echo "---"
echo "git init"
echo "git add ."
echo 'git commit -m "🚀 Ready for Vercel deployment"'
echo "git branch -M main"
echo ""
echo "📌 الآن اذهب إلى GitHub:"
echo "1. اذهب إلى https://github.com/new"
echo "2. أنشئ مستودع باسم 'car-rental-erp'"
echo "3. نسخ الأوامر التالية:"
echo ""

# الخطوة 2: رفع على GitHub
echo "✅ الخطوة 2: رفع على GitHub"
echo "---"
echo 'git remote add origin https://github.com/YOUR_USERNAME/car-rental-erp.git'
echo "git push -u origin main"
echo ""

# الخطوة 3: Vercel
echo "✅ الخطوة 3: ربط مع Vercel"
echo "---"
echo "1. اذهب إلى https://vercel.com/new"
echo "2. اختر 'Import Git Repository'"
echo "3. ابحث عن 'car-rental-erp'"
echo "4. اضغط 'Import'"
echo "5. في الإعدادات:"
echo "   - Build Command: npm run build"
echo "   - Output Directory: dist"
echo ""

echo "✅ الخطوة 4: تم!"
echo "---"
echo "سعادتك 🎉 توقع البريد من Vercel بـ:"
echo "- URL فريد: https://car-rental-erp-xxx.vercel.app"
echo "- شهادة SSL مجاني"
echo "- Auto deployment مع كل push"
echo ""

echo "📝 ملاحظات:"
echo "- استخدم VITE_ prefix للمتغيرات البيئية"
echo "- أضف Supabase إذا أردت قاعدة بيانات"
echo "- الملفات الحساسة .env.local مُحمية بالفعل"
