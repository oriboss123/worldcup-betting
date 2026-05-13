'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Group } from '@/lib/types'
import Link from 'next/link'
import { Plus, Users, LogIn, ChevronLeft } from 'lucide-react'

export default function GroupsPage() {
  const { user, loading } = useUser()
  const router = useRouter()
  const supabase = createClient()

  const [myGroups, setMyGroups] = useState<(Group & { member_count: number; my_points: number })[]>([])
  const [joinCode, setJoinCode] = useState('')
  const [joinError, setJoinError] = useState('')
  const [joining, setJoining] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!loading && !user) router.push('/register')
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    const fetchGroups = async () => {
      const { data } = await supabase
        .from('group_members')
        .select('group_id, points, groups(id, name, invite_code, created_by, created_at)')
        .eq('user_id', user.id)

      if (!data) { setFetching(false); return }

      const groups = await Promise.all(data.map(async (row: any) => {
        const { count } = await supabase
          .from('group_members').select('*', { count: 'exact', head: true }).eq('group_id', row.group_id)
        return { ...row.groups, member_count: count || 0, my_points: row.points }
      }))
      setMyGroups(groups)
      setFetching(false)
    }
    fetchGroups()
  }, [user])

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setJoinError('')
    setJoining(true)
    const code = joinCode.trim().toUpperCase()
    const { data: group } = await supabase.from('groups').select('*').eq('invite_code', code).single()

    if (!group) { setJoinError('קוד לא נמצא. בדוק שוב.'); setJoining(false); return }

    const { data: existing } = await supabase.from('group_members').select('id').eq('group_id', group.id).eq('user_id', user.id).single()
    if (existing) { router.push(`/groups/${group.id}`); return }

    await supabase.from('group_members').insert({ group_id: group.id, user_id: user.id })
    router.push(`/groups/${group.id}`)
  }

  if (loading || !user) return null

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">הקבוצות שלי</h1>
        <Link href="/groups/create"
          className="flex items-center gap-1.5 text-white text-sm px-4 py-2 rounded-xl transition font-semibold"
          style={{ background: 'linear-gradient(135deg, #15803d, #22c55e)', boxShadow: '0 2px 15px rgba(34,197,94,0.25)' }}>
          <Plus size={15} />
          צור קבוצה
        </Link>
      </div>

      {/* Join form */}
      <div className="rounded-2xl p-5 mb-6" style={{ background: '#0a0a1a', border: '1px solid #1a1a30' }}>
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <LogIn size={16} className="text-blue-400" />
          הצטרף לקבוצה בקוד
        </h2>
        <form onSubmit={handleJoin} className="flex gap-2">
          <input
            type="text" value={joinCode}
            onChange={e => setJoinCode(e.target.value.toUpperCase())}
            placeholder="קוד 6 תווים"
            maxLength={6}
            className="flex-1 rounded-xl px-4 py-3 text-white text-center tracking-[0.3em] font-mono text-lg placeholder-gray-700 outline-none uppercase transition"
            style={{ background: '#070712', border: '1px solid #1a1a30' }}
            onFocus={e => e.currentTarget.style.borderColor = '#22c55e'}
            onBlur={e => e.currentTarget.style.borderColor = '#1a1a30'}
          />
          <button type="submit" disabled={joining || joinCode.length < 6}
            className="px-5 rounded-xl text-white font-semibold transition disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)', boxShadow: '0 2px 15px rgba(59,130,246,0.2)' }}>
            {joining ? '...' : 'הצטרף'}
          </button>
        </form>
        {joinError && <p className="text-red-400 text-sm mt-3">{joinError}</p>}
      </div>

      {/* Groups list */}
      {fetching ? (
        <div className="text-center text-gray-500 py-16">
          <div className="text-4xl mb-3 animate-pulse">👥</div>
          טוען...
        </div>
      ) : myGroups.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: '#0a0a1a', border: '1px solid #1a1a30' }}>
          <Users size={40} className="mx-auto mb-3 text-gray-700" />
          <p className="text-gray-400 font-medium">עדיין לא חלק מקבוצה</p>
          <p className="text-sm text-gray-600 mt-1">צור קבוצה חדשה או הצטרף עם קוד</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myGroups.map(g => (
            <Link key={g.id} href={`/groups/${g.id}`}>
              <div className="rounded-2xl p-4 transition hover:brightness-110 border"
                style={{ background: 'linear-gradient(135deg, #0d0d22, #080815)', borderColor: '#1a1a30' }}>
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <h3 className="font-bold text-white truncate">{g.name}</h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Users size={11} />{g.member_count} משתתפים
                      </span>
                      <span className="text-xs text-gray-700 font-mono bg-black/30 px-2 py-0.5 rounded-lg">
                        {g.invite_code}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <div className={`text-xl font-black ${g.my_points >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {g.my_points >= 0 ? '+' : ''}{g.my_points}
                      </div>
                      <div className="text-xs text-gray-600">נקודות</div>
                    </div>
                    <ChevronLeft size={16} className="text-gray-600" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
