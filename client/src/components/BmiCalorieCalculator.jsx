import React, { useState } from 'react'
import {
  Scale,
  Flame,
  Activity,
  Target,
  ArrowRight,
  Zap,
  Info,
  X,
  User,
  Calendar,
  ArrowUpDown,
  ChevronDown,
  Dumbbell,
  TrendingUp,
  Lightbulb
} from 'lucide-react'
import { useFreePass } from '../context/PassModalContext'

export default function BmiCalorieCalculator({ isModal = false, onClose }) {
  const { openPassModal } = useFreePass()

  // Form Inputs
  const [gender, setGender] = useState('male') // 'male' | 'female'
  const [age, setAge] = useState(26)
  const [height, setHeight] = useState(175) // cm
  const [weight, setWeight] = useState(72) // kg
  const [activityLevel, setActivityLevel] = useState(1.55) // Moderately active
  const [fitnessGoal, setFitnessGoal] = useState('fatloss') // 'fatloss' | 'maintenance' | 'musclegain'

  // Calculations
  const heightM = Math.max(0.5, height / 100)
  const bmi = (weight / (heightM * heightM)).toFixed(1)

  // BMR (Mifflin-St Jeor Equation)
  const bmr =
    gender === 'male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161

  // TDEE (Total Daily Energy Expenditure)
  const tdee = Math.round(bmr * activityLevel)

  // Goal Calories
  let targetCalories = tdee
  if (fitnessGoal === 'fatloss') targetCalories = Math.round(tdee - 450)
  if (fitnessGoal === 'musclegain') targetCalories = Math.round(tdee + 350)
  targetCalories = Math.max(1200, targetCalories)

  // Macros estimate
  const proteinG = Math.round(weight * 2.0)
  const fatG = Math.round((targetCalories * 0.25) / 9)
  const carbG = Math.max(0, Math.round((targetCalories - (proteinG * 4 + fatG * 9)) / 4))

  // Percentages
  const proteinPct = Math.round(((proteinG * 4) / targetCalories) * 100) || 26
  const fatPct = Math.round(((fatG * 9) / targetCalories) * 100) || 26
  const carbPct = Math.max(0, 100 - proteinPct - fatPct)

  // BMI Category & Styling
  const getBmiDetails = (val) => {
    if (val < 18.5) {
      return {
        label: 'Underweight Range',
        color: 'text-sky-400',
        badgeBg: 'bg-sky-500/15 text-sky-300 border-sky-500/20',
        planRecommend: 'Pro Plan (Focus: Hypertrophy & Nutrition)',
        tip: 'Focus on caloric surplus with progressive compound lifting and protein intake.',
      }
    }
    if (val < 25) {
      return {
        label: 'Optimal Athletic Range',
        color: 'text-emerald-400',
        badgeBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
        planRecommend: 'Pro Plan (All Access to Gym & Group Classes)',
        tip: 'Excellent foundation! Aim for athletic performance and progressive overload.',
      }
    }
    if (val < 30) {
      return {
        label: 'Overweight Range',
        color: 'text-amber-400',
        badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/20',
        planRecommend: 'Elite Plan (Cardio, HIIT Classes & 1-on-1 PT)',
        tip: 'A structured 400-kcal deficit combined with 3x weekly strength circuits will accelerate fat loss.',
      }
    }
    return {
      label: 'Obese Class Range',
      color: 'text-rose-400',
      badgeBg: 'bg-rose-500/15 text-rose-300 border-rose-500/20',
      planRecommend: 'Elite Plan with Personal Trainer Guidance',
      tip: 'Start with low-impact cardio and progressive resistance training under coach guidance.',
    }
  }

  const bmiDetails = getBmiDetails(Number(bmi))

  const content = (
    <div className="relative w-full">
      {/* Close button if inside modal */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-1 -right-1 sm:top-0 sm:right-0 z-30 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close Calculator"
        >
          <X size={18} />
        </button>
      )}

      {/* ── Section Header (Compact) ─────────────────────── */}
      <div className={`text-center max-w-2xl mx-auto ${isModal ? 'mb-4' : 'mb-8'}`}>
        <span className="inline-flex items-center gap-1.5 bg-white/5 text-gray-300 border border-white/10 text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-2 backdrop-blur-md">
          <Activity size={12} className="text-white" />
          <span>Health &amp; Fitness Logic</span>
        </span>

        <h2 className={`${isModal ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'} font-black text-white tracking-tight sm:whitespace-nowrap`}>
          Interactive BMI &amp; Calorie Calculator
        </h2>

        <p className="text-gray-400 text-xs mt-1 leading-normal font-normal sm:whitespace-nowrap">
          Calculate your Body Mass Index, TDEE, and exact macronutrient targets in seconds.
        </p>
      </div>

      {/* ── Two-Column Layout (Compact & Fitted) ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* ── Left Column: Enter Your Parameters (7 cols) ── */}
        <div className="lg:col-span-7 bg-[#0b0c10] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xl backdrop-blur-xl flex flex-col justify-between">
          
          {/* Card Header */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
              <User size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">Enter Your Parameters</h3>
              <p className="text-gray-400 text-[11px]">Tell us a bit about yourself to get personalized results.</p>
            </div>
          </div>

          {/* Gender Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-400 mb-1.5">Gender</label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`py-2 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  gender === 'male'
                    ? 'bg-white text-gray-950 shadow-[0_0_15px_rgba(255,255,255,0.35)]'
                    : 'bg-[#07070a] text-gray-400 border border-white/10 hover:text-white'
                }`}
              >
                <span className="text-sm">♂</span>
                <span>Male</span>
              </button>

              <button
                type="button"
                onClick={() => setGender('female')}
                className={`py-2 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  gender === 'female'
                    ? 'bg-white text-gray-950 shadow-[0_0_15px_rgba(255,255,255,0.35)]'
                    : 'bg-[#07070a] text-gray-400 border border-white/10 hover:text-white'
                }`}
              >
                <span className="text-sm">♀</span>
                <span>Female</span>
              </button>
            </div>
          </div>

          {/* Age, Height, Weight Row */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 mb-1">Age (Years)</label>
              <div className="relative flex items-center">
                <Calendar size={13} className="absolute left-2.5 text-gray-400 pointer-events-none" />
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value) || 0)}
                  min={12}
                  max={100}
                  className="w-full bg-[#07070a] border border-white/10 rounded-xl pl-8 pr-2 py-1.5 text-white font-semibold text-xs focus:border-white/30 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-400 mb-1">Height (cm)</label>
              <div className="relative flex items-center">
                <ArrowUpDown size={13} className="absolute left-2.5 text-gray-400 pointer-events-none" />
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value) || 0)}
                  min={100}
                  max={250}
                  className="w-full bg-[#07070a] border border-white/10 rounded-xl pl-8 pr-2 py-1.5 text-white font-semibold text-xs focus:border-white/30 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-400 mb-1">Weight (kg)</label>
              <div className="relative flex items-center">
                <Scale size={13} className="absolute left-2.5 text-gray-400 pointer-events-none" />
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value) || 0)}
                  min={30}
                  max={300}
                  className="w-full bg-[#07070a] border border-white/10 rounded-xl pl-8 pr-2 py-1.5 text-white font-semibold text-xs focus:border-white/30 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Weekly Physical Activity Level */}
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 mb-1">
              <Activity size={13} className="text-gray-400" />
              <span>Weekly Physical Activity Level</span>
            </label>
            <div className="relative">
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(Number(e.target.value))}
                className="w-full bg-[#07070a] border border-white/10 rounded-xl px-3 py-2 text-white text-xs font-medium focus:border-white/30 focus:outline-none appearance-none cursor-pointer transition-colors"
              >
                <option value={1.2}>Sedentary (Desk job, minimal daily movement)</option>
                <option value={1.375}>Lightly Active (Light exercise 1–2 days/week)</option>
                <option value={1.55}>Moderately Active (Gym workouts 3–5 days/week)</option>
                <option value={1.725}>Very Active (Hard training 6–7 days/week)</option>
                <option value={1.9}>Extra Active (Physical athlete / 2x daily workouts)</option>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Your Fitness Goal */}
          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 mb-1.5">
              <Target size={13} className="text-gray-400" />
              <span>Your Fitness Goal</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  id: 'fatloss',
                  label: 'Fat Loss',
                  desc: 'Deficit',
                  icon: <Flame size={15} className={fitnessGoal === 'fatloss' ? 'text-emerald-500' : 'text-gray-400'} />,
                },
                {
                  id: 'maintenance',
                  label: 'Maintenance',
                  desc: 'Maintain',
                  icon: <Dumbbell size={15} className={fitnessGoal === 'maintenance' ? 'text-gray-950' : 'text-gray-400'} />,
                },
                {
                  id: 'musclegain',
                  label: 'Hypertrophy',
                  desc: 'Surplus',
                  icon: <TrendingUp size={15} className={fitnessGoal === 'musclegain' ? 'text-gray-950' : 'text-gray-400'} />,
                },
              ].map((g) => {
                const active = fitnessGoal === g.id
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setFitnessGoal(g.id)}
                    className={`p-2.5 rounded-xl flex items-center gap-2 text-left transition-all cursor-pointer ${
                      active
                        ? 'bg-white text-gray-950 shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                        : 'bg-[#07070a] border border-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <div className="shrink-0">{g.icon}</div>
                    <div>
                      <p className={`text-xs font-bold leading-tight ${active ? 'text-gray-950' : 'text-white'}`}>{g.label}</p>
                      <span className={`text-[10px] block ${active ? 'text-gray-600' : 'text-gray-500'}`}>{g.desc}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

        </div>

        {/* ── Right Column: Result Cards (5 cols) ─────────── */}
        <div className="lg:col-span-5 flex flex-col gap-3 justify-between">
          
          {/* Card 1: Your Body Mass Index */}
          <div className="bg-[#0b0c10] border border-white/10 rounded-2xl p-4 sm:p-4.5 relative overflow-hidden shadow-xl backdrop-blur-xl flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white shrink-0">
                <Scale size={14} />
              </div>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                Your Body Mass Index
              </span>
            </div>

            {/* BMI Number & Badge */}
            <div className="text-center py-1">
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">{bmi}</div>
              <div className="mt-1 mb-3">
                <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-[11px] font-semibold border ${bmiDetails.badgeBg}`}>
                  {bmiDetails.label}
                </span>
              </div>
            </div>

            {/* Meter Bar */}
            <div className="mb-2">
              <div className="w-full h-1.5 rounded-full overflow-hidden flex bg-white/10">
                <div className="w-1/4 bg-sky-400/80" title="Underweight" />
                <div className="w-1/4 bg-emerald-400" title="Optimal" />
                <div className="w-1/4 bg-amber-400" title="Overweight" />
                <div className="w-1/4 bg-rose-500" title="Obese" />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-gray-400 mt-1 px-0.5">
                <span>18.5</span>
                <span>25.0</span>
                <span>30.0</span>
              </div>
            </div>

            {/* Tip Note */}
            <div className="pt-2 border-t border-white/5 flex items-start gap-1.5 text-[11px] text-gray-400 leading-tight">
              <Info size={13} className="text-gray-400 shrink-0 mt-0.5" />
              <span>{bmiDetails.tip}</span>
            </div>
          </div>

          {/* Card 2: Daily Target Calories & Macros */}
          <div className="bg-[#0b0c10] border border-white/10 rounded-2xl p-4 sm:p-4.5 relative overflow-hidden shadow-xl backdrop-blur-xl flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300">
                  <Flame size={13} />
                </div>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Daily Target Calories
                </span>
              </div>
              <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
                <Flame size={13} />
              </div>
            </div>

            {/* Big Calorie Value */}
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight my-1.5">
              {targetCalories} kcal / day
            </div>

            {/* 3 Macro Cards */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-[#07070a] border border-white/10 rounded-xl p-2 text-center">
                <span className="text-[10px] text-gray-400 block font-medium">Protein</span>
                <p className="text-sm sm:text-base font-bold text-white mt-0.5">{proteinG}g</p>
                <span className="text-[10px] text-gray-500 block">({proteinPct}%)</span>
              </div>

              <div className="bg-[#07070a] border border-white/10 rounded-xl p-2 text-center">
                <span className="text-[10px] text-gray-400 block font-medium">Carbs</span>
                <p className="text-sm sm:text-base font-bold text-white mt-0.5">{carbG}g</p>
                <span className="text-[10px] text-gray-500 block">({carbPct}%)</span>
              </div>

              <div className="bg-[#07070a] border border-white/10 rounded-xl p-2 text-center">
                <span className="text-[10px] text-gray-400 block font-medium">Fats</span>
                <p className="text-sm sm:text-base font-bold text-white mt-0.5">{fatG}g</p>
                <span className="text-[10px] text-gray-500 block">({fatPct}%)</span>
              </div>
            </div>

            {/* Recommended Plan */}
            <div className="text-[11px] text-gray-400 mb-3 flex items-center gap-1.5">
              <Lightbulb size={12} className="text-gray-400 shrink-0" />
              <span>Recommended: <strong className="text-white font-medium">{bmiDetails.planRecommend}</strong></span>
            </div>

            {/* White Glowing Action Button */}
            <button
              type="button"
              onClick={openPassModal}
              className="w-full bg-white hover:bg-gray-100 text-gray-950 font-bold py-2.5 px-4 rounded-full text-xs flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all cursor-pointer hover:scale-[1.01]"
            >
              <Zap size={14} className="fill-gray-950 text-gray-950" />
              <span>Start with a Free 1-Day Trial Pass</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>

      </div>
    </div>
  )

  if (isModal) {
    return content
  }

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto overflow-hidden">
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full border border-white/5 pointer-events-none select-none" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full border border-white/5 pointer-events-none select-none" />
      {content}
    </section>
  )
}
