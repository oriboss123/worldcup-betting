'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User } from '@/lib/types'
import { Crown, Medal, Trophy, Globe } from 'lucide-react'

export default function LeaderboardPage() {
  const { user, loading } = useUser()
  const router = useRouter()
  const supabase = createClient()

  const [users, setUsers] = useState<User[]>([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!loading && !user) router.push('/register')
  }, [user, loading, router])

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('users')
        .select('*')
        .order('total_points', { ascending: false })
        .limit(100)

      if (data) setUsers(data)
      setFetching(false)
    }
    fetch()
  }, [])

  if (loading || !user) return null

  const myRank = users.findIndex(u => u.id === user.id) + 1

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Globe size={22} className="text-green-400" />
        <h1 className="text-2xl font-bold text-white">דירוג גלובלי</h1>
      </div>

      {/* My rank banner */}
      {myRank > 0 && (
        <div className="bg-gradient-to-l from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">המיקום שלך</p>
            <p className="text-2xl font-bold text-white">#{myRank}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">נקודות</p>
            <p className={`text-2xl font-bold ${user.total_points >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {user.total_points >= 0 ? '+' : ''}{user.total_points}
            </p>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className="bg-[#13131f] border border-[#1e1e2e] rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#1e1e2e] flex items-center gap-2">
          <Trophy size={16} className="text-yellow-400" />
          <h2 className="font-semibold text-white">כל המשתתפים</h2>
          <span className="text-xs text-gray-500 mr-auto">{users.length} משתתפים</span>
        </div>

        {fetching ? (
          <div className="text-center text-gray-500 py-8">טוען...</div>
        ) : (
          <div className="divide-y divide-[#1e1e2e]">
            {users.map((u, i) => {
              const isMe = u.id === user.id
              const displayName = u.nickname || u.name
              return (
                <div key={u.id} className={`flex items-center px-4 py-3 ${isMe ? 'bg-green-500/5' : ''}`}>
                  <div className="w-10 text-center">
                    {i === 0 ? <Crown size={20} className="text-yellow-400 mx-auto" /> :
                     i === 1 ? <Medal size={18} className="text-gray-300 mx-auto" /> :
                     i === 2 ? <Medal size={18} className="text-amber-600 mx-auto" /> :
                     <span className="text-gray-500 text-sm">#{i + 1}</span>}
                  </div>
                  <div className="flex-1 mr-3">
                    <p className={`font-medium text-sm ${isMe ? 'text-green-400' : 'text-white'}`}>
                      {displayName} {isMe ? '(אתה)' : ''}
                    </p>
                    {u.nickname && (
                      <p className="text-xs text-gray-500">{u.name}</p>
                    )}
                  </div>
                  <div className={`font-bold text-lg ${u.total_points >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {u.total_points >= 0 ? '+' : ''}{u.total_points}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-600 text-center">
        <p>מוצגים 100 המקומות הראשונים</p>
        <p className="mt-1">נקודות: מנצח +3/-1 | תוצאה מדויקת +6/-3</p>
      </div>
    </div>
  )
}
