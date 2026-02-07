import React from 'react'
import { Search, Filter, X } from 'lucide-react'

export function SearchInput({ 
  value, 
  onChange, 
  placeholder = 'بحث...', 
  className = '',
  ...props 
}) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        {...props}
      />
    </div>
  )
}

export function FilterDropdown({ 
  options, 
  value, 
  onChange, 
  placeholder = 'الكل',
  className = '',
  ...props 
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      {...props}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export function DateFilter({ 
  value, 
  onChange, 
  placeholder = 'اختر التاريخ',
  className = '',
  ...props 
}) {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      {...props}
    />
  )
}

export function FilterBar({ 
  searchValue, 
  onSearchChange, 
  filters, 
  onClearFilters,
  className = '',
  children 
}) {
  const hasActiveFilters = filters?.some(filter => filter.value) || searchValue

  return (
    <div className={`bg-white p-4 rounded-lg border border-gray-200 ${className}`}>
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="flex-1">
          <SearchInput
            value={searchValue}
            onChange={onSearchChange}
            placeholder="بحث..."
          />
        </div>
        
        <div className="flex flex-wrap gap-3 items-center">
          {children}
          
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4" />
              مسح الفلاتر
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function StatusFilter({ 
  value, 
  onChange, 
  options,
  className = '',
  ...props 
}) {
  const statusOptions = [
    { value: '', label: 'الكل' },
    ...options
  ]

  return (
    <FilterDropdown
      options={statusOptions}
      value={value}
      onChange={onChange}
      className={className}
      {...props}
    />
  )
}
