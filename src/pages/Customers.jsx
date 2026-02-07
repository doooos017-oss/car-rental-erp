import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'
import { Card, CardHeader, CardContent } from '../components/ui/Card.jsx'
import { Search, Plus, User, Phone, Mail, MapPin, Edit, Trash2, Eye, Calendar, FileText } from 'lucide-react'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [customerStats, setCustomerStats] = useState({
    total: 0,
    active: 0,
    newThisMonth: 0,
    vip: 0
  })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    nationalId: '',
    address: '',
    licenseNumber: '',
    licenseExpiry: '',
    dateOfBirth: '',
    emergencyContact: '',
    emergencyPhone: '',
    notes: '',
    status: 'active',
    type: 'individual'
  })

  useEffect(() => {
    fetchCustomersData()
  }, [])

  const fetchCustomersData = async () => {
    try {
      const customersQuery = query(
        collection(db, 'customers'),
        orderBy('createdAt', 'desc')
      )
      const customersSnapshot = await getDocs(customersQuery)
      const customersData = customersSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }))
      setCustomers(customersData)

      // Calculate stats
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      
      setCustomerStats({
        total: customersData.length,
        active: customersData.filter(c => c.status === 'active').length,
        newThisMonth: customersData.filter(c => {
          const createdAt = c.createdAt?.toDate ? c.createdAt.toDate() : new Date(c.createdAt)
          return createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear
        }).length,
        vip: customersData.filter(c => c.type === 'vip').length
      })
    } catch (error) {
      console.error('Error fetching customers data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCustomer = async (e) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'customers'), {
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      setShowAddModal(false)
      setFormData({
        name: '',
        email: '',
        phone: '',
        nationalId: '',
        address: '',
        licenseNumber: '',
        licenseExpiry: '',
        dateOfBirth: '',
        emergencyContact: '',
        emergencyPhone: '',
        notes: '',
        status: 'active',
        type: 'individual'
      })
      fetchCustomersData()
    } catch (error) {
      console.error('Error adding customer:', error)
    }
  }

  const handleUpdateCustomer = async (customerId, updates) => {
    try {
      await updateDoc(doc(db, 'customers', customerId), {
        ...updates,
        updatedAt: new Date()
      })
      fetchCustomersData()
    } catch (error) {
      console.error('Error updating customer:', error)
    }
  }

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العميل؟')) {
      try {
        await deleteDoc(doc(db, 'customers', customerId))
        fetchCustomersData()
      } catch (error) {
        console.error('Error deleting customer:', error)
      }
    }
  }

  const filteredCustomers = customers.filter(customer => 
    customer.name?.toLowerCase().includes(search.toLowerCase()) ||
    customer.email?.toLowerCase().includes(search.toLowerCase()) ||
    customer.phone?.includes(search) ||
    customer.nationalId?.includes(search)
  )

  const statusMap = {
    active: { label: 'نشط', color: 'bg-green-100 text-green-800' },
    inactive: { label: 'غير نشط', color: 'bg-gray-100 text-gray-800' },
    suspended: { label: 'موقوف', color: 'bg-red-100 text-red-800' },
    vip: { label: 'VIP', color: 'bg-purple-100 text-purple-800' }
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
        <h1 className="text-2xl font-bold text-gray-800">إدارة العملاء</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          إضافة عميل
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">إجمالي العملاء</p>
                <p className="text-2xl font-bold text-gray-900">{customerStats.total}</p>
              </div>
              <User className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">عملاء نشطون</p>
                <p className="text-2xl font-bold text-green-600">{customerStats.active}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">جدد هذا الشهر</p>
                <p className="text-2xl font-bold text-blue-600">{customerStats.newThisMonth}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">عملاء VIP</p>
                <p className="text-2xl font-bold text-purple-600">{customerStats.vip}</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-sm">★</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-4 border-b border-gray-50">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              className="w-full pr-10 pl-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="بحث بالاسم، البريد الإلكتروني، أو الهاتف..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-right font-medium text-gray-500">الاسم</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">معلومات الاتصال</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">رقم الهوية</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">النوع</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">الحالة</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCustomers.map(customer => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                        {customer.name?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{customer.name}</div>
                        <div className="text-xs text-gray-500">العميل رقم #{customer.id?.slice(-6) || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {customer.email && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Mail className="w-3 h-3" />
                          {customer.email}
                        </div>
                      )}
                      {customer.phone && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Phone className="w-3 h-3" />
                          {customer.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{customer.nationalId || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      customer.type === 'vip' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {customer.type === 'vip' ? 'VIP' : 'فردي'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusMap[customer.status]?.color}`}>
                      {statusMap[customer.status]?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCustomer(customer)
                          setFormData(customer)
                          setShowAddModal(true)
                        }}
                        className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(customer.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedCustomer ? 'تعديل عميل' : 'إضافة عميل جديد'}
              </h2>
            </div>
            <form onSubmit={handleAddCustomer} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهوية</label>
                  <input
                    type="text"
                    value={formData.nationalId}
                    onChange={e => setFormData({...formData, nationalId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رقم الرخصة</label>
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={e => setFormData({...formData, licenseNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ انتهاء الرخصة</label>
                  <input
                    type="date"
                    value={formData.licenseExpiry}
                    onChange={e => setFormData({...formData, licenseExpiry: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الميلاد</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={e => setFormData({...formData, dateOfBirth: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الجهة الطارئة</label>
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={e => setFormData({...formData, emergencyContact: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">هاتف الطارئ</label>
                  <input
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={e => setFormData({...formData, emergencyPhone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">نوع العميل</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="individual">فردي</option>
                    <option value="corporate">شركة</option>
                    <option value="vip">VIP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                    <option value="suspended">موقوف</option>
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
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setSelectedCustomer(null)
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      nationalId: '',
                      address: '',
                      licenseNumber: '',
                      licenseExpiry: '',
                      dateOfBirth: '',
                      emergencyContact: '',
                      emergencyPhone: '',
                      notes: '',
                      status: 'active',
                      type: 'individual'
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
                  {selectedCustomer ? 'تحديث' : 'إضافة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Details Modal */}
      {selectedCustomer && !showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">تفاصيل العميل</h2>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">المعلومات الأساسية</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-500">الاسم:</span> {selectedCustomer.name}</div>
                    <div><span className="text-gray-500">البريد:</span> {selectedCustomer.email || '-'}</div>
                    <div><span className="text-gray-500">الهاتف:</span> {selectedCustomer.phone}</div>
                    <div><span className="text-gray-500">الهوية:</span> {selectedCustomer.nationalId || '-'}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">معلومات إضافية</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-500">العنوان:</span> {selectedCustomer.address || '-'}</div>
                    <div><span className="text-gray-500">النوع:</span> 
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        selectedCustomer.type === 'vip' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedCustomer.type === 'vip' ? 'VIP' : 'فردي'}
                      </span>
                    </div>
                    <div><span className="text-gray-500">الحالة:</span> 
                      <span className={`px-2 py-1 rounded-full text-xs ${statusMap[selectedCustomer.status]?.color}`}>
                        {statusMap[selectedCustomer.status]?.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {selectedCustomer.notes && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">ملاحظات</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {selectedCustomer.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
