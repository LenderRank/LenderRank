'use client'

import Link from 'next/link'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function SignIn() {
  const router = useRouter()
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

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    router.push('/')
  }

  return (
    <main className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
        <Link href="/" className="text-2xl font-bold text-green-800" style={{fontFamily: 'Georgia, serif'}}>LenderRep</Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="bg-white border border-gray-100 rounded-2xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{fontFamily: 'Georgia, serif'}}>Welcome back</h1>
          <p className="text-sm text-gray-500 mb-6">Sign in to your LenderRep account</p>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5">Email address</label>
              <input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-400 text-gray-700"
              />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-xs font-medium text-gray-600">Password</label>
                <Link href="/forgot-password" className="text-xs text-green-800 hover:underline">Forgot password?</Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-400 text-gray-700"
              />
            </div>

            <button
              onClick={handleSignIn}
              disabled={loading}
              className={`w-full py-2.5 rounded-lg text-sm font-medium mt-2 transition-all ${loading ? 'bg-gray-100 text-gray-400' : 'bg-green-800 text-white hover:bg-green-700'}`}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="relative my-6">
            <div className="border-t border-gray-100"></div>
            <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-white px-3 text-xs text-gray-400">or</span>
          </div>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link href="/sign-up" className="text-green-800 font-medium hover:underline">Sign up free</Link>
          </p>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-center text-xs text-gray-400 mb-3">Are you a loan officer?</p>
            <Link href="/claim" className="block text-center text-sm border border-green-200 text-green-800 py-2.5 rounded-lg hover:bg-green-50">
              Claim your profile instead
            </Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-gray-100 px-6 py-4 text-center">
        <span className="text-xs text-gray-400">Not affiliated with NMLS or any government agency</span>
      </footer>
    </main>
  )
}