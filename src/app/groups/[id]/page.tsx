'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Group, GroupMember } from '@/lib/types'
import { ArrowRight, Copy, Check, Share2, LogOut, Crown, Medal, Trophy } from 'lucide-react'
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
      navigator.share({ title: `הצטרף ל-${group.name}`, text: `הצטרף לקבוצת ההימורים שלי: קוד ${group.invite_code}`, url }).catch(() => {})
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

  if (loading || !user) return null
  if (fetching) return <div className="text-center text-gray-500 py-12 pt-24">טוען...</div>
  if (!group) return null

  const myRank = members.findIndex(m => m.user_id === user.id) + 1
  const myMember = members.find(m => m.user_id === user.id)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/groups" className="text-gray-400 hover:text-white transition">
          <ArrowRight size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-white">{group.name}</h1>
      </div>

      {/* Invite card */}
      <div className="bg-gradient-to-l from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
        <p className="text-sm text-gray-400 mb-2">קוד הזמנה</p>
        <div className="flex items-center justify-between">
          <span className="text-3xl font-mono font-bold text-white tracking-widest">{group.invite_code}</span>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 bg-[#1e1e2e] hover:bg-[#2a2a3e] text-gray-300 px-3 py-2 rounded-lg text-sm transition"
            >
              {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              {copied ? 'הועתק' : 'העתק'}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm transition"
            >
              <Share2 size={14} />
              שתף
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          שתף את הקוד עם חברים — הם יוכלו להצטרף דרך האפליקציה
        </p>
      </div>

      {/* My stats */}
      {isMember && myMember && (
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[#13131f] border border-[#1e1e2e] rounded-xl p-3 text-center">
            <div className={`text-2xl font-bold ${myMember.points >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {myMember.points >= 0 ? '+' : ''}{myMember.points}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">הנקודות שלי</div>
          </div>
          <div className="bg-[#13131f] border border-[#1e1e2e] rounded-xl p-3 text-center">
            <div className="text-2xl font-bold text-yellow-400">#{myRank || '?'}</div>
            <div className="text-xs text-gray-500 mt-0.5">המיקום שלי</div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className="bg-[#13131f] border border-[#1e1e2e] rounded-xl overflow-hidden mb-4">
        <div className="px-4 py-3 border-b border-[#1e1e2e] flex items-center gap-2">
          <Trophy size={16} className="text-yellow-400" />
          <h2 className="font-semibold text-white">דירוג הקבוצה</h2>
          <span className="text-xs text-gray-500 mr-auto">{members.length} משתתפים</span>
        </div>
        <div className="divide-y divide-[#1e1e2e]">
          {members.map((m, i) => {
            const isMe = m.user_id === user.id
            const displayName = m.user?.nickname || m.user?.name || 'משתמש'
            return (
              <div key={m.id} className={`flex items-center px-4 py-3 ${isMe ? 'bg-green-500/5' : ''}`}>
                <div className="w-8 text-center">
                  {i === 0 ? <Crown size={18} className="text-yellow-400 mx-auto" /> :
                   i === 1 ? <Medal size={16} className="text-gray-300 mx-auto" /> :
                   i === 2 ? <Medal size={16} className="text-amber-600 mx-auto" /> :
                   <span className="text-gray-500 text-sm">#{i + 1}</span>}
                </div>
                <div className="flex-1 mr-3">
                  <span className={`font-medium text-sm ${isMe ? 'text-green-400' : 'text-white'}`}>
                    {displayName} {isMe ? '(אתה)' : ''}
                  </span>
                </div>
                <div className={`font-bold ${m.points >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {m.points >= 0 ? '+' : ''}{m.points}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Actions */}
      {!isMember ? (
        <button
          onClick={handleJoin}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition"
        >
          הצטרף לקבוצה
        </button>
      ) : group.created_by !== user.id && (
        <button
          onClick={handleLeave}
          className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 border border-red-400/20 hover:border-red-400/40 py-2.5 rounded-xl transition text-sm"
        >
          <LogOut size={15} />
          עזוב קבוצה
        </button>
      )}
    </div>
  )
}
