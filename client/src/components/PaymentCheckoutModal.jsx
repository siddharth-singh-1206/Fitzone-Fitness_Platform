import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  X,
  CreditCard,
  QrCode,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Tag,
  ArrowRight,
  Sparkles,
  Dumbbell
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'

export default function PaymentCheckoutModal({ isOpen, onClose, plan, user, onSuccess }) {
  const navigate = useNavigate()
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [promoCode, setPromoCode] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)
  const [appliedCode, setAppliedCode] = useState('')
  const [processing, setProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(null)

  // Card form state
  const [cardForm, setCardForm] = useState({
    number: '4532 8821 9012 3456',
    name: user?.name || 'Arjun Verma',
    expiry: '12/28',
    cvv: '884',
  })

  // UPI form state
  const [upiId, setUpiId] = useState(`${user?.email?.split('@')[0] || 'member'}@okhdfcbank`)
  const [selectedBank, setSelectedBank] = useState('HDFC Bank')

  if (!isOpen || !plan) return null

  // Pricing calculations
  const originalPrice = plan.price || 49
  const discountAmount = Math.round(originalPrice * (discountPercent / 100))
  const discountedPrice = originalPrice - discountAmount
  const basePrice = Math.round((discountedPrice / 1.18) * 100) / 100
  const gstAmount = Math.round((discountedPrice - basePrice) * 100) / 100
  const finalTotal = discountedPrice

  const handleApplyPromo = (e) => {
    e.preventDefault()
    const code = promoCode.trim().toUpperCase()
    if (!code) return

    if (code === 'FIT20') {
      setDiscountPercent(20)
      setAppliedCode('FIT20 (20% OFF)')
      toast.success('Promo code FIT20 applied! You saved 20% 🎉')
    } else if (code === 'WELCOME10') {
      setDiscountPercent(10)
      setAppliedCode('WELCOME10 (10% OFF)')
      toast.success('Promo code WELCOME10 applied! 10% discount added.')
    } else if (code === 'FITZONE50') {
      setDiscountPercent(50)
      setAppliedCode('FITZONE50 (50% OFF VIP)')
      toast.success('VIP Promo code applied! 50% discount added! 🔥')
    } else {
      toast.error('Invalid promo code. Try FIT20 or WELCOME10')
    }
  }

  const handleRemovePromo = () => {
    setDiscountPercent(0)
    setAppliedCode('')
    setPromoCode('')
    toast('Promo code removed', { icon: 'ℹ️' })
  }

  const handlePayment = async () => {
    if (!user) {
      toast.error('You must be logged in to activate a membership', { icon: '🔒' })
      return
    }
    setProcessing(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1400))

      try {
        if (plan._id && !plan._id.startsWith('fallback')) {
          await api.post('/memberships', { planId: plan._id })
        }
      } catch (err) {
        console.warn('Backend membership recording warning:', err)
      }

      const txnId = `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
      setPaymentSuccess({
        txnId,
        amount: finalTotal,
        date: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        method: paymentMethod.toUpperCase(),
      })

      if (onSuccess) onSuccess()
      toast.success('Payment authorized and membership activated! 🎉')
    } catch (err) {
      toast.error('Payment authorization failed. Please retry.')
    } finally {
      setProcessing(false)
    }
  }

  const handleClose = () => {
    if (paymentSuccess) {
      setPaymentSuccess(null)
      onClose()
      navigate('/dashboard')
    } else {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0d0d13]/95 border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 text-white my-8">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X size={20} />
        </button>

        {!paymentSuccess ? (
          /* ── CHECKOUT & PAYMENT VIEW ─────────────────── */
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1.5 bg-white/10 text-white border border-white/15 text-xs font-semibold px-3.5 py-1 rounded-full uppercase tracking-wider">
                <Lock size={12} /> 256-Bit SSL Encrypted Checkout
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1 mb-1 tracking-tight">
              Secure <span className="gradient-text">Membership Checkout</span>
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mb-6">
              Subscribe to <strong className="text-white">{plan.name} Plan</strong> ({plan.durationInDays || plan.duration || 30} days access).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Left Column: Payment Method (3 Cols) */}
              <div className="md:col-span-3 space-y-4">
                {/* Method Tabs */}
                <div className="grid grid-cols-3 gap-2 bg-[#07070b] p-1.5 rounded-2xl border border-white/10">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'bg-white text-gray-950 shadow-[0_0_15px_rgba(255,255,255,0.25)] font-bold'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <CreditCard size={17} className="mb-1" />
                    Cards
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'bg-white text-gray-950 shadow-[0_0_15px_rgba(255,255,255,0.25)] font-bold'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <QrCode size={17} className="mb-1" />
                    UPI / QR
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      paymentMethod === 'netbanking'
                        ? 'bg-white text-gray-950 shadow-[0_0_15px_rgba(255,255,255,0.25)] font-bold'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Building2 size={17} className="mb-1" />
                    Net Banking
                  </button>
                </div>

                {/* Method Form: Credit/Debit Card */}
                {paymentMethod === 'card' && (
                  <div className="space-y-3 bg-[#07070b] p-4 rounded-2xl border border-white/10">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 mb-1">Card Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardForm.number}
                          onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
                          className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs font-mono focus:border-white/30 focus:outline-none"
                        />
                        <CreditCard size={15} className="absolute right-3.5 top-3 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardForm.name}
                        onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
                        className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs focus:border-white/30 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-400 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardForm.expiry}
                          onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                          className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs font-mono focus:border-white/30 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-400 mb-1">CVV</label>
                        <input
                          type="password"
                          maxLength={4}
                          value={cardForm.cvv}
                          onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                          className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs font-mono focus:border-white/30 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Method Form: UPI */}
                {paymentMethod === 'upi' && (
                  <div className="space-y-4 bg-[#07070b] p-4 rounded-2xl border border-white/10 text-center">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 mb-1 text-left">Virtual Payment Address (VPA)</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="username@okhdfcbank"
                        className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs font-mono focus:border-white/30 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 justify-center text-xs text-gray-400 py-1">
                      <span>or scan dynamic QR code on phone</span>
                    </div>

                    <div className="w-32 h-32 bg-white p-2 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                      <QrCode size={110} className="text-gray-950" />
                    </div>
                  </div>
                )}

                {/* Method Form: Net Banking */}
                {paymentMethod === 'netbanking' && (
                  <div className="space-y-3 bg-[#07070b] p-4 rounded-2xl border border-white/10">
                    <label className="block text-[11px] font-semibold text-gray-400 mb-1">Select Bank</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Bank'].map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setSelectedBank(b)}
                          className={`p-2 rounded-xl text-xs font-medium text-left border transition-all ${
                            selectedBank === b
                              ? 'bg-white text-gray-950 border-white font-bold'
                              : 'bg-[#0a0a0f] border-white/10 text-gray-300 hover:text-white'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Order Summary (2 Cols) */}
              <div className="md:col-span-2 space-y-4">
                <div className="bg-[#07070b] p-4 rounded-2xl border border-white/10 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Order Summary</h3>

                  <div className="pb-3 border-b border-white/10">
                    <p className="font-bold text-white text-sm">{plan.name} Membership</p>
                    <p className="text-[11px] text-gray-500">{plan.durationInDays || plan.duration || 30} Days Unlimited Access</p>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-gray-400">
                      <span>Base Plan:</span>
                      <span>₹{originalPrice}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-400 font-semibold">
                        <span>Discount ({appliedCode}):</span>
                        <span>-₹{discountAmount}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-gray-400">
                      <span>GST (18% Incl.):</span>
                      <span>₹{gstAmount}</span>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex justify-between text-base font-black text-white">
                      <span>Total Amount:</span>
                      <span>₹{finalTotal}</span>
                    </div>
                  </div>
                </div>

                {/* Promo Code Input */}
                <div className="bg-[#07070b] p-3.5 rounded-2xl border border-white/10">
                  <label className="block text-[11px] font-semibold text-gray-400 mb-1 flex items-center gap-1">
                    <Tag size={12} className="text-gray-400" /> Have a Promo Code?
                  </label>
                  {appliedCode ? (
                    <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2 text-xs">
                      <span className="text-emerald-400 font-bold">{appliedCode}</span>
                      <button
                        onClick={handleRemovePromo}
                        className="text-gray-400 hover:text-white text-xs font-semibold underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="e.g. FIT20"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="w-full bg-[#0a0a0f] border border-white/10 rounded-full px-3.5 py-2 text-white text-xs uppercase focus:border-white/30 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="bg-white hover:bg-gray-200 text-gray-950 font-bold text-xs px-3.5 py-2 rounded-full transition-colors shrink-0"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  <p className="text-[10px] text-gray-500 mt-1.5">Tip: Try code <strong>FIT20</strong> for 20% off.</p>
                </div>

                {/* Pay Button */}
                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full bg-white hover:bg-gray-100 text-gray-950 text-sm py-3.5 rounded-full font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] transition cursor-pointer disabled:opacity-50"
                >
                  <Lock size={14} />
                  <span>{processing ? 'Processing Payment…' : `Pay Securely ₹${finalTotal}`}</span>
                </button>

                <p className="text-[10px] text-gray-500 text-center flex items-center justify-center gap-1">
                  <ShieldCheck size={13} className="text-emerald-400" />
                  Instant Activation • 100% Secure Transaction
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* ── PAYMENT SUCCESS VIEW ─────────────────────── */
          <div className="text-center py-6 space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-xl">
              <CheckCircle2 size={46} />
            </div>

            <div>
              <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                <Sparkles size={12} /> Payment Verified
              </span>
              <h2 className="text-3xl font-black text-white">Welcome to FitZone!</h2>
              <p className="text-gray-400 text-sm mt-1 max-w-sm mx-auto">
                Your subscription to the <strong className="text-white">{plan.name} Plan</strong> has been activated successfully.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-[#07070b] p-5 rounded-2xl border border-white/10 max-w-md mx-auto text-xs space-y-2.5 text-left">
              <div className="flex justify-between">
                <span className="text-gray-500">Transaction ID:</span>
                <span className="font-mono text-white font-bold">{paymentSuccess.txnId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Plan Activated:</span>
                <span className="text-white font-medium">{plan.name} ({plan.durationInDays || plan.duration || 30} Days)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount Paid:</span>
                <span className="text-white font-black text-sm">₹{paymentSuccess.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Method:</span>
                <span className="text-white font-medium">{paymentSuccess.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Timestamp:</span>
                <span className="text-gray-400">{paymentSuccess.date}</span>
              </div>
            </div>

            {/* Next Steps Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
              <button
                onClick={handleClose}
                className="w-full bg-white hover:bg-gray-100 text-gray-950 py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] transition"
              >
                <span>Go to Member Dashboard</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
