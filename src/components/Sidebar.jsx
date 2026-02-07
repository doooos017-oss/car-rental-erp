import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Car, Users, FileSignature, Wallet, ListChecks, Building2, MapPin, Wrench, BarChart3, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../store/authStore'

const items = [
  { to: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
  { to: '/fleet', label: 'أسطول السيارات', icon: Car },
  { to: '/customers', label: 'العملاء', icon: Users },
  { to: '/contracts', label: 'العقود', icon: FileSignature },
  { to: '/finance', label: 'المالية', icon: Wallet },
  { to: '/maintenance', label: 'الصيانة', icon: Wrench },
  { to: '/reports', label: 'التقارير', icon: BarChart3 },
  { to: '/tasks', label: 'المهام', icon: ListChecks },
  { to: '/branches', label: 'الفروع', icon: Building2 },
  { to: '/gps', label: 'تتبع GPS', icon: MapPin }
]

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 min-w-64 h-full sticky top-0 bg-white text-gray-700 border-r border-gray-200 shadow-sm">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-700 mb-6">نظام تأجير السيارات</h1>
          
          {/* User info */}
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="mr-3">
                <p className="text-sm font-medium text-gray-900">
                  {user?.displayName || 'مستخدم'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <nav className="px-3 space-y-1">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-700 font-semibold border-r-4 border-blue-700' : 'text-gray-600 hover:bg-gray-50'}`
                }
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
          
          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 mt-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>تسجيل الخروج</span>
          </button>
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="md:hidden fixed top-0 right-0 w-64 h-full bg-white text-gray-700 shadow-xl z-50">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold text-blue-700">نظام تأجير السيارات</h1>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* User info */}
              <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="mr-3">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.displayName || 'مستخدم'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <nav className="px-3 space-y-1">
              {items.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-blue-700 font-semibold border-r-4 border-blue-700' : 'text-gray-600 hover:bg-gray-50'}`
                    }
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </NavLink>
                )
              })}
              
              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 mt-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={20} />
                <span>تسجيل الخروج</span>
              </button>
            </nav>
          </aside>
        </>
      )}

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 z-30 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        {items.slice(0, 5).map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 p-2 rounded-md ${isActive ? 'text-blue-600' : 'text-gray-400'}`
              }
            >
              <Icon size={24} />
              <span className="text-[10px]">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
    </>
  )
}
