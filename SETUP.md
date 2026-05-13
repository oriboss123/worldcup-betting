# מונדיאל 2026 - הוראות הגדרה

## שלב 1: צור חשבון Supabase

1. לך ל-[supabase.com](https://supabase.com) וצור חשבון חינמי
2. צור פרויקט חדש
3. בצד שמאל → **Settings** → **API** → העתק:
   - `Project URL` → שים ב-`NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → שים ב-`NEXT_PUBLIC_SUPABASE_ANON_KEY`

## שלב 2: הגדר env vars

ערוך את הקובץ `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## שלב 3: צור את הטבלאות בסופאבייס

1. לך ל-**SQL Editor** ב-Supabase
2. הדבק את כל תוכן הקובץ `supabase_schema.sql`
3. לחץ **Run**

## שלב 4: הפעל את האפליקציה

```bash
npm run dev
```

פתח http://localhost:3000

## שלב 5: טען משחקים

1. הירשם עם מספר הטלפון שלך
2. לך ל-`/admin` (עם הטלפון שלך כ-ADMIN_PHONE בקובץ admin/page.tsx)
3. לחץ **טען משחקי מונדיאל 2026**

## הגדרת מנהל

בקובץ `src/app/admin/page.tsx` שנה:
```ts
const ADMIN_PHONE = '0500000000' // מספר הטלפון שלך
```

## פריסה לאינטרנט (Vercel)

```bash
npx vercel
```
הוסף את ה-env vars ב-Vercel dashboard.

## מבנה הניקוד

| הימור | נכון | לא נכון |
|-------|------|---------|
| מנצח | +3 | -1 |
| תוצאה מדויקת | +6 | -3 |
