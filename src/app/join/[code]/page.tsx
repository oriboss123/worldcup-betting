'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function JoinPage() {
  const { user, loading } = useUser()
  const router = useRouter()
  const { code } = useParams()
  const supabase = createClient()
  const [status, setStatus] = useState<'loading' | 'joining' | 'error'>('loading')
  const [groupName, setGroupName] = useState('')

  useEffect(() => {
    if (loading) return
    if (!user) {
      // Store code and redirect to register
      localStorage.setItem('pending_join_code', code as string)
      router.push('/register')
      return
    }

    const joinGroup = async () => {
      setStatus('joining')
      const { data: group } = await supabase
        .from('groups')
        .select('*')
        .eq('invite_code', (code as string).toUpperCase())
        .single()

      if (!group) {
        setStatus('error')
        return
      }

      setGroupName(group.name)

      const { data: existing } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_id', group.id)
        .eq('user_id', user.id)
        .single()

      if (!existing) {
        await supabase.from('group_members').insert({ group_id: group.id, user_id: user.id })
      }

      router.push(`/groups/${group.id}`)
    }

    joinGroup()
  }, [user, loading, code])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        {status === 'loading' || status === 'joining' ? (
          <>
            <div className="text-5xl mb-4 animate-pulse">⚽</div>
            <p className="text-white font-semibold">
              {status === 'joining' ? `מצטרף ל-${groupName || 'קבוצה'}...` : 'טוען...'}
            </p>
          </>
        ) : (
          <>
            <div className="text-5xl mb-4">❌</div>
            <p className="text-white font-semibold mb-2">קוד לא נמצא</p>
            <p className="text-gray-400 text-sm mb-4">הקישור אינו תקין או שהקבוצה נמחקה</p>
            <Link href="/groups" className="text-green-400 hover:underline">חזור לקבוצות</Link>
          </>
        )}
      </div>
    </div>
  )
}
