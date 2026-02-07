// Date utilities
export const formatDate = (date, locale = 'ar-SA') => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString(locale)
}

export const formatDateTime = (date, locale = 'ar-SA') => {
  if (!date) return '-'
  return new Date(date).toLocaleString(locale)
}

export const formatTime = (date, locale = 'ar-SA') => {
  if (!date) return '-'
  return new Date(date).toLocaleTimeString(locale, { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// Number utilities
export const formatCurrency = (amount, currency = 'ريال') => {
  if (!amount) return `${currency} 0`
  return `${currency} ${parseFloat(amount).toLocaleString('ar-SA')}`
}

export const formatNumber = (number) => {
  if (!number) return '0'
  return parseFloat(number).toLocaleString('ar-SA')
}

// String utilities
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '-'
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9)
}

// Validation utilities
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePhone = (phone) => {
  const re = /^05\d{8}$/
  return re.test(phone)
}

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0
}

// File utilities
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2)
}

// Status utilities
export const getStatusColor = (status) => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
    expired: 'bg-red-100 text-red-800',
    maintenance: 'bg-orange-100 text-orange-800',
    reserved: 'bg-purple-100 text-purple-800',
    available: 'bg-green-100 text-green-800',
    rented: 'bg-blue-100 text-blue-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export const getStatusLabel = (status, type = 'general') => {
  const labels = {
    general: {
      active: 'نشط',
      inactive: 'غير نشط',
      pending: 'معلق',
      completed: 'مكتمل',
      cancelled: 'ملغي',
      expired: 'منتهي'
    },
    contract: {
      draft: 'مسودة',
      active: 'نشط',
      expired: 'منتهي',
      cancelled: 'ملغي'
    },
    payment: {
      pending: 'معلق',
      paid: 'مدفوع',
      overdue: 'متأخر',
      cancelled: 'ملغي'
    },
    vehicle: {
      available: 'متاح',
      rented: 'مؤجر',
      maintenance: 'صيانة',
      reserved: 'محجوز'
    },
    maintenance: {
      scheduled: 'مجدول',
      in_progress: 'قيد التنفيذ',
      completed: 'مكتمل',
      cancelled: 'ملغي'
    }
  }
  return labels[type]?.[status] || labels.general[status] || status
}

// Calculation utilities
export const calculateDaysBetween = (startDate, endDate) => {
  if (!startDate || !endDate) return 0
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end - start)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export const calculateTotal = (dailyRate, days) => {
  if (!dailyRate || !days) return 0
  return parseFloat(dailyRate) * parseInt(days)
}

export const calculateVAT = (amount, vatRate = 0.15) => {
  if (!amount) return 0
  return parseFloat(amount) * vatRate
}

export const calculateTotalWithVAT = (amount, vatRate = 0.15) => {
  if (!amount) return 0
  const vat = calculateVAT(amount, vatRate)
  return parseFloat(amount) + vat
}

// Array utilities
export const sortByDate = (array, dateField = 'createdAt', order = 'desc') => {
  return [...array].sort((a, b) => {
    const dateA = new Date(a[dateField])
    const dateB = new Date(b[dateField])
    return order === 'desc' ? dateB - dateA : dateA - dateB
  })
}

export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key]
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {})
}

export const unique = (array, key) => {
  return [...new Map(array.map(item => [item[key], item])).values()]
}

// URL utilities
export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value)
    }
  })
  return searchParams.toString()
}

export const parseQueryString = (queryString) => {
  const params = new URLSearchParams(queryString)
  const result = {}
  for (const [key, value] of params.entries()) {
    result[key] = value
  }
  return result
}

// Error handling
export const getErrorMessage = (error) => {
  if (error?.message) return error.message
  if (typeof error === 'string') return error
  return 'حدث خطأ غير متوقع'
}

export const handleAsyncError = (error) => {
  console.error('Async Error:', error)
  return {
    success: false,
    error: getErrorMessage(error)
  }
}

// Local storage utilities
export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

export const getLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return defaultValue
  }
}

export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing from localStorage:', error)
  }
}

// Debounce utility
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
