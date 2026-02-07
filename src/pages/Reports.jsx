import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase/config'
import { Card, CardHeader, CardContent } from '../components/ui/Card.jsx'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Download, Filter, Calendar, TrendingUp, DollarSign, Car, Users, FileText } from 'lucide-react'

export default function Reports() {
  const [reportsData, setReportsData] = useState({
    revenueData: [],
    fleetUtilization: [],
    customerAnalytics: [],
    maintenanceCosts: [],
    branchPerformance: [],
    topCustomers: [],
    vehiclePerformance: []
  })
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('month')
  const [selectedReport, setSelectedReport] = useState('overview')

  useEffect(() => {
    fetchReportsData()
  }, [dateRange])

  const fetchReportsData = async () => {
    try {
      // Mock data for demonstration - in real app, this would come from Firebase
      const mockRevenueData = [
        { month: 'يناير', revenue: 45000, expenses: 12000, profit: 33000 },
        { month: 'فبراير', revenue: 52000, expenses: 14000, profit: 38000 },
        { month: 'مارس', revenue: 48000, expenses: 13000, profit: 35000 },
        { month: 'أبريل', revenue: 61000, expenses: 15000, profit: 46000 },
        { month: 'مايو', revenue: 58000, expenses: 16000, profit: 42000 },
        { month: 'يونيو', revenue: 67000, expenses: 18000, profit: 49000 }
      ]

      const mockFleetUtilization = [
        { name: 'متاح', value: 35, color: '#10b981' },
        { name: 'مؤجر', value: 55, color: '#3b82f6' },
        { name: 'صيانة', value: 10, color: '#ef4444' }
      ]

      const mockCustomerAnalytics = [
        { month: 'يناير', newCustomers: 12, returningCustomers: 45 },
        { month: 'فبراير', newCustomers: 18, returningCustomers: 52 },
        { month: 'مارس', newCustomers: 15, returningCustomers: 48 },
        { month: 'أبريل', newCustomers: 22, returningCustomers: 61 },
        { month: 'مايو', newCustomers: 19, returningCustomers: 58 },
        { month: 'يونيو', newCustomers: 25, returningCustomers: 67 }
      ]

      const mockMaintenanceCosts = [
        { month: 'يناير', cost: 8000 },
        { month: 'فبراير', cost: 12000 },
        { month: 'مارس', cost: 6000 },
        { month: 'أبريل', cost: 15000 },
        { month: 'مايو', cost: 9000 },
        { month: 'يونيو', cost: 11000 }
      ]

      const mockBranchPerformance = [
        { branch: 'الرياض', revenue: 120000, rentals: 145, customers: 89 },
        { branch: 'جدة', revenue: 98000, rentals: 118, customers: 72 },
        { branch: 'الدمام', revenue: 76000, rentals: 92, customers: 56 },
        { branch: 'مكة المكرمة', revenue: 65000, rentals: 78, customers: 48 }
      ]

      const mockTopCustomers = [
        { name: 'شركة النقل السريع', rentals: 24, revenue: 48000 },
        { name: 'مؤسسة الذهب', rentals: 18, revenue: 36000 },
        { name: 'شركة الأمل', rentals: 15, revenue: 30000 },
        { name: 'الشركة المتحدة', rentals: 12, revenue: 24000 },
        { name: 'مجموعة الرائد', rentals: 10, revenue: 20000 }
      ]

      const mockVehiclePerformance = [
        { plate: 'أ ب 123', make: 'تويوتا', model: 'كامري', utilization: 85, revenue: 15000 },
        { plate: 'ج د 456', make: 'هونداي', model: 'سوناتا', utilization: 92, revenue: 18000 },
        { plate: 'و ه 789', make: 'نيسان', model: 'ألتيما', utilization: 78, revenue: 12000 },
        { plate: 'س ل 012', make: 'كيا', model: 'أوبتيما', utilization: 88, revenue: 16000 },
        { plate: 'م ن 345', make: 'مرسيدس', model: 'E-Class', utilization: 95, revenue: 25000 }
      ]

      setReportsData({
        revenueData: mockRevenueData,
        fleetUtilization: mockFleetUtilization,
        customerAnalytics: mockCustomerAnalytics,
        maintenanceCosts: mockMaintenanceCosts,
        branchPerformance: mockBranchPerformance,
        topCustomers: mockTopCustomers,
        vehiclePerformance: mockVehiclePerformance
      })
    } catch (error) {
      console.error('Error fetching reports data:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportReport = (reportType) => {
    // In a real implementation, this would generate and download a PDF/Excel report
    console.log(`Exporting ${reportType} report...`)
    alert('سيتم تحميل التقرير قريباً')
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
        <h1 className="text-2xl font-bold text-gray-800">التقارير والتحليلات</h1>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">آخر أسبوع</option>
            <option value="month">آخر شهر</option>
            <option value="quarter">آخر ربع سنة</option>
            <option value="year">آخر سنة</option>
          </select>
          <button
            onClick={() => exportReport(selectedReport)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            تصدير التقرير
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'overview', label: 'نظرة عامة', icon: TrendingUp },
          { id: 'revenue', label: 'الإيرادات', icon: DollarSign },
          { id: 'fleet', label: 'الأسطول', icon: Car },
          { id: 'customers', label: 'العملاء', icon: Users },
          { id: 'maintenance', label: 'الصيانة', icon: FileText }
        ].map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedReport(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                selectedReport === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Overview Report */}
      {selectedReport === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">إجمالي الإيرادات</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ريال {reportsData.revenueData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
                    </p>
                    <p className="text-xs text-green-600 mt-1">+12% من الشهر الماضي</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">إجمالي التأجيرات</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reportsData.branchPerformance.reduce((sum, item) => sum + item.rentals, 0)}
                    </p>
                    <p className="text-xs text-green-600 mt-1">+8% من الشهر الماضي</p>
                  </div>
                  <Car className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">العملاء النشطون</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reportsData.branchPerformance.reduce((sum, item) => sum + item.customers, 0)}
                    </p>
                    <p className="text-xs text-green-600 mt-1">+15% من الشهر الماضي</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">معدل الاستغلال</p>
                    <p className="text-2xl font-bold text-gray-900">78%</p>
                    <p className="text-xs text-green-600 mt-1">+5% من الشهر الماضي</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue and Profit Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader title="الإيرادات والأرباح" />
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={reportsData.revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`ريال ${value.toLocaleString()}`, '']} />
                    <Legend />
                    <Area type="monotone" dataKey="revenue" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="الإيرادات" />
                    <Area type="monotone" dataKey="profit" stackId="2" stroke="#10b981" fill="#10b981" name="الأرباح" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="استغلال الأسطول" />
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reportsData.fleetUtilization}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {reportsData.fleetUtilization.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Revenue Report */}
      {selectedReport === 'revenue' && (
        <div className="space-y-6">
          <Card>
            <CardHeader title="تحليل الإيرادات الشهري" />
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={reportsData.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`ريال ${value.toLocaleString()}`, '']} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#3b82f6" name="الإيرادات" />
                  <Bar dataKey="expenses" fill="#ef4444" name="المصروفات" />
                  <Bar dataKey="profit" fill="#10b981" name="الأرباح" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="أداء الفروع" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportsData.branchPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="branch" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`ريال ${value.toLocaleString()}`, 'الإيرادات']} />
                  <Bar dataKey="revenue" fill="#8b5cf6" name="الإيرادات" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Fleet Report */}
      {selectedReport === 'fleet' && (
        <div className="space-y-6">
          <Card>
            <CardHeader title="أداء السيارات" />
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-right font-medium text-gray-500">السيارة</th>
                      <th className="px-6 py-3 text-right font-medium text-gray-500">نسبة الاستغلال</th>
                      <th className="px-6 py-3 text-right font-medium text-gray-500">الإيرادات</th>
                      <th className="px-6 py-3 text-right font-medium text-gray-500">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {reportsData.vehiclePerformance.map((vehicle, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{vehicle.plate}</div>
                            <div className="text-xs text-gray-500">{vehicle.make} {vehicle.model}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${vehicle.utilization}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{vehicle.utilization}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          ريال {vehicle.revenue.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ممتاز
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Customers Report */}
      {selectedReport === 'customers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader title="نمو العملاء" />
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reportsData.customerAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="newCustomers" stroke="#3b82f6" name="عملاء جدد" />
                    <Line type="monotone" dataKey="returningCustomers" stroke="#10b981" name="عملاء عائدون" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="أفضل العملاء" />
              <CardContent>
                <div className="space-y-4">
                  {reportsData.topCustomers.map((customer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{customer.name}</div>
                          <div className="text-xs text-gray-500">{customer.rentals} تأجير</div>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-gray-900">
                          ريال {customer.revenue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Maintenance Report */}
      {selectedReport === 'maintenance' && (
        <div className="space-y-6">
          <Card>
            <CardHeader title="تكاليف الصيانة الشهرية" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={reportsData.maintenanceCosts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`ريال ${value.toLocaleString()}`, 'التكلفة']} />
                  <Area type="monotone" dataKey="cost" stroke="#f59e0b" fill="#fbbf24" name="تكلفة الصيانة" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
