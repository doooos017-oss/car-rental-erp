import { useERP } from '../store/store.js'

const columns = ['Car Prep', 'Cleaning', 'Maintenance']
const colMap = { 'Car Prep': 'تجهيز السيارة', 'Cleaning': 'تنظيف', 'Maintenance': 'صيانة' }

export default function Tasks() {
  const { tasks, cars, employees, completeTask, assignTask } = useERP()
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">المهام</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map(col => (
          <div key={col} className="bg-gray-800 rounded-md p-4">
            <div className="text-lg mb-2">{colMap[col]}</div>
            <div className="space-y-2">
              {tasks.filter(t => t.type === col).map(t => (
                <div key={t.id} className="bg-gray-900 rounded-md p-3">
                  <div className="font-medium">{t.title === 'Car Prep' ? 'تجهيز السيارة' : t.title}</div>
                  <div className="text-xs text-gray-400 mb-2">{cars.find(c => c.id === t.carId)?.plate}</div>
                  
                  <div className="mb-2">
                    <select 
                      className="w-full bg-gray-800 text-xs px-2 py-1 rounded border border-gray-700"
                      value={t.employeeId || ''}
                      onChange={(e) => assignTask(t.id, Number(e.target.value))}
                    >
                      <option value="">تعيين موظف...</option>
                      {employees.map(e => (
                        <option key={e.id} value={e.id}>{e.name} - {e.role}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs">{t.status === 'Todo' ? 'قيد التنفيذ' : 'مكتمل'}</span>
                    <button className="px-3 py-1 bg-green-600 rounded-md text-xs" onClick={() => completeTask(t.id)}>إكمال</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
