'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const STEPS = [
  {
    icon: '👑',
    title: 'אורי נמני הבוס',
    desc: 'מברך אתכם שנכנסתם לאתר שהוא בנה 🎉',
  },
  {
    icon: '⚽',
    title: 'ברוך הבא למונדיאל 2026!',
    desc: 'כאן תוכל להמר על תוצאות משחקי המונדיאל ולהתחרות עם חברים.',
  },
  {
    icon: '📋',
    title: 'איך מהמרים?',
    desc: 'לחץ על משחק, בחר "ניחוש מנצח" (+3/-1) או "תוצאה מדויקת" (+6/-3). ההימור נסגר 30 דקות לפני הקיקאוף!',
  },
  {
    icon: '👥',
    title: 'צור קבוצה עם חברים',
    desc: 'לך ל"קבוצות", צור קבוצה ושלח לחברים את קוד ההזמנה. תתחרו בינכם בדירוג פרטי.',
  },
  {
    icon: '🏆',
    title: 'מי ינצח?',
    desc: 'בסוף המונדיאל מי שצבר הכי הרבה נקודות — הוא האלוף! בהצלחה 🔥',
  },
]

export default function WelcomeModal() {
  const [show, setShow] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    // Show after every login (flag set by register page)
    const shouldShow = sessionStorage.getItem('wc_show_welcome')
    if (shouldShow) {
      sessionStorage.removeItem('wc_show_welcome')
      setStep(0)
      setTimeout(() => setShow(true), 400)
    }
  }, [])

  const close = () => setShow(false)

  if (!show) return null

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={close} />
      <div className="relative rounded-2xl p-7 max-w-sm w-full shadow-2xl shadow-black/60"
        style={{ background: 'linear-gradient(160deg, #0f0f2a, #0a0a1a)', border: '1px solid rgba(34,197,94,0.2)', zIndex: 1 }}>

        <button onClick={close} className="absolute top-4 left-4 text-gray-600 hover:text-gray-400 transition">
          <X size={18} />
        </button>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mb-6">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${
              i === step ? 'w-6 bg-green-400' : i < step ? 'w-3 bg-green-700' : 'w-3 bg-[#2a2a3e]'
            }`} />
          ))}
        </div>

        <div className="text-center mb-7">
          <div className="text-6xl mb-4">{current.icon}</div>
          <h2 className="text-2xl font-black text-white mb-3">{current.title}</h2>
          <p className="text-gray-300 text-base leading-relaxed">{current.desc}</p>
        </div>

        <div className="flex gap-2">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)}
              className="flex-1 border border-[#2a2a3e] text-gray-400 hover:text-white py-3 rounded-xl text-sm transition">
              ← הקודם
            </button>
          )}
          <button
            onClick={isLast ? close : () => setStep(s => s + 1)}
            className="flex-1 text-white font-bold py-3 rounded-xl transition text-base"
            style={{ background: 'linear-gradient(135deg, #15803d, #22c55e)', boxShadow: '0 4px 20px rgba(34,197,94,0.3)' }}>
            {isLast ? '✅ בואו נתחיל!' : 'הבא →'}
          </button>
        </div>
      </div>
    </div>
  )
}
