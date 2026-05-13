import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  if (!url.startsWith('http')) {
    // Build-time stub — all calls are no-ops
    const stub: any = new Proxy({}, {
      get: (_t, prop) => {
        if (prop === 'from') return () => stub
        if (prop === 'rpc') return () => Promise.resolve({ data: null, error: null })
        if (['select','insert','update','delete','eq','order','limit','single','head'].includes(String(prop))) {
          return () => stub
        }
        if (String(prop) === 'then') return undefined
        return () => Promise.resolve({ data: null, error: null, count: 0 })
      }
    })
    return stub as ReturnType<typeof createBrowserClient>
  }

  return createBrowserClient(url, key)
}
