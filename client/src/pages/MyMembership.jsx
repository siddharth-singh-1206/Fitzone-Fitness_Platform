import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  FileText,
  Flame,
  Activity,
  Target,
  User,
  Scale,
  Sparkles,
  CheckCircle2,
  CalendarCheck,
  ChevronRight
} from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { useSound } from '../context/SoundContext'
import LoadingSpinner from '../components/LoadingSpinner'
import InvoiceModal from '../components/InvoiceModal'

/** Status badge with color coding */
function StatusBadge({ status }) {
  const config = {
    active: { label: 'Active', cls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: <CheckCircle size={13} /> },
    expired: { label: 'Expired', cls: 'bg-red-500/20 text-red-400 border-red-500/30', icon: <XCircle size={13} /> },
    cancelled: { label: 'Cancelled', cls: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: <AlertCircle size={13} /> },
  }
  const c = config[status] || config.expired
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${c.cls}`}>
      {c.icon} {c.label}
    </span>
  )
}

/** Formats a date string to readable format */
const fmt = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'N/A'

/** Computes days remaining until end date */
const daysRemaining = (endDate) => {
  if (!endDate) return null
  const diff = Math.ceil((new Date(endDate) - new Date()) / (1000 * 60 * 60 * 24))
  return diff
}

export default function MyMembership() {
  const { user, updateUser } = useAuth()
  const { playSuccess } = useSound()
  const [membership, setMembership] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('membership') // 'membership' | 'goals' | 'attendance' | 'profile'
  const [showInvoice, setShowInvoice] = useState(false)

  // Attendance states
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [attendanceStats, setAttendanceStats] = useState({ thisMonthCount: 0, streak: 0, totalCheckIns: 0 })
  const [selectedActivity, setSelectedActivity] = useState('Gym Floor')
  const [checkingIn, setCheckingIn] = useState(false)

  // Profile & Goal states
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    fitnessGoal: user?.fitnessGoal || 'General Fitness',
    currentWeight: user?.currentWeight || 72,
    targetWeight: user?.targetWeight || 68,
    height: user?.height || 175,
  })
  const [savingProfile, setSavingProfile] = useState(false)

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        fitnessGoal: user.fitnessGoal || 'General Fitness',
        currentWeight: user.currentWeight || 72,
        targetWeight: user.targetWeight || 68,
        height: user.height || 175,
      })
    }
  }, [user])

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      try {
        const [memRes, attRes] = await Promise.allSettled([
          api.get('/memberships/my'),
          api.get('/attendance/my'),
        ])

        if (!isMounted) return

        if (memRes.status === 'fulfilled') {
          setMembership(memRes.value.data)
        }
        if (attRes.status === 'fulfilled' && attRes.value.data) {
          setAttendanceRecords(attRes.value.data.records || [])
          setAttendanceStats(attRes.value.data.stats || { thisMonthCount: 0, streak: 0, totalCheckIns: 0 })
        }
      } catch (err) {
        console.warn('Dashboard load error:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadData()
    return () => {
      isMounted = false
    }
  }, [])

  const handleCheckIn = async () => {
    setCheckingIn(true)
    try {
      const res = await api.post('/attendance/checkin', { activity: selectedActivity })
      playSuccess()
      toast.success(res.data?.message || 'Checked in successfully! Have a great workout 💪')
      // Refresh attendance
      const attRes = await api.get('/attendance/my')
      if (attRes.data) {
        setAttendanceRecords(attRes.data.records || [])
        setAttendanceStats(attRes.data.stats || { thisMonthCount: 0, streak: 0, totalCheckIns: 0 })
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Check-in failed. Please try again.')
    } finally {
      setCheckingIn(false)
    }
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      const res = await api.put('/auth/profile', profileForm)
      const updated = res.data?.data || res.data
      updateUser(updated)
      toast.success('Fitness profile updated successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSavingProfile(false)
    }
  }

  // Calculate BMI
  const heightM = (profileForm.height || 175) / 100
  const bmi = (profileForm.currentWeight / (heightM * heightM)).toFixed(1)
  const getBmiCategory = (val) => {
    if (val < 18.5) return { label: 'Underweight', color: 'text-gray-300' }
    if (val < 25) return { label: 'Normal Weight', color: 'text-emerald-400' }
    if (val < 30) return { label: 'Overweight', color: 'text-amber-400' }
    return { label: 'Obese', color: 'text-red-400' }
  }
  const bmiCat = getBmiCategory(Number(bmi))

  const remaining = membership ? daysRemaining(membership.endDate) : null
  const totalDays = membership?.plan?.durationInDays || membership?.plan?.duration || 30
  const progressPercent =
    remaining !== null && totalDays ? Math.max(0, Math.min(100, Math.round((remaining / totalDays) * 100))) : 0

  return (
    <div className="bg-[#050508] min-h-screen py-16 px-4 sm:px-6 lg:px-8 pt-28 text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* ── Top Header & Greeting ──────────────────────── */}
        <div className="card bg-[#0d0d13]/90 border border-white/10 p-6 sm:p-8 rounded-3xl relative overflow-hidden backdrop-blur-2xl shadow-2xl">
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white/[0.02] blur-3xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white text-2xl font-black shadow-xl">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-white">{user?.name}</h1>
                  <span className="bg-white/10 border border-white/15 text-gray-200 text-xs px-3 py-0.5 rounded-full font-semibold uppercase">
                    {user?.role || 'Member'}
                  </span>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm mt-0.5">{user?.email}</p>
              </div>
            </div>

            {/* Quick Check-in Button */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleCheckIn}
                disabled={checkingIn}
                className="w-full sm:w-auto bg-white hover:bg-gray-100 text-gray-950 font-bold text-xs sm:text-sm py-3 px-6 rounded-full flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all cursor-pointer"
              >
                <CalendarCheck size={16} />
                <span>{checkingIn ? 'Checking In…' : 'Check In Today'}</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Pill Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white">
                <Flame size={18} />
              </div>
              <div>
                <p className="text-white font-bold text-lg">{attendanceStats.streak} Days</p>
                <p className="text-gray-500 text-xs">Current Streak</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white">
                <Activity size={18} />
              </div>
              <div>
                <p className="text-white font-bold text-lg">{attendanceStats.thisMonthCount}</p>
                <p className="text-gray-500 text-xs">Visits This Month</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white">
                <Scale size={18} />
              </div>
              <div>
                <p className="text-white font-bold text-lg">{profileForm.currentWeight} kg</p>
                <p className="text-gray-500 text-xs">Current Weight</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white">
                <Target size={18} />
              </div>
              <div>
                <p className="text-white font-bold text-lg">{profileForm.fitnessGoal}</p>
                <p className="text-gray-500 text-xs">Target Focus</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs Navigation ─────────────────────────────── */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto no-scrollbar">
          {[
            { id: 'membership', label: 'Membership Plan', icon: <CalendarDays size={15} /> },
            { id: 'goals', label: 'Goals & Metrics', icon: <Target size={15} /> },
            { id: 'attendance', label: 'Attendance Records', icon: <Activity size={15} /> },
            { id: 'profile', label: 'Profile Settings', icon: <User size={15} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white text-gray-950 shadow-[0_0_15px_rgba(255,255,255,0.3)] font-bold'
                  : 'text-gray-400 hover:text-white bg-white/5 border border-white/10'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── Tab 1: Membership ───────────────────────────── */}
        {activeTab === 'membership' && (
          <div>
            {loading ? (
              <LoadingSpinner />
            ) : !membership ? (
              <div className="card text-center py-20 border border-white/10 rounded-3xl bg-[#0d0d13]/85 backdrop-blur-xl">
                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                  <CalendarDays size={32} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">No Active Membership Found</h2>
                <p className="text-gray-400 max-w-md mx-auto mb-6 text-xs sm:text-sm">
                  Subscribe to a FitZone plan today to unlock gym facilities, group classes, and personal trainer coaching.
                </p>
                <Link to="/plans" className="btn-primary">
                  <span>Explore Plans</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Card */}
                <div className="lg:col-span-2 card bg-[#0d0d13]/85 border border-white/10 p-6 sm:p-8 rounded-3xl relative backdrop-blur-2xl shadow-2xl">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Current Subscription</p>
                      <h2 className="text-3xl font-black text-white">{membership.plan?.name || 'Active Plan'} Plan</h2>
                    </div>
                    <StatusBadge status={membership.status} />
                  </div>

                  {/* Price & Billing */}
                  <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-white/10">
                    <span className="text-4xl font-black text-white">₹{membership.plan?.price}</span>
                    <span className="text-gray-400 text-xs">
                      / {membership.plan?.durationInDays || membership.plan?.duration || 30} Days Validity
                    </span>
                  </div>

                  {/* Dates Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#07070b] p-4 rounded-2xl border border-white/10">
                      <p className="text-gray-500 text-xs mb-1 flex items-center gap-1.5 font-medium">
                        <CalendarDays size={13} className="text-gray-400" /> Started On
                      </p>
                      <p className="text-white font-semibold text-sm">{fmt(membership.startDate)}</p>
                    </div>

                    <div className="bg-[#07070b] p-4 rounded-2xl border border-white/10">
                      <p className="text-gray-500 text-xs mb-1 flex items-center gap-1.5 font-medium">
                        <CalendarDays size={13} className="text-gray-400" /> Expires On
                      </p>
                      <p className="text-white font-semibold text-sm">{fmt(membership.endDate)}</p>
                    </div>
                  </div>

                  {/* Days remaining progress */}
                  {membership.status === 'active' && remaining !== null && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-bold text-sm flex items-center gap-2">
                          <Clock size={15} className="text-white" />
                          {remaining > 0 ? `${remaining} days remaining` : 'Expires today'}
                        </span>
                        <span className="text-gray-400 text-xs font-semibold">{progressPercent}% duration left</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Included Features */}
                  <div>
                    <h3 className="text-white font-bold text-sm mb-3">Included Benefits & Privileges</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {(membership.plan?.features || []).map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                          <CheckCircle2 size={15} className="text-white shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Sidebar Action & Invoice */}
                <div className="space-y-6">
                  {/* Invoice Download Card */}
                  <div className="card bg-[#0d0d13]/85 border border-white/10 p-6 rounded-3xl backdrop-blur-2xl">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center mb-4">
                      <FileText size={20} />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-1">Official Tax Invoice</h3>
                    <p className="text-gray-400 text-xs mb-5 leading-relaxed">
                      View, print, or download your verified GST payment receipt for tax & reimbursement claims.
                    </p>
                    <button
                      onClick={() => setShowInvoice(true)}
                      className="w-full btn-secondary text-xs flex items-center justify-center gap-2 py-3"
                    >
                      <FileText size={15} /> <span>View & Download Invoice</span>
                    </button>
                  </div>

                  {/* Upgrade / Change Plan Card */}
                  <div className="card bg-[#0d0d13]/85 border border-white/10 p-6 rounded-3xl text-center backdrop-blur-2xl">
                    <Sparkles className="text-white mx-auto mb-3" size={24} />
                    <h3 className="text-white font-bold mb-1">Want to Upgrade?</h3>
                    <p className="text-gray-400 text-xs mb-4">
                      Looking for personal coaching or multi-city access? Compare our elite options.
                    </p>
                    <Link to="/plans" className="text-white hover:underline text-xs font-semibold inline-flex items-center gap-1">
                      <span>Explore All Plans</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Tab 2: Fitness Goals & Metrics ──────────────── */}
        {activeTab === 'goals' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* BMI & Stats Display */}
            <div className="space-y-6">
              <div className="card bg-[#0d0d13]/85 border border-white/10 p-6 rounded-3xl text-center backdrop-blur-2xl">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Calculated Body Mass Index</p>
                <div className="text-5xl font-black text-white mb-2">{bmi}</div>
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full bg-white/10 border border-white/15 ${bmiCat.color}`}>
                  {bmiCat.label}
                </span>

                <div className="mt-6 pt-6 border-t border-white/10 text-xs text-gray-400 space-y-2 text-left">
                  <div className="flex justify-between">
                    <span>Height:</span>
                    <span className="text-white font-medium">{profileForm.height} cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Weight:</span>
                    <span className="text-white font-medium">{profileForm.currentWeight} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Target Weight:</span>
                    <span className="text-white font-medium">{profileForm.targetWeight} kg</span>
                  </div>
                </div>
              </div>

              {/* Goal Progress Bar */}
              <div className="card bg-[#0d0d13]/85 border border-white/10 p-6 rounded-3xl backdrop-blur-2xl">
                <h4 className="text-white font-bold text-sm mb-2">Weight Goal Progress</h4>
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>Current: {profileForm.currentWeight} kg</span>
                  <span className="text-white font-bold">Goal: {profileForm.targetWeight} kg</span>
                </div>
                <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" style={{ width: '65%' }} />
                </div>
                <p className="text-[11px] text-gray-500 mt-2 text-center">
                  {Math.abs(profileForm.currentWeight - profileForm.targetWeight)} kg away from target
                </p>
              </div>
            </div>

            {/* Goal Update Form */}
            <div className="lg:col-span-2 card bg-[#0d0d13]/85 border border-white/10 p-6 sm:p-8 rounded-3xl backdrop-blur-2xl">
              <h3 className="text-2xl font-black text-white mb-1">Set & Update Fitness Goals</h3>
              <p className="text-gray-400 text-xs sm:text-sm mb-6">
                Keep your parameters up to date so your coaches can calibrate your routine.
              </p>

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">Primary Fitness Goal</label>
                  <select
                    value={profileForm.fitnessGoal}
                    onChange={(e) => setProfileForm({ ...profileForm, fitnessGoal: e.target.value })}
                    className="w-full bg-[#07070b] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-white/30 focus:outline-none"
                  >
                    <option value="General Fitness">General Fitness & Health</option>
                    <option value="Muscle Gain & Hypertrophy">Muscle Gain & Hypertrophy</option>
                    <option value="Fat Loss & Toning">Fat Loss & Conditioning</option>
                    <option value="Endurance & Stamina">Endurance & Athletic Stamina</option>
                    <option value="Powerlifting & Strength">Powerlifting & Strength</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2">Current Weight (kg)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={profileForm.currentWeight}
                      onChange={(e) => setProfileForm({ ...profileForm, currentWeight: e.target.value })}
                      className="w-full bg-[#07070b] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-white/30 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2">Target Goal (kg)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={profileForm.targetWeight}
                      onChange={(e) => setProfileForm({ ...profileForm, targetWeight: e.target.value })}
                      className="w-full bg-[#07070b] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-white/30 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2">Height (cm)</label>
                    <input
                      type="number"
                      value={profileForm.height}
                      onChange={(e) => setProfileForm({ ...profileForm, height: e.target.value })}
                      className="w-full bg-[#07070b] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-white/30 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="btn-primary text-xs sm:text-sm py-3 px-7 rounded-full font-bold flex items-center gap-2 cursor-pointer"
                >
                  <span>{savingProfile ? 'Saving Changes…' : 'Save Fitness Metrics'}</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── Tab 3: Attendance Records ───────────────────── */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            {/* Check-in Quick Action Card */}
            <div className="card bg-[#0d0d13]/85 border border-white/10 p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-2xl">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Log Gym Visit Today</h3>
                <p className="text-gray-400 text-xs">Record your attendance and maintain your fitness streak.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <select
                  value={selectedActivity}
                  onChange={(e) => setSelectedActivity(e.target.value)}
                  className="bg-[#07070b] border border-white/10 text-white text-xs rounded-full px-4 py-2.5 focus:border-white/30 focus:outline-none"
                >
                  <option value="Gym Floor">Gym Floor Workout</option>
                  <option value="Cardio Session">Cardio Zone</option>
                  <option value="Yoga Class">Yoga Class</option>
                  <option value="Swimming Pool">Swimming Pool</option>
                  <option value="CrossFit Workout">CrossFit Training</option>
                </select>
                <button
                  onClick={handleCheckIn}
                  disabled={checkingIn}
                  className="bg-white hover:bg-gray-100 text-gray-950 font-bold text-xs py-2.5 px-5 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)] transition cursor-pointer"
                >
                  {checkingIn ? 'Checking In…' : 'Check In Now'}
                </button>
              </div>
            </div>

            {/* Attendance History Table */}
            <div className="card bg-[#0d0d13]/85 border border-white/10 rounded-3xl overflow-hidden p-0 backdrop-blur-2xl shadow-2xl">
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-white font-bold text-base flex items-center gap-2">
                  <Activity size={17} className="text-white" /> Recent Attendance History
                </h3>
                <span className="text-xs text-gray-400 font-medium">Total: {attendanceRecords.length} Check-ins</span>
              </div>

              {attendanceRecords.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <CalendarDays size={36} className="text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-300 font-medium text-sm">No check-ins logged yet.</p>
                  <p className="text-gray-500 text-xs mt-1">Hit "Check In Now" above when you arrive at the gym!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#08080c] text-gray-400 text-xs uppercase tracking-wider font-semibold border-b border-white/10">
                      <tr>
                        <th className="py-3.5 px-6">Date & Time</th>
                        <th className="py-3.5 px-6">Activity</th>
                        <th className="py-3.5 px-6">Session Duration</th>
                        <th className="py-3.5 px-6 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {attendanceRecords.map((rec, i) => (
                        <tr key={rec._id || i} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 px-6 text-white font-medium">
                            {new Date(rec.checkInTime || rec.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="py-4 px-6 text-gray-300">
                            <span className="inline-block bg-white/5 border border-white/10 text-gray-200 text-xs px-3 py-1 rounded-full font-medium">
                              {rec.activity || 'Gym Floor'}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-400 text-xs">
                            {rec.durationMinutes || 60} Minutes
                          </td>
                          <td className="py-4 px-6 text-right">
                            <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                              <CheckCircle size={14} /> Verified
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Tab 4: Profile Settings ─────────────────────── */}
        {activeTab === 'profile' && (
          <div className="card bg-[#0d0d13]/85 border border-white/10 p-6 sm:p-8 rounded-3xl max-w-2xl mx-auto backdrop-blur-2xl">
            <h3 className="text-2xl font-black text-white mb-1">Account & Member Profile</h3>
            <p className="text-gray-400 text-xs sm:text-sm mb-6">Manage your personal credentials and contact settings.</p>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full bg-[#07070b] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-white/30 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">Email Address (Read-only)</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full bg-[#07070b]/50 border border-white/5 rounded-xl px-4 py-3 text-gray-500 text-sm cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full bg-[#07070b] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-white/30 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="btn-primary text-xs sm:text-sm py-3.5 px-8 rounded-full font-bold cursor-pointer"
                >
                  {savingProfile ? 'Updating Profile…' : 'Save Profile Details'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={showInvoice}
        onClose={() => setShowInvoice(false)}
        membership={membership}
        user={user}
      />
    </div>
  )
}
