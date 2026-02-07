import React from 'react'

export function Table({ 
  columns, 
  data, 
  loading = false, 
  emptyMessage = 'لا توجد بيانات',
  className = '',
  ...props 
}) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="bg-white p-4 rounded-lg animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-lg font-medium mb-2">لا توجد بيانات</h3>
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-gray-200 ${className}`} {...props}>
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
              {columns.map((column) => (
                <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function TableActions({ actions, row }) {
  return (
    <div className="flex items-center gap-2">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={() => action.onClick(row)}
          className={`p-1 rounded-lg transition-colors ${
            action.variant === 'danger' 
              ? 'text-red-600 hover:bg-red-50' 
              : action.variant === 'success'
              ? 'text-green-600 hover:bg-green-50'
              : 'text-blue-600 hover:bg-blue-50'
          }`}
          title={action.title}
        >
          {action.icon}
        </button>
      ))}
    </div>
  )
}
