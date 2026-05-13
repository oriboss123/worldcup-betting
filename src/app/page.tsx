'use client'

import { useUser } from '@/contexts/UserContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Users, Trophy, TrendingUp } from 'lucide-react'

export default function HomePage() {
  const { user, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/matches')
    }
  }, [user, loading, router])

  if (loading) return null

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center mb-12">
        <div className="text-7xl mb-4">⚽</div>
        <h1 className="text-4xl font-bold text-white mb-3">מונדיאל 2026</h1>
        <p className="text-xl text-green-400 font-semibold mb-2">הימור עם חברים</p>
        <p className="text-gray-400 max-w-md mx-auto">
          הימר על כל משחקי המונדיאל, צור קבוצה עם חברים ותתחרה על מי מנחש הכי טוב
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-2xl w-full">
        <FeatureCard icon={<Calendar className="text-green-400" />} title="104 משחקים" desc="כל לוח האליפות" />
        <FeatureCard icon={<Trophy className="text-yellow-400" />} title="נקודות" desc="+3 מנצח / +6 תוצאה" />
        <FeatureCard icon={<Users className="text-blue-400" />} title="קבוצות" desc="תתחרו עם חברים" />
        <FeatureCard icon={<TrendingUp className="text-purple-400" />} title="דירוג" desc="מי המנחש הגדול?" />
      </div>

      <Link
        href="/register"
        className="bg-green-500 hover:bg-green-600 text-white font-bold text-lg px-10 py-4 rounded-xl transition shadow-lg shadow-green-500/20"
      >
        הצטרפו עכשיו 🚀
      </Link>

      <p className="mt-4 text-sm text-gray-500">
        כבר רשום?{' '}
        <Link href="/register" className="text-green-400 hover:underline">
          כנס עם מספר הטלפון שלך
        </Link>
      </p>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-[#13131f] border border-[#1e1e2e] rounded-xl p-4 text-center">
      <div className="flex justify-center mb-2 text-2xl">{icon}</div>
      <div className="font-semibold text-white text-sm">{title}</div>
      <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
    </div>
  )
}
