import React from 'react'
import { Printer, X, Dumbbell, CheckCircle2 } from 'lucide-react'

export default function InvoiceModal({ isOpen, onClose, membership, user }) {
  if (!isOpen || !membership) return null

  const plan = membership.plan || {}
  const invoiceNo = `FZ-${(membership._id || '1024').slice(-8).toUpperCase()}`
  const invoiceDate = new Date(membership.startDate || membership.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  const price = plan.price || 0
  const basePrice = Math.round((price / 1.18) * 100) / 100
  const gst = Math.round((price - basePrice) * 100) / 100

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0b0c10] border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 text-white my-8 print:p-0 print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Header Actions (hidden in print) */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 print:hidden">
          <div className="flex items-center gap-2">
            <Dumbbell className="text-white" size={22} />
            <span className="font-black text-base tracking-wider uppercase">FITZONE INVOICE</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-100 text-gray-950 text-xs font-bold px-4 py-2 rounded-full transition-all shadow-md cursor-pointer"
            >
              <Printer size={14} /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Invoice Printable Body */}
        <div className="mt-6 space-y-6 print:mt-0 print:text-black">
          {/* Brand & Status Banner */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-black text-white print:text-black">FitZone Fitness Club</h2>
              <p className="text-xs text-gray-400 print:text-gray-600">
                Level 4, Signature Hub, 100 Feet Road, Indiranagar, Bengaluru 560038<br />
                GSTIN: 29AAACF8892M1Z4 | concierge@fitzone.in
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider print:border-black print:text-green-700">
                <CheckCircle2 size={13} /> Payment Received
              </span>
              <p className="text-xs text-gray-400 print:text-gray-600 mt-1">Invoice: #{invoiceNo}</p>
            </div>
          </div>

          {/* Billed To & Dates */}
          <div className="grid grid-cols-2 gap-4 bg-gray-950/60 p-4 rounded-xl border border-gray-800/80 print:bg-gray-50 print:border-gray-300">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">Billed To</p>
              <p className="text-sm font-bold text-white print:text-black">{user?.name || 'Valued Member'}</p>
              <p className="text-xs text-gray-400 print:text-gray-600">{user?.email}</p>
              {user?.phone && <p className="text-xs text-gray-400 print:text-gray-600">Phone: {user.phone}</p>}
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">Subscription Dates</p>
              <p className="text-xs text-gray-400 print:text-gray-600">Invoice Date: <span className="text-white print:text-black font-medium">{invoiceDate}</span></p>
              <p className="text-xs text-gray-400 print:text-gray-600">
                Valid Until: <span className="text-white print:text-black font-medium">
                  {new Date(membership.endDate || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </p>
            </div>
          </div>

          {/* Item Table */}
          <div className="border border-gray-800 rounded-xl overflow-hidden print:border-gray-300">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-800/60 text-gray-400 print:bg-gray-100 print:text-black font-semibold">
                <tr>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-center">Duration</th>
                  <th className="p-3 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 print:divide-gray-200">
                <tr>
                  <td className="p-3">
                    <p className="font-bold text-white print:text-black">{plan.name} Membership Plan</p>
                    <p className="text-gray-400 print:text-gray-600 text-[11px] mt-0.5">
                      Full access to club facilities, locker rooms, and trainer guidance.
                    </p>
                  </td>
                  <td className="p-3 text-center text-gray-300 print:text-black font-medium">
                    {plan.durationInDays || plan.duration || 30} Days
                  </td>
                  <td className="p-3 text-right font-semibold text-white print:text-black">₹{basePrice.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Breakdown summary */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-gray-400 print:text-gray-600">
                <span>Subtotal:</span>
                <span>₹{basePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400 print:text-gray-600">
                <span>GST (18% Integrated):</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-white print:text-black border-t border-white/10 print:border-gray-300 pt-2">
                <span>Total Paid:</span>
                <span>₹{price.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-4 border-t border-gray-800/80 text-[11px] text-gray-500 text-center print:text-gray-600">
            Thank you for being part of the FitZone family! This is a computer-generated tax invoice.
          </div>
        </div>
      </div>
    </div>
  )
}
