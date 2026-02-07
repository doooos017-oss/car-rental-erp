import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-6">🔍</div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          404
        </h1>
        
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          الصفحة غير موجودة
        </h2>
        
        <p className="text-gray-600 mb-8">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
          يرجى التحقق من الرابط أو استخدام البحث للعثور على ما تبحث عنه.
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
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            العودة إلى الصفحة السابقة
          </button>
        </div>
        
        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            صفحات سريعة:
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded text-right"
            >
              لوحة التحكم
            </button>
            <button
              onClick={() => navigate('/fleet')}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded text-right"
            >
              إدارة الأسطول
            </button>
            <button
              onClick={() => navigate('/contracts')}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded text-right"
            >
              العقود
            </button>
            <button
              onClick={() => navigate('/customers')}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded text-right"
            >
              العملاء
            </button>
            <button
              onClick={() => navigate('/maintenance')}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded text-right"
            >
              الصيانة
            </button>
            <button
              onClick={() => navigate('/finance')}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded text-right"
            >
              المالية
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
