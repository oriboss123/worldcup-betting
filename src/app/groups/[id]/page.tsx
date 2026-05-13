'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Group, GroupMember } from '@/lib/types'
import { ArrowRight, Copy, Check, Share2, LogOut, Crown, Medal, Trophy, UserMinus } from 'lucide-react'
import Link from 'next/link'

export default function GroupPage() {
  const { user, loading } = useUser()
  const router = useRouter()
  const { id } = useParams()
  const supabase = createClient()

  const [group, setGroup] = useState<Group | null>(null)
  const [members, setMembers] = useState<(GroupMember & { user: any })[]>([])
  const [copied, setCopied] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [isMember, setIsMember] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push('/register')
  }, [user, loading, router])

  useEffect(() => {
    if (!user || !id) return
    const fetch = async () => {
      const [{ data: groupData }, { data: membersData }] = await Promise.all([
        supabase.from('groups').select('*').eq('id', id).single(),
        supabase.from('group_members').select('*, user:users(*)').eq('group_id', id).order('points', { ascending: false }),
      ])
      if (!groupData) { router.push('/groups'); return }
      setGroup(groupData)
      setMembers(membersData || [])
      setIsMember(membersData?.some((m: any) => m.user_id === user.id) || false)
      setFetching(false)
    }
    fetch()
  }, [user, id])

  const handleCopy = () => {
    if (!group) return
    navigator.clipboard.writeText(group.invite_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = () => {
    if (!group) return
    const url = `${window.location.origin}/join/${group.invite_code}`
    if (navigator.share) {
      navigator.share({ title: `הצטרף ל-${group.name}`, text: `קוד: ${group.invite_code}`, url }).catch(() => {})
    } else {
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleLeave = async () => {
    if (!user || !group) return
    if (!confirm('האם לעזוב את הקבוצה?')) return
    await supabase.from('group_members').delete().eq('group_id', group.id).eq('user_id', user.id)
    router.push('/groups')
  }

  const handleJoin = async () => {
    if (!user || !group) return
    await supabase.from('group_members').insert({ group_id: group.id, user_id: user.id })
    window.location.reload()
  }

  const handleKick = async (memberId: string, memberName: string) => {
    if (!confirm(`להוציא את ${memberName} מהקבוצה?`)) return
    await supabase.from('group_members').delete().eq('id', memberId)
    setMembers(prev => prev.filter(m => m.id !== memberId))
  }

  if (loading || !user) return null
  if (fetching) return <div className="text-center text-gray-500 py-24 text-sm">טוען...</div>
  if (!group) return null

  const myRank = members.findIndex(m => m.user_id === user.id) + 1
  const myMember = members.find(m => m.user_id === user.id)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/groups" className="text-gray-500 hover:text-white transition p-1.5 rounded-lg hover:bg-white/5">
          <ArrowRight size={18} />
        </Link>
        <h1 className="text-2xl font-bold text-white">{group.name}</h1>
      </div>

      {/* Invite card */}
      <div className="rounded-2xl p-5 mb-6"
        style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(59,130,246,0.07))', border: '1px solid rgba(34,197,94,0.2)' }}>
        <p className="text-xs text-gray-500 mb-2">קוד הזמנה לשיתוף</p>
        <div className="flex items-center justify-between gap-3">
          <span className="text-3xl font-mono font-black text-white tracking-[0.25em]">{group.invite_code}</span>
          <div className="flex gap-2">
            <button onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-gray-300 hover:text-white transition"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
              {copied ? 'הועתק!' : 'העתק'}
            </button>
            <button onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-white font-semibold transition"
              style={{ background: 'linear-gradient(135deg, #15803d, #22c55e)', boxShadow: '0 2px 12px rgba(34,197,94,0.3)' }}>
              <Share2 size={13} />
              שתף
            </button>
          </div>
        </div>
      </div>

      {/* My stats */}
      {isMember && myMember && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: 'הנקודות שלי', value: `${myMember.points >= 0 ? '+' : ''}${myMember.points}`, color: myMember.points >= 0 ? 'text-green-400' : 'text-red-400' },
            { label: 'המיקום שלי', value: `#${myRank || '?'}`, color: 'text-yellow-400' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-4 text-center" style={{ background: '#0a0a1a', border: '1px solid #1a1a30' }}>
              <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-600 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Leaderboard */}
      <div className="rounded-2xl overflow-hidden mb-4" style={{ background: '#0a0a1a', border: '1px solid #1a1a30' }}>
        <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: '#1a1a30' }}>
          <Trophy size={14} className="text-yellow-400" />
          <span className="font-semibold text-white text-sm">דירוג הקבוצה</span>
          <span className="text-xs text-gray-600 mr-auto">{members.length} משתתפים</span>
        </div>
        <div className="divide-y" style={{ borderColor: '#1a1a30' }}>
          {members.map((m, i) => {
            const isMe = m.user_id === user.id
            const displayName = m.user?.nickname || m.user?.name || 'משתמש'
            return (
              <div key={m.id} className="flex items-center px-4 py-3 transition"
                style={isMe ? { background: 'rgba(34,197,94,0.05)' } : {}}>
                <div className="w-9 text-center flex-shrink-0">
                  {i === 0 ? <Crown size={18} className="text-yellow-400 mx-auto" /> :
                   i === 1 ? <Medal size={16} className="text-gray-300 mx-auto" /> :
                   i === 2 ? <Medal size={16} className="text-amber-600 mx-auto" /> :
                   <span className="text-gray-600 text-sm">#{i + 1}</span>}
                </div>
                <div className="flex-1 mr-3 min-w-0">
                  <span className={`font-medium text-sm truncate block ${isMe ? 'text-green-400' : 'text-white'}`}>
                    {displayName} {isMe ? '👈' : ''}
                  </span>
                </div>
                <div className={`font-black text-lg ml-3 ${m.points >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {m.points >= 0 ? '+' : ''}{m.points}
                </div>
                {group.created_by === user.id && !isMe && (
                  <button
                    onClick={() => handleKick(m.id, displayName)}
                    className="mr-2 p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition"
                    title="הוצא מהקבוצה"
                  >
                    <UserMinus size={15} />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {!isMember ? (
        <button onClick={handleJoin}
          className="w-full text-white font-bold py-4 text-lg rounded-2xl transition"
          style={{ background: 'linear-gradient(135deg, #15803d, #22c55e)', boxShadow: '0 4px 20px rgba(34,197,94,0.25)' }}>
          הצטרף לקבוצה
        </button>
      ) : group.created_by !== user.id && (
        <button onClick={handleLeave}
          className="w-full flex items-center justify-center gap-2 text-red-400/70 hover:text-red-400 py-4 rounded-2xl transition font-medium"
          style={{ border: '1px solid rgba(239,68,68,0.15)' }}>
          <LogOut size={16} />
          עזוב קבוצה
        </button>
      )}
    </div>
  )
}
