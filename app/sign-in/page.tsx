'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import Footer from '../components/Footer'

async function completeClaim(userId: string, nmlsId: string) {
  // Only claim if the profile hasn't been claimed yet
  await supabase
    .from('loan_officers')
    .update({ is_claimed: true })
    .eq('nmls_id', nmlsId)
    .eq('is_claimed', false)

  await supabase
    .from('profiles')
    .update({ role: 'loan_officer', claimed_nmls_id: null })
    .eq('id', userId)
}

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nmlsParam = searchParams.get('nmls')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }
    setLoading(true)
    setError('')

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    const userId = data.user.id

    if (nmlsParam) {
      // Came directly from the claim flow with an NMLS ID in the URL
      await completeClaim(userId, nmlsParam)
      router.push('/account')
      return
    }

    // No URL param — check if this user has a pending claim stored in their profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('claimed_nmls_id')
      .eq('id', userId)
      .single()

    if (profile?.claimed_nmls_id) {
      await completeClaim(userId, profile.claimed_nmls_id)
      router.push('/account')
      return
    }

    router.push('/')
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900">
        <Link href="/" className="text-2xl font-bold text-green-800 dark:text-green-400" style={{fontFamily: 'Georgia, serif'}}>LenderRep</Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-8 w-full max-w-md">
          {nmlsParam && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 text-green-800 dark:text-green-300 text-sm px-4 py-3 rounded-lg mb-6">
              Sign in to complete your claim for NMLS #{nmlsParam}.
            </div>
          )}

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1" style={{fontFamily: 'Georgia, serif'}}>Welcome back</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Sign in to your LenderRep account</p>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1.5">Email address</label>
              <input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-400 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Password</label>
                <Link href="/forgot-password" className="text-xs text-green-800 dark:text-green-400 hover:underline">Forgot password?</Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-400 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>

            <button
              onClick={handleSignIn}
              disabled={loading}
              className={`w-full py-2.5 rounded-lg text-sm font-medium mt-2 transition-all ${loading ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500' : 'bg-green-800 text-white hover:bg-green-700'}`}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="relative my-6">
            <div className="border-t border-gray-100 dark:border-gray-700"></div>
            <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-white dark:bg-gray-800 px-3 text-xs text-gray-400 dark:text-gray-500">or</span>
          </div>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?{' '}
            <Link
              href={nmlsParam ? `/sign-up?nmls=${encodeURIComponent(nmlsParam)}` : '/sign-up'}
              className="text-green-800 dark:text-green-400 font-medium hover:underline"
            >
              Sign up free
            </Link>
          </p>

          {!nmlsParam && (
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
              <p className="text-center text-xs text-gray-400 dark:text-gray-500 mb-3">Are you a loan officer?</p>
              <Link href="/claim" className="block text-center text-sm border border-green-200 dark:border-green-700 text-green-800 dark:text-green-400 py-2.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20">
                Claim your profile instead
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}

export default function SignIn() {
  return (
    <Suspense fallback={null}>
      <SignInContent />
    </Suspense>
  )
}
