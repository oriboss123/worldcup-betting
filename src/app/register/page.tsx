'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/contexts/UserContext'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function RegisterPage() {
  const [mode, setMode] = useState<'register' | 'login'>('register')
  const [name, setName] = useState('')
  const [nickname, setNickname] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setUser } = useUser()
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const cleanPhone = phone.replace(/\D/g, '')
    if (cleanPhone.length < 9) {
      setError('מספר טלפון לא תקין')
      setLoading(false)
      return
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setError('חובה להזין שם')
        setLoading(false)
        return
      }

      // Check if phone already exists
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('phone', cleanPhone)
        .single()

      if (existing) {
        setError('מספר טלפון זה כבר רשום. נסה להתחבר.')
        setLoading(false)
        return
      }

      const { data, error: insertError } = await supabase
        .from('users')
        .insert({ name: name.trim(), nickname: nickname.trim() || null, phone: cleanPhone })
        .select()
        .single()

      if (insertError) {
        setError('שגיאה בהרשמה. נסה שוב.')
        setLoading(false)
        return
      }

      setUser(data)
      router.push('/matches')
    } else {
      const { data, error: loginError } = await supabase
        .from('users')
        .select('*')
        .eq('phone', cleanPhone)
        .single()

      if (loginError || !data) {
        setError('לא נמצא משתמש עם מספר טלפון זה. הירשם תחילה.')
        setLoading(false)
        return
      }

      setUser(data)
      router.push('/matches')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⚽</div>
          <h1 className="text-2xl font-bold text-white">מונדיאל 2026</h1>
          <p className="text-gray-400 text-sm mt-1">הימורים עם חברים</p>
        </div>

        <div className="bg-[#13131f] border border-[#1e1e2e] rounded-2xl p-6">
          {/* Tabs */}
          <div className="flex rounded-lg bg-[#0a0a0f] p-1 mb-6">
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${mode === 'register' ? 'bg-green-500 text-white' : 'text-gray-400'}`}
            >
              הרשמה
            </button>
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${mode === 'login' ? 'bg-green-500 text-white' : 'text-gray-400'}`}
            >
              כניסה
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="text-sm text-gray-400 block mb-1.5">שם מלא *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="ישראל ישראלי"
                    className="w-full bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg px-4 py-2.5 text-white placeholder-gray-600 outline-none focus:border-green-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1.5">כינוי (לא חובה)</label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={e => setNickname(e.target.value)}
                    placeholder="הכינוי שלך בלוח הדירוג"
                    className="w-full bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg px-4 py-2.5 text-white placeholder-gray-600 outline-none focus:border-green-500 transition"
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-sm text-gray-400 block mb-1.5">מספר טלפון *</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="050-0000000"
                className="w-full bg-[#0a0a0f] border border-[#2a2a3e] rounded-lg px-4 py-2.5 text-white placeholder-gray-600 outline-none focus:border-green-500 transition"
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition"
            >
              {loading ? 'טוען...' : mode === 'register' ? 'הירשם' : 'כנס'}
            </button>
          </form>

          {mode === 'register' && (
            <p className="text-xs text-gray-600 mt-4 text-center">
              הטלפון משמש כסיסמה — אין צורך בכניסה מורכבת
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
