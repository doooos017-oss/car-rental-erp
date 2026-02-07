import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase/config'
import { Card, CardHeader, CardContent } from '../components/ui/Card.jsx'
import { Badge } from '../components/ui/Badge.jsx'
import { Search, Filter, Plus, Edit, Trash2, Eye, Car, MapPin, Calendar, DollarSign } from 'lucide-react'

export default function Fleet() {
  const [cars, setCars] = useState([])
  const [branches, setBranches] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [branchFilter, setBranchFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedCar, setSelectedCar] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const [formData, setFormData] = useState({
    plate: '',
    make: '',
    model: '',
    year: '',
    color: '',
    status: 'available',
    branchId: '',
    dailyRate: '',
    mileage: '',
    vin: '',
    insuranceExpiry: '',
    registrationExpiry: '',
    lastMaintenance: '',
    nextMaintenance: ''
  })

  useEffect(() => {
    fetchFleetData()
  }, [])

  const fetchFleetData = async () => {
    try {
      // Fetch cars
      const carsSnapshot = await getDocs(collection(db, 'cars'))
      const carsData = carsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setCars(carsData)

      // Fetch branches
      const branchesSnapshot = await getDocs(collection(db, 'branches'))
      const branchesData = branchesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setBranches(branchesData)
    } catch (error) {
      console.error('Error fetching fleet data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCar = async (e) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'cars'), {
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      setShowAddModal(false)
      setFormData({
        plate: '',
        make: '',
        model: '',
        year: '',
        color: '',
        status: 'available',
        branchId: '',
        dailyRate: '',
        mileage: '',
        vin: '',
        insuranceExpiry: '',
        registrationExpiry: '',
        lastMaintenance: '',
        nextMaintenance: ''
      })
      fetchFleetData()
    } catch (error) {
      console.error('Error adding car:', error)
    }
  }

  const handleUpdateCarStatus = async (carId, newStatus) => {
    try {
      await updateDoc(doc(db, 'cars', carId), {
        status: newStatus,
        updatedAt: new Date()
      })
      fetchFleetData()
    } catch (error) {
      console.error('Error updating car status:', error)
    }
  }

  const handleDeleteCar = async (carId) => {
    if (window.confirm('هل أنت متأكد من حذف هذه السيارة؟')) {
      try {
        await deleteDoc(doc(db, 'cars', carId))
        fetchFleetData()
      } catch (error) {
        console.error('Error deleting car:', error)
      }
    }
  }

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.plate?.toLowerCase().includes(search.toLowerCase()) ||
                         car.model?.toLowerCase().includes(search.toLowerCase()) ||
                         car.make?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || car.status === statusFilter
    const matchesBranch = branchFilter === 'all' || car.branchId === branchFilter
    return matchesSearch && matchesStatus && matchesBranch
  })

  const statusMap = {
    available: { label: 'متاح', variant: 'success', color: 'bg-green-100 text-green-800' },
    rented: { label: 'مؤجر', variant: 'info', color: 'bg-blue-100 text-blue-800' },
    maintenance: { label: 'صيانة', variant: 'danger', color: 'bg-red-100 text-red-800' },
    reserved: { label: 'محجوز', variant: 'warning', color: 'bg-yellow-100 text-yellow-800' }
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
        <h1 className="text-2xl font-bold text-gray-800">إدارة الأسطول</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          إضافة سيارة
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">إجمالي السيارات</p>
                <p className="text-2xl font-bold text-gray-900">{cars.length}</p>
              </div>
              <Car className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">سيارات متاحة</p>
                <p className="text-2xl font-bold text-green-600">
                  {cars.filter(c => c.status === 'available').length}
                </p>
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
                <p className="text-sm text-gray-500">سيارات مؤجرة</p>
                <p className="text-2xl font-bold text-blue-600">
                  {cars.filter(c => c.status === 'rented').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">🚗</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">تحت الصيانة</p>
                <p className="text-2xl font-bold text-red-600">
                  {cars.filter(c => c.status === 'maintenance').length}
                </p>
              </div>
              <Wrench className="w-8 h-8 text-red-600" />
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
                placeholder="بحث باللوحة أو الموديل..." 
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
              <option value="available">متاح</option>
              <option value="rented">مؤجر</option>
              <option value="maintenance">صيانة</option>
              <option value="reserved">محجوز</option>
            </select>
            <select 
              className="bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
              value={branchFilter} 
              onChange={e => setBranchFilter(e.target.value)}
            >
              <option value="all">كل الفروع</option>
              {branches.map(branch => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-right font-medium text-gray-500">رقم اللوحة</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">الموديل</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">السنة</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">الحالة</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">الفرع</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">السعر اليومي</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCars.map(car => (
                <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{car.plate}</td>
                  <td className="px-6 py-4 text-gray-600">{car.make} {car.model}</td>
                  <td className="px-6 py-4 text-gray-600">{car.year}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusMap[car.status]?.color}`}>
                      {statusMap[car.status]?.label || car.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {branches.find(b => b.id === car.branchId)?.name || '-'}
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-medium">
                    ريال {car.dailyRate || 0}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedCar(car)
                          setShowDetailsModal(true)
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCar(car)
                          setFormData(car)
                          setShowAddModal(true)
                        }}
                        className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCar(car.id)}
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

      {/* Add/Edit Car Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedCar ? 'تعديل سيارة' : 'إضافة سيارة جديدة'}
              </h2>
            </div>
            <form onSubmit={handleAddCar} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رقم اللوحة</label>
                  <input
                    type="text"
                    required
                    value={formData.plate}
                    onChange={e => setFormData({...formData, plate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الشركة المصنعة</label>
                  <input
                    type="text"
                    required
                    value={formData.make}
                    onChange={e => setFormData({...formData, make: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الموديل</label>
                  <input
                    type="text"
                    required
                    value={formData.model}
                    onChange={e => setFormData({...formData, model: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">السنة</label>
                  <input
                    type="number"
                    required
                    value={formData.year}
                    onChange={e => setFormData({...formData, year: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">اللون</label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={e => setFormData({...formData, color: e.target.value})}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">المسافة المقطوعة (كم)</label>
                  <input
                    type="number"
                    value={formData.mileage}
                    onChange={e => setFormData({...formData, mileage: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">رقم VIN</label>
                  <input
                    type="text"
                    value={formData.vin}
                    onChange={e => setFormData({...formData, vin: e.target.value})}
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
                    <option value="available">متاح</option>
                    <option value="rented">مؤجر</option>
                    <option value="maintenance">صيانة</option>
                    <option value="reserved">محجوز</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الفرع</label>
                  <select
                    value={formData.branchId}
                    onChange={e => setFormData({...formData, branchId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">اختر الفرع</option>
                    {branches.map(branch => (
                      <option key={branch.id} value={branch.id}>{branch.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setSelectedCar(null)
                    setFormData({
                      plate: '',
                      make: '',
                      model: '',
                      year: '',
                      color: '',
                      status: 'available',
                      branchId: '',
                      dailyRate: '',
                      mileage: '',
                      vin: '',
                      insuranceExpiry: '',
                      registrationExpiry: '',
                      lastMaintenance: '',
                      nextMaintenance: ''
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
                  {selectedCar ? 'تحديث' : 'إضافة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
