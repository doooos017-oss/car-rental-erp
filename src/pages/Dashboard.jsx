import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase/config'
import { StatCard } from '../components/ui/StatCard.jsx'
import { Card, CardHeader, CardContent } from '../components/ui/Card.jsx'
import { Wallet, AlertCircle, Clock, Car, TrendingUp, Users, FileText, Wrench } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingPayments: 0,
    rentedCars: 0,
    overdueContracts: 0,
    totalCars: 0,
    totalCustomers: 0,
    activeContracts: 0,
    maintenanceCars: 0
  })
  const [recentContracts, setRecentContracts] = useState([])
  const [fleetData, setFleetData] = useState([])
  const [revenueData, setRevenueData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch cars
      const carsSnapshot = await getDocs(collection(db, 'cars'))
      const cars = carsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      
      // Fetch customers
      const customersSnapshot = await getDocs(collection(db, 'customers'))
      const customers = customersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      
      // Fetch contracts
      const contractsSnapshot = await getDocs(
        query(collection(db, 'contracts'), orderBy('createdAt', 'desc'), limit(10))
      )
      const contracts = contractsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

      // Calculate stats
      const rentedCars = cars.filter(car => car.status === 'rented').length
      const availableCars = cars.filter(car => car.status === 'available').length
      const maintenanceCars = cars.filter(car => car.status === 'maintenance').length
      const totalRevenue = contracts.reduce((sum, contract) => sum + (contract.totalAmount || 0), 0)
      const pendingPayments = contracts.filter(contract => contract.paymentStatus === 'pending').length
      const overdueContracts = contracts.filter(contract => 
        new Date(contract.endDate) < new Date() && contract.status === 'active'
      ).length

      setStats({
        totalRevenue,
        pendingPayments,
        rentedCars,
        overdueContracts,
        totalCars: cars.length,
        totalCustomers: customers.length,
        activeContracts: contracts.filter(c => c.status === 'active').length,
        maintenanceCars
      })

      setRecentContracts(contracts.slice(0, 5))

      // Fleet data for pie chart
      setFleetData([
        { name: 'متاح', value: availableCars, color: '#10b981' },
        { name: 'مؤجر', value: rentedCars, color: '#3b82f6' },
        { name: 'صيانة', value: maintenanceCars, color: '#ef4444' }
      ])

      // Mock revenue data for the last 6 months
      const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو']
      setRevenueData(
        months.map(month => ({
          month,
          revenue: Math.floor(Math.random() * 50000) + 30000
        }))
      )

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">لوحة التحكم</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('ar-SA', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="الإيرادات الإجمالية" 
          value={`ريال ${stats.totalRevenue.toLocaleString()}`} 
          icon={Wallet} 
          color="brand"
          trend="up"
          trendValue="12%"
        />
        <StatCard 
          title="المدفوعات المعلقة" 
          value={stats.pendingPayments} 
          icon={Clock} 
          color="amber"
        />
        <StatCard 
          title="السيارات المؤجرة" 
          value={`${stats.rentedCars}/${stats.totalCars}`} 
          icon={Car} 
          color="green"
          trend="up"
          trendValue="5%"
        />
        <StatCard 
          title="العقود المتأخرة" 
          value={stats.overdueContracts} 
          icon={AlertCircle} 
          color="rose"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="إجمالي العملاء" 
          value={stats.totalCustomers} 
          icon={Users} 
          color="brand"
        />
        <StatCard 
          title="العقود النشطة" 
          value={stats.activeContracts} 
          icon={FileText} 
          color="green"
        />
        <StatCard 
          title="سيارات تحت الصيانة" 
          value={stats.maintenanceCars} 
          icon={Wrench} 
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader title="إيرادات الشهر الستة الماضية" />
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`ريال ${value.toLocaleString()}`, 'الإيرادات']}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Fleet Status Pie Chart */}
        <Card>
          <CardHeader title="حالة الأسطول" subtitle="توزيع السيارات حسب الحالة" />
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={fleetData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => 
                    `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {fleetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader title="أحدث العقود" />
        <CardContent className="p-0">
          <div className="divide-y divide-gray-50">
            {recentContracts.map((contract) => (
              <div key={contract.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    {contract.customerName?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {contract.customerName || 'عميل'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {contract.carPlate || 'سيارة'} • {contract.startDate}
                    </div>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-gray-900">
                    ريال {contract.totalAmount?.toLocaleString() || 0}
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                    contract.status === 'active' 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {contract.status === 'active' ? 'نشط' : 'منتهي'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
