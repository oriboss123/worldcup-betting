'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Group } from '@/lib/types'
import Link from 'next/link'
import { Plus, Users, LogIn } from 'lucide-react'

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
          .from('group_members')
          .select('*', { count: 'exact', head: true })
          .eq('group_id', row.group_id)

        return {
          ...row.groups,
          member_count: count || 0,
          my_points: row.points,
        }
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
    const { data: group } = await supabase
      .from('groups')
      .select('*')
      .eq('invite_code', code)
      .single()

    if (!group) {
      setJoinError('קוד לא נמצא. בדוק שוב.')
      setJoining(false)
      return
    }

    const { data: existing } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', group.id)
      .eq('user_id', user.id)
      .single()

    if (existing) {
      router.push(`/groups/${group.id}`)
      return
    }

    await supabase.from('group_members').insert({ group_id: group.id, user_id: user.id })
    router.push(`/groups/${group.id}`)
  }

  if (loading || !user) return null

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">הקבוצות שלי</h1>
        <Link
          href="/groups/create"
          className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg transition"
        >
          <Plus size={16} />
          צור קבוצה
        </Link>
      </div>

      {/* Join form */}
      <form onSubmit={handleJoin} className="bg-[#13131f] border border-[#1e1e2e] rounded-xl p-4 mb-6">
        <h2 className="font-semibold text-white mb-3 flex items-center gap-2">
          <LogIn size={18} className="text-blue-400" />
          הצטרף לקבוצה בקוד
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={joinCode}
            onChange={e => setJoinCode(e.target.value.toUpperCase())}
            placeholder="הכנס קוד (6 תווים)"
            maxLength={6}
            className="flex-1 bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg px-4 py-2.5 text-white text-center tracking-widest font-mono placeholder-gray-600 outline-none focus:border-blue-500 uppercase"
          />
          <button
            type="submit"
            disabled={joining || joinCode.length < 6}
            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-4 py-2.5 rounded-lg transition"
          >
            {joining ? '...' : 'הצטרף'}
          </button>
        </div>
        {joinError && <p className="text-red-400 text-sm mt-2">{joinError}</p>}
      </form>

      {/* Groups list */}
      {fetching ? (
        <div className="text-center text-gray-500 py-12">טוען...</div>
      ) : myGroups.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <Users size={40} className="mx-auto mb-3 opacity-30" />
          <p>עדיין לא חלק מקבוצה</p>
          <p className="text-sm mt-1">צור קבוצה או הצטרף עם קוד</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myGroups.map(g => (
            <Link key={g.id} href={`/groups/${g.id}`} className="block">
              <div className="bg-[#13131f] border border-[#1e1e2e] hover:border-[#2e2e4e] rounded-xl p-4 transition">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{g.name}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                      <span className="flex items-center gap-1"><Users size={13} />{g.member_count} משתתפים</span>
                      <span className="font-mono text-xs text-gray-600 bg-[#0a0a0f] px-2 py-0.5 rounded">{g.invite_code}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${g.my_points >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {g.my_points >= 0 ? '+' : ''}{g.my_points}
                    </div>
                    <div className="text-xs text-gray-500">נקודות</div>
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
