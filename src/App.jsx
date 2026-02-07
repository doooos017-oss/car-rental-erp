import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { useEffect } from 'react'
import { ErrorBoundary } from './components/ErrorBoundary.jsx'
import { ProtectedRoute, AdminRoute, ManagerRoute, EmployeeRoute, CustomerRoute } from './components/ProtectedRoute.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Fleet from './pages/Fleet.jsx'
import Customers from './pages/Customers.jsx'
import Contracts from './pages/Contracts.jsx'
import Finance from './pages/Finance.jsx'
import Tasks from './pages/Tasks.jsx'
import Branches from './pages/Branches.jsx'
import GPS from './pages/GPS.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Maintenance from './pages/Maintenance.jsx'
import Reports from './pages/Reports.jsx'
import Unauthorized from './pages/Unauthorized.jsx'
import NotFound from './pages/NotFound.jsx'

function AuthRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthStore()
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />
}

export default function App() {
  const { initializeAuth } = useAuthStore()
  
  useEffect(() => {
    const unsubscribe = initializeAuth()
    return () => unsubscribe()
  }, [initializeAuth])

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/login" element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        } />
        <Route path="/register" element={
          <AuthRoute>
            <Register />
          </AuthRoute>
        } />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="/" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="fleet" element={<Fleet />} />
          <Route path="customers" element={<Customers />} />
          <Route path="contracts" element={<Contracts />} />
          <Route path="finance" element={<Finance />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="reports" element={<Reports />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="branches" element={<Branches />} />
          <Route path="gps" element={<GPS />} />
        </Route>
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </ErrorBoundary>
  )
}
