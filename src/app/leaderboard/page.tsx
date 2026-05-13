'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User } from '@/lib/types'
import { Crown, Medal, Trophy } from 'lucide-react'

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
      const { data } = await supabase.from('users').select('*').order('total_points', { ascending: false }).limit(100)
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
        <Trophy size={22} className="text-yellow-400" />
        <h1 className="text-2xl font-bold text-white">דירוג גלובלי</h1>
      </div>

      {/* My rank */}
      {myRank > 0 && (
        <div className="rounded-2xl p-5 mb-6 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(59,130,246,0.08))', border: '1px solid rgba(34,197,94,0.25)' }}>
          <div>
            <p className="text-xs text-gray-400 mb-1">המיקום שלך</p>
            <p className="text-3xl font-black text-white">#{myRank}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 mb-1">נקודות</p>
            <p className={`text-3xl font-black ${user.total_points >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {user.total_points >= 0 ? '+' : ''}{user.total_points}
            </p>
          </div>
        </div>
      )}

      {/* Top 3 podium */}
      {!fetching && users.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[users[1], users[0], users[2]].map((u, podiumIdx) => {
            const rank = podiumIdx === 0 ? 2 : podiumIdx === 1 ? 1 : 3
            const isMe = u?.id === user.id
            const colors = { 1: 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30', 2: 'from-gray-400/15 to-gray-400/5 border-gray-400/20', 3: 'from-amber-600/15 to-amber-600/5 border-amber-600/20' }
            const pts = { 1: 'text-yellow-400', 2: 'text-gray-300', 3: 'text-amber-500' }
            return (
              <div key={rank} className={`rounded-2xl p-3 text-center bg-gradient-to-b border ${colors[rank as 1|2|3]} ${rank === 1 ? 'mt-0' : 'mt-4'}`}>
                <div className="text-2xl mb-1">{rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}</div>
                <div className={`text-xs font-bold truncate ${isMe ? 'text-green-400' : 'text-white'}`}>
                  {u?.nickname || u?.name}
                </div>
                <div className={`text-lg font-black mt-1 ${pts[rank as 1|2|3]}`}>
                  {(u?.total_points ?? 0) >= 0 ? '+' : ''}{u?.total_points ?? 0}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Full list */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#0a0a1a', border: '1px solid #1a1a30' }}>
        <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: '#1a1a30' }}>
          <Trophy size={14} className="text-yellow-400" />
          <span className="font-semibold text-white text-sm">כל המשתתפים</span>
          <span className="text-xs text-gray-600 mr-auto">{users.length} משתתפים</span>
        </div>

        {fetching ? (
          <div className="text-center text-gray-500 py-10 text-sm">טוען...</div>
        ) : (
          <div className="divide-y" style={{ borderColor: '#1a1a30' }}>
            {users.map((u, i) => {
              const isMe = u.id === user.id
              return (
                <div key={u.id} className="flex items-center px-4 py-3 transition"
                  style={isMe ? { background: 'rgba(34,197,94,0.05)' } : {}}>
                  <div className="w-10 text-center flex-shrink-0">
                    {i === 0 ? <Crown size={18} className="text-yellow-400 mx-auto" /> :
                     i === 1 ? <Medal size={16} className="text-gray-300 mx-auto" /> :
                     i === 2 ? <Medal size={16} className="text-amber-600 mx-auto" /> :
                     <span className="text-gray-600 text-sm">#{i + 1}</span>}
                  </div>
                  <div className="flex-1 mx-3 min-w-0">
                    <p className={`font-medium text-sm truncate ${isMe ? 'text-green-400' : 'text-white'}`}>
                      {u.nickname || u.name} {isMe ? '👈' : ''}
                    </p>
                    {u.nickname && <p className="text-xs text-gray-600 truncate">{u.name}</p>}
                  </div>
                  <div className={`font-black text-lg flex-shrink-0 ${u.total_points >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {u.total_points >= 0 ? '+' : ''}{u.total_points}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-gray-700 text-center">מנצח +3 / -1 | תוצאה מדויקת +6 / -3</p>
    </div>
  )
}
