import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, updateDoc, doc, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'
import { Card, CardHeader, CardContent } from '../components/ui/Card.jsx'
import { Search, Plus, Wrench, Calendar, AlertTriangle, CheckCircle, Clock, Car } from 'lucide-react'

export default function Maintenance() {
  const [maintenanceRecords, setMaintenanceRecords] = useState([])
  const [cars, setCars] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  const [formData, setFormData] = useState({
    carId: '',
    type: '',
    description: '',
    cost: '',
    scheduledDate: '',
    completedDate: '',
    status: 'scheduled',
    mechanic: '',
    notes: ''
  })

  useEffect(() => {
    fetchMaintenanceData()
  }, [])

  const fetchMaintenanceData = async () => {
    try {
      // Fetch maintenance records
      const maintenanceQuery = query(
        collection(db, 'maintenance'),
        orderBy('scheduledDate', 'desc')
      )
      const maintenanceSnapshot = await getDocs(maintenanceQuery)
      const maintenanceData = maintenanceSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }))
      setMaintenanceRecords(maintenanceData)

      // Fetch cars
      const carsSnapshot = await getDocs(collection(db, 'cars'))
      const carsData = carsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setCars(carsData)
    } catch (error) {
      console.error('Error fetching maintenance data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddMaintenance = async (e) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'maintenance'), {
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      setShowAddModal(false)
      setFormData({
        carId: '',
        type: '',
        description: '',
        cost: '',
        scheduledDate: '',
        completedDate: '',
        status: 'scheduled',
        mechanic: '',
        notes: ''
      })
      fetchMaintenanceData()
    } catch (error) {
      console.error('Error adding maintenance record:', error)
    }
  }

  const handleUpdateStatus = async (recordId, newStatus) => {
    try {
      await updateDoc(doc(db, 'maintenance', recordId), {
        status: newStatus,
        completedDate: newStatus === 'completed' ? new Date().toISOString() : null,
        updatedAt: new Date()
      })
      fetchMaintenanceData()
    } catch (error) {
      console.error('Error updating maintenance status:', error)
    }
  }

  const filteredRecords = maintenanceRecords.filter(record => {
    const car = cars.find(c => c.id === record.carId)
    const matchesSearch = car?.plate?.toLowerCase().includes(search.toLowerCase()) ||
                         car?.make?.toLowerCase().includes(search.toLowerCase()) ||
                         record.type?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusMap = {
    scheduled: { 
      label: 'مجدول', 
      color: 'bg-blue-100 text-blue-800',
      icon: Calendar
    },
    in_progress: { 
      label: 'قيد التنفيذ', 
      color: 'bg-yellow-100 text-yellow-800',
      icon: Clock
    },
    completed: { 
      label: 'مكتمل', 
      color: 'bg-green-100 text-green-800',
      icon: CheckCircle
    },
    overdue: { 
      label: 'متأخر', 
      color: 'bg-red-100 text-red-800',
      icon: AlertTriangle
    }
  }

  const maintenanceTypes = [
    'تغيير زيت',
    'صيانة دورية',
    'إطارات',
    'فرامل',
    'بطارية',
    'تكييف',
    'محرك',
    'نقل',
    'أخرى'
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">إدارة الصيانة</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          إضافة صيانة
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">إجمالي الصيانة</p>
                <p className="text-2xl font-bold text-gray-900">{maintenanceRecords.length}</p>
              </div>
              <Wrench className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">مجدولة</p>
                <p className="text-2xl font-bold text-blue-600">
                  {maintenanceRecords.filter(r => r.status === 'scheduled').length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">قيد التنفيذ</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {maintenanceRecords.filter(r => r.status === 'in_progress').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">مكتملة</p>
                <p className="text-2xl font-bold text-green-600">
                  {maintenanceRecords.filter(r => r.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-4 border-b border-gray-50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                className="w-full pr-10 pl-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="بحث بالسيارة أو نوع الصيانة..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
              />
            </div>
            <select 
              className="bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">جميع الحالات</option>
              <option value="scheduled">مجدول</option>
              <option value="in_progress">قيد التنفيذ</option>
              <option value="completed">مكتمل</option>
              <option value="overdue">متأخر</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-right font-medium text-gray-500">السيارة</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">نوع الصيانة</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">التاريخ المجدول</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">الحالة</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">التكلفة</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">الفني</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredRecords.map(record => {
                const car = cars.find(c => c.id === record.carId)
                const StatusIcon = statusMap[record.status]?.icon || Calendar
                
                return (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">{car?.plate}</div>
                          <div className="text-xs text-gray-500">{car?.make} {car?.model}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{record.type}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {record.scheduledDate ? new Date(record.scheduledDate).toLocaleDateString('ar-SA') : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusMap[record.status]?.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusMap[record.status]?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      {record.cost ? `ريال ${record.cost}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{record.mechanic || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {record.status === 'scheduled' && (
                          <button
                            onClick={() => handleUpdateStatus(record.id, 'in_progress')}
                            className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            بدء
                          </button>
                        )}
                        {record.status === 'in_progress' && (
                          <button
                            onClick={() => handleUpdateStatus(record.id, 'completed')}
                            className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            إكمال
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Maintenance Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">إضافة صيانة جديدة</h2>
            </div>
            <form onSubmit={handleAddMaintenance} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">السيارة</label>
                  <select
                    required
                    value={formData.carId}
                    onChange={e => setFormData({...formData, carId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">اختر السيارة</option>
                    {cars.map(car => (
                      <option key={car.id} value={car.id}>
                        {car.plate} - {car.make} {car.model}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نوع الصيانة</label>
                  <select
                    required
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">اختر النوع</option>
                    {maintenanceTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">التاريخ المجدول</label>
                  <input
                    type="date"
                    required
                    value={formData.scheduledDate}
                    onChange={e => setFormData({...formData, scheduledDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">التكلفة (ريال)</label>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={e => setFormData({...formData, cost: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الفني</label>
                  <input
                    type="text"
                    value={formData.mechanic}
                    onChange={e => setFormData({...formData, mechanic: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="scheduled">مجدول</option>
                    <option value="in_progress">قيد التنفيذ</option>
                    <option value="completed">مكتمل</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setFormData({
                      carId: '',
                      type: '',
                      description: '',
                      cost: '',
                      scheduledDate: '',
                      completedDate: '',
                      status: 'scheduled',
                      mechanic: '',
                      notes: ''
                    })
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  إضافة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
