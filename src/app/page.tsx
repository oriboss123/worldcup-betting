'use client'

import { useUser } from '@/contexts/UserContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, Users, Trophy, TrendingUp, Zap, Shield, Globe2 } from 'lucide-react'

const WC_START = new Date('2026-06-11T00:00:00')

function useCountdown() {
  const [diff, setDiff] = useState(WC_START.getTime() - Date.now())
  useEffect(() => {
    const t = setInterval(() => setDiff(WC_START.getTime() - Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const total = Math.max(0, diff)
  const days = Math.floor(total / 86400000)
  const hours = Math.floor((total % 86400000) / 3600000)
  const mins = Math.floor((total % 3600000) / 60000)
  const secs = Math.floor((total % 60000) / 1000)
  return { days, hours, mins, secs }
}

export default function HomePage() {
  const { user, loading } = useUser()
  const router = useRouter()
  const { days, hours, mins, secs } = useCountdown()

  useEffect(() => {
    if (!loading && user) router.push('/matches')
  }, [user, loading, router])

  if (loading) return null

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pb-16">
      {/* Hero */}
      <div className="w-full max-w-4xl text-center pt-16 pb-10">
        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 text-sm text-green-400 mb-6">
          <Zap size={13} />
          מונדיאל 2026 — ארה״ב, קנדה, מקסיקו
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
          הימורים עם<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-l from-green-400 to-emerald-300">חברים</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
          נחשו תוצאות, צרו קבוצות, תתחרו — מי מהחבר׳ה המנחש הגדול ביותר?
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/register"
            className="bg-gradient-to-l from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 text-white font-bold text-lg px-10 py-4 rounded-xl transition shadow-lg shadow-green-500/25"
          >
            הצטרפו עכשיו 🚀
          </Link>
          <Link
            href="/register"
            className="border border-[#2a2a3e] text-gray-300 hover:text-white hover:border-[#3a3a5e] font-medium px-8 py-4 rounded-xl transition"
          >
            כבר רשום? כנס
          </Link>
        </div>
      </div>

      {/* Countdown */}
      <div className="w-full max-w-2xl mb-12">
        <p className="text-center text-sm text-gray-500 mb-3">⏳ פותח ב-11 ביוני 2026</p>
        <div className="grid grid-cols-4 gap-3">
          {[
            { val: days, label: 'ימים' },
            { val: hours, label: 'שעות' },
            { val: mins, label: 'דקות' },
            { val: secs, label: 'שניות' },
          ].map(({ val, label }) => (
            <div key={label} className="bg-[#0f0f1e] border border-[#1a1a2e] rounded-xl py-4 text-center">
              <div className="text-3xl font-black text-white tabular-nums">{String(val).padStart(2, '0')}</div>
              <div className="text-xs text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <FeatureCard
          icon={<Calendar className="text-green-400" size={22} />}
          color="green"
          title="104 משחקים"
          desc="כל שלבי הטורניר"
        />
        <FeatureCard
          icon={<Trophy className="text-yellow-400" size={22} />}
          color="yellow"
          title="מערכת נקודות"
          desc="+3 מנצח | +6 תוצאה מדויקת"
        />
        <FeatureCard
          icon={<Users className="text-blue-400" size={22} />}
          color="blue"
          title="קבוצות"
          desc="תחרות פרטית עם חברים"
        />
        <FeatureCard
          icon={<TrendingUp className="text-purple-400" size={22} />}
          color="purple"
          title="לוח דירוג"
          desc="מי המנחש הגדול?"
        />
      </div>

      {/* How it works */}
      <div className="w-full max-w-3xl mb-12">
        <h2 className="text-2xl font-bold text-white text-center mb-6">איך זה עובד?</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Step num={1} icon="📋" title="נחש תוצאות" desc="לפני כל משחק, הימר על מי ינצח ומה יהיה הניקוד המדויק" />
          <Step num={2} icon="👥" title="צור קבוצה" desc="הזמן חברים לקבוצה פרטית ותתחרו בינכם" />
          <Step num={3} icon="🏆" title="עלה בדירוג" desc="ניחוש נכון = נקודות. בסוף המונדיאל — יש אלוף!" />
        </div>
      </div>

      {/* Scoring */}
      <div className="w-full max-w-2xl">
        <div className="bg-[#0f0f1e] border border-[#1a1a2e] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} className="text-green-400" />
            <h3 className="font-bold text-white">מבנה הניקוד</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
              <div className="text-2xl font-black text-green-400">+3</div>
              <div className="text-gray-400 text-xs mt-1">ניחשת נכון מי ינצח</div>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 text-center">
              <div className="text-2xl font-black text-yellow-400">+6</div>
              <div className="text-gray-400 text-xs mt-1">ניחשת תוצאה מדויקת</div>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
              <div className="text-2xl font-black text-red-400">-1</div>
              <div className="text-gray-400 text-xs mt-1">טעית בניחוש המנצח</div>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
              <div className="text-2xl font-black text-red-400">-3</div>
              <div className="text-gray-400 text-xs mt-1">טעית בתוצאה המדויקת</div>
            </div>
          </div>
        </div>
      </div>

      {/* Flags decoration */}
      <div className="mt-12 flex items-center gap-2 text-2xl opacity-40 select-none flex-wrap justify-center max-w-lg">
        {'🇧🇷🇦🇷🇫🇷🇩🇪🇪🇸🇵🇹🇬🇧🇮🇹🇳🇱🇧🇪🇺🇸🇲🇽🇯🇵🇰🇷🇲🇦🇸🇳'.match(/(©|®|[ -㌀]|\ud83c[퀀-\udfff]|\ud83d[퀀-\udfff]|\ud83e[퀀-\udfff]){2}/g)?.map((f, i) => (
          <span key={i}>{f}</span>
        ))}
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, desc, color }: { icon: React.ReactNode; title: string; desc: string; color: string }) {
  const borders: Record<string, string> = {
    green: 'border-green-500/20 hover:border-green-500/40',
    yellow: 'border-yellow-500/20 hover:border-yellow-500/40',
    blue: 'border-blue-500/20 hover:border-blue-500/40',
    purple: 'border-purple-500/20 hover:border-purple-500/40',
  }
  return (
    <div className={`bg-[#0f0f1e] border ${borders[color]} rounded-xl p-4 text-center transition`}>
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="font-semibold text-white text-sm">{title}</div>
      <div className="text-xs text-gray-500 mt-1">{desc}</div>
    </div>
  )
}

function Step({ num, icon, title, desc }: { num: number; icon: string; title: string; desc: string }) {
  return (
    <div className="bg-[#0f0f1e] border border-[#1a1a2e] rounded-xl p-5 text-center relative">
      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-green-500/20 text-green-400 text-xs font-bold flex items-center justify-center">
        {num}
      </div>
      <div className="text-3xl mb-3">{icon}</div>
      <div className="font-semibold text-white mb-1">{title}</div>
      <div className="text-xs text-gray-500">{desc}</div>
    </div>
  )
}
