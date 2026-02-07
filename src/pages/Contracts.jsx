import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'
import { Card, CardHeader, CardContent } from '../components/ui/Card.jsx'
import { Search, Plus, FileText, Edit, Trash2, Eye, Calendar, Car, User, DollarSign, CheckCircle, Clock, AlertCircle } from 'lucide-react'

export default function Contracts() {
  const [contracts, setContracts] = useState([])
  const [cars, setCars] = useState([])
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedContract, setSelectedContract] = useState(null)

  const [formData, setFormData] = useState({
    customerId: '',
    carId: '',
    startDate: '',
    endDate: '',
    dailyRate: '',
    totalAmount: '',
    deposit: '',
    status: 'draft',
    paymentStatus: 'pending',
    notes: '',
    terms: ''
  })

  useEffect(() => {
    fetchContractsData()
  }, [])

  const fetchContractsData = async () => {
    try {
      // Fetch contracts
      const contractsQuery = query(
        collection(db, 'contracts'),
        orderBy('createdAt', 'desc')
      )
      const contractsSnapshot = await getDocs(contractsQuery)
      const contractsData = contractsSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }))
      setContracts(contractsData)

      // Fetch cars
      const carsSnapshot = await getDocs(collection(db, 'cars'))
      const carsData = carsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setCars(carsData)

      // Fetch customers
      const customersSnapshot = await getDocs(collection(db, 'customers'))
      const customersData = customersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setCustomers(customersData)
    } catch (error) {
      console.error('Error fetching contracts data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddContract = async (e) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'contracts'), {
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      setShowAddModal(false)
      setFormData({
        customerId: '',
        carId: '',
        startDate: '',
        endDate: '',
        dailyRate: '',
        totalAmount: '',
        deposit: '',
        status: 'draft',
        paymentStatus: 'pending',
        notes: '',
        terms: ''
      })
      fetchContractsData()
    } catch (error) {
      console.error('Error adding contract:', error)
    }
  }

  const handleUpdateStatus = async (contractId, newStatus) => {
    try {
      await updateDoc(doc(db, 'contracts', contractId), {
        status: newStatus,
        updatedAt: new Date()
      })
      fetchContractsData()
    } catch (error) {
      console.error('Error updating contract status:', error)
    }
  }

  const handleDeleteContract = async (contractId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العقد؟')) {
      try {
        await deleteDoc(doc(db, 'contracts', contractId))
        fetchContractsData()
      } catch (error) {
        console.error('Error deleting contract:', error)
      }
    }
  }

  const calculateTotalAmount = (dailyRate, startDate, endDate) => {
    if (!dailyRate || !startDate || !endDate) return 0
    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    return days * parseFloat(dailyRate)
  }

  useEffect(() => {
    const total = calculateTotalAmount(formData.dailyRate, formData.startDate, formData.endDate)
    setFormData(prev => ({ ...prev, totalAmount: total.toString() }))
  }, [formData.dailyRate, formData.startDate, formData.endDate])

  const filteredContracts = contracts.filter(contract => {
    const customer = customers.find(c => c.id === contract.customerId)
    const car = cars.find(c => c.id === contract.carId)
    const matchesSearch = customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
                         car?.plate?.toLowerCase().includes(search.toLowerCase()) ||
                         contract.id?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || contract.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusMap = {
    draft: { 
      label: 'مسودة', 
      color: 'bg-gray-100 text-gray-800',
      icon: FileText
    },
    active: { 
      label: 'نشط', 
      color: 'bg-green-100 text-green-800',
      icon: CheckCircle
    },
    expired: { 
      label: 'منتهي', 
      color: 'bg-red-100 text-red-800',
      icon: AlertCircle
    },
    cancelled: { 
      label: 'ملغي', 
      color: 'bg-red-100 text-red-800',
      icon: AlertCircle
    },
    pending: { 
      label: 'معلق', 
      color: 'bg-yellow-100 text-yellow-800',
      icon: Clock
    }
  }

  const paymentStatusMap = {
    pending: { label: 'معلق', color: 'bg-yellow-100 text-yellow-800' },
    paid: { label: 'مدفوع', color: 'bg-green-100 text-green-800' },
    overdue: { label: 'متأخر', color: 'bg-red-100 text-red-800' },
    partial: { label: 'مدفوع جزئياً', color: 'bg-blue-100 text-blue-800' }
  }

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
        <h1 className="text-2xl font-bold text-gray-800">إدارة العقود</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          إضافة عقد
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">إجمالي العقود</p>
                <p className="text-2xl font-bold text-gray-900">{contracts.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">عقود نشطة</p>
                <p className="text-2xl font-bold text-green-600">
                  {contracts.filter(c => c.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">مدفوعات معلقة</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {contracts.filter(c => c.paymentStatus === 'pending').length}
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
                <p className="text-sm text-gray-500">القيمة الإجمالية</p>
                <p className="text-2xl font-bold text-blue-600">
                  ريال {contracts.reduce((sum, c) => sum + (parseFloat(c.totalAmount) || 0), 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
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
                placeholder="بحث بالعميل أو السيارة..." 
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
              <option value="draft">مسودة</option>
              <option value="active">نشط</option>
              <option value="expired">منتهي</option>
              <option value="cancelled">ملغي</option>
              <option value="pending">معلق</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-right font-medium text-gray-500">رقم العقد</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">العميل</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">السيارة</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">الفترة</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">المبلغ الإجمالي</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">الحالة</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">المدفوعات</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredContracts.map(contract => {
                const customer = customers.find(c => c.id === contract.customerId)
                const car = cars.find(c => c.id === contract.carId)
                const StatusIcon = statusMap[contract.status]?.icon || FileText
                
                return (
                  <tr key={contract.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      #{contract.id?.slice(-6) || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">{customer?.name || 'عميل غير محدد'}</div>
                          <div className="text-xs text-gray-500">{customer?.phone || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">{car?.plate || 'سيارة غير محددة'}</div>
                          <div className="text-xs text-gray-500">{car?.make} {car?.model}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="text-xs">
                        <div>من: {contract.startDate ? new Date(contract.startDate).toLocaleDateString('ar-SA') : '-'}</div>
                        <div>إلى: {contract.endDate ? new Date(contract.endDate).toLocaleDateString('ar-SA') : '-'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      ريال {contract.totalAmount ? parseFloat(contract.totalAmount).toLocaleString() : 0}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusMap[contract.status]?.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusMap[contract.status]?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${paymentStatusMap[contract.paymentStatus]?.color}`}>
                        {paymentStatusMap[contract.paymentStatus]?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedContract(contract)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedContract(contract)
                            setFormData(contract)
                            setShowAddModal(true)
                          }}
                          className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {contract.status === 'draft' && (
                          <button
                            onClick={() => handleDeleteContract(contract.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Add/Edit Contract Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedContract ? 'تعديل عقد' : 'إضافة عقد جديد'}
              </h2>
            </div>
            <form onSubmit={handleAddContract} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">العميل</label>
                  <select
                    required
                    value={formData.customerId}
                    onChange={e => setFormData({...formData, customerId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">اختر العميل</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} - {customer.phone}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">السيارة</label>
                  <select
                    required
                    value={formData.carId}
                    onChange={e => setFormData({...formData, carId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">اختر السيارة</option>
                    {cars.filter(car => car.status === 'available').map(car => (
                      <option key={car.id} value={car.id}>
                        {car.plate} - {car.make} {car.model}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ البدء</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={e => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الانتهاء</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={e => setFormData({...formData, endDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">السعر اليومي (ريال)</label>
                  <input
                    type="number"
                    required
                    value={formData.dailyRate}
                    onChange={e => setFormData({...formData, dailyRate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">التأمين (ريال)</label>
                  <input
                    type="number"
                    value={formData.deposit}
                    onChange={e => setFormData({...formData, deposit: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">المبلغ الإجمالي (ريال)</label>
                  <input
                    type="number"
                    value={formData.totalAmount}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">حالة العقد</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="draft">مسودة</option>
                    <option value="active">نشط</option>
                    <option value="expired">منتهي</option>
                    <option value="cancelled">ملغي</option>
                    <option value="pending">معلق</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">حالة الدفع</label>
                  <select
                    value={formData.paymentStatus}
                    onChange={e => setFormData({...formData, paymentStatus: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">معلق</option>
                    <option value="paid">مدفوع</option>
                    <option value="overdue">متأخر</option>
                    <option value="partial">مدفوع جزئياً</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ملاحظات</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الشروط والأحكام</label>
                <textarea
                  rows={4}
                  value={formData.terms}
                  onChange={e => setFormData({...formData, terms: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="أدخل شروط وأحكام العقد..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setSelectedContract(null)
                    setFormData({
                      customerId: '',
                      carId: '',
                      startDate: '',
                      endDate: '',
                      dailyRate: '',
                      totalAmount: '',
                      deposit: '',
                      status: 'draft',
                      paymentStatus: 'pending',
                      notes: '',
                      terms: ''
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
                  {selectedContract ? 'تحديث' : 'إضافة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
