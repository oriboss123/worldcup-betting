'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const STEPS = [
  {
    icon: '⚽',
    title: 'ברוך הבא למונדיאל 2026!',
    desc: 'כאן תוכל להמר על תוצאות משחקי המונדיאל ולהתחרות עם חברים.',
  },
  {
    icon: '📋',
    title: 'איך מהמרים?',
    desc: 'לך ל"משחקים", בחר משחק ונחש מי ינצח (+3 נקודות) או את התוצאה המדויקת (+6 נקודות). ניחוש שגוי = נקודות שליליות!',
  },
  {
    icon: '👥',
    title: 'צור קבוצה עם חברים',
    desc: 'לך ל"קבוצות", צור קבוצה חדשה ושלח לחברים את קוד ההזמנה. הדירוג בקבוצה הוא פרטי.',
  },
  {
    icon: '⏰',
    title: 'שים לב!',
    desc: 'ניתן להמר רק עד 30 דקות לפני תחילת המשחק. אחרי זה — ההימורים נסגרים. אל תחכה לרגע האחרון!',
  },
]

export default function WelcomeModal() {
  const [show, setShow] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const seen = localStorage.getItem('wc2026_welcomed')
    if (!seen) {
      setTimeout(() => setShow(true), 600)
    }
  }, [])

  const close = () => {
    localStorage.setItem('wc2026_welcomed', '1')
    setShow(false)
  }

  if (!show) return null

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={close} />
      <div className="relative bg-[#0f0f1e] border border-[#2a2a3e] rounded-2xl p-7 max-w-sm w-full shadow-2xl shadow-black/60 animate-in fade-in zoom-in-95 duration-200">
        <button onClick={close} className="absolute top-4 left-4 text-gray-600 hover:text-gray-400 transition">
          <X size={18} />
        </button>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mb-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-green-400' : i < step ? 'w-3 bg-green-700' : 'w-3 bg-[#2a2a3e]'}`}
            />
          ))}
        </div>

        <div className="text-center mb-6">
          <div className="text-5xl mb-4">{current.icon}</div>
          <h2 className="text-xl font-bold text-white mb-2">{current.title}</h2>
          <p className="text-gray-400 text-sm leading-relaxed">{current.desc}</p>
        </div>

        <div className="flex gap-2">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex-1 border border-[#2a2a3e] text-gray-400 hover:text-white py-2.5 rounded-xl text-sm transition"
            >
              הקודם
            </button>
          )}
          <button
            onClick={isLast ? close : () => setStep(s => s + 1)}
            className="flex-1 bg-gradient-to-l from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white font-semibold py-2.5 rounded-xl text-sm transition shadow shadow-green-500/20"
          >
            {isLast ? '✅ מוכן, בואו נתחיל!' : 'הבא →'}
          </button>
        </div>
      </div>
    </div>
  )
}
