import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { LoadingSpinner } from './ui/LoadingSpinner.jsx'

export function ProtectedRoute({ children, requiredRole = null }) {
  const { user, isLoading } = useAuthStore()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="xl" />
      </div>
    )
  }

  if (!user) {
    // Redirect to login page with return URL
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check if user has required role
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to unauthorized page or dashboard
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export function AdminRoute({ children }) {
  return <ProtectedRoute requiredRole="admin">{children}</ProtectedRoute>
}

export function ManagerRoute({ children }) {
  return <ProtectedRoute requiredRole="manager">{children}</ProtectedRoute>
}

export function EmployeeRoute({ children }) {
  return <ProtectedRoute requiredRole="employee">{children}</ProtectedRoute>
}

export function CustomerRoute({ children }) {
  return <ProtectedRoute requiredRole="customer">{children}</ProtectedRoute>
}

export function RoleBasedRoute({ children, allowedRoles = [] }) {
  const { user } = useAuthStore()

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}
