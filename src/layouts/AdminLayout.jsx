import Sidebar from '../components/Sidebar.jsx'
import Header from './Header.jsx'

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden" dir="rtl">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 pb-24 md:pb-6 scrollbar">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
