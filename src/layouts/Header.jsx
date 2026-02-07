import { Bell, Search, User, Settings, LogOut } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export default function Header() {
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10" dir="rtl">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md hidden lg:block">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="بحث عام..." 
            className="w-full pr-10 pl-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 left-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Settings size={20} />
        </button>
        
        <div className="flex items-center gap-3 pr-2 border-r border-gray-100">
          <div className="text-left hidden md:block">
            <div className="text-sm font-semibold text-gray-800">
              {user?.displayName || 'مستخدم'}
            </div>
            <div className="text-xs text-gray-500">
              {user?.email}
            </div>
          </div>
          <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center border border-blue-200">
            {user?.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User size={20} />
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
