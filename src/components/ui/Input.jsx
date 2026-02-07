import React from 'react'

export function Input({ 
  label, 
  error, 
  helperText, 
  icon: Icon,
  className = '',
  containerClassName = '',
  ...props 
}) {
  const inputClasses = `
    w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}
    ${Icon ? 'pr-10' : ''}
    ${className}
  `

  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={inputClasses}
          {...props}
        />
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}

export function Select({ 
  label, 
  error, 
  helperText, 
  options,
  placeholder = 'اختر...',
  className = '',
  containerClassName = '',
  ...props 
}) {
  const selectClasses = `
    w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}
    ${className}
  `

  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        className={selectClasses}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}

export function Textarea({ 
  label, 
  error, 
  helperText, 
  rows = 3,
  className = '',
  containerClassName = '',
  ...props 
}) {
  const textareaClasses = `
    w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical
    ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}
    ${className}
  `

  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        className={textareaClasses}
        rows={rows}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}

export function Checkbox({ 
  label, 
  error, 
  helperText, 
  className = '',
  containerClassName = '',
  ...props 
}) {
  const checkboxClasses = `
    w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500
    ${error ? 'border-red-300 focus:ring-red-500' : ''}
    ${className}
  `

  return (
    <div className={`space-y-1 ${containerClassName}`}>
      <div className="flex items-center">
        <input
          type="checkbox"
          className={checkboxClasses}
          {...props}
        />
        {label && (
          <label className="mr-2 text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}
