import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Home } from 'lucide-react'

export default function Unauthorized() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <Shield className="w-8 h-8 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          غير مصرح بالوصول
        </h1>
        
        <p className="text-gray-600 mb-8">
          عذراً، ليس لديك الصلاحيات الكافية للوصول إلى هذه الصفحة.
          يرجى التواصل مع المسؤول إذا كنت تعتقد أن هذا خطأ.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            العودة إلى لوحة التحكم
          </button>
          
          <button
            onClick={() => navigate(-1)}
            className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            العودة إلى الصفحة السابقة
          </button>
        </div>
        
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            مستويات الصلاحيات:
          </h3>
          <div className="text-xs text-gray-600 space-y-1 text-right">
            <div><strong>المدير:</strong> صلاحية كاملة على النظام</div>
            <div><strong>المدير:</strong> إدارة العمليات اليومية</div>
            <div><strong>الموظف:</strong> الوصول إلى المهام الأساسية</div>
            <div><strong>العميل:</strong> عرض الحجوزات والمعاملات</div>
          </div>
        </div>
      </div>
    </div>
  )
}
