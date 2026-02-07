import { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, updateDoc, doc, query, orderBy } from 'firebase/firestore'
import { db } from '../firebase/config'
import { Card, CardHeader, CardContent } from '../components/ui/Card.jsx'
import { Search, Plus, DollarSign, CreditCard, FileText, Calendar, TrendingUp, Download, Eye, CheckCircle, Clock } from 'lucide-react'

export default function Finance() {
  const [transactions, setTransactions] = useState([])
  const [contracts, setContracts] = useState([])
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [financeStats, setFinanceStats] = useState({
    totalRevenue: 0,
    pendingPayments: 0,
    paidPayments: 0,
    monthlyRevenue: 0
  })

  const [formData, setFormData] = useState({
    contractId: '',
    amount: '',
    type: 'payment',
    status: 'pending',
    date: new Date().toISOString().split('T')[0],
    description: '',
    paymentMethod: 'cash'
  })

  useEffect(() => {
    fetchFinanceData()
  }, [])

  const fetchFinanceData = async () => {
    try {
      // Fetch transactions
      const transactionsQuery = query(
        collection(db, 'transactions'),
        orderBy('date', 'desc')
      )
      const transactionsSnapshot = await getDocs(transactionsQuery)
      const transactionsData = transactionsSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }))
      setTransactions(transactionsData)

      // Fetch contracts
      const contractsSnapshot = await getDocs(collection(db, 'contracts'))
      const contractsData = contractsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setContracts(contractsData)

      // Fetch customers
      const customersSnapshot = await getDocs(collection(db, 'customers'))
      const customersData = customersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setCustomers(customersData)

      // Calculate stats
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      
      setFinanceStats({
        totalRevenue: transactionsData.filter(t => t.status === 'paid').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0),
        pendingPayments: transactionsData.filter(t => t.status === 'pending').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0),
        paidPayments: transactionsData.filter(t => t.status === 'paid').length,
        monthlyRevenue: transactionsData.filter(t => {
          const transactionDate = new Date(t.date)
          return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear && t.status === 'paid'
        }).reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0)
      })
    } catch (error) {
      console.error('Error fetching finance data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTransaction = async (e) => {
    e.preventDefault()
    try {
      await addDoc(collection(db, 'transactions'), {
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      setShowAddModal(false)
      setFormData({
        contractId: '',
        amount: '',
        type: 'payment',
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        description: '',
        paymentMethod: 'cash'
      })
      fetchFinanceData()
    } catch (error) {
      console.error('Error adding transaction:', error)
    }
  }

  const handleUpdateStatus = async (transactionId, newStatus) => {
    try {
      await updateDoc(doc(db, 'transactions', transactionId), {
        status: newStatus,
        updatedAt: new Date()
      })
      fetchFinanceData()
    } catch (error) {
      console.error('Error updating transaction status:', error)
    }
  }

  const handleGenerateInvoice = (transaction) => {
    const contract = contracts.find(c => c.id === transaction.contractId)
    const customer = customers.find(c => c.id === contract?.customerId)
    
    const invoiceContent = `
      <html dir="rtl" style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="text-align: center; color: #1f2937;">فاتورة رقم #${transaction.id?.slice(-6) || 'N/A'}</h1>
        <div style="border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px;">
          <h2>معلومات العميل</h2>
          <p><strong>الاسم:</strong> ${customer?.name || 'غير محدد'}</p>
          <p><strong>رقم الهاتف:</strong> ${customer?.phone || 'غير محدد'}</p>
          <hr style="margin: 20px 0;">
          <h2>معلومات الفاتورة</h2>
          <p><strong>رقم العقد:</strong> #${contract?.id?.slice(-6) || 'N/A'}</p>
          <p><strong>المبلغ:</strong> ريال ${parseFloat(transaction.amount || 0).toLocaleString()}</p>
          <p><strong>التاريخ:</strong> ${new Date(transaction.date).toLocaleDateString('ar-SA')}</p>
          <p><strong>الحالة:</strong> ${transaction.status === 'paid' ? 'مدفوع' : 'معلق'}</p>
          <p><strong>طريقة الدفع:</strong> ${transaction.paymentMethod || 'نقد'}</p>
          ${transaction.description ? `<p><strong>وصف:</strong> ${transaction.description}</p>` : ''}
        </div>
        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #6b7280;">شكراً لثقتك بنا</p>
        </div>
      </html>
    `
    
    const printWindow = window.open('', '_blank', 'width=800,height=600')
    printWindow.document.write(invoiceContent)
    printWindow.document.close()
    printWindow.print()
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.id?.toLowerCase().includes(search.toLowerCase()) ||
                         transaction.description?.toLowerCase().includes(search.toLowerCase())
    const matchesDate = !dateFilter || transaction.date === dateFilter
    return matchesSearch && matchesDate
  })

  // Chart data for revenue visualization
  const chartData = transactions
    .filter(t => t.status === 'paid' && t.type === 'payment')
    .reduce((acc, curr) => {
      const date = curr.date
      acc[date] = (acc[date] || 0) + parseFloat(curr.amount || 0)
      return acc
    }, {})

  const typeMap = {
    invoice: 'فاتورة',
    payment: 'دفعة',
    expense: 'مصروف',
    refund: 'استرداد'
  }

  const statusMap = {
    pending: { label: 'معلق', color: 'bg-yellow-100 text-yellow-800' },
    paid: { label: 'مدفوع', color: 'bg-green-100 text-green-800' },
    overdue: { label: 'متأخر', color: 'bg-red-100 text-red-800' },
    cancelled: { label: 'ملغي', color: 'bg-gray-100 text-gray-800' }
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
        <h1 className="text-2xl font-bold text-gray-800">المعاملات المالية</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          إضافة معاملة
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold text-gray-900">
                  ريال {financeStats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">المدفوعات المعلقة</p>
                <p className="text-2xl font-bold text-yellow-600">
                  ريال {financeStats.pendingPayments.toLocaleString()}
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
                <p className="text-sm text-gray-500">المدفوعات المدفوعة</p>
                <p className="text-2xl font-bold text-blue-600">{financeStats.paidPayments}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">إيرادات الشهر</p>
                <p className="text-2xl font-bold text-purple-600">
                  ريال {financeStats.monthlyRevenue.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader title="الإيرادات اليومية" />
        <CardContent>
          <div className="flex items-end gap-2 h-40">
            {Object.entries(chartData).slice(-30).map(([date, amount]) => (
              <div key={date} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div 
                  className="w-full bg-green-500 rounded-t hover:bg-green-400 transition-all"
                  style={{ height: `${Math.min((amount / 5000) * 100, 100)}%` }}
                ></div>
                <div className="text-xs text-gray-400 rotate-45 mt-2 origin-left whitespace-nowrap">
                  {new Date(date).getDate()}
                </div>
                <div className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-900 text-xs p-1 rounded">
                  ريال {amount.toLocaleString()}
                </div>
              </div>
            ))}
            {Object.keys(chartData).length === 0 && (
              <div className="text-gray-500 text-sm w-full text-center">
                لا توجد بيانات كافية للرسم البياني
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <div className="p-4 border-b border-gray-50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                className="w-full pr-10 pl-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="بحث بالرقم أو الوصف..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
              />
            </div>
            <input 
              className="bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
              type="date" 
              value={dateFilter} 
              onChange={e => setDateFilter(e.target.value)} 
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-right font-medium text-gray-500">الرقم</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">النوع</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">المبلغ</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">الحالة</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">رقم العقد</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">التاريخ</th>
                <th className="px-6 py-3 text-right font-medium text-gray-500">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTransactions.map(transaction => {
                const contract = contracts.find(c => c.id === transaction.contractId)
                const customer = customers.find(c => c.id === contract?.customerId)
                
                return (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      #{transaction.id?.slice(-6) || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {transaction.type === 'invoice' ? <FileText className="w-4 h-4 text-blue-600" /> : <DollarSign className="w-4 h-4 text-green-600" />}
                        <span>{typeMap[transaction.type] || transaction.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      ريال {parseFloat(transaction.amount || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusMap[transaction.status]?.color}`}>
                        {statusMap[transaction.status]?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">#{transaction.contractId?.slice(-6) || 'N/A'}</div>
                        <div className="text-xs text-gray-500">{customer?.name || '-'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(transaction.date).toLocaleDateString('ar-SA')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleGenerateInvoice(transaction)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        {transaction.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateStatus(transaction.id, 'paid')}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedTransaction(transaction)}
                          className="p-1 text-gray-600 hover:bg-gray-50 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">إضافة معاملة جديدة</h2>
            </div>
            <form onSubmit={handleAddTransaction} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رقم العقد</label>
                <select
                  required
                  value={formData.contractId}
                  onChange={e => setFormData({...formData, contractId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">اختر العقد</option>
                  {contracts.map(contract => {
                    const customer = customers.find(c => c.id === contract.customerId)
                    return (
                      <option key={contract.id} value={contract.id}>
                        #{contract.id?.slice(-6)} - {customer?.name}
                      </option>
                    )
                  })}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المبلغ (ريال)</label>
                <input
                  type="number"
                  required
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">النوع</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="payment">دفع</option>
                  <option value="invoice">فاتورة</option>
                  <option value="expense">مصروف</option>
                  <option value="refund">استرداد</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">معلق</option>
                  <option value="paid">مدفوع</option>
                  <option value="overdue">متأخر</option>
                  <option value="cancelled">ملغي</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">طريقة الدفع</label>
                <select
                  value={formData.paymentMethod}
                  onChange={e => setFormData({...formData, paymentMethod: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="cash">نقد</option>
                  <option value="card">بطاقة</option>
                  <option value="bank">تحويل بنكي</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">التاريخ</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
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
