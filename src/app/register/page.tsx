'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/contexts/UserContext'
import { createClient } from '@/lib/supabase/client'
import { Lock, Phone, User, Hash } from 'lucide-react'

export default function RegisterPage() {
  const [mode, setMode] = useState<'register' | 'login'>('register')
  const [name, setName] = useState('')
  const [nickname, setNickname] = useState('')
  const [phone, setPhone] = useState('')
  const [pin, setPin] = useState('')
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

    if (mode === 'register' && (pin.length !== 4 || !/^\d{4}$/.test(pin))) {
      setError('קוד PIN חייב להיות 4 ספרות')
      setLoading(false)
      return
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setError('חובה להזין שם')
        setLoading(false)
        return
      }

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
        .insert({ name: name.trim(), nickname: nickname.trim() || null, phone: cleanPhone, pin })
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
        setError('לא נמצא משתמש עם מספר טלפון זה.')
        setLoading(false)
        return
      }

      if (data.pin) {
        // existing user with PIN — must verify
        if (pin.length !== 4 || data.pin !== pin) {
          setError('קוד PIN שגוי.')
          setLoading(false)
          return
        }
      }
      // existing user without PIN — let them in (legacy)

      setUser(data)
      router.push('/matches')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⚽</div>
          <h1 className="text-2xl font-bold text-white">מונדיאל 2026</h1>
          <p className="text-gray-500 text-sm mt-1">הימורים עם חברים</p>
        </div>

        <div className="bg-[#0f0f1e] border border-[#1a1a2e] rounded-2xl p-8 shadow-xl shadow-black/40">
          {/* Tabs */}
          <div className="flex rounded-xl bg-[#070712] p-1 mb-6">
            <button
              onClick={() => { setMode('register'); setError('') }}
              className={`flex-1 py-3 rounded-lg text-base font-bold transition ${mode === 'register' ? 'bg-gradient-to-l from-green-500 to-emerald-400 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
            >
              הרשמה
            </button>
            <button
              onClick={() => { setMode('login'); setError('') }}
              className={`flex-1 py-3 rounded-lg text-base font-bold transition ${mode === 'login' ? 'bg-gradient-to-l from-green-500 to-emerald-400 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
            >
              כניסה
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <Field icon={<User size={15} />} label="שם מלא *">
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="ישראל ישראלי"
                    className="w-full bg-transparent text-white placeholder-gray-600 outline-none text-base"
                    required
                  />
                </Field>
                <Field icon={<Hash size={15} />} label="כינוי (לא חובה)">
                  <input
                    type="text"
                    value={nickname}
                    onChange={e => setNickname(e.target.value)}
                    placeholder="הכינוי שלך בדירוג"
                    className="w-full bg-transparent text-white placeholder-gray-600 outline-none text-base"
                  />
                </Field>
              </>
            )}

            <Field icon={<Phone size={15} />} label="מספר טלפון *">
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="050-0000000"
                className="w-full bg-transparent text-white placeholder-gray-600 outline-none text-base"
                required
              />
            </Field>

            <Field icon={<Lock size={15} />} label={mode === 'register' ? 'קוד PIN (4 ספרות) *' : 'קוד PIN (אם הגדרת)'}>
              <input
                type="password"
                value={pin}
                onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="• • • •"
                maxLength={4}
                inputMode="numeric"
                className="w-full bg-transparent text-white placeholder-gray-600 outline-none text-sm tracking-widest"
                required
              />
            </Field>

            {error && (
              <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-l from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 disabled:opacity-50 text-white font-bold py-4 text-lg rounded-xl transition shadow-lg shadow-green-500/20"
            >
              {loading ? '...' : mode === 'register' ? 'הירשם עכשיו 🚀' : 'כנס לחשבון'}
            </button>
          </form>

          {mode === 'register' && (
            <p className="text-xs text-gray-600 mt-4 text-center">
              קוד ה-PIN ישמש לכניסה בפעמים הבאות — אל תשכח אותו!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm text-gray-400 block mb-2 font-medium">{label}</label>
      <div className="flex items-center gap-3 bg-[#070712] border border-[#2a2a3e] rounded-xl px-5 py-4 focus-within:border-green-500 transition">
        <span className="text-gray-500 flex-shrink-0">{icon}</span>
        {children}
      </div>
    </div>
  )
}
