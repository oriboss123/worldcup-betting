'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { generateInviteCode } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function CreateGroupPage() {
  const { user } = useUser()
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setError('')
    setLoading(true)

    const invite_code = generateInviteCode()
    const { data, error: err } = await supabase
      .from('groups')
      .insert({ name: name.trim(), invite_code, created_by: user.id })
      .select()
      .single()

    if (err) {
      setError('שגיאה ביצירת הקבוצה')
      setLoading(false)
      return
    }

    // Add creator as member
    await supabase.from('group_members').insert({ group_id: data.id, user_id: user.id })
    router.push(`/groups/${data.id}`)
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/groups" className="text-gray-400 hover:text-white transition">
          <ArrowRight size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-white">צור קבוצה חדשה</h1>
      </div>

      <div className="bg-[#13131f] border border-[#1e1e2e] rounded-2xl p-6">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-1.5">שם הקבוצה *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="הקבוצה של הבנים 🔥"
              className="w-full bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg px-4 py-2.5 text-white placeholder-gray-600 outline-none focus:border-green-500 transition"
              required
              maxLength={50}
            />
          </div>

          <div className="bg-[#0a0a0f] rounded-lg p-3 text-sm text-gray-400 border border-[#1e1e2e]">
            <p>אחרי היצירה, תקבל קוד הזמנה ייחודי לשיתוף עם חברים</p>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition"
          >
            {loading ? 'יוצר...' : 'צור קבוצה'}
          </button>
        </form>
      </div>
    </div>
  )
}
