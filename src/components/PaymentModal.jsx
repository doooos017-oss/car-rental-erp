import { useState } from 'react'
import { CreditCard, Smartphone, Shield, CheckCircle } from 'lucide-react'

export default function PaymentModal({ isOpen, onClose, amount, contractId, onPaymentComplete }) {
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  })

  const handlePayment = async () => {
    setIsProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      onPaymentComplete({
        method: paymentMethod,
        amount,
        contractId,
        status: 'success',
        transactionId: `txn_${Date.now()}`
      })
      onClose()
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">الدفع الإلكتروني</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Amount Display */}
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-gray-600">المبلغ الإجمالي</div>
            <div className="text-2xl font-bold text-blue-600">ريال {amount?.toLocaleString()}</div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">طريقة الدفع</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
                  paymentMethod === 'card'
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CreditCard className="w-6 h-6" />
                <span className="text-sm">بطاقة ائتمان</span>
              </button>
              <button
                onClick={() => setPaymentMethod('paypal')}
                className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
                  paymentMethod === 'paypal'
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Smartphone className="w-6 h-6" />
                <span className="text-sm">PayPal</span>
              </button>
            </div>
          </div>

          {/* Card Details Form */}
          {paymentMethod === 'card' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رقم البطاقة</label>
                <input
                  type="text"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم على البطاقة</label>
                <input
                  type="text"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="الاسم الكامل"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الانتهاء</label>
                  <input
                    type="text"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <input
                    type="text"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PayPal Option */}
          {paymentMethod === 'paypal' && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-600 mb-3">سيتم توجيهك إلى PayPal لإتمام الدفع</p>
              <button className="w-full py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
                <Smartphone className="w-5 h-5 inline ml-2" />
                الدفع عبر PayPal
              </button>
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Shield className="w-5 h-5 text-gray-600" />
            <p className="text-xs text-gray-600">
              معلومات الدفع الخاصة بك مشفرة وآمنة. لا نحتفظ ببيانات بطاقتك.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>جاري المعالجة...</span>
              </div>
            ) : (
              `دفع ريال ${amount?.toLocaleString()}`
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
